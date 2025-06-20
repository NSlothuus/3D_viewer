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
  const { selectedObjects, getSelectedObjects, updateObject, getMesh, transformMode, transformEnabled } = useSceneStore();
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  const selectedObjectsList = getSelectedObjects();
  const selectedObject = selectedObjectsList.length === 1 ? selectedObjectsList[0] : null;
  const selectedMesh = selectedObject ? getMesh(selectedObject.id) : null;
  
  // Use store's transform mode if no mode prop is provided
  const currentMode = mode || transformMode;
  const isEnabled = enabled !== undefined ? enabled : transformEnabled;

  useEffect(() => {
    if (controlsRef.current && selectedMesh) {
      controlsRef.current.attach(selectedMesh);
    }
  }, [selectedMesh]);

  const handleObjectChange = () => {
    if (selectedObject && selectedMesh && controlsRef.current) {
      // Update the object3D in the store with the mesh's current transform
      const updatedObject3D = selectedObject.object3D.clone();
      updatedObject3D.position.copy(selectedMesh.position);
      updatedObject3D.rotation.copy(selectedMesh.rotation);
      updatedObject3D.scale.copy(selectedMesh.scale);
      
      // Update the object in the store
      updateObject(selectedObject.id, { object3D: updatedObject3D });
    }
  };

  if (!isEnabled || !selectedObject || !selectedMesh) {
    return null;
  }

  return (
    <DreiTransformControls
      ref={controlsRef}
      camera={camera}
      domElement={gl.domElement}
      object={selectedMesh}
      mode={currentMode}
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