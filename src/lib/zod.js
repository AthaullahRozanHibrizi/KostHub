import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter" }),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  role: z.enum(['seeker', 'owner']),
});

export const propertySchema = z.object({
  name: z.string().min(3, { message: "Nama properti terlalu pendek" }),
  price: z.coerce.number().min(100000, { message: "Harga minimal Rp 100.000" }),
  type: z.enum(['Putra', 'Putri', 'Campur']),
  location: z.string().min(5, { message: "Alamat terlalu pendek" }),
  description: z.string().min(10, { message: "Deskripsi minimal 10 karakter" }),
  totalRooms: z.coerce.number().min(1, { message: "Minimal 1 kamar" }),
  availableRooms: z.coerce.number().min(0, { message: "Kamar tersedia tidak boleh minus" }),
  facilities: z.string().min(2, { message: "Masukkan minimal 1 fasilitas" }),
});
