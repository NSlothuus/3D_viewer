import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSceneStore } from '../../../stores/sceneStore';

const TimelineContainer = styled.div`
  background-color: #2a2a2a;
  border-top: 1px solid #444444;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 120px;
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const PlaybackControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlButton = styled.button<{ $active?: boolean }>`
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
    background-color: ${props => props.$active ? '#3d8bff' : '#444444'};
    border-color: ${props => props.$active ? '#3d8bff' : '#666666'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TimeDisplay = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #cccccc;
  min-width: 80px;
  text-align: center;
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #cccccc;
`;

const SpeedSlider = styled.input`
  width: 60px;
  height: 4px;
  background: #444444;
  outline: none;
  border-radius: 2px;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: #4a9eff;
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #4a9eff;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const TimelineTrack = styled.div`
  position: relative;
  height: 40px;
  background-color: #1a1a1a;
  border: 1px solid #444444;
  border-radius: 4px;
  overflow: hidden;
`;

const TimelineBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #333333 0%, #444444 100%);
  cursor: pointer;
`;

const TimelineProgress = styled.div<{ $progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${props => props.$progress * 100}%;
  background: linear-gradient(90deg, #4a9eff 0%, #3d8bff 100%);
  transition: width 0.1s ease;
`;

const TimelineHandle = styled.div<{ $position: number }>`
  position: absolute;
  top: 50%;
  left: ${props => props.$position * 100}%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 24px;
  background-color: #ffffff;
  border: 2px solid #4a9eff;
  border-radius: 2px;
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:active {
    cursor: grabbing;
  }
`;

const AnimationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 100px;
  overflow-y: auto;
`;

const AnimationItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background-color: ${props => props.$active ? '#3a3a3a' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#4a9eff' : 'transparent'};
  border-radius: 3px;
  font-size: 12px;
  color: #cccccc;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3a3a3a;
  }
`;

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * 30); // Assuming 30fps
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
};

const Timeline: React.FC = () => {
  const {
    globalAnimationTime,
    isGlobalAnimationPlaying,
    globalAnimationSpeed,
    setGlobalAnimationTime,
    setGlobalAnimationPlaying,
    setGlobalAnimationSpeed,
    getAnimatedObjects,
  } = useSceneStore();

  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const animatedObjects = getAnimatedObjects();
  const maxDuration = Math.max(
    ...animatedObjects.flatMap(obj => 
      obj.animations?.clips.map(clip => clip.duration) || [0]
    ),
    10 // Minimum 10 seconds
  );

  // Animation loop
  useEffect(() => {
    if (isGlobalAnimationPlaying && !isDragging) {
      const animate = () => {
        const currentTime = globalAnimationTime;
        const newTime = currentTime + (1/60) * globalAnimationSpeed; // 60fps
        setGlobalAnimationTime(newTime > maxDuration ? 0 : newTime); // Loop back to start
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGlobalAnimationPlaying, isDragging, globalAnimationSpeed, maxDuration, setGlobalAnimationTime]);

  const handlePlayPause = () => {
    setGlobalAnimationPlaying(!isGlobalAnimationPlaying);
  };

  const handleStop = () => {
    setGlobalAnimationPlaying(false);
    setGlobalAnimationTime(0);
  };

  const handleTimelineClick = (event: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const progress = x / rect.width;
    const newTime = progress * maxDuration;
    
    setGlobalAnimationTime(Math.max(0, Math.min(newTime, maxDuration)));
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    handleTimelineClick(event);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      handleTimelineClick(event);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const progress = maxDuration > 0 ? globalAnimationTime / maxDuration : 0;

  if (animatedObjects.length === 0) {
    return (
      <TimelineContainer>
        <div style={{ textAlign: 'center', color: '#666666', fontSize: '14px' }}>
          No animated objects in scene
        </div>
      </TimelineContainer>
    );
  }

  return (
    <TimelineContainer>
      <TimelineHeader>
        <PlaybackControls>
          <ControlButton onClick={handlePlayPause} title={isGlobalAnimationPlaying ? 'Pause' : 'Play'}>
            {isGlobalAnimationPlaying ? '⏸️' : '▶️'}
          </ControlButton>
          <ControlButton onClick={handleStop} title="Stop">
            ⏹️
          </ControlButton>
          <TimeDisplay>
            {formatTime(globalAnimationTime)} / {formatTime(maxDuration)}
          </TimeDisplay>
        </PlaybackControls>
        
        <SpeedControl>
          <span>Speed:</span>
          <SpeedSlider
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={globalAnimationSpeed}
            onChange={(e) => setGlobalAnimationSpeed(parseFloat(e.target.value))}
          />
          <span>{globalAnimationSpeed.toFixed(1)}x</span>
        </SpeedControl>
      </TimelineHeader>

      <TimelineTrack
        ref={timelineRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <TimelineBar />
        <TimelineProgress $progress={progress} />
        <TimelineHandle $position={progress} />
      </TimelineTrack>

      <AnimationList>
        {animatedObjects.map(obj => 
          obj.animations?.clips.map(clip => (
            <AnimationItem
              key={clip.id}
              $active={obj.animations?.activeClips.includes(clip.id) || false}
            >
              <span>{obj.name} - {clip.name}</span>
              <span>{formatTime(clip.duration)}</span>
            </AnimationItem>
          ))
        )}
      </AnimationList>
    </TimelineContainer>
  );
};

export default Timeline;