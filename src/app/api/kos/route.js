import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const kosList = await prisma.kos.findMany({
      include: {
        images: true,
        facilities: true,
      },
    });

    // Format the response to match the frontend expectations
    const formattedList = kosList.map(kos => ({
      ...kos,
      image: kos.images.length > 0 ? kos.images[0].url : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
      facilitiesList: kos.facilities.map(f => f.name)
    }));

    return NextResponse.json(formattedList);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // In a real app, we'd verify the session here to get ownerId. 
    // For this demo, we'll expect ownerId in the request body, or fallback to the first user if missing.
    let ownerId = data.ownerId;
    if (!ownerId) {
       const user = await prisma.user.findFirst({ where: { role: 'OWNER' }});
       if (!user) return NextResponse.json({ success: false, message: 'No owner found' }, { status: 400 });
       ownerId = user.id;
    }

    const newKos = await prisma.kos.create({
      data: {
        name: data.name,
        price: parseInt(data.price),
        type: data.type,
        location: data.location,
        description: data.description || 'Deskripsi belum tersedia.',
        status: data.status || 'Aktif',
        ownerId: ownerId,
        images: {
          create: data.images?.map(url => ({ url })) || []
        },
        facilities: {
          create: data.facilities?.map(name => ({ name })) || []
        }
      },
      include: {
        images: true,
        facilities: true
      }
    });

    return NextResponse.json({ success: true, data: newKos }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Failed to create' }, { status: 400 });
  }
}
