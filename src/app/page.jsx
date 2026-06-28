import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import KosCard from '../components/KosCard';
import styles from './page.module.css';
import prisma from '@/lib/prisma';

export default async function Home() {
  // Fetch real data from database
  const kosList = await prisma.kos.findMany({
    take: 6, // Limit to 6 popular kos
    include: {
      images: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const popularKos = kosList.map(kos => ({
    ...kos,
    image: kos.images.length > 0 ? kos.images[0].url : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
  }));

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>
            Temukan Kos Impianmu di <span className="text-gradient">KostHub</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Ribuan pilihan kos eksklusif, aman, dan nyaman tersedia untukmu.
          </p>
          
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Masukkan nama lokasi atau kota..." 
              className={styles.searchInput}
            />
            <button className={`btn btn-primary ${styles.searchBtn}`}>Cari Sekarang</button>
          </div>
        </div>
      </section>

      {/* Popular Kos Section */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Rekomendasi Terpopuler</h2>
          <p className={styles.sectionSubtitle}>Pilihan kos favorit berdasarkan pencarian terbanyak.</p>
        </div>
        
        <div className={styles.kosGrid}>
          {popularKos.map((kos) => (
            <KosCard key={kos.id} {...kos} />
          ))}
          {popularKos.length === 0 && (
            <p style={{textAlign: 'center', gridColumn: '1/-1', color: 'var(--color-text-muted)'}}>
              Belum ada data kos yang tersedia. Pemilik kos dapat menambahkan data melalui dashboard.
            </p>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Apa Kata Mereka?</h2>
            <p className={styles.sectionSubtitle}>Pengalaman nyata dari pengguna KostHub.</p>
          </div>
          
          <div className={styles.testimonialGrid}>
            <div className={`glass-panel ${styles.testimonialCard}`}>
              <p className={styles.quote}>"Berkat KostHub, saya bisa nemuin kos yang pas dengan budget dan dekat kampus cuma dalam 10 menit!"</p>
              <div className={styles.author}>
                <div className={styles.avatar}>A</div>
                <div>
                  <h4>Andi Setiawan</h4>
                  <span>Mahasiswa</span>
                </div>
              </div>
            </div>
            <div className={`glass-panel ${styles.testimonialCard}`}>
              <p className={styles.quote}>"Fitur manajemen kos buat pemilik sangat membantu. Saya bisa atur semua kamar kos yang kosong dari satu dashboard."</p>
              <div className={styles.author}>
                <div className={styles.avatar}>B</div>
                <div>
                  <h4>Budi Santoso</h4>
                  <span>Pemilik Kos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
