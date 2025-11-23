export default function LandingSimple() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white', 
      padding: '50px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Joyeux Noël</h1>
      <p style={{ fontSize: '20px', marginBottom: '30px' }}>de la part de…</p>
      <a href="/editor" style={{
        padding: '16px 32px',
        background: 'linear-gradient(to right, #dc2626, #f59e0b)',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '9999px',
        textDecoration: 'none'
      }}>
        ✨ Créer ma carte
      </a>
    </div>
  );
}
