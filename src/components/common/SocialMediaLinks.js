function SocialMediaLinks() {
  const linkStyle = {
    display: 'inline-block',
    padding: '0.5rem',
    color: '#333',
    textDecoration: 'none',
    margin: '0 0.25rem',
    border: '1px solid #ddd',
    borderRadius: '4px'
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <a
        href="https://www.linkedin.com/in/souradeep-nanda/"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        LinkedIn
      </a>
      <a
        href="https://github.com/Ghost---Shadow"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        GitHub
      </a>
      <a
        href="https://stackoverflow.com/users/1217998/souradeep-nanda"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        StackOverflow
      </a>
    </div>
  );
}

export default SocialMediaLinks;
