import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <h2>Kost<span className="text-gradient">Hub</span></h2>
          <p className={styles.desc}>Platform pencarian dan manajemen kos terbaik di Indonesia. Temukan hunian impianmu sekarang.</p>
        </div>
        <div className={styles.links}>
          <h3>Layanan</h3>
          <ul>
            <li><a href="#">Cari Kos</a></li>
            <li><a href="#">Promosikan Kos</a></li>
            <li><a href="#">Bantuan</a></li>
          </ul>
        </div>
        <div className={styles.links}>
          <h3>Perusahaan</h3>
          <ul>
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Kontak</a></li>
            <li><a href="#">Karir</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} KostHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
