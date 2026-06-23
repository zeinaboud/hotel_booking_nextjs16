import { auth } from '@/auth';
import { findBranchId, getHotelsContext } from '@/lib/ai/hotelData';
import { prisma } from '@/lib/prisma';
import { BookingError, createBookingRequest } from '@/lib/services/createBookingRequest';
import createCheckoutSession from '@/lib/services/createCheckoutSession';
import { groqClient } from '../../../lib/ai/gemini';

const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'create_booking',
      description:
        'Creates a hotel room booking once the user has confirmed all details: room type, hotel branch, check-in date, check-out date, and quantity of rooms.',
      parameters: {
        type: 'object',
        properties: {
          roomType: {
            type: 'string',
            enum: ['SINGLE', 'DOUBLE', 'SUITE'],
            description: 'The type of room to book',
          },
          hotelName: {
            type: 'string',
            description:
              'The exact hotel name as shown in the hotel data context (e.g. "DoubleTree by Hilton Dubai Al Jadaf")',
          },
          city: {
            type: 'string',
            description:
              'The city/branch of the hotel, written in English exactly as it appears in the hotel data context (e.g. "Dubai")',
          },
          checkIn: {
            type: 'string',
            description: 'Check-in date in YYYY-MM-DD format',
          },
          checkOut: {
            type: 'string',
            description: 'Check-out date in YYYY-MM-DD format',
          },
          quantity: {
            type: 'number',
            description: 'Number of rooms to book',
          },
        },
        required: ['roomType', 'hotelName', 'city', 'checkIn', 'checkOut', 'quantity'],
      },
    },
  },
];

async function getAIReply(messages: { role: string; content: string }[]) {
  const hotelsContext = await getHotelsContext();

  const systemPrompt = `You are a smart hotel booking assistant.

CRITICAL LANGUAGE RULE (highest priority, overrides everything else):
- Detect the language of the user's LATEST message only.
- If the latest message is in English, respond ENTIRELY in English.
- If the latest message is in Arabic, respond ENTIRELY in Arabic (use correct grammar).
- Ignore the language used in earlier messages in the conversation — only the latest message matters.
- Never mix languages in a single response.

Formatting instructions:
- Use clear, organized Markdown formatting.
- When listing multiple rooms or options, use bullet points (-), each on its own line.
- Leave a blank line between paragraphs.

Important rules:
- Never mention the branchId or any technical ID to the user.
- Only mention: hotel/branch name, room type, price, and available quantity.
- Before calling the create_booking tool, make sure you've collected from the user: room type, hotel/branch name, check-in date, check-out date, and quantity.
- Summarize the booking details and ask for explicit confirmation ("yes"/"confirm") before calling create_booking.
- Do not call create_booking until the user explicitly confirms.
- If asked about a room or price not found in the data, tell the user honestly instead of making up information.

${hotelsContext}`;

  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: systemPrompt }, ...messages] as any,
    tools,
    tool_choice: 'auto',
  });

  const responseMessage = completion.choices[0]?.message;

  if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
    const toolCall = responseMessage.tool_calls[0];

    if (toolCall.function.name === 'create_booking') {
      const args = JSON.parse(toolCall.function.arguments);

      const hotelId = await findBranchId(args.hotelName, args.city);

      if (!hotelId) {
        return `⚠️ Could not find a hotel named "${args.hotelName}" in "${args.city}". Please check the name and try again.`;
      }

      const session = await auth();
      if (!session?.user?.email) {
        return 'You must sign in first to complete the booking. Please sign in and try again.';
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return 'Your account was not found. Please sign in again.';
      }

      try {
        const result = await createBookingRequest({
          userId: user.id,
          roomType: args.roomType,
          hotelId,
          checkIn: args.checkIn,
          checkOut: args.checkOut,
          quantity: args.quantity,
        });

        let checkoutUrl: string | null = null;
        try {
          checkoutUrl = await createCheckoutSession(result.bookingRequest.id);
        } catch (checkoutErr) {
          console.error('Checkout session error:', checkoutErr);
        }

        if (checkoutUrl) {
          return `✅ Booking request created successfully!\n\n- Nights: ${result.nights}\n- Total price: $${result.totalPrice}\n\nYour room is held for 10 minutes. Please complete payment here:\n\n${checkoutUrl}\n\n⚠️ If payment is not completed within 10 minutes, the booking will be automatically cancelled and the room released.`;
        }

        return `✅ Booking request created, but there was an error generating the payment link. Please go to "My Bookings" to complete payment manually.\n\n- Nights: ${result.nights}\n- Total price: $${result.totalPrice}`;
      } catch (err) {
        if (err instanceof BookingError) {
          return `⚠️ Booking could not be completed: ${err.message}`;
        }
        console.error(err);
        return '⚠️ An unexpected error occurred while booking. Please try again later.';
      }
    }
  }

  return responseMessage?.content || '';
}

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { conversationId, message } = body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return Response.json({ error: 'Message is required' }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: 'Please sign in first' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 401 });
  }

  // جلب أو إنشاء المحادثة
  let conversation;
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId: user.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conversation) {
      return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }
  } else {
    conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        title: message.slice(0, 50),
      },
      include: { messages: true },
    });
  }

  // حفظ رسالة المستخدم
  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'user',
      content: message,
    },
  });

  // بناء تاريخ المحادثة الكامل لبعثه للـ AI
  const history = [
    ...conversation.messages.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  const replyText = await getAIReply(history);

  // حفظ رد الـ AI
  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      content: replyText,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  return Response.json({
    conversationId: conversation.id,
    reply: replyText,
  });
}
