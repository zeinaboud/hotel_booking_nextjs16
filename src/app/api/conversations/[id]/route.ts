import { auth } from '@/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: 'please sign in first' }, { status: 401 });
  }

  const user = await prisma?.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return Response.json({ error: 'user not found' }, { status: 404 });
  }

  const conversation = await prisma?.conversation.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!conversation) {
    return Response.json({ error: 'conversation not found' }, { status: 404 });
  }

  return Response.json(conversation);
}
