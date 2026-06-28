'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Navbar from '../../components/Navbar';
import styles from './login.module.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('seeker'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');

    if (isLogin) {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } else {
      // Register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        // Auto login after register
        const signInRes = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (!signInRes?.error) {
          router.push('/');
          router.refresh();
        }
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={`glass-panel ${styles.authCard}`}>
          <div className={styles.header}>
            <h2>{isLogin ? 'Selamat Datang Kembali' : 'Daftar Akun Baru'}</h2>
            <p className={styles.subtitle}>
              {isLogin ? 'Masuk untuk melanjutkan ke KostHub' : 'Bergabung dengan ribuan pencari dan pemilik kos'}
            </p>
          </div>

          {!isLogin && (
            <div className={styles.roleToggle}>
              <button 
                type="button"
                className={`${styles.roleBtn} ${role === 'seeker' ? styles.activeRole : ''}`}
                onClick={() => setRole('seeker')}
              >
                Pencari Kos
              </button>
              <button 
                type="button"
                className={`${styles.roleBtn} ${role === 'owner' ? styles.activeRole : ''}`}
                onClick={() => setRole('owner')}
              >
                Pemilik Kos
              </button>
            </div>
          )}

          {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input name="name" type="text" className="input-field" placeholder="Masukkan nama Anda" required />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" className="input-field" placeholder="nama@email.com" required />
            </div>
            <div className="form-group">
              <label>Kata Sandi</label>
              <input name="password" type="password" className="input-field" placeholder="••••••••" required />
            </div>

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar Sekarang')}
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button className={styles.toggleBtn} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                {isLogin ? 'Daftar di sini' : 'Masuk'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
