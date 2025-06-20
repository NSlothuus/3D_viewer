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
  const {
    registerMesh,
    unregisterMesh,
    globalAnimationTime,
    isGlobalAnimationPlaying,
    globalAnimationSpeed
  } = useSceneStore();

  // Register/unregister mesh for transform controls
  useEffect(() => {
    if (groupRef.current) {
      registerMesh(object.id, groupRef.current);
    }
    return () => {
      unregisterMesh(object.id);
    };
  }, [object.id, registerMesh, unregisterMesh]);

  useFrame((state, delta) => {
    if (groupRef.current && object.object3D) {
      groupRef.current.position.copy(object.object3D.position);
      groupRef.current.rotation.copy(object.object3D.rotation);
      groupRef.current.scale.copy(object.object3D.scale);
    }

    // Handle animations
    if (object.animations?.mixer) {
      const mixer = object.animations.mixer;
      
      if (isGlobalAnimationPlaying) {
        // Update mixer with scaled delta time
        mixer.update(delta * globalAnimationSpeed);
      } else {
        // When not playing, set time directly for scrubbing
        mixer.setTime(globalAnimationTime);
      }
    }
  });

  // Setup animation actions when component mounts or animations change
  useEffect(() => {
    if (object.animations?.mixer && object.animations.clips.length > 0) {
      const mixer = object.animations.mixer;
      
      // Clear existing actions
      mixer.stopAllAction();
      
      // Create and play actions for active clips
      object.animations.activeClips.forEach(clipId => {
        const clip = object.animations!.clips.find(c => c.id === clipId);
        if (clip) {
          const action = mixer.clipAction(clip.threeClip);
          action.setLoop(object.animations!.loop ? 2201 : 2200, Infinity); // LoopRepeat or LoopOnce
          action.play();
        }
      });
    }
  }, [object.animations?.activeClips, object.animations?.loop]);

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