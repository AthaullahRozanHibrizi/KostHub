import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import DetailClient from './DetailClient';
import styles from './detail.module.css';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function KosDetail({ params }) {
  const { id } = await params;
  
  // Increment views
  await prisma.kos.update({
    where: { id },
    data: { views: { increment: 1 } }
  }).catch(() => {}); // ignore error if id not found here

  const kos = await prisma.kos.findUnique({
    where: { id },
    include: {
      images: true,
      facilities: true,
      owner: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      },
      favorites: true,
    }
  });

  if (!kos) {
    return notFound();
  }

  const mainImage = kos.images[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200';
  const subImage1 = kos.images[1]?.url || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800';
  const subImage2 = kos.images[2]?.url || 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800';

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

        {/* Pass down to client component for interactivity */}
        <DetailClient kos={kos} />

      </main>
      <Footer />
    </>
  );
}
