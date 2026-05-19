import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class AvatarRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        
        // Adjust camera for a portrait-like view
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
        this.camera.position.set(0, 1.4, 3);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // Ensure the canvas sits properly behind the subtitles
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.zIndex = '0';
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.mixer = null;
        this.animations = {};
        this.currentAction = null;

        this.setupLights();
        this.loadModels();
        this.animate();

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(2, 5, 5);
        this.scene.add(dirLight);
        
        const fillLight = new THREE.DirectionalLight(0xaabbff, 0.5);
        fillLight.position.set(-2, 3, 2);
        this.scene.add(fillLight);
    }

    async loadModels() {
        const loader = new GLTFLoader();
        
        try {
            // Load the main Ziva avatar model
            const gltf = await loader.loadAsync('../assets/model/Ziva.glb');
            this.model = gltf.scene;
            
            // Adjust to center the model in the display
            this.model.position.set(0, -1, 0); 
            this.scene.add(this.model);

            this.mixer = new THREE.AnimationMixer(this.model);

            // Setup internal animations if any exist in Ziva.glb
            if (gltf.animations.length > 0) {
                this.setupAnimations(gltf.animations);
            }

            // Load external animations from Animations.glb
            try {
                const animGltf = await loader.loadAsync('../assets/model/Animations.glb');
                if (animGltf.animations.length > 0) {
                    this.setupAnimations(animGltf.animations);
                }
            } catch (e) {
                console.warn("Could not load Animations.glb, relying on internal animations.", e);
            }

            // Play idle by default
            this.playAnimation('idle');

        } catch (error) {
            console.error("Error loading 3D models:", error);
        }
    }

    setupAnimations(animations) {
        animations.forEach(clip => {
            const name = clip.name.toLowerCase();
            this.animations[name] = this.mixer.clipAction(clip);
            
            // Map common keywords to our required states
            if (name.includes('idle')) this.animations['idle'] = this.animations[name];
            if (name.includes('talk') || name.includes('speak') || name.includes('mouth')) {
                this.animations['talking'] = this.animations[name];
            }
        });

        // Fallback assignments if exact keywords weren't found
        if (!this.animations['idle'] && animations.length > 0) {
            this.animations['idle'] = this.mixer.clipAction(animations[0]);
        }
        if (!this.animations['talking'] && animations.length > 1) {
            this.animations['talking'] = this.mixer.clipAction(animations[1]);
        } else if (!this.animations['talking']) {
            this.animations['talking'] = this.animations['idle'];
        }
    }

    playAnimation(name) {
        if (!this.mixer) return;

        let action = this.animations[name];
        if (!action) action = this.animations['idle'];
        
        if (action && this.currentAction !== action) {
            if (this.currentAction) {
                this.currentAction.fadeOut(0.3);
            }
            action.reset().fadeIn(0.3).play();
            this.currentAction = action;
        }
    }

    setTalking(isTalking) {
        if (isTalking) {
            this.playAnimation('talking');
        } else {
            this.playAnimation('idle');
        }
    }

    onWindowResize() {
        if (!this.container) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();
        if (this.mixer) {
            this.mixer.update(delta);
        }
        this.renderer.render(this.scene, this.camera);
    }
}
