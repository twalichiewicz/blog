---
title: 3d Skull model
short: true
tags:
  - blog
date: 2025-04-30 23:17:10
---

{% code_sandbox label="3D Skull Model" %}
<style>
#skull-container {
  width: 100%;
  height: 400px;
  position: relative;
  margin: 0;
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
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/MTLLoader.js';

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

    // Add timestamp tracking for rotation
    this.lastTimestamp = 0;
    this.accumulatedRotation = 0;

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
    this.camera.position.set(0, 0, 4);
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

    // Studio lighting setup
    // Main key light (top-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2, 3, 4);
    this.scene.add(keyLight);

    // Fill light (left side)
    const fillLight = new THREE.DirectionalLight(0xf2e6d9, 0.7); // Warm fill
    fillLight.position.set(-4, 0, 3);
    this.scene.add(fillLight);

    // Rim light (back-right)
    const rimLight = new THREE.DirectionalLight(0xd9ebf2, 0.8); // Cool rim
    rimLight.position.set(3, 2, -3);
    this.scene.add(rimLight);

    // Top light for subtle highlights
    const topLight = new THREE.DirectionalLight(0xffffff, 0.4);
    topLight.position.set(0, 5, 0);
    this.scene.add(topLight);

    // Soft ambient light
    const ambientLight = new THREE.HemisphereLight(
      0xffffff, // Sky color
      0xe6d9cc, // Ground color
      0.4 // Intensity
    );
    this.scene.add(ambientLight);

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

            // Apply material to all meshes
            obj.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xf5f5f0, // Very subtle off-white
                  metalness: 0.0,
                  roughness: 0.85, // Slightly reduced for better light interaction
                  emissive: 0x000000,
                  emissiveIntensity: 0
                });

                // Add subtle shadows
                child.castShadow = true;
                child.receiveShadow = true;
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

    // Store the current rotation state
    if (this.skull) {
      this.rotationY = this.skull.rotation.y;
      this.rotationX = this.skull.rotation.x;
    }
  }

  onPointerUp() {
    this.isDragging = false;
    this.canvas.classList.remove('dragging');

    // Store the final rotation position to continue from here
    if (this.skull) {
      this.accumulatedRotation = this.skull.rotation.y % (2 * Math.PI);
      this.lastTimestamp = performance.now();
    }
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
        // During drag, use the stored rotation plus mouse movement
        this.skull.rotation.y = this.rotationY + this.pointerX * this.config.mouseLookFactor;
        this.skull.rotation.x = this.rotationX + this.pointerY * this.config.mouseLookFactor;
      } else {
        // When not dragging, continue rotation from last position
        const deltaTime = this.lastTimestamp ? timestamp - this.lastTimestamp : 0;
        this.accumulatedRotation += deltaTime * this.config.autoRotationSpeed;
        this.skull.rotation.y = this.accumulatedRotation;
        this.skull.rotation.x = this.rotationX || 0;
      }
      this.lastTimestamp = timestamp;
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

    window.skullAnimation = new PatchedSkullAnimation(canvas, modelPath, mtlPath, {
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

// Handle code-sandbox events
const canvas = document.getElementById('skullCanvas');
if (canvas) {
  const container = canvas.closest('.code-sandbox-content');
  if (container) {
    let animation = null;
    
    container.addEventListener('sandbox:suspend', () => {
      // Find and destroy the animation instance
      if (window.skullAnimation) {
        window.skullAnimation.destroy();
        window.skullAnimation = null;
      }
    });
    
    container.addEventListener('sandbox:resume', () => {
      // Reinitialize the animation
      init().catch(error => console.error('Resume error:', error));
    });
  }
}
</script>
{% endcode_sandbox %}
