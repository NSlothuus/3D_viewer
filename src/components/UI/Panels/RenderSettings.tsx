import React from 'react';
import styled from 'styled-components';
import { useSceneStore } from '../../../stores/sceneStore';
import * as THREE from 'three';

const RenderSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #2a2a2a;
`;

const RenderSettingsHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #404040;
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
`;

const RenderSettingsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const SettingSection = styled.div`
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

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 8px;
`;

const SettingLabel = styled.label`
  font-size: 12px;
  color: #aaaaaa;
  flex: 1;
`;

const ToggleSwitch = styled.input`
  width: 40px;
  height: 20px;
  appearance: none;
  background-color: #444444;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;

  &:checked {
    background-color: #4a9eff;
  }

  &::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #ffffff;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
  }

  &:checked::before {
    transform: translateX(20px);
  }
`;

const Dropdown = styled.select`
  background-color: #444444;
  border: 1px solid #555555;
  border-radius: 4px;
  color: #ffffff;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  min-width: 120px;

  &:hover {
    background-color: #555555;
  }

  option {
    background-color: #444444;
    color: #ffffff;
  }
`;

const Slider = styled.input`
  flex: 1;
  max-width: 100px;
  height: 4px;
  background: #444444;
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #4a9eff;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #4a9eff;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const SliderValue = styled.span`
  font-size: 11px;
  color: #888888;
  min-width: 40px;
  text-align: right;
`;

const RenderSettings: React.FC = () => {
  const { renderSettings, updateRenderSettings, viewMode, setViewMode } = useSceneStore();

  const handleToggle = (setting: keyof typeof renderSettings) => {
    updateRenderSettings({
      [setting]: !renderSettings[setting]
    });
  };

  const handleSliderChange = (setting: keyof typeof renderSettings, value: number) => {
    updateRenderSettings({
      [setting]: value
    });
  };

  const handleDropdownChange = (setting: keyof typeof renderSettings, value: any) => {
    updateRenderSettings({
      [setting]: value
    });
  };

  const handleViewModeChange = (mode: 'shaded' | 'wireframe' | 'solid') => {
    setViewMode({
      type: mode,
      name: mode.charAt(0).toUpperCase() + mode.slice(1),
    });
  };

  return (
    <RenderSettingsContainer>
      <RenderSettingsHeader>Render Settings</RenderSettingsHeader>
      
      <RenderSettingsContent>
        {/* View Mode */}
        <SettingSection>
          <SectionTitle>View Mode</SectionTitle>
          
          <SettingRow>
            <SettingLabel>Rendering Mode</SettingLabel>
            <Dropdown 
              value={viewMode.type} 
              onChange={(e) => handleViewModeChange(e.target.value as any)}
            >
              <option value="shaded">Shaded</option>
              <option value="wireframe">Wireframe</option>
              <option value="solid">Solid</option>
            </Dropdown>
          </SettingRow>
        </SettingSection>

        {/* Quality Settings */}
        <SettingSection>
          <SectionTitle>Quality</SectionTitle>
          
          <SettingRow>
            <SettingLabel>Anti-aliasing</SettingLabel>
            <ToggleSwitch
              type="checkbox"
              checked={renderSettings.antialias}
              onChange={() => handleToggle('antialias')}
            />
          </SettingRow>

          <SettingRow>
            <SettingLabel>Shadows</SettingLabel>
            <ToggleSwitch
              type="checkbox"
              checked={renderSettings.shadows}
              onChange={() => handleToggle('shadows')}
            />
          </SettingRow>

          <SettingRow>
            <SettingLabel>Shadow Type</SettingLabel>
            <Dropdown 
              value={renderSettings.shadowType}
              onChange={(e) => handleDropdownChange('shadowType', parseInt(e.target.value))}
            >
              <option value={THREE.BasicShadowMap}>Basic</option>
              <option value={THREE.PCFShadowMap}>PCF</option>
              <option value={THREE.PCFSoftShadowMap}>PCF Soft</option>
              <option value={THREE.VSMShadowMap}>VSM</option>
            </Dropdown>
          </SettingRow>
        </SettingSection>

        {/* Tone Mapping */}
        <SettingSection>
          <SectionTitle>Tone Mapping</SectionTitle>
          
          <SettingRow>
            <SettingLabel>Tone Mapping</SettingLabel>
            <Dropdown 
              value={renderSettings.toneMapping}
              onChange={(e) => handleDropdownChange('toneMapping', parseInt(e.target.value))}
            >
              <option value={THREE.NoToneMapping}>None</option>
              <option value={THREE.LinearToneMapping}>Linear</option>
              <option value={THREE.ReinhardToneMapping}>Reinhard</option>
              <option value={THREE.CineonToneMapping}>Cineon</option>
              <option value={THREE.ACESFilmicToneMapping}>ACES Filmic</option>
            </Dropdown>
          </SettingRow>

          <SettingRow>
            <SettingLabel>Exposure</SettingLabel>
            <Slider
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={renderSettings.toneMappingExposure}
              onChange={(e) => handleSliderChange('toneMappingExposure', parseFloat(e.target.value))}
            />
            <SliderValue>{renderSettings.toneMappingExposure.toFixed(1)}</SliderValue>
          </SettingRow>
        </SettingSection>

        {/* Post Processing */}
        <SettingSection>
          <SectionTitle>Post Processing</SectionTitle>
          
          <SettingRow>
            <SettingLabel>Bloom</SettingLabel>
            <ToggleSwitch
              type="checkbox"
              checked={renderSettings.bloom}
              onChange={() => handleToggle('bloom')}
            />
          </SettingRow>

          {renderSettings.bloom && (
            <>
              <SettingRow>
                <SettingLabel>Bloom Strength</SettingLabel>
                <Slider
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.1"
                  value={renderSettings.bloomStrength}
                  onChange={(e) => handleSliderChange('bloomStrength', parseFloat(e.target.value))}
                />
                <SliderValue>{renderSettings.bloomStrength.toFixed(1)}</SliderValue>
              </SettingRow>

              <SettingRow>
                <SettingLabel>Bloom Radius</SettingLabel>
                <Slider
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={renderSettings.bloomRadius}
                  onChange={(e) => handleSliderChange('bloomRadius', parseFloat(e.target.value))}
                />
                <SliderValue>{renderSettings.bloomRadius.toFixed(2)}</SliderValue>
              </SettingRow>

              <SettingRow>
                <SettingLabel>Bloom Threshold</SettingLabel>
                <Slider
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.05"
                  value={renderSettings.bloomThreshold}
                  onChange={(e) => handleSliderChange('bloomThreshold', parseFloat(e.target.value))}
                />
                <SliderValue>{renderSettings.bloomThreshold.toFixed(2)}</SliderValue>
              </SettingRow>
            </>
          )}
        </SettingSection>
      </RenderSettingsContent>
    </RenderSettingsContainer>
  );
};

export default RenderSettings;