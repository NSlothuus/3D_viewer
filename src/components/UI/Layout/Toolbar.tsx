import React from 'react';
import styled from 'styled-components';
import { useSceneStore } from '../../../stores/sceneStore';
import * as THREE from 'three';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  background-color: #333333;
  border-bottom: 1px solid #404040;
  padding: 0 16px;
  gap: 8px;
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:not(:last-child) {
    border-right: 1px solid #404040;
    padding-right: 16px;
    margin-right: 8px;
  }
`;

const ToolbarButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${props => props.$active ? '#4a9eff' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#4a9eff' : '#555555'};
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$active ? '#3a8eef' : '#444444'};
    border-color: ${props => props.$active ? '#3a8eef' : '#666666'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DropdownButton = styled.select`
  background-color: #444444;
  border: 1px solid #555555;
  border-radius: 4px;
  color: #ffffff;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #555555;
  }

  option {
    background-color: #444444;
    color: #ffffff;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

interface ToolbarProps {
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
  leftPanelVisible: boolean;
  rightPanelVisible: boolean;
  onRightPanelTabChange: (tab: 'properties' | 'render') => void;
  rightPanelTab: 'properties' | 'render';
}

const Toolbar: React.FC<ToolbarProps> = ({
  onToggleLeftPanel,
  onToggleRightPanel,
  leftPanelVisible,
  rightPanelVisible,
  onRightPanelTabChange,
  rightPanelTab,
}) => {
  const { addObject, generateId, viewMode, setViewMode, setEnvironment, transformMode, setTransformMode } = useSceneStore();

  const createPrimitive = (type: 'box' | 'sphere' | 'plane' | 'cylinder' | 'torus') => {
    const id = generateId();
    const object3D = new THREE.Object3D();
    object3D.position.set(0, 0, 0);
    
    // Set primitive data
    const primitiveData = {
      type,
      width: 1,
      height: 1,
      depth: 1,
      radius: 0.5,
      tube: 0.2,
      radiusTop: 0.5,
      radiusBottom: 0.5,
      widthSegments: 32,
      heightSegments: 16,
      depthSegments: 1,
      radialSegments: 32,
      tubularSegments: 100,
    };
    
    object3D.userData = { primitive: primitiveData };

    const sceneObject = {
      id,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${id.slice(-4)}`,
      type: 'mesh' as const,
      object3D,
      visible: true,
      locked: false,
    };

    addObject(sceneObject);
  };

  const createLight = (type: 'point' | 'spot' | 'directional') => {
    const id = generateId();
    const object3D = new THREE.Object3D();
    object3D.position.set(2, 2, 2);
    
    const lightProperties = {
      type,
      intensity: 1,
      color: new THREE.Color(0xffffff),
      castShadow: true,
      angle: Math.PI / 6,
      penumbra: 0.1,
      distance: 0,
      decay: 2,
    };
    
    object3D.userData = { lightProperties };

    const sceneObject = {
      id,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Light ${id.slice(-4)}`,
      type: 'light' as const,
      object3D,
      visible: true,
      locked: false,
    };

    addObject(sceneObject);
  };

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = event.target.value as 'shaded' | 'wireframe' | 'solid';
    setViewMode({
      type: mode,
      name: mode.charAt(0).toUpperCase() + mode.slice(1),
    });
  };

  const handleHDRIUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Create a blob URL for the file
        const url = URL.createObjectURL(file);
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        // For now, let's try without specifying format and let drei auto-detect
        setEnvironment({
          type: 'hdri',
          hdriUrl: url,
          hdriFormat: fileExtension,
          intensity: 1.0,
        });
      } catch (error) {
        console.error('Error loading HDRI file:', error);
        alert('Error loading HDRI file. Please try a different file.');
      }
    }
  };

  const clearEnvironment = () => {
    setEnvironment({
      type: 'color',
      color: new THREE.Color(0x222222),
      intensity: 1.0,
    });
  };

  const hdriInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <ToolbarContainer>
      <HiddenFileInput
        ref={hdriInputRef}
        type="file"
        accept=".hdr,.exr,.jpg,.jpeg,.png"
        onChange={handleHDRIUpload}
      />
      {/* Panel toggles */}
      <ToolbarSection>
        <ToolbarButton
          $active={leftPanelVisible}
          onClick={onToggleLeftPanel}
          title="Toggle Outliner"
        >
          ☰
        </ToolbarButton>
        <ToolbarButton
          $active={rightPanelVisible && rightPanelTab === 'properties'}
          onClick={() => {
            if (rightPanelTab === 'properties') {
              onToggleRightPanel();
            } else {
              onRightPanelTabChange('properties');
              if (!rightPanelVisible) onToggleRightPanel();
            }
          }}
          title="Toggle Properties"
        >
          ⚙
        </ToolbarButton>
        <ToolbarButton
          $active={rightPanelVisible && rightPanelTab === 'render'}
          onClick={() => {
            if (rightPanelTab === 'render') {
              onToggleRightPanel();
            } else {
              onRightPanelTabChange('render');
              if (!rightPanelVisible) onToggleRightPanel();
            }
          }}
          title="Render Settings"
        >
          🎨
        </ToolbarButton>
      </ToolbarSection>

      {/* Primitives */}
      <ToolbarSection>
        <ToolbarButton onClick={() => createPrimitive('box')} title="Add Cube">
          ⬜
        </ToolbarButton>
        <ToolbarButton onClick={() => createPrimitive('sphere')} title="Add Sphere">
          ⚪
        </ToolbarButton>
        <ToolbarButton onClick={() => createPrimitive('plane')} title="Add Plane">
          ▭
        </ToolbarButton>
        <ToolbarButton onClick={() => createPrimitive('cylinder')} title="Add Cylinder">
          ⬭
        </ToolbarButton>
        <ToolbarButton onClick={() => createPrimitive('torus')} title="Add Torus">
          ⭕
        </ToolbarButton>
      </ToolbarSection>

      {/* Lights */}
      <ToolbarSection>
        <ToolbarButton onClick={() => createLight('point')} title="Add Point Light">
          💡
        </ToolbarButton>
        <ToolbarButton onClick={() => createLight('spot')} title="Add Spot Light">
          🔦
        </ToolbarButton>
        <ToolbarButton onClick={() => createLight('directional')} title="Add Directional Light">
          ☀️
        </ToolbarButton>
      </ToolbarSection>

      {/* Transform Tools */}
      <ToolbarSection>
        <ToolbarButton
          $active={transformMode === 'translate'}
          onClick={() => setTransformMode('translate')}
          title="Move (G)"
        >
          🔄
        </ToolbarButton>
        <ToolbarButton
          $active={transformMode === 'rotate'}
          onClick={() => setTransformMode('rotate')}
          title="Rotate (R)"
        >
          🔃
        </ToolbarButton>
        <ToolbarButton
          $active={transformMode === 'scale'}
          onClick={() => setTransformMode('scale')}
          title="Scale (S)"
        >
          📏
        </ToolbarButton>
      </ToolbarSection>

      {/* Environment */}
      <ToolbarSection>
        <ToolbarButton
          onClick={() => hdriInputRef.current?.click()}
          title="Load HDRI Environment"
        >
          🌍
        </ToolbarButton>
        <ToolbarButton
          onClick={clearEnvironment}
          title="Clear Environment"
        >
          🗑️
        </ToolbarButton>
      </ToolbarSection>

      {/* View Mode */}
      <ToolbarSection>
        <DropdownButton value={viewMode.type} onChange={handleViewModeChange}>
          <option value="shaded">Shaded</option>
          <option value="wireframe">Wireframe</option>
          <option value="solid">Solid</option>
        </DropdownButton>
      </ToolbarSection>
    </ToolbarContainer>
  );
};

export default Toolbar;