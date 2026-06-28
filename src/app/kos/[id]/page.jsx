import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import DetailClient from './DetailClient';
import styles from './detail.module.css';
import { kv } from '@vercel/kv'; // Ganti import prisma dengan kv
import { notFound } from 'next/navigation';

export default async function KosDetail({ params }) {
  const { id } = await params;
  
  // Mengambil data dari Vercel KV (Redis)
  const kos = await kv.get(`kos:${id}`);

  if (!kos) {
    return notFound();
  }

  // Karena data di KV bersifat sederhana, pastikan struktur gambarnya sesuai
  const mainImage = kos.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200';
  const subImage1 = kos.images?.[1]?.url || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800';
  const subImage2 = kos.images?.[2]?.url || 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800';

  return (
    <>
      <Navbar />
      <main className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <span className={`${styles.badge} ${styles['badge' + kos.type]}`}>Kos {kos.type}</span>
            <h1 className={styles.title}>{kos.name}</h1>
            <p className={styles.location}>📍 {kos.location}</p>
          </div>
        </div>

        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img src={mainImage} alt="Foto Utama" />
          </div>
          <div className={styles.subImages}>
            <img src={subImage1} alt="Foto 2" />
            <img src={subImage2} alt="Foto 3" />
          </div>
        </div>

        <DetailClient kos={kos} />
      </main>
      <Footer />
    </>
  );
}