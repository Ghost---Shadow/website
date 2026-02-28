import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Component } from 'react';
import PropTypes from 'prop-types';
import MobiusGlb from '../../assets/mobius.glb';
import IllustrationSvg from '../../assets/illustration.svg';

/* eslint-disable react/no-unknown-property */

function Illustration({ scale, ringScale }) {
  const { nodes, materials } = useGLTF(MobiusGlb);
  const group = useRef();
  const middleRing = useRef();

  const lowerScale = scale * (1 - ringScale);
  const upperScale = scale * (1 + ringScale);

  useFrame(({ clock }) => {
    group.current.rotation.y = clock.getElapsedTime();
    const t = ((1 + Math.sin(clock.getElapsedTime())) / 2);
    const epsilon = 0.2;
    const sinTime = lowerScale + epsilon + t * (upperScale - lowerScale - 2 * epsilon);
    middleRing.current.scale.set(sinTime, sinTime, sinTime);
  });

  return (
    <>
      <OrbitControls
        makeDefault
        enableDamping
        enableZoom={false}
        enablePan={false}
        dampingFactor={0.05}
        rotateSpeed={1.1}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.5}
      />
      <ambientLight intensity={1} />
      <group ref={group} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.strip.geometry}
          material={materials.blue}
          scale={upperScale}
        />
        <mesh
          ref={middleRing}
          castShadow
          receiveShadow
          geometry={nodes.strip.geometry}
          material={materials.red}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.strip.geometry}
          material={materials.blue}
          scale={lowerScale}
        />
      </group>
    </>
  );
}

Illustration.propTypes = {
  scale: PropTypes.number,
  ringScale: PropTypes.number,
};

Illustration.defaultProps = {
  scale: 2,
  ringScale: 0.2,
};

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <img src={IllustrationSvg} alt="stacks" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
    }
    return children;
  }
}

WebGLErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

/* eslint-disable react/jsx-props-no-spreading */
function IllustrationWrapper({ ...props }) {
  return (
    <WebGLErrorBoundary>
      <Canvas style={{ cursor: 'grab' }} fallback={<img src={IllustrationSvg} alt="stacks" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}>
        <Illustration {...props} />
      </Canvas>
    </WebGLErrorBoundary>
  );
}

export default IllustrationWrapper;
