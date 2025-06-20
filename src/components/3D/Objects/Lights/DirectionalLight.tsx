import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DirectionalLight as ThreeDirectionalLight } from 'three';
import { SceneObject, LightProperties } from '../../../../types/scene';

interface DirectionalLightProps {
  object: SceneObject;
  properties: LightProperties;
}

const DirectionalLight: React.FC<DirectionalLightProps> = ({ object, properties }) => {
  const lightRef = useRef<ThreeDirectionalLight>(null);

  useFrame(() => {
    if (lightRef.current && object.object3D) {
      lightRef.current.position.copy(object.object3D.position);
      lightRef.current.intensity = properties.intensity;
      lightRef.current.color.copy(properties.color);
      lightRef.current.castShadow = properties.castShadow;
    }
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[
          object.object3D.position.x,
          object.object3D.position.y,
          object.object3D.position.z,
        ]}
        intensity={properties.intensity}
        color={properties.color}
        castShadow={properties.castShadow}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Light helper visualization */}
      <group position={[
        object.object3D.position.x,
        object.object3D.position.y,
        object.object3D.position.z,
      ]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.3]} />
          <meshBasicMaterial
            color={properties.color}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Arrow to show direction */}
        <mesh position={[0, -0.2, 0]}>
          <coneGeometry args={[0.08, 0.15, 8]} />
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

export default DirectionalLight;