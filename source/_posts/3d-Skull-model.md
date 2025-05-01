---
title: 3d Skull model
short: true
tags:
  - blog
date: 2025-04-30 23:17:10
---

<style>
#skull-container {
  width: 100%;
  height: 400px;
  position: relative;
  margin: 2rem 0;
  border: 1px solid #ccc;
  background: rgba(0,0,0,0.02);
  border-radius: 8px;
  overflow: hidden;
}

.skull-container {
  width: 100%;
  height: 100%;
}

#skullCanvas {
  width: 100% !important;
  height: 100% !important;
  outline: none;
}

#error-message {
  color: red;
  padding: 1rem;
  margin: 1rem;
  background: rgba(255,0,0,0.1);
  border-radius: 4px;
  display: none;
}

#loading-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top-color: #666;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<div id="error-message"></div>
<div id="skull-container">
  <div id="loading-message">
    <div class="loading-spinner"></div>
    Loading 3D model...
  </div>
</div>

<script type="module">
import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.157.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three@0.157.0/examples/jsm/loaders/MTLLoader.js';

// Error handling
const showError = (message) => {
  console.error(message);
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
  // Hide loading message
  const loadingDiv = document.getElementById('loading-message');
  if (loadingDiv) loadingDiv.style.display = 'none';
};

class PatchedSkullAnimation {
  constructor(canvas, modelPath, mtlPath, config = {}) {
    this.canvas = canvas;
    this.modelPath = modelPath;
    this.mtlPath = mtlPath;
    this.config = {
      mouseLookFactor: 0.05,
      dragRotationSpeed: 0.005,
      resetDelay: 2000,
      resetSpeed: 0.05,
      autoRotationSpeed: 0.0005,
      ...config
    };

    // Get container dimensions
    this.container = this.canvas.parentElement;
    this.containerRect = this.container.getBoundingClientRect();

    // Initialize Three.js components
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    // Set up camera with proper aspect ratio
    this.camera = new THREE.PerspectiveCamera(
      35, // Even narrower FOV for closer view
      this.containerRect.width / this.containerRect.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 4); // Moved closer from 5 to 4
    this.camera.lookAt(0, 0, 0);

    // Set up renderer with proper size and DPI handling
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.containerRect.width, this.containerRect.height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Enhanced lighting setup
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(1, 2, 3);
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-2, 0, -2);
    this.scene.add(fillLight);

    // Rim light for depth
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
    rimLight.position.set(0, 3, -2);
    this.scene.add(rimLight);

    console.log('Loading model from:', this.modelPath);

    // Load material first
    const mtlLoader = new MTLLoader();
    mtlLoader.load(this.mtlPath,
      (materials) => {
        materials.preload();
        console.log('Materials loaded:', materials);

        // Then load the model with materials
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
          this.modelPath,
          (obj) => {
            console.log('Model loaded successfully:', obj);
            this.skull = obj;

            // Enhance materials
            obj.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (!child.material) {
                  child.material = new THREE.MeshPhysicalMaterial({
                    color: 0xcccccc,
                    metalness: 0.0,
                    roughness: 0.5,
                    clearcoat: 0.1,
                    clearcoatRoughness: 0.4
                  });
                }
              }
            });

            this.scene.add(this.skull);
            this.centerModel();
            this.animate();

