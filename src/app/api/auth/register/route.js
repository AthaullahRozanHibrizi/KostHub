import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role === 'owner' ? 'pemilik' : 'pencari'
      }
    });

    return NextResponse.json({ message: "User created", user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
  // Ini adalah perintah "CCTV" untuk menangkap error asli
  console.error("=== DEBUG_REGISTER_ERROR ===");
  console.error("Message:", error.message);
  console.error("Stack Trace:", error.stack);
  
  // Tetap mengembalikan respon 500 ke browser, tapi kita sudah punya log di Vercel
  return NextResponse.json({ message: "An error occurred" }, { status: 500 });
}
}
