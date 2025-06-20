import React, { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneObject } from '../../../types/scene';

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

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      {renderGeometry()}
      <meshStandardMaterial
        color={isSelected ? '#ff6b6b' : '#ffffff'}
        wireframe={isSelected}
        transparent={isSelected}
        opacity={isSelected ? 0.8 : 1.0}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[meshRef.current?.geometry]} />
          <lineBasicMaterial color="#ff6b6b" />
        </lineSegments>
      )}
    </mesh>
  );
};

export default PrimitiveObject;