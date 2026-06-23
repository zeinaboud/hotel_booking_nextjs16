import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: 'please sign in first' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return Response.json({ error: 'user not found' }, { status: 404 });
  }

  //get all conversations of user
  const conversations = await prisma.conversation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
  });

  return Response.json({ conversations });
}
