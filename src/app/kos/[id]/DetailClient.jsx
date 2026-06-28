'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { Heart, Star, Send } from 'lucide-react';
import styles from './detail.module.css';

// Dynamic import for Map to prevent SSR errors
const Map = dynamic(() => import('../../../components/Map'), { ssr: false, loading: () => <div style={{height: '100%', background: '#eee'}}>Memuat peta...</div> });

export default function DetailClient({ kos }) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(kos.favorites?.some(f => f.userId === session?.user?.id) || false);
  const [reviews, setReviews] = useState(kos.reviews || []);
  const [bookingStatus, setBookingStatus] = useState('');
  
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const handleFavorite = async () => {
    if (!session) return alert("Silakan login dulu untuk menyimpan favorit");
    // Optimistic UI
    setIsFavorite(!isFavorite);
    
    // In real app, call API to toggle favorite
    // await fetch(`/api/kos/${kos.id}/favorite`, { method: 'POST' });
  };

  const handleBooking = async () => {
    if (!session) return alert("Silakan login dulu untuk memesan kamar");
    if (kos.availableRooms <= 0) return alert("Maaf, kamar sudah penuh.");
    
    setBookingStatus('loading');
    setTimeout(() => {
      setBookingStatus('success');
      alert("Booking berhasil disimulasi! Silakan cek menu transaksi Anda.");
    }, 1500);
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!session) return alert("Silakan login dulu untuk memberi ulasan");
    
    const formData = new FormData(e.target);
    const newReview = {
      id: Math.random().toString(),
      rating: Number(formData.get('rating')),
      comment: formData.get('comment'),
      user: { name: session.user.name },
      createdAt: new Date().toISOString()
    };
    
    setReviews([newReview, ...reviews]);
    e.target.reset();
  };

  const mainImage = kos.images[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200';
  
  return (
    <div className={styles.contentLayout}>
      <div className={styles.mainInfo}>
        <section className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Deskripsi</h2>
            <button onClick={handleFavorite} className="btn" style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '50%', padding: '10px' }}>
              <Heart fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : 'var(--color-text)'} size={24} />
            </button>
          </div>
          <p className={styles.description}>{kos.description}</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem' }}>
            <p><strong>Pemilik:</strong> {kos.owner.name}</p>
            <p><strong>Kamar Kosong:</strong> {kos.availableRooms} / {kos.totalRooms}</p>
            <p><strong>Dilihat:</strong> {kos.views} kali</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Fasilitas Kamar</h2>
          {kos.facilities.length > 0 ? (
            <ul className={styles.facilityList}>
              {kos.facilities.map((f, i) => (
                <li key={i} className={styles.facilityItem}>✔️ {f.name}</li>
              ))}
            </ul>
          ) : (
            <p>Belum ada fasilitas tercantum.</p>
          )}
        </section>

        <section className={styles.section}>
          <h2>Lokasi Peta</h2>
          <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
            <Map locationName={kos.location} />
          </div>
        </section>

        <section className={styles.section}>
          <h2>Ulasan Penyewa</h2>
          <form onSubmit={submitReview} className={styles.reviewForm} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select name="rating" className="input-field" required style={{ width: '150px' }}>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
            <textarea name="comment" className="input-field" placeholder="Bagaimana pengalaman Anda di kos ini?" required rows="3"></textarea>
            <button type="submit" className="btn btn-outline" style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.5rem' }}>
              <Send size={16} /> Kirim Ulasan
            </button>
          </form>

          <div className={styles.reviewList}>
            {reviews.length === 0 ? <p>Belum ada ulasan.</p> : reviews.map(r => (
              <div key={r.id} className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{r.user.name}</strong>
                  <span style={{ color: '#f59e0b' }}>{'⭐'.repeat(r.rating)}</span>
                </div>
                <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className={styles.sidebar}>
        <div className={`glass-panel ${styles.bookingCard}`}>
          <p className={styles.priceLabel}>Harga Sewa</p>
          <div className={styles.priceWrapper}>
            <span className={styles.price}>{formatPrice(kos.price)}</span>
            <span className={styles.period}>/ bulan</span>
          </div>
          
          <div className={styles.availability}>
            <span className={kos.availableRooms > 0 ? styles.statusDot : ''} style={{ background: kos.availableRooms <= 0 ? 'red' : '' }}></span>
            {kos.availableRooms > 0 ? 'Tersedia' : 'Penuh'}
          </div>
          
          <button 
            onClick={handleBooking} 
            disabled={kos.availableRooms <= 0 || bookingStatus === 'loading' || bookingStatus === 'success'}
            className={`btn btn-primary ${styles.contactBtn}`}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {bookingStatus === 'loading' ? 'Memproses...' : 
             bookingStatus === 'success' ? 'Berhasil Booking!' : 
             'Booking Kamar Sekarang'}
          </button>
          
          <p style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-muted)' }}>
            Pembayaran akan disimulasikan secara lokal.
          </p>
        </div>
      </aside>
    </div>
  );
}
