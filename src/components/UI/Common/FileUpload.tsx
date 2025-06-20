import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useSceneStore } from '../../../stores/sceneStore';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';

const DropZone = styled.div<{ isDragOver: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.isDragOver ? 'rgba(74, 158, 255, 0.2)' : 'transparent'};
  border: ${props => props.isDragOver ? '2px dashed #4a9eff' : 'none'};
  display: ${props => props.isDragOver ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: ${props => props.isDragOver ? 'all' : 'none'};
`;

const DropMessage = styled.div`
  background-color: rgba(42, 42, 42, 0.95);
  padding: 32px;
  border-radius: 8px;
  text-align: center;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
`;

const FileInput = styled.input`
  display: none;
`;

const ImportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: 1px solid #555555;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #444444;
    border-color: #666666;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const LoadingMessage = styled.div`
  background-color: #2a2a2a;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  color: #ffffff;
`;

interface FileUploadProps {
  children: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({ children }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addObject, generateId } = useSceneStore();

  const supportedFormats = ['.glb', '.gltf', '.fbx'];

  const loadGLTF = async (file: File): Promise<THREE.Object3D> => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      const url = URL.createObjectURL(file);
      
      loader.load(
        url,
        (gltf) => {
          URL.revokeObjectURL(url);
          resolve(gltf.scene);
        },
        (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setLoadingMessage(`Loading GLTF: ${percent}%`);
        },
        (error) => {
          URL.revokeObjectURL(url);
          reject(error);
        }
      );
    });
  };

  const loadFBX = async (file: File): Promise<THREE.Object3D> => {
    return new Promise((resolve, reject) => {
      const loader = new FBXLoader();
      const url = URL.createObjectURL(file);
      
      loader.load(
        url,
        (fbx) => {
          URL.revokeObjectURL(url);
          resolve(fbx);
        },
        (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setLoadingMessage(`Loading FBX: ${percent}%`);
        },
        (error) => {
          URL.revokeObjectURL(url);
          reject(error);
        }
      );
    });
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setLoadingMessage('Processing file...');

    try {
      const extension = file.name.toLowerCase().split('.').pop();
      let object3D: THREE.Object3D;

      switch (extension) {
        case 'glb':
        case 'gltf':
          object3D = await loadGLTF(file);
          break;
        case 'fbx':
          object3D = await loadFBX(file);
          break;
        default:
          throw new Error(`Unsupported file format: ${extension}`);
      }

      // Create scene object
      const id = generateId();
      const sceneObject = {
        id,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: 'mesh' as const,
        object3D,
        visible: true,
        locked: false,
      };

      // Center the object
      const box = new THREE.Box3().setFromObject(object3D);
      const center = box.getCenter(new THREE.Vector3());
      object3D.position.sub(center);

      addObject(sceneObject);
      
    } catch (error) {
      console.error('Error loading file:', error);
      alert(`Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.toLowerCase().split('.').pop();
      return supportedFormats.includes(extension);
    });

    if (validFiles.length === 0) {
      alert(`Please drop a valid 3D file. Supported formats: ${supportedFormats.join(', ')}`);
      return;
    }

    // Process first valid file
    processFile(validFiles[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      
      <DropZone isDragOver={isDragOver}>
        <DropMessage>
          Drop 3D files here
          <br />
          <small>Supported: GLB, GLTF, FBX</small>
        </DropMessage>
      </DropZone>

      {isLoading && (
        <LoadingOverlay>
          <LoadingMessage>
            {loadingMessage}
            <br />
            <small>Please wait...</small>
          </LoadingMessage>
        </LoadingOverlay>
      )}

      <FileInput
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf,.fbx"
        onChange={handleFileSelect}
      />

      {/* Import button - can be positioned anywhere */}
      <ImportButton
        onClick={openFileDialog}
        title="Import 3D File"
        style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 100 }}
      >
        📁
      </ImportButton>
    </div>
  );
};

export default FileUpload;