            // Hide loading message
            const loadingDiv = document.getElementById('loading-message');
            if (loadingDiv) loadingDiv.style.display = 'none';
          },
          (progress) => {
            const percent = (progress.loaded / progress.total * 100).toFixed(0);
            const loadingDiv = document.getElementById('loading-message');
            if (loadingDiv) {
              loadingDiv.textContent = `Loading 3D model... ${percent}%`;
            }
          },
          (error) => {
            console.error('Error loading model:', error);
            showError(`Failed to load 3D model: ${error.message}`);
          }
        );
      },
      undefined,
      (error) => {
        console.error('Error loading materials:', error);
        showError(`Failed to load materials: ${error.message}`);
      }
    );

    // Event listeners
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('resize', this.onWindowResize);

    // Initial resize
    this.onWindowResize();
  }

  centerModel() {
    if (!this.skull) return;

    const box = new THREE.Box3().setFromObject(this.skull);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center the model
    this.skull.position.x = -center.x;
    this.skull.position.y = -center.y;
    this.skull.position.z = -center.z;

    // Adjust camera to fit model
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.tan(fov / 2));

    // Reduced padding for closer view
    cameraZ *= 1.2; // Changed from 1.5 to 1.2 for closer view

    this.camera.position.z = cameraZ;
    this.camera.lookAt(0, 0, 0);

    // Update camera near/far
    this.camera.near = cameraZ / 100;
    this.camera.far = cameraZ * 100;
    this.camera.updateProjectionMatrix();

    // Initial rotation for better view
    this.skull.rotation.y = Math.PI / 8;
    this.skull.rotation.x = -Math.PI / 16;
  }

  onPointerMove(event) {
    // Convert page coordinates to container-relative coordinates
    const rect = this.container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.isDragging) {
      this.updateInteractionTime();
    }

    this.pointerX = (x / rect.width) * 2 - 1;
    this.pointerY = -((y / rect.height) * 2 - 1);

    if (this.isDragging && this.previousMouseX !== undefined) {
      const deltaX = event.clientX - this.previousMouseX;
      const deltaY = event.clientY - this.previousMouseY;

      this.rotationY = (this.rotationY || 0) + deltaX * this.config.dragRotationSpeed;
      this.rotationX = (this.rotationX || 0) + deltaY * this.config.dragRotationSpeed;
      this.rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.rotationX));
    }

    this.previousMouseX = event.clientX;
    this.previousMouseY = event.clientY;
  }

  onPointerDown(event) {
    this.isDragging = true;
    this.canvas.classList.add('dragging');
    this.previousMouseX = event.clientX;
    this.previousMouseY = event.clientY;
    this.updateInteractionTime();
  }

  onPointerUp() {
    this.isDragging = false;
    this.canvas.classList.remove('dragging');
  }

  onWindowResize() {
    const rect = this.container.getBoundingClientRect();
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(rect.width, rect.height, false);
  }

  updateInteractionTime() {
    this.lastInteractionTime = performance.now();
  }

  animate(timestamp = 0) {
    if (this.skull) {
      if (this.isDragging) {
        this.skull.rotation.y = this.rotationY + this.pointerX * this.config.mouseLookFactor;
        this.skull.rotation.x = this.rotationX + this.pointerY * this.config.mouseLookFactor;
      } else {
        this.skull.rotation.y = (this.rotationY || 0) + (timestamp * this.config.autoRotationSpeed);
        this.skull.rotation.x = this.rotationX || 0;
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame((t) => this.animate(t));
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('resize', this.onWindowResize);

    if (this.skull) {
      this.scene.remove(this.skull);
      this.skull.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    this.renderer.dispose();
  }
}

// Initialize everything
const init = async () => {
  try {
    const modelPath = '/img/skully3d.obj';
    const mtlPath = '/img/skully3d.mtl';

    // Test file accessibility
    const [modelResponse, mtlResponse] = await Promise.all([
      fetch(modelPath),
      fetch(mtlPath)
    ]);

    if (!modelResponse.ok) throw new Error(`Model not found (${modelResponse.status})`);
    if (!mtlResponse.ok) throw new Error(`Material not found (${mtlResponse.status})`);

    console.log('✓ Files accessible:', { modelPath, mtlPath });

    const container = document.getElementById('skull-container');
    if (!container) throw new Error('Container not found');

    const canvas = document.createElement('canvas');
    canvas.id = 'skullCanvas';
    container.appendChild(canvas);

    new PatchedSkullAnimation(canvas, modelPath, mtlPath, {
    mouseLookFactor: 0.05,
    autoRotationSpeed: 0.0005
    });

    console.log('✓ Initialization complete');
  } catch (error) {
    showError(`Setup failed: ${error.message}`);
    throw error;
  }
};

// Start initialization
init().catch(error => console.error('Fatal error:', error));
</script>
