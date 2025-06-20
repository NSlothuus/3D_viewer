import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight as ThreePointLight } from 'three';
import { SceneObject, LightProperties } from '../../../../types/scene';

interface PointLightProps {
  object: SceneObject;
  properties: LightProperties;
}

const PointLight: React.FC<PointLightProps> = ({ object, properties }) => {
  const lightRef = useRef<ThreePointLight>(null);

  useFrame(() => {
    if (lightRef.current && object.object3D) {
      lightRef.current.position.copy(object.object3D.position);
      lightRef.current.intensity = properties.intensity;
      lightRef.current.color.copy(properties.color);
      lightRef.current.castShadow = properties.castShadow;
      
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
      <pointLight
        ref={lightRef}
        position={[
          object.object3D.position.x,
          object.object3D.position.y,
          object.object3D.position.z,
        ]}
        intensity={properties.intensity}
        color={properties.color}
        castShadow={properties.castShadow}
        distance={properties.distance || 0}
        decay={properties.decay || 2}
      />
      
      {/* Light helper visualization */}
      <mesh position={[
        object.object3D.position.x,
        object.object3D.position.y,
        object.object3D.position.z,
      ]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial
          color={properties.color}
          transparent
          opacity={0.8}
        />
      </mesh>
    </>
  );
};

export default PointLight;