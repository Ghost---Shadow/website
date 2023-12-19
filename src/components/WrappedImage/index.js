import { Stack, Image } from '@mantine/core';
import PropTypes from 'prop-types';

function WrappedImage({ src, alt, width }) {
  return (
    <Stack sx={{ flex: 1, alignItems: 'center' }}>
      <div style={{ width }}>
        <Image src={src} alt={alt} />
      </div>
      <p>{alt}</p>
    </Stack>
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
