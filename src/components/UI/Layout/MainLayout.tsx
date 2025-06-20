import React, { useState } from 'react';
import styled from 'styled-components';
import Scene from '../../3D/Scene/Scene';
import Outliner from '../Panels/Outliner';
import Properties from '../Panels/Properties';
import RenderSettings from '../Panels/RenderSettings';
import Toolbar from './Toolbar';
import { useSceneStore } from '../../../stores/sceneStore';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ViewportContainer = styled.div`
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
`;

const LeftPanel = styled.div<{ isVisible: boolean; width: number }>`
  width: ${props => props.isVisible ? props.width : 0}px;
  min-width: ${props => props.isVisible ? '200px' : '0px'};
  max-width: 400px;
  background-color: #2a2a2a;
  border-right: 1px solid #404040;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const RightPanel = styled.div<{ isVisible: boolean; width: number }>`
  width: ${props => props.isVisible ? props.width : 0}px;
  min-width: ${props => props.isVisible ? '250px' : '0px'};
  max-width: 400px;
  background-color: #2a2a2a;
  border-left: 1px solid #404040;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const MainLayout: React.FC = () => {
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'render'>('properties');

  const { selectObject } = useSceneStore();

  const handleObjectClick = (objectId: string, event: any) => {
    const isMultiSelect = event.ctrlKey || event.metaKey;
    selectObject(objectId, isMultiSelect);
  };

  return (
    <LayoutContainer>
      <Toolbar
        onToggleLeftPanel={() => setLeftPanelVisible(!leftPanelVisible)}
        onToggleRightPanel={() => setRightPanelVisible(!rightPanelVisible)}
        leftPanelVisible={leftPanelVisible}
        rightPanelVisible={rightPanelVisible}
        onRightPanelTabChange={setRightPanelTab}
        rightPanelTab={rightPanelTab}
      />
      
      <MainContent>
        <LeftPanel isVisible={leftPanelVisible} width={leftPanelWidth}>
          <Outliner />
        </LeftPanel>
        
        <ViewportContainer>
          <Scene onObjectClick={handleObjectClick} />
        </ViewportContainer>
        
        <RightPanel isVisible={rightPanelVisible} width={rightPanelWidth}>
          {rightPanelTab === 'properties' ? <Properties /> : <RenderSettings />}
        </RightPanel>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;