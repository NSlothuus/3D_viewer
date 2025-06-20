import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { useSceneStore } from '../../../stores/sceneStore';
import { SceneObject } from '../../../types/scene';
import PointLightComponent from '../Objects/Lights/PointLight';
import SpotLightComponent from '../Objects/Lights/SpotLight';
import DirectionalLightComponent from '../Objects/Lights/DirectionalLight';

interface SceneLightsProps {
  onObjectClick?: (objectId: string, event: ThreeEvent<MouseEvent>) => void;
}

const SceneLights: React.FC<SceneLightsProps> = ({ onObjectClick }) => {
  const { objects } = useSceneStore();

  const handleLightClick = (objectId: string, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onObjectClick?.(objectId, event);
  };

  const renderLight = (object: SceneObject) => {
    if (!object.visible || object.type !== 'light') return null;

    const lightData = object.object3D.userData.lightProperties;
    if (!lightData) return null;

    switch (lightData.type) {
      case 'point':
        return (
          <PointLightComponent
            key={object.id}
            object={object}
            properties={lightData}
            onClick={(event) => handleLightClick(object.id, event)}
          />
        );
      case 'spot':
        return (
          <SpotLightComponent
            key={object.id}
            object={object}
            properties={lightData}
            onClick={(event) => handleLightClick(object.id, event)}
          />
        );
      case 'directional':
        return (
          <DirectionalLightComponent
            key={object.id}
            object={object}
            properties={lightData}
            onClick={(event) => handleLightClick(object.id, event)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from(objects.values())
        .filter(obj => obj.type === 'light')
        .map(object => renderLight(object))}
    </>
  );
};

export default SceneLights;