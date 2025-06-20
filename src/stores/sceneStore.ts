import { create } from 'zustand';
import * as THREE from 'three';
import { SceneState, SceneObject, RenderSettings, ViewMode, CameraSettings } from '../types/scene';

interface SceneStore extends SceneState {
  // Mesh registry for transform controls
  meshRegistry: Map<string, THREE.Object3D>;
  // Transform state
  transformMode: 'translate' | 'rotate' | 'scale';
  transformEnabled: boolean;
  // Actions
  addObject: (object: SceneObject) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  selectObject: (id: string, multiSelect?: boolean) => void;
  deselectObject: (id: string) => void;
  clearSelection: () => void;
  setObjectVisibility: (id: string, visible: boolean) => void;
  setObjectLock: (id: string, locked: boolean) => void;
  updateRenderSettings: (settings: Partial<RenderSettings>) => void;
  setViewMode: (mode: ViewMode) => void;
  updateCamera: (settings: Partial<CameraSettings>) => void;
  setEnvironment: (environment: SceneState['environment']) => void;
  // Transform methods
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  setTransformEnabled: (enabled: boolean) => void;
  // Mesh registry methods
  registerMesh: (objectId: string, mesh: THREE.Object3D) => void;
  unregisterMesh: (objectId: string) => void;
  getMesh: (objectId: string) => THREE.Object3D | undefined;
  // Utility
  getObject: (id: string) => SceneObject | undefined;
  getSelectedObjects: () => SceneObject[];
  generateId: () => string;
}

const defaultRenderSettings: RenderSettings = {
  antialias: true,
  shadows: true,
  shadowType: THREE.PCFSoftShadowMap,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.0,
  outputColorSpace: THREE.SRGBColorSpace,
  bloom: false,
  bloomStrength: 1.5,
  bloomRadius: 0.4,
  bloomThreshold: 0.85,
};

const defaultCamera: CameraSettings = {
  type: 'perspective',
  fov: 75,
  near: 0.1,
  far: 1000,
  position: new THREE.Vector3(5, 5, 5),
  target: new THREE.Vector3(0, 0, 0),
};

const defaultViewMode: ViewMode = {
  type: 'shaded',
  name: 'Shaded',
};

export const useSceneStore = create<SceneStore>((set, get) => ({
  // Initial state
  objects: new Map(),
  selectedObjects: [],
  camera: defaultCamera,
  renderSettings: defaultRenderSettings,
  viewMode: defaultViewMode,
  environment: {
    type: 'color',
    color: new THREE.Color(0x222222),
    intensity: 1.0,
  },
  meshRegistry: new Map(),
  transformMode: 'translate',
  transformEnabled: true,

  // Actions
  addObject: (object: SceneObject) => {
    set((state) => {
      const newObjects = new Map(state.objects);
      newObjects.set(object.id, object);
      return { objects: newObjects };
    });
  },

  removeObject: (id: string) => {
    set((state) => {
      const newObjects = new Map(state.objects);
      const object = newObjects.get(id);
      
      if (object) {
        // Remove from parent's children if it has a parent
        if (object.parent) {
          const parent = newObjects.get(object.parent);
          if (parent && parent.children) {
            parent.children = parent.children.filter(child => child.id !== id);
          }
        }
        
        // Remove all children recursively
        const removeChildren = (obj: SceneObject) => {
          if (obj.children) {
            obj.children.forEach(child => {
              removeChildren(child);
              newObjects.delete(child.id);
            });
          }
        };
        removeChildren(object);
        
        newObjects.delete(id);
      }
      
      return {
        objects: newObjects,
        selectedObjects: state.selectedObjects.filter(selectedId => selectedId !== id),
      };
    });
  },

  updateObject: (id: string, updates: Partial<SceneObject>) => {
    set((state) => {
      const newObjects = new Map(state.objects);
      const object = newObjects.get(id);
      
      if (object) {
        newObjects.set(id, { ...object, ...updates });
      }
      
      return { objects: newObjects };
    });
  },

  selectObject: (id: string, multiSelect = false) => {
    set((state) => {
      if (multiSelect) {
        const isSelected = state.selectedObjects.includes(id);
        return {
          selectedObjects: isSelected
            ? state.selectedObjects.filter(selectedId => selectedId !== id)
            : [...state.selectedObjects, id],
        };
      } else {
        return { selectedObjects: [id] };
      }
    });
  },

  deselectObject: (id: string) => {
    set((state) => ({
      selectedObjects: state.selectedObjects.filter(selectedId => selectedId !== id),
    }));
  },

  clearSelection: () => {
    set({ selectedObjects: [] });
  },

  setObjectVisibility: (id: string, visible: boolean) => {
    get().updateObject(id, { visible });
  },

  setObjectLock: (id: string, locked: boolean) => {
    get().updateObject(id, { locked });
  },

  updateRenderSettings: (settings: Partial<RenderSettings>) => {
    set((state) => ({
      renderSettings: { ...state.renderSettings, ...settings },
    }));
  },

  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode });
  },

  updateCamera: (settings: Partial<CameraSettings>) => {
    set((state) => ({
      camera: { ...state.camera, ...settings },
    }));
  },

  setEnvironment: (environment: SceneState['environment']) => {
    set({ environment });
  },

  // Transform methods
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => {
    set({ transformMode: mode });
  },

  setTransformEnabled: (enabled: boolean) => {
    set({ transformEnabled: enabled });
  },

  // Mesh registry methods
  registerMesh: (objectId: string, mesh: THREE.Object3D) => {
    set((state) => {
      const newMeshRegistry = new Map(state.meshRegistry);
      newMeshRegistry.set(objectId, mesh);
      return { meshRegistry: newMeshRegistry };
    });
  },

  unregisterMesh: (objectId: string) => {
    set((state) => {
      const newMeshRegistry = new Map(state.meshRegistry);
      newMeshRegistry.delete(objectId);
      return { meshRegistry: newMeshRegistry };
    });
  },

  getMesh: (objectId: string) => {
    return get().meshRegistry.get(objectId);
  },

  // Utility functions
  getObject: (id: string) => {
    return get().objects.get(id);
  },

  getSelectedObjects: () => {
    const { objects, selectedObjects } = get();
    return selectedObjects.map(id => objects.get(id)).filter(Boolean) as SceneObject[];
  },

  generateId: () => {
    return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
}));