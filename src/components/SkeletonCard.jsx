import styles from '../app/page.module.css'; // Reusing global card styles

export default function SkeletonCard() {
  return (
    <div className={`glass-panel ${styles.kosCard}`} style={{ animation: 'pulse 1.5s infinite', opacity: 0.7 }}>
      <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)' }}></div>
      <div style={{ padding: 'var(--space-4)' }}>
        <div style={{ height: '20px', width: '30%', backgroundColor: 'var(--color-bg-secondary)', marginBottom: 'var(--space-2)', borderRadius: 'var(--radius-sm)' }}></div>
        <div style={{ height: '24px', width: '80%', backgroundColor: 'var(--color-bg-secondary)', marginBottom: 'var(--space-2)', borderRadius: 'var(--radius-sm)' }}></div>
        <div style={{ height: '16px', width: '50%', backgroundColor: 'var(--color-bg-secondary)', marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-sm)' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ height: '20px', width: '40%', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}></div>
          <div style={{ height: '36px', width: '80px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}></div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}} />
    </div>
  );
}
