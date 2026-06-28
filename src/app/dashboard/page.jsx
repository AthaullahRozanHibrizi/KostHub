'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './dashboard.module.css';
import { propertySchema } from '@/lib/zod';
import { Eye, Home, Users } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('properties');
  const [isAdding, setIsAdding] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'OWNER') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchProperties();
    }
  }, [status, session, router]);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/kos');
      const data = await res.json();
      const myProperties = data.filter(p => p.ownerId === session.user.id);
      setProperties(myProperties);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setFormErrors({});
    const formData = new FormData(e.target);
    
    const newPropertyData = {
      name: formData.get('name'),
      price: formData.get('price'),
      type: formData.get('type'),
      location: formData.get('location'),
      description: formData.get('description'),
      totalRooms: formData.get('totalRooms'),
      availableRooms: formData.get('availableRooms'),
      facilities: formData.get('facilities')
    };

    // Zod Validation
    const validationResult = propertySchema.safeParse(newPropertyData);
    if (!validationResult.success) {
      const errors = {};
      validationResult.error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    let imageUrl = '';
    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const uploadJson = await uploadRes.json();
      if (uploadJson.success) {
        imageUrl = uploadJson.url;
      }
    }

    const payload = {
      ...newPropertyData,
      ownerId: session.user.id,
      images: imageUrl ? [imageUrl] : [],
      facilities: newPropertyData.facilities.split(',').map(f => f.trim()).filter(Boolean)
    };

    const res = await fetch('/api/kos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setIsAdding(false);
      setFile(null);
      fetchProperties();
    }
  };

  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const totalProperties = properties.length;
  const totalAvailableRooms = properties.reduce((sum, p) => sum + p.availableRooms, 0);

  if (status === 'loading' || loading) return <p style={{textAlign:'center', marginTop:'2rem'}}>Loading...</p>;
  if (!session || session.user.role !== 'OWNER') return null;

  return (
    <>
      <Navbar />
      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}>{session.user.name.charAt(0)}</div>
              <div>
                <h3 className={styles.ownerName}>{session.user.name}</h3>
                <span className={styles.ownerRole}>Pemilik Kos</span>
              </div>
            </div>
            <nav className={styles.navMenu}>
              <button 
                className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.activeNav : ''}`}
                onClick={() => { setActiveTab('dashboard'); setIsAdding(false); }}
              >
                Statistik (Analytics)
              </button>
              <button 
                className={`${styles.navItem} ${activeTab === 'properties' ? styles.activeNav : ''}`}
                onClick={() => setActiveTab('properties')}
              >
                Properti Saya
              </button>
            </nav>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h2>{activeTab === 'dashboard' ? 'Ringkasan Statistik' : 'Manajemen Properti Kos'}</h2>
            {activeTab === 'properties' && !isAdding && (
              <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                + Tambah Kos Baru
              </button>
            )}
          </div>

          {activeTab === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '50%', color: '#4f46e5' }}><Eye /></div>
                <div>
                  <h3 style={{ fontSize: '1.5rem' }}>{totalViews}</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>Total Dilihat</p>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%', color: '#16a34a' }}><Home /></div>
                <div>
                  <h3 style={{ fontSize: '1.5rem' }}>{totalProperties}</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>Total Properti</p>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '50%', color: '#d97706' }}><Users /></div>
                <div>
                  <h3 style={{ fontSize: '1.5rem' }}>{totalAvailableRooms}</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>Kamar Kosong</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'properties' && isAdding ? (
            <div className={`glass-panel ${styles.formCard}`}>
              <h3>Tambah Properti Baru</h3>
              <form onSubmit={handleAddProperty} className={styles.form}>
                <div className="form-group">
                  <label>Nama Kos</label>
                  <input name="name" type="text" className="input-field" />
                  {formErrors.name && <span style={{color: 'red', fontSize: '0.8rem'}}>{formErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Harga Sewa / Bulan (Rp)</label>
                  <input name="price" type="number" className="input-field" />
                  {formErrors.price && <span style={{color: 'red', fontSize: '0.8rem'}}>{formErrors.price}</span>}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Total Kamar</label>
                    <input name="totalRooms" type="number" className="input-field" defaultValue={1} />
                    {formErrors.totalRooms && <span style={{color: 'red', fontSize: '0.8rem'}}>{formErrors.totalRooms}</span>}
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Kamar Kosong</label>
                    <input name="availableRooms" type="number" className="input-field" defaultValue={1} />
                    {formErrors.availableRooms && <span style={{color: 'red', fontSize: '0.8rem'}}>{formErrors.availableRooms}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Tipe Kos</label>
                  <select name="type" className="input-field">
                    <option value="Putra">Putra</option>
                    <option value="Putri">Putri</option>
                    <option value="Campur">Campur</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Lokasi (Alamat Lengkap)</label>
                  <input name="location" type="text" className="input-field" />
                  {formErrors.location && <span style={{color: 'red', fontSize: '0.8rem'}}>{formErrors.location}</span>}
                </div>
                <div className="form-group">
                  <label>Deskripsi Kos</label>
                  <textarea name="description" className="input-field" rows="4"></textarea>
                  {formErrors.description && <span style={{color: 'red', fontSize: '0.8rem'}}>{formErrors.description}</span>}
                </div>
                <div className="form-group">
                  <label>Fasilitas (pisahkan dengan koma)</label>
                  <input name="facilities" type="text" className="input-field" placeholder="WiFi, AC, Kasur" />
                  {formErrors.facilities && <span style={{color: 'red', fontSize: '0.8rem'}}>{formErrors.facilities}</span>}
                </div>
                <div className="form-group">
                  <label>Foto Utama</label>
                  <input type="file" className="input-field" accept="image/*" onChange={e => setFile(e.target.files[0])} />
                </div>
                <div className={styles.formActions}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan Properti</button>
                </div>
              </form>
            </div>
          ) : activeTab === 'properties' && (
            <div className={`glass-panel ${styles.tableContainer}`}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nama Kos</th>
                    <th>Kamar Kosong</th>
                    <th>Dilihat</th>
                    <th>Harga / Bulan</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong><br/><span style={{fontSize:'0.8rem', color:'gray'}}>{p.location}</span></td>
                      <td>{p.availableRooms} / {p.totalRooms}</td>
                      <td>{p.views}</td>
                      <td>Rp {p.price.toLocaleString('id-ID')}</td>
                      <td>
                        <span className={p.availableRooms > 0 ? styles.statusActive : ''} style={{ color: p.availableRooms <= 0 ? 'red' : '' }}>
                          {p.availableRooms > 0 ? 'Tersedia' : 'Penuh'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {properties.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Belum ada properti.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
