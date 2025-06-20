import React, { useRef, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Group } from 'three';
import { SceneObject } from '../../../types/scene';
import { useSceneStore } from '../../../stores/sceneStore';

interface ImportedModelProps {
  object: SceneObject;
  isSelected: boolean;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
}

const ImportedModel: React.FC<ImportedModelProps> = ({
  object,
  isSelected,
  onClick,
}) => {
  const groupRef = useRef<Group>(null);
  const { registerMesh, unregisterMesh } = useSceneStore();

  // Register/unregister mesh for transform controls
  useEffect(() => {
    if (groupRef.current) {
      registerMesh(object.id, groupRef.current);
    }
    return () => {
      unregisterMesh(object.id);
    };
  }, [object.id, registerMesh, unregisterMesh]);

  useFrame(() => {
    if (groupRef.current && object.object3D) {
      groupRef.current.position.copy(object.object3D.position);
      groupRef.current.rotation.copy(object.object3D.rotation);
      groupRef.current.scale.copy(object.object3D.scale);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={onClick}
    >
      {/* The actual imported model will be added here when loaded */}
      {object.object3D.children.map((child, index) => (
        <primitive
          key={index}
          object={child.clone()}
        />
      ))}
      
      {/* Selection outline */}
      {isSelected && (
        <group>
          {/* Add selection visualization here */}
        </group>
      )}
    </group>
  );
};

export default ImportedModel;