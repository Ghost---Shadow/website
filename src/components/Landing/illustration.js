import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import MobiusGlb from '../../assets/mobius.glb';

/* eslint-disable react/no-unknown-property */

function Illustration({ scale, ringScale }) {
  const { nodes, materials } = useGLTF(MobiusGlb);
  const group = useRef();
  useFrame(({ clock }) => {
    group.current.rotation.y = clock.getElapsedTime();
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
          scale={scale * (1 + ringScale)}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.strip.geometry}
          material={materials.red}
          scale={scale}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.strip.geometry}
          material={materials.blue}
          scale={scale * (1 - ringScale)}
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

/* eslint-disable react/jsx-props-no-spreading */
function IllustrationWrapper({ ...props }) {
  return (
    <Canvas>
      <Illustration {...props} />
    </Canvas>
  );
}

export default IllustrationWrapper;
