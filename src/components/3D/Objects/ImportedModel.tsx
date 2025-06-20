import React, { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Group } from 'three';
import { SceneObject } from '../../../types/scene';

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