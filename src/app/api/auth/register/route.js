import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    // 1. Cek apakah user sudah ada
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan user ke KV
    const userData = { name, email, password: hashedPassword, role };
    await kv.set(`user:${email}`, userData);

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error("KV Register Error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}