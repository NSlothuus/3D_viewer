import React, { useRef, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { SpotLight as ThreeSpotLight, Mesh } from 'three';
import { SceneObject, LightProperties } from '../../../../types/scene';
import { useSceneStore } from '../../../../stores/sceneStore';

interface SpotLightProps {
  object: SceneObject;
  properties: LightProperties;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
}

const SpotLight: React.FC<SpotLightProps> = ({ object, properties, onClick }) => {
  const lightRef = useRef<ThreeSpotLight>(null);
  const helperMeshRef = useRef<Mesh>(null);
  const { registerMesh, unregisterMesh } = useSceneStore();

  // Register/unregister helper mesh for transform controls
  useEffect(() => {
    if (helperMeshRef.current) {
      registerMesh(object.id, helperMeshRef.current);
    }
    return () => {
      unregisterMesh(object.id);
    };
  }, [object.id, registerMesh, unregisterMesh]);

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

    // Update helper mesh position
    if (helperMeshRef.current && object.object3D) {
      helperMeshRef.current.position.copy(object.object3D.position);
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
        <mesh ref={helperMeshRef} onClick={onClick}>
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