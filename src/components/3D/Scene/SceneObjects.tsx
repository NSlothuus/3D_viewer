import React from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useSceneStore } from '../../../stores/sceneStore';
import { SceneObject } from '../../../types/scene';
import PrimitiveObject from '../Objects/PrimitiveObject';
import ImportedModel from '../Objects/ImportedModel';

interface SceneObjectsProps {
  onObjectClick?: (objectId: string, event: ThreeEvent<MouseEvent>) => void;
}

const SceneObjects: React.FC<SceneObjectsProps> = ({ onObjectClick }) => {
  const { objects, selectedObjects } = useSceneStore();

  const handleObjectClick = (objectId: string, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onObjectClick?.(objectId, event);
  };

  const renderObject = (object: SceneObject) => {
    if (!object.visible) return null;

    const isSelected = selectedObjects.includes(object.id);

    switch (object.type) {
      case 'mesh':
        // Check if it's a primitive or imported model
        if (object.object3D.userData.primitive) {
          return (
            <PrimitiveObject
              key={object.id}
              object={object}
              isSelected={isSelected}
              onClick={(event: ThreeEvent<MouseEvent>) => handleObjectClick(object.id, event)}
            />
          );
        } else {
          return (
            <ImportedModel
              key={object.id}
              object={object}
              isSelected={isSelected}
              onClick={(event: ThreeEvent<MouseEvent>) => handleObjectClick(object.id, event)}
            />
          );
        }
      case 'group':
        return (
          <group
            key={object.id}
            ref={(ref) => {
              if (ref) {
                ref.copy(object.object3D);
              }
            }}
            onClick={(event) => handleObjectClick(object.id, event)}
          >
            {object.children?.map(child => renderObject(child))}
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from(objects.values()).map(object => renderObject(object))}
    </>
  );
};

export default SceneObjects;