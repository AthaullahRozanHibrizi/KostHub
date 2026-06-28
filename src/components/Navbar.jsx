'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navbar}`}>
        <Link href="/" className={styles.logo}>
          Kost<span className="text-gradient">Hub</span>
        </Link>
        
        <nav className={styles.navLinks}>
          <Link href="/search" className={styles.link}>Cari Kos</Link>
          {session?.user?.role === 'OWNER' && (
            <Link href="/dashboard" className={styles.link}>Dashboard Pemilik</Link>
          )}
        </nav>
        
        <div className={styles.actions}>
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 500 }}>Halo, {session.user.name}</span>
              <button onClick={() => signOut()} className="btn btn-outline">Keluar</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">Masuk</Link>
              <Link href="/login" className="btn btn-primary">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
