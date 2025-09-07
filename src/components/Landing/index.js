import Link from 'next/link';
import IllustrationSvg from '../../assets/illustration.svg';
import SocialMediaLinks from '../common/SocialMediaLinks';

function ButtonGroup() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Link href="/blog" style={{ textDecoration: 'none' }}>
        <button
          style={{
            border: '1px solid #333',
            color: '#333',
            backgroundColor: 'transparent',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Blog
        </button>
      </Link>
      <a href="#bio" style={{ textDecoration: 'none' }}>
        <button
          style={{
            border: '1px solid #333',
            color: '#333',
            backgroundColor: 'transparent',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Bio
        </button>
      </a>
    </div>
  );
}

function Landing() {
  return (
    <div style={{
      flex: 1, 
      height: '100vh', 
      margin: '5rem', 
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        marginBottom: '2rem' 
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>Souradeep Nanda</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', margin: 0 }}>
            Tech Generalist - Full stack developer, devops, ML engineer, data analyst
          </p>
        </div>
        <div>
          <SocialMediaLinks />
        </div>
      </div>
      <div style={{ 
        flex: 0.5, 
        display: 'flex', 
        alignItems: 'center' 
      }}>
        <div style={{
          flex: 1, 
          width: '400px', 
          height: '300px'
        }}>
          <img src={IllustrationSvg} alt="stacks" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'flex-end' 
        }}>
          <div style={{ flex: 0.5 }}>
            <ButtonGroup />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
