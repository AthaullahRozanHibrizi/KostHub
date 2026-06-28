import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const kos = await prisma.kos.findUnique({
      where: { id },
      include: {
        images: true,
        facilities: true,
        owner: {
          select: { name: true, email: true }
        }
      }
    });

    if (!kos) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(kos);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.kos.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
