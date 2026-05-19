const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid #ccc', marginTop: '2rem' }}>
      <div className="container" style={{ textAlign: 'center', paddingTop: '1rem', paddingBottom: '1rem' }}>
        © {new Date().getFullYear()} Russian Urban Dictionary
      </div>
    </footer>
  );
};

export default Footer;