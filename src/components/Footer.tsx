const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid #6B7280', marginTop: '0.5rem' }}>
      <div className="container" style={{ textAlign: 'center', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
        <div>© {new Date().getFullYear()} Russian Urban Dictionary</div>
        <div style={{ fontSize: '11px', color: 'gray', marginTop: '4px' }}>
          Анонимная статистика собирается через Simple Analytics
        </div>
      </div>
    </footer>
  );
};

export default Footer;