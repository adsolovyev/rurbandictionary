const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid #6B7280', marginTop: '0.5rem' }}>
      <div className="container" style={{ textAlign: 'center', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
        © {new Date().getFullYear()} Russian Urban Dictionary
      </div>
    </footer>
  );
};

export default Footer;