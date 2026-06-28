'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import KosCard from '../../components/KosCard';
import SkeletonCard from '../../components/SkeletonCard';
import styles from './search.module.css';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [kosData, setKosData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [facilities, setFacilities] = useState({
    WiFi: false,
    AC: false,
    'Kamar Mandi Dalam': false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/kos');
        const data = await res.json();
        setKosData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFacilityChange = (f) => {
    setFacilities(prev => ({ ...prev, [f]: !prev[f] }));
    setCurrentPage(1); // Reset page on filter change
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = kosData.filter(kos => {
    if (searchTerm && !kos.name.toLowerCase().includes(searchTerm.toLowerCase()) && !kos.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (typeFilter && kos.type !== typeFilter) return false;
    if (kos.price > maxPrice) return false;
    
    const activeFacilities = Object.keys(facilities).filter(k => facilities[k]);
    if (activeFacilities.length > 0) {
      const kosFacilities = kos.facilitiesList || [];
      const hasAll = activeFacilities.every(f => kosFacilities.includes(f));
      if (!hasAll) return false;
    }
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <div className={`container ${styles.layout}`}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
            <h3 className={styles.filterTitle}>Filter Pencarian</h3>
            
            <div className="form-group">
              <label>Cari Lokasi / Nama Kos</label>
              <div style={{position: 'relative'}}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Cari..." 
                  value={searchTerm}
                  onChange={handleFilterChange(setSearchTerm)}
                  style={{paddingLeft: '35px'}}
                />
                <Search size={18} style={{position:'absolute', left:'10px', top:'10px', color:'var(--color-text-muted)'}}/>
              </div>
            </div>

            <div className="form-group">
              <label>Tipe Kos</label>
              <select className="input-field" value={typeFilter} onChange={handleFilterChange(setTypeFilter)}>
                <option value="">Semua Tipe</option>
                <option value="Putra">Putra</option>
                <option value="Putri">Putri</option>
                <option value="Campur">Campur</option>
              </select>
            </div>

            <div className="form-group">
              <label>Maksimal Harga: Rp {maxPrice.toLocaleString('id-ID')}</label>
              <input 
                type="range" 
                min="500000" 
                max="5000000" 
                step="100000" 
                value={maxPrice}
                onChange={handleFilterChange((val) => setMaxPrice(Number(val)))}
                className={styles.rangeInput}
              />
            </div>

            <div className="form-group">
              <label>Fasilitas</label>
              <div className={styles.checkboxGroup}>
                {Object.keys(facilities).map(f => (
                  <label key={f} className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={facilities[f]} 
                      onChange={() => handleFacilityChange(f)} 
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Results */}
        <main className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2>{loading ? 'Memuat data...' : `Menampilkan ${filteredData.length} Kos`}</h2>
          </div>
          
          <div className={styles.grid}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : currentData.length > 0 ? (
              currentData.map(kos => <KosCard key={kos.id} {...kos} />)
            ) : (
              <div className={styles.emptyState}>
                <p>Tidak ada kos yang sesuai dengan filter Anda.</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                className="btn btn-outline" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Sebelumnya
              </button>
              <span className={styles.pageInfo}>Halaman {currentPage} dari {totalPages}</span>
              <button 
                className="btn btn-outline" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Selanjutnya
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
