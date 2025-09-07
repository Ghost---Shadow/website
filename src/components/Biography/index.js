const timelineData = [
  {
    company: 'University of Texas at Dallas',
    role: 'Phd Candidate',
    tenure: '2023 - Present',
    description: 'Worked on making large language models slightly better.',
  },
  {
    company: 'Aleph Alpha Gmbh',
    role: 'Software Engineer',
    tenure: '2021 - 2023',
    description: 'Worked on the dashboard and API. Moved to the research team to help out researchers.',
  },
  {
    company: 'McKinsey and Company',
    role: 'Software Engineer',
    tenure: '2018 - 2021',
    description: 'Mostly built software for banks in the Asia Pacific region.',
  },
];

function ProfessionalTimeline() {
  return (
    <div style={{ margin: '1rem 0px' }}>
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {timelineData.map((job, index) => (
          <div 
            key={`${job.company} - ${job.role}`} 
            style={{ 
              position: 'relative', 
              paddingBottom: '2rem',
              borderLeft: index < timelineData.length - 1 ? '2px solid #666' : 'none'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                left: '-8px',
                top: '0',
                width: '14px',
                height: '14px',
                backgroundColor: '#666',
                borderRadius: '50%'
              }}
            />
            <div style={{ paddingLeft: '1rem' }}>
              <a
                href="https://www.linkedin.com/in/souradeep-nanda/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'white', textDecoration: 'underline' }}
              >
                {`${job.company} - ${job.role}`}
              </a>
              <div style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {job.tenure}
              </div>
              <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {job.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Biography() {
  return (
    <div
      id="bio"
      style={{
        flex: 1,
        minHeight: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5rem',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>About me</h2>
        <p style={{ color: 'white', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px' }}>
          I am someone who can wear a lot of hats.
          I feel validated when I see people using my creations.
          I like playing video games, reading Wikipedia at 3 AM and watching anime.
          I have more ideas than time.
        </p>
      </div>
      <ProfessionalTimeline />
      <a
        href="https://github.com/Ghost---Shadow/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          border: '1px solid white',
          color: 'white',
          padding: '0.5rem 1rem',
          textDecoration: 'none',
          borderRadius: '4px',
          marginTop: '2rem'
        }}
      >
        Personal Projects
      </a>
    </div>
  );
}

export default Biography;
