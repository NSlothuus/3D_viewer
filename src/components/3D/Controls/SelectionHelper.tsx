import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '../../../stores/sceneStore';

const SelectionHelper: React.FC = () => {
  const { selectedObjects, getSelectedObjects } = useSceneStore();
  const groupRef = useRef<THREE.Group>(null);

  const selectedObjectsList = getSelectedObjects();

  useFrame(() => {
    if (!groupRef.current) return;

    // Clear previous selection helpers
    groupRef.current.clear();

    selectedObjectsList.forEach(object => {
      if (!object.visible) return;

      // Create bounding box helper
      const box = new THREE.Box3().setFromObject(object.object3D);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Create wireframe box geometry
      const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({ 
        color: 0x4a9eff, 
        linewidth: 2,
        transparent: true,
        opacity: 0.8
      });
      const wireframe = new THREE.LineSegments(edges, material);
      
      // Position the wireframe at the object's bounding box center
      wireframe.position.copy(center);
      
      // Add corner indicators
      const cornerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const cornerMaterial = new THREE.MeshBasicMaterial({ color: 0x4a9eff });
      
      const corners = [
        new THREE.Vector3(-size.x/2, -size.y/2, -size.z/2),
        new THREE.Vector3(size.x/2, -size.y/2, -size.z/2),
        new THREE.Vector3(-size.x/2, size.y/2, -size.z/2),
        new THREE.Vector3(size.x/2, size.y/2, -size.z/2),
        new THREE.Vector3(-size.x/2, -size.y/2, size.z/2),
        new THREE.Vector3(size.x/2, -size.y/2, size.z/2),
        new THREE.Vector3(-size.x/2, size.y/2, size.z/2),
        new THREE.Vector3(size.x/2, size.y/2, size.z/2),
      ];

      corners.forEach(cornerPos => {
        const corner = new THREE.Mesh(cornerGeometry, cornerMaterial);
        corner.position.copy(cornerPos.add(center));
        groupRef.current?.add(corner);
      });

      groupRef.current?.add(wireframe);
    });
  });

  return <group ref={groupRef} />;
};

export default SelectionHelper;