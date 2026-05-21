// avatar.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class AvatarManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        
        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
        this.camera.position.set(0, 1.4, 3);

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(2, 5, 5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0x8B5CF6, 0.5); // Purple accent
        fillLight.position.set(-2, 3, 2);
        this.scene.add(fillLight);

        this.clock = new THREE.Clock();
        this.mixer = null;
        this.animations = {};
        this.currentAction = null;
        this.model = null;

        this.initModel();
        
        // Window resize
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if(!this.container || !this.camera || !this.renderer) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if(width === 0 || height === 0) return;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    async initModel() {
        const loader = new GLTFLoader();
        
        try {
            const loadGLTF = (url) => new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject));

            // Load main model
            const gltf = await loadGLTF('assets/model/Ziva.glb');
            this.model = gltf.scene;
            this.model.position.set(0, 0, 0);
            
            // Adjust scale if needed
            this.model.scale.set(1.1, 1.1, 1.1);
            
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.scene.add(this.model);
            this.mixer = new THREE.AnimationMixer(this.model);

            // Load animations from external files concurrently
            const animPromises = [
                loadGLTF('assets/model/Animations.glb').catch(e => {
                    console.warn("Could not load Animations.glb", e);
                    return { animations: [] };
                }),
                loadGLTF('assets/model/Snepard.glb').catch(e => {
                    console.warn("Could not load Snepard.glb", e);
                    return { animations: [] };
                })
            ];
            
            const [anim1, anim2] = await Promise.all(animPromises);

            // Combine all animations
            const allAnimations = [
                ...(gltf.animations || []),
                ...(anim1.animations || []),
                ...(anim2.animations || [])
            ];

            if (allAnimations.length > 0) {
                allAnimations.forEach((clip, i) => {
                    let name = clip.name.toLowerCase();
                    if (name.includes('idle')) this.animations['idle'] = clip;
                    else if (name.includes('talk') || name.includes('speak')) this.animations['talking'] = clip;
                    else if (name.includes('listen') || name.includes('nod')) this.animations['listening'] = clip;
                    else if (name.includes('think')) this.animations['thinking'] = clip;
                    else {
                        if(i === 0) this.animations['idle'] = clip;
                        if(i === 1) this.animations['talking'] = clip;
                    }
                });

                // Ensure fallback mappings
                if (!this.animations['idle']) this.animations['idle'] = allAnimations[0];
                if (!this.animations['talking']) this.animations['talking'] = allAnimations[1] || allAnimations[0];
                if (!this.animations['listening']) this.animations['listening'] = this.animations['idle'];
                if (!this.animations['thinking']) this.animations['thinking'] = this.animations['idle'];

                this.playAnimation('idle');
            }

            this.animate();
        } catch (error) {
            console.error("Error loading Ziva.glb:", error);
        }
    }

    playAnimation(name) {
        if (!this.mixer) return;
        const clip = this.animations[name] || this.animations['idle'];
        if (!clip) return;

        const action = this.mixer.clipAction(clip);
        if (this.currentAction === action) return;

        if (this.currentAction) {
            this.currentAction.fadeOut(0.5);
        }

        action.reset().fadeIn(0.5).play();
        this.currentAction = action;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);
        
        // Gentle breathing rotation
        if (this.model && this.currentAction && this.currentAction.getClip().name.toLowerCase().includes('idle')) {
            this.model.rotation.y = Math.sin(Date.now() * 0.001) * 0.05;
        }

        this.renderer.render(this.scene, this.camera);
    }
}
