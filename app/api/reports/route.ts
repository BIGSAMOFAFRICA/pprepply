import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

function isDbUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Can't reach database server") ||
    message.includes('ECONNREFUSED') ||
    message.includes('ENOTFOUND') ||
    message.includes('ETIMEDOUT')
  );
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return NextResponse.json({ reports: [] });

    const reports = await prisma.report.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    if (isDbUnavailable(error)) {
      // Degrade gracefully if DB is temporarily unreachable.
      return NextResponse.json(
        { reports: [], warning: 'Database unavailable (check DATABASE_URL / network / SSL)' },
        { status: 200 },
      );
    }
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get('id');
    if (!reportId) return NextResponse.json({ error: 'Missing report ID' }, { status: 400 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await prisma.report.deleteMany({
      where: { id: reportId, userId: dbUser.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isDbUnavailable(error)) {
      return NextResponse.json(
        { error: 'Database unavailable (check DATABASE_URL / network / SSL)' },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
