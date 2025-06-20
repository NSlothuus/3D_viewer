import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SpotLight as ThreeSpotLight } from 'three';
import { SceneObject, LightProperties } from '../../../../types/scene';

interface SpotLightProps {
  object: SceneObject;
  properties: LightProperties;
}

const SpotLight: React.FC<SpotLightProps> = ({ object, properties }) => {
  const lightRef = useRef<ThreeSpotLight>(null);

  useFrame(() => {
    if (lightRef.current && object.object3D) {
      lightRef.current.position.copy(object.object3D.position);
      lightRef.current.intensity = properties.intensity;
      lightRef.current.color.copy(properties.color);
      lightRef.current.castShadow = properties.castShadow;
      
      if (properties.angle !== undefined) {
        lightRef.current.angle = properties.angle;
      }
      if (properties.penumbra !== undefined) {
        lightRef.current.penumbra = properties.penumbra;
      }
      if (properties.distance !== undefined) {
        lightRef.current.distance = properties.distance;
      }
      if (properties.decay !== undefined) {
        lightRef.current.decay = properties.decay;
      }
    }
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[
          object.object3D.position.x,
          object.object3D.position.y,
          object.object3D.position.z,
        ]}
        intensity={properties.intensity}
        color={properties.color}
        castShadow={properties.castShadow}
        angle={properties.angle || Math.PI / 6}
        penumbra={properties.penumbra || 0.1}
        distance={properties.distance || 0}
        decay={properties.decay || 2}
      />
      
      {/* Light helper visualization */}
      <group position={[
        object.object3D.position.x,
        object.object3D.position.y,
        object.object3D.position.z,
      ]}>
        <mesh>
          <coneGeometry args={[0.1, 0.2, 8]} />
          <meshBasicMaterial
            color={properties.color}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </>
  );
};

export default SpotLight;