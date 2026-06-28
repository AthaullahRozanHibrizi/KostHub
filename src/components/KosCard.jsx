import Link from 'next/link';
import styles from './KosCard.module.css';

export default function KosCard({ id, name, price, type, location, image }) {
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} />
        <span className={`${styles.badge} ${styles['badge' + type]}`}>Kos {type}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.location}>📍 {location}</p>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(price)}</span>
          <span className={styles.period}>/ bulan</span>
        </div>
        <Link href={`/kos/${id}`} className={`btn btn-outline ${styles.btnFull}`}>Lihat Detail</Link>
      </div>
    </div>
  );
}
