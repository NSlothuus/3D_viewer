import React from 'react';
import { useSceneStore } from '../../../stores/sceneStore';
import { SceneObject } from '../../../types/scene';
import PointLightComponent from '../Objects/Lights/PointLight';
import SpotLightComponent from '../Objects/Lights/SpotLight';
import DirectionalLightComponent from '../Objects/Lights/DirectionalLight';

const SceneLights: React.FC = () => {
  const { objects } = useSceneStore();

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
          />
        );
      case 'spot':
        return (
          <SpotLightComponent
            key={object.id}
            object={object}
            properties={lightData}
          />
        );
      case 'directional':
        return (
          <DirectionalLightComponent
            key={object.id}
            object={object}
            properties={lightData}
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