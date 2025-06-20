import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three-stdlib';
import { EXRLoader } from 'three-stdlib';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface CustomEnvironmentProps {
  hdriUrl: string;
  hdriFormat?: string;
  background?: boolean;
  intensity?: number;
}

const CustomEnvironment: React.FC<CustomEnvironmentProps> = ({
  hdriUrl,
  hdriFormat,
  background = true,
  intensity = 1.0,
}) => {
  const texture = useMemo(() => {
    if (!hdriUrl) return null;

    // Determine the loader based on format or file extension
    const format = hdriFormat?.toLowerCase();
    
    try {
      if (format === 'hdr') {
        const loader = new RGBELoader();
        return loader.loadAsync(hdriUrl);
      } else if (format === 'exr') {
        const loader = new EXRLoader();
        return loader.loadAsync(hdriUrl);
      } else if (format === 'jpg' || format === 'jpeg' || format === 'png') {
        const loader = new TextureLoader();
        const tex = loader.loadAsync(hdriUrl);
        return tex.then(texture => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          return texture;
        });
      } else {
        // Try RGBE loader as default for unknown formats
        const loader = new RGBELoader();
        return loader.loadAsync(hdriUrl);
      }
    } catch (error) {
      console.error('Error loading environment texture:', error);
      return null;
    }
  }, [hdriUrl, hdriFormat]);

  React.useEffect(() => {
    if (!texture) return;

    texture.then(loadedTexture => {
      if (loadedTexture) {
        loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
        
        // Apply to scene
        if (background) {
          // This will be handled by the parent Scene component
        }
      }
    }).catch(error => {
      console.error('Failed to load environment texture:', error);
    });
  }, [texture, background]);

  return null; // This component doesn't render anything directly
};

export default CustomEnvironment;