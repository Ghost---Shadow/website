import PropTypes from 'prop-types';

function WrappedImage({ src, alt, width }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <div style={{ width }}>
        <img src={src} alt={alt} style={{ width: '100%', height: 'auto' }} />
      </div>
      <p>{alt}</p>
    </div>
  );
}

WrappedImage.propTypes = {
  src: PropTypes.node.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.string,
};

WrappedImage.defaultProps = {
  width: '50%',
};

export default WrappedImage;
