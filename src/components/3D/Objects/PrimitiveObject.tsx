import React, { useRef, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneObject } from '../../../types/scene';
import { useSceneStore } from '../../../stores/sceneStore';

interface PrimitiveObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
}

const PrimitiveObject: React.FC<PrimitiveObjectProps> = ({
  object,
  isSelected,
  onClick,
}) => {
  const meshRef = useRef<Mesh>(null);
  const { viewMode, registerMesh, unregisterMesh } = useSceneStore();

  // Register/unregister mesh for transform controls
  useEffect(() => {
    if (meshRef.current) {
      registerMesh(object.id, meshRef.current);
    }
    return () => {
      unregisterMesh(object.id);
    };
  }, [object.id, registerMesh, unregisterMesh]);

  useFrame(() => {
    if (meshRef.current && object.object3D) {
      meshRef.current.position.copy(object.object3D.position);
      meshRef.current.rotation.copy(object.object3D.rotation);
      meshRef.current.scale.copy(object.object3D.scale);
    }
  });

  const primitiveData = object.object3D.userData.primitive;
  if (!primitiveData) return null;

  const renderGeometry = () => {
    switch (primitiveData.type) {
      case 'box':
        return (
          <boxGeometry
            args={[
              primitiveData.width || 1,
              primitiveData.height || 1,
              primitiveData.depth || 1,
              primitiveData.widthSegments || 1,
              primitiveData.heightSegments || 1,
              primitiveData.depthSegments || 1,
            ]}
          />
        );
      case 'sphere':
        return (
          <sphereGeometry
            args={[
              primitiveData.radius || 0.5,
              primitiveData.widthSegments || 32,
              primitiveData.heightSegments || 16,
            ]}
          />
        );
      case 'plane':
        return (
          <planeGeometry
            args={[
              primitiveData.width || 1,
              primitiveData.height || 1,
              primitiveData.widthSegments || 1,
              primitiveData.heightSegments || 1,
            ]}
          />
        );
      case 'cylinder':
        return (
          <cylinderGeometry
            args={[
              primitiveData.radiusTop || 0.5,
              primitiveData.radiusBottom || 0.5,
              primitiveData.height || 1,
              primitiveData.radialSegments || 32,
              primitiveData.heightSegments || 1,
            ]}
          />
        );
      case 'torus':
        return (
          <torusGeometry
            args={[
              primitiveData.radius || 0.5,
              primitiveData.tube || 0.2,
              primitiveData.radialSegments || 16,
              primitiveData.tubularSegments || 100,
            ]}
          />
        );
      default:
        return <boxGeometry />;
    }
  };

  const getMaterial = () => {
    const baseColor = '#ffffff';
    
    switch (viewMode.type) {
      case 'wireframe':
        return (
          <meshStandardMaterial
            color={baseColor}
            wireframe={true}
          />
        );
      case 'solid':
        return (
          <meshBasicMaterial
            color={baseColor}
          />
        );
      case 'shaded':
      default:
        return (
          <meshStandardMaterial
            color={baseColor}
          />
        );
    }
  };

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      {renderGeometry()}
      {getMaterial()}
    </mesh>
  );
};

export default PrimitiveObject;