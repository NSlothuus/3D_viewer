import React, { useState } from 'react';
import styled from 'styled-components';
import { useSceneStore } from '../../../stores/sceneStore';
import { SceneObject } from '../../../types/scene';

const OutlinerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #2a2a2a;
`;

const OutlinerHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #404040;
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
`;

const SearchContainer = styled.div`
  padding: 8px 16px;
  border-bottom: 1px solid #404040;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  background-color: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;

  &:focus {
    outline: none;
    border-color: #4a9eff;
  }

  &::placeholder {
    color: #888888;
  }
`;

const ObjectList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const ObjectItem = styled.div<{ $selected: boolean; $level: number }>`
  display: flex;
  align-items: center;
  padding: 4px 16px;
  padding-left: ${props => 16 + props.$level * 20}px;
  cursor: pointer;
  font-size: 12px;
  color: ${props => props.$selected ? '#4a9eff' : '#ffffff'};
  background-color: ${props => props.$selected ? '#2a4a6b' : 'transparent'};

  &:hover {
    background-color: ${props => props.$selected ? '#2a4a6b' : '#333333'};
  }
`;

const ObjectIcon = styled.span`
  margin-right: 8px;
  font-size: 14px;
`;

const ObjectName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ObjectControls = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 8px;
`;

const ControlButton = styled.button<{ $active?: boolean }>`
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  color: ${props => props.$active ? '#4a9eff' : '#888888'};
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ffffff;
  }
`;

const Outliner: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    objects, 
    selectedObjects, 
    selectObject, 
    setObjectVisibility, 
    setObjectLock,
    removeObject 
  } = useSceneStore();

  const getObjectIcon = (object: SceneObject) => {
    switch (object.type) {
      case 'mesh':
        if (object.object3D.userData.primitive) {
          const primitiveType = object.object3D.userData.primitive.type;
          switch (primitiveType) {
            case 'box': return '⬜';
            case 'sphere': return '⚪';
            case 'plane': return '▭';
            case 'cylinder': return '⬭';
            case 'torus': return '⭕';
            default: return '📦';
          }
        }
        return '🎭';
      case 'light':
        const lightType = object.object3D.userData.lightProperties?.type;
        switch (lightType) {
          case 'point': return '💡';
          case 'spot': return '🔦';
          case 'directional': return '☀️';
          default: return '💡';
        }
      case 'camera': return '📷';
      case 'group': return '📁';
      default: return '❓';
    }
  };

  const filteredObjects = Array.from(objects.values()).filter(object =>
    object.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleObjectClick = (objectId: string, event: React.MouseEvent) => {
    const isMultiSelect = event.ctrlKey || event.metaKey;
    selectObject(objectId, isMultiSelect);
  };

  const handleVisibilityToggle = (objectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const object = objects.get(objectId);
    if (object) {
      setObjectVisibility(objectId, !object.visible);
    }
  };

  const handleLockToggle = (objectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const object = objects.get(objectId);
    if (object) {
      setObjectLock(objectId, !object.locked);
    }
  };

  const handleDelete = (objectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeObject(objectId);
  };

  const renderObject = (object: SceneObject, level: number = 0) => {
    const isSelected = selectedObjects.includes(object.id);

    return (
      <div key={object.id}>
        <ObjectItem
          $selected={isSelected}
          $level={level}
          onClick={(e) => handleObjectClick(object.id, e)}
        >
          <ObjectIcon>{getObjectIcon(object)}</ObjectIcon>
          <ObjectName>{object.name}</ObjectName>
          <ObjectControls>
            <ControlButton
              $active={object.visible}
              onClick={(e) => handleVisibilityToggle(object.id, e)}
              title={object.visible ? 'Hide' : 'Show'}
            >
              {object.visible ? '👁' : '🙈'}
            </ControlButton>
            <ControlButton
              $active={object.locked}
              onClick={(e) => handleLockToggle(object.id, e)}
              title={object.locked ? 'Unlock' : 'Lock'}
            >
              {object.locked ? '🔒' : '🔓'}
            </ControlButton>
            <ControlButton
              onClick={(e) => handleDelete(object.id, e)}
              title="Delete"
            >
              🗑
            </ControlButton>
          </ObjectControls>
        </ObjectItem>
        {object.children?.map(child => renderObject(child, level + 1))}
      </div>
    );
  };

  return (
    <OutlinerContainer>
      <OutlinerHeader>Outliner</OutlinerHeader>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search objects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      <ObjectList>
        {filteredObjects.length === 0 ? (
          <ObjectItem $selected={false} $level={0}>
            <ObjectName style={{ color: '#888888', fontStyle: 'italic' }}>
              {searchTerm ? 'No objects found' : 'No objects in scene'}
            </ObjectName>
          </ObjectItem>
        ) : (
          filteredObjects.map(object => renderObject(object))
        )}
      </ObjectList>
    </OutlinerContainer>
  );
};

export default Outliner;