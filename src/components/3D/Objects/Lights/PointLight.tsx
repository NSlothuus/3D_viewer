import React, { useRef, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { PointLight as ThreePointLight, Mesh } from 'three';
import { SceneObject, LightProperties } from '../../../../types/scene';
import { useSceneStore } from '../../../../stores/sceneStore';

interface PointLightProps {
  object: SceneObject;
  properties: LightProperties;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
}

const PointLight: React.FC<PointLightProps> = ({ object, properties, onClick }) => {
  const lightRef = useRef<ThreePointLight>(null);
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
      <mesh
        ref={helperMeshRef}
        position={[
          object.object3D.position.x,
          object.object3D.position.y,
          object.object3D.position.z,
        ]}
        onClick={onClick}
      >
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