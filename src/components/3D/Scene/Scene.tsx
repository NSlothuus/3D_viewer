import React, { useRef, useEffect, useState } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '../../../stores/sceneStore';
import SceneObjects from './SceneObjects';
import SceneLights from './SceneLights';
import TransformControls from '../Controls/TransformControls';
import SelectionHelper from '../Controls/SelectionHelper';
import FileUpload from '../../UI/Common/FileUpload';

interface SceneProps {
  onObjectClick?: (objectId: string, event: ThreeEvent<MouseEvent>) => void;
}

const Scene: React.FC<SceneProps> = ({ onObjectClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [transformEnabled, setTransformEnabled] = useState(true);
  const { renderSettings, camera, environment, selectedObjects } = useSceneStore();

  // Handle keyboard shortcuts for transform modes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedObjects.length === 0) return;
      
      switch (event.key.toLowerCase()) {
        case 'g':
          setTransformMode('translate');
          break;
        case 'r':
          setTransformMode('rotate');
          break;
        case 's':
          setTransformMode('scale');
          break;
        case 'escape':
          setTransformEnabled(false);
          setTimeout(() => setTransformEnabled(true), 100);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObjects]);

  return (
    <FileUpload>
      <Canvas
        ref={canvasRef}
        camera={{
          position: [camera.position.x, camera.position.y, camera.position.z],
          fov: camera.fov,
          near: camera.near,
          far: camera.far,
        }}
        shadows={renderSettings.shadows}
        gl={{
          antialias: renderSettings.antialias,
          toneMapping: renderSettings.toneMapping,
          toneMappingExposure: renderSettings.toneMappingExposure,
          outputColorSpace: renderSettings.outputColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = renderSettings.shadows;
          gl.shadowMap.type = renderSettings.shadowType;
        }}
        style={{ background: 'transparent' }}
      >
      {/* Environment */}
      {environment?.type === 'hdri' && environment.hdriUrl ? (
        <Environment files={environment.hdriUrl} />
      ) : (
        <color
          attach="background"
          args={[environment?.color || new THREE.Color(0x222222)]}
        />
      )}

      {/* Grid */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* Lights */}
      <SceneLights />

      {/* Objects */}
      <SceneObjects onObjectClick={onObjectClick} />

      {/* Selection Helper */}
      <SelectionHelper />

      {/* Transform Controls */}
      <TransformControls
        enabled={transformEnabled && selectedObjects.length === 1}
        mode={transformMode}
      />

      {/* Controls */}
      <OrbitControls
        target={[camera.target.x, camera.target.y, camera.target.z]}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        dampingFactor={0.05}
        enableDamping={true}
        maxPolarAngle={Math.PI}
        minDistance={0.1}
        maxDistance={1000}
      />

      {/* Ambient light for basic visibility */}
      <ambientLight intensity={0.2} />
    </Canvas>
    </FileUpload>
  );
};

export default Scene;