import { auth } from '@/auth';
import ChatWindow from '@/components/chat/ChatWindow';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login' as unknown as any);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect('/login' as unknown as any);

  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: user.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  if (!conversation) redirect('/chat' as unknown as any);

  const messages: Message[] = conversation.messages.map((m) => ({
    id: m.id,
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  return <ChatWindow initialMessages={messages} initialConversationId={id} />;
}
