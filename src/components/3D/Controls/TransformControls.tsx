import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { TransformControls as DreiTransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '../../../stores/sceneStore';

interface TransformControlsProps {
  enabled: boolean;
  mode: 'translate' | 'rotate' | 'scale';
}

const TransformControls: React.FC<TransformControlsProps> = ({ enabled, mode }) => {
  const { selectedObjects, getSelectedObjects, updateObject } = useSceneStore();
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  const selectedObjectsList = getSelectedObjects();
  const selectedObject = selectedObjectsList.length === 1 ? selectedObjectsList[0] : null;

  useEffect(() => {
    if (controlsRef.current && selectedObject) {
      controlsRef.current.attach(selectedObject.object3D);
    }
  }, [selectedObject]);

  const handleObjectChange = () => {
    if (selectedObject && controlsRef.current) {
      // Update the object in the store
      updateObject(selectedObject.id, { object3D: selectedObject.object3D });
    }
  };

  if (!enabled || !selectedObject) {
    return null;
  }

  return (
    <DreiTransformControls
      ref={controlsRef}
      camera={camera}
      domElement={gl.domElement}
      object={selectedObject.object3D}
      mode={mode}
      size={1}
      showX={true}
      showY={true}
      showZ={true}
      space="world"
      onObjectChange={handleObjectChange}
    />
  );
};

export default TransformControls;