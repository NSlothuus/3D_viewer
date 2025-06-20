import React from 'react';
import styled from 'styled-components';
import { useSceneStore } from '../../../stores/sceneStore';
import * as THREE from 'three';

const PropertiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #2a2a2a;
`;

const PropertiesHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #404040;
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
`;

const PropertiesContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const PropertySection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: #cccccc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PropertyRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
`;

const PropertyLabel = styled.label`
  min-width: 60px;
  font-size: 12px;
  color: #aaaaaa;
`;

const PropertyInput = styled.input`
  flex: 1;
  padding: 4px 8px;
  background-color: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;

  &:focus {
    outline: none;
    border-color: #4a9eff;
  }
`;

const ColorInput = styled.input`
  width: 40px;
  height: 24px;
  padding: 0;
  border: 1px solid #404040;
  border-radius: 4px;
  background: none;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 3px;
  }
`;

const Vector3Input = styled.div`
  display: flex;
  gap: 4px;
  flex: 1;
`;

const Vector3Field = styled(PropertyInput)`
  width: 60px;
  flex: none;
`;

const NoSelectionMessage = styled.div`
  text-align: center;
  color: #888888;
  font-style: italic;
  margin-top: 40px;
`;

const Properties: React.FC = () => {
  const { selectedObjects, getSelectedObjects, updateObject } = useSceneStore();

  const selectedObjectsList = getSelectedObjects();
  const selectedObject = selectedObjectsList.length === 1 ? selectedObjectsList[0] : null;

  const updateObjectProperty = (property: string, value: any) => {
    if (!selectedObject) return;

    if (property.startsWith('position.') || property.startsWith('rotation.') || property.startsWith('scale.')) {
      const [transformType, axis] = property.split('.');
      const currentTransform = selectedObject.object3D[transformType as keyof THREE.Object3D] as THREE.Vector3 | THREE.Euler;
      
      if (currentTransform) {
        (currentTransform as any)[axis] = parseFloat(value) || 0;
        updateObject(selectedObject.id, { object3D: selectedObject.object3D });
      }
    } else if (property === 'name') {
      updateObject(selectedObject.id, { name: value });
    }
  };

  const updateLightProperty = (property: string, value: any) => {
    if (!selectedObject || selectedObject.type !== 'light') return;

    const lightProperties = selectedObject.object3D.userData.lightProperties;
    if (!lightProperties) return;

    if (property === 'intensity') {
      lightProperties.intensity = parseFloat(value) || 0;
    } else if (property === 'color') {
      lightProperties.color = new THREE.Color(value);
    } else if (property === 'angle') {
      lightProperties.angle = parseFloat(value) || 0;
    } else if (property === 'penumbra') {
      lightProperties.penumbra = parseFloat(value) || 0;
    } else if (property === 'distance') {
      lightProperties.distance = parseFloat(value) || 0;
    } else if (property === 'decay') {
      lightProperties.decay = parseFloat(value) || 0;
    }

    selectedObject.object3D.userData.lightProperties = lightProperties;
    updateObject(selectedObject.id, { object3D: selectedObject.object3D });
  };

  const renderTransformProperties = () => {
    if (!selectedObject) return null;

    const position = selectedObject.object3D.position;
    const rotation = selectedObject.object3D.rotation;
    const scale = selectedObject.object3D.scale;

    return (
      <PropertySection>
        <SectionTitle>Transform</SectionTitle>
        
        <PropertyRow>
          <PropertyLabel>Position</PropertyLabel>
          <Vector3Input>
            <Vector3Field
              type="number"
              step="0.1"
              value={position.x.toFixed(2)}
              onChange={(e) => updateObjectProperty('position.x', e.target.value)}
            />
            <Vector3Field
              type="number"
              step="0.1"
              value={position.y.toFixed(2)}
              onChange={(e) => updateObjectProperty('position.y', e.target.value)}
            />
            <Vector3Field
              type="number"
              step="0.1"
              value={position.z.toFixed(2)}
              onChange={(e) => updateObjectProperty('position.z', e.target.value)}
            />
          </Vector3Input>
        </PropertyRow>

        <PropertyRow>
          <PropertyLabel>Rotation</PropertyLabel>
          <Vector3Input>
            <Vector3Field
              type="number"
              step="0.1"
              value={(rotation.x * 180 / Math.PI).toFixed(1)}
              onChange={(e) => updateObjectProperty('rotation.x', (parseFloat(e.target.value) || 0) * Math.PI / 180)}
            />
            <Vector3Field
              type="number"
              step="0.1"
              value={(rotation.y * 180 / Math.PI).toFixed(1)}
              onChange={(e) => updateObjectProperty('rotation.y', (parseFloat(e.target.value) || 0) * Math.PI / 180)}
            />
            <Vector3Field
              type="number"
              step="0.1"
              value={(rotation.z * 180 / Math.PI).toFixed(1)}
              onChange={(e) => updateObjectProperty('rotation.z', (parseFloat(e.target.value) || 0) * Math.PI / 180)}
            />
          </Vector3Input>
        </PropertyRow>

        <PropertyRow>
          <PropertyLabel>Scale</PropertyLabel>
          <Vector3Input>
            <Vector3Field
              type="number"
              step="0.1"
              min="0.01"
              value={scale.x.toFixed(2)}
              onChange={(e) => updateObjectProperty('scale.x', e.target.value)}
            />
            <Vector3Field
              type="number"
              step="0.1"
              min="0.01"
              value={scale.y.toFixed(2)}
              onChange={(e) => updateObjectProperty('scale.y', e.target.value)}
            />
            <Vector3Field
              type="number"
              step="0.1"
              min="0.01"
              value={scale.z.toFixed(2)}
              onChange={(e) => updateObjectProperty('scale.z', e.target.value)}
            />
          </Vector3Input>
        </PropertyRow>
      </PropertySection>
    );
  };

  const renderLightProperties = () => {
    if (!selectedObject || selectedObject.type !== 'light') return null;

    const lightProperties = selectedObject.object3D.userData.lightProperties;
    if (!lightProperties) return null;

    // Ensure color is always a THREE.Color object
    if (!lightProperties.color || typeof lightProperties.color.getHexString !== 'function') {
      lightProperties.color = new THREE.Color(lightProperties.color || 0xffffff);
    }

    return (
      <PropertySection>
        <SectionTitle>Light Properties</SectionTitle>
        
        <PropertyRow>
          <PropertyLabel>Intensity</PropertyLabel>
          <PropertyInput
            type="number"
            step="0.1"
            min="0"
            value={lightProperties.intensity}
            onChange={(e) => updateLightProperty('intensity', e.target.value)}
          />
        </PropertyRow>

        <PropertyRow>
          <PropertyLabel>Color</PropertyLabel>
          <ColorInput
            type="color"
            value={`#${lightProperties.color.getHexString()}`}
            onChange={(e) => updateLightProperty('color', e.target.value)}
          />
        </PropertyRow>

        {lightProperties.type === 'spot' && (
          <>
            <PropertyRow>
              <PropertyLabel>Angle</PropertyLabel>
              <PropertyInput
                type="number"
                step="0.1"
                min="0"
                max={Math.PI}
                value={(lightProperties.angle || 0).toFixed(2)}
                onChange={(e) => updateLightProperty('angle', e.target.value)}
              />
            </PropertyRow>

            <PropertyRow>
              <PropertyLabel>Penumbra</PropertyLabel>
              <PropertyInput
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={(lightProperties.penumbra || 0).toFixed(2)}
                onChange={(e) => updateLightProperty('penumbra', e.target.value)}
              />
            </PropertyRow>
          </>
        )}

        {(lightProperties.type === 'point' || lightProperties.type === 'spot') && (
          <>
            <PropertyRow>
              <PropertyLabel>Distance</PropertyLabel>
              <PropertyInput
                type="number"
                step="0.1"
                min="0"
                value={lightProperties.distance || 0}
                onChange={(e) => updateLightProperty('distance', e.target.value)}
              />
            </PropertyRow>

            <PropertyRow>
              <PropertyLabel>Decay</PropertyLabel>
              <PropertyInput
                type="number"
                step="0.1"
                min="0"
                value={lightProperties.decay || 2}
                onChange={(e) => updateLightProperty('decay', e.target.value)}
              />
            </PropertyRow>
          </>
        )}
      </PropertySection>
    );
  };

  const renderObjectProperties = () => {
    if (!selectedObject) return null;

    return (
      <PropertySection>
        <SectionTitle>Object</SectionTitle>
        
        <PropertyRow>
          <PropertyLabel>Name</PropertyLabel>
          <PropertyInput
            type="text"
            value={selectedObject.name}
            onChange={(e) => updateObjectProperty('name', e.target.value)}
          />
        </PropertyRow>

        <PropertyRow>
          <PropertyLabel>Type</PropertyLabel>
          <PropertyInput
            type="text"
            value={selectedObject.type}
            disabled
            style={{ opacity: 0.6 }}
          />
        </PropertyRow>
      </PropertySection>
    );
  };

  if (selectedObjects.length === 0) {
    return (
      <PropertiesContainer>
        <PropertiesHeader>Properties</PropertiesHeader>
        <PropertiesContent>
          <NoSelectionMessage>
            Select an object to view its properties
          </NoSelectionMessage>
        </PropertiesContent>
      </PropertiesContainer>
    );
  }

  if (selectedObjects.length > 1) {
    return (
      <PropertiesContainer>
        <PropertiesHeader>Properties</PropertiesHeader>
        <PropertiesContent>
          <NoSelectionMessage>
            Multiple objects selected ({selectedObjects.length})
            <br />
            Multi-object editing not yet supported
          </NoSelectionMessage>
        </PropertiesContent>
      </PropertiesContainer>
    );
  }

  return (
    <PropertiesContainer>
      <PropertiesHeader>Properties</PropertiesHeader>
      <PropertiesContent>
        {renderObjectProperties()}
        {renderTransformProperties()}
        {renderLightProperties()}
      </PropertiesContent>
    </PropertiesContainer>
  );
};

export default Properties;