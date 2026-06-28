import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request) {
  try {
    // Di KV, kita ambil semua data dengan prefix 'kos:'
    // Catatan: Anda perlu menyimpan ID kos ke dalam sebuah SET bernama 'all_kos'
    const kosIds = await kv.smembers('all_kos');
    const kosList = await Promise.all(kosIds.map(id => kv.get(`kos:${id}`)));

    return NextResponse.json(kosList);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const id = Date.now().toString(); // Generate ID sederhana

    const newKos = {
      id,
      name: data.name,
      price: parseInt(data.price),
      type: data.type,
      location: data.location,
      images: data.images || [],
      facilities: data.facilities || [],
      createdAt: new Date().toISOString()
    };

    // Simpan ke KV
    await kv.set(`kos:${id}`, newKos);
    await kv.sadd('all_kos', id); // Tambahkan ke daftar semua kos

    return NextResponse.json({ success: true, data: newKos }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Failed to create' }, { status: 400 });
  }
}