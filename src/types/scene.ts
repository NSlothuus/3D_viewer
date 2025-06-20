import * as THREE from 'three';

export interface SceneObject {
  id: string;
  name: string;
  type: 'mesh' | 'light' | 'camera' | 'group';
  object3D: THREE.Object3D;
  visible: boolean;
  locked: boolean;
  children?: SceneObject[];
  parent?: string;
}

export interface Transform {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

export interface LightProperties {
  type: 'point' | 'spot' | 'directional' | 'area' | 'ambient';
  intensity: number;
  color: THREE.Color;
  castShadow: boolean;
  // Spot light specific
  angle?: number;
  penumbra?: number;
  // Point/Spot light specific
  distance?: number;
  decay?: number;
}

export interface MaterialProperties {
  type: 'standard' | 'basic' | 'phong' | 'toon' | 'custom';
  color: THREE.Color;
  metalness?: number;
  roughness?: number;
  opacity: number;
  transparent: boolean;
  emissive?: THREE.Color;
  emissiveIntensity?: number;
  // Texture maps
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  roughnessMap?: THREE.Texture;
  metalnessMap?: THREE.Texture;
  emissiveMap?: THREE.Texture;
}

export interface BoxGeometry {
  type: 'box';
  width: number;
  height: number;
  depth: number;
  widthSegments: number;
  heightSegments: number;
  depthSegments: number;
}

export interface SphereGeometry {
  type: 'sphere';
  radius: number;
  widthSegments: number;
  heightSegments: number;
}

export interface PlaneGeometry {
  type: 'plane';
  width: number;
  height: number;
  widthSegments: number;
  heightSegments: number;
}

export interface CylinderGeometry {
  type: 'cylinder';
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments: number;
  heightSegments: number;
}

export interface TorusGeometry {
  type: 'torus';
  radius: number;
  tube: number;
  radialSegments: number;
  tubularSegments: number;
}

export type PrimitiveGeometry = BoxGeometry | SphereGeometry | PlaneGeometry | CylinderGeometry | TorusGeometry;

export interface CameraSettings {
  type: 'perspective' | 'orthographic';
  fov: number;
  near: number;
  far: number;
  position: THREE.Vector3;
  target: THREE.Vector3;
}

export interface RenderSettings {
  antialias: boolean;
  shadows: boolean;
  shadowType: THREE.ShadowMapType;
  toneMapping: THREE.ToneMapping;
  toneMappingExposure: number;
  outputColorSpace: THREE.ColorSpace;
  // Post-processing
  bloom: boolean;
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
}

export interface ViewMode {
  type: 'shaded' | 'wireframe' | 'solid' | 'material' | 'lighting';
  name: string;
}

export interface SceneState {
  objects: Map<string, SceneObject>;
  selectedObjects: string[];
  camera: CameraSettings;
  renderSettings: RenderSettings;
  viewMode: ViewMode;
  environment?: {
    type: 'hdri' | 'color' | 'gradient';
    hdriUrl?: string;
    hdriFormat?: string;
    color?: THREE.Color;
    intensity: number;
  };
}