// src/three/scene.js

import * as THREE from 'three';

let animationId;

// Initialize the scene, camera, renderer, and objects
export function initScene(canvas) {
    // Create scene - use a darker background to ensure contrast
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    
    // Create camera - position it better to see all objects
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);
    
    // Create renderer with explicit pixel ratio and size
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false // Disable alpha to ensure visibility
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add stronger lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Increased intensity
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased intensity
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add a second directional light from another angle
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);
    
    // Add a colorful rotating cube - make it larger
    const cubeGeometry = new THREE.BoxGeometry(8, 8, 8);
    const cubeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        metalness: 0.3,
        roughness: 0.4,
        emissive: 0x222222 // Add some self-illumination
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, 0); // Center it
    scene.add(cube);
    
    // Add a sphere
    const sphereGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00,
        metalness: 0.5,
        roughness: 0.2,
        emissive: 0x112211 // Add some self-illumination
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-10, 0, 0); // Position to the left
    scene.add(sphere);
    
    // Add a torus knot
    const torusGeometry = new THREE.TorusKnotGeometry(3, 1, 100, 16);
    const torusMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0000ff,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x111122 // Add some self-illumination
    });
    const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
    torusKnot.position.set(10, 0, 0); // Position to the right
    scene.add(torusKnot);
    
    // Add axes helper for debugging
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
    
    // Create particle system (for background) - but with fewer particles
    const particleCount = 500;
    const particles = createParticles(scene, particleCount);
    
    // Log that scene was created
    console.log("Three.js scene created with:", {
        objects: scene.children.length,
        camera: camera.position,
        renderer: renderer.info.render
    });
    
    return { scene, camera, renderer, particles, cube, sphere, torusKnot };
}

// Create particles for background effect
function createParticles(scene, count) {
    const particles = [];
    
    // Create geometry and material
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    // Define color palette
    const colorPalette = [
        new THREE.Color(0x3498db), // Blue
        new THREE.Color(0x2ecc71), // Green
        new THREE.Color(0x9b59b6), // Purple
        new THREE.Color(0xe74c3c), // Red
        new THREE.Color(0xf39c12)  // Orange
    ];
    
    // Generate random positions and colors
    for (let i = 0; i < count; i++) {
        // Position
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        
        vertices.push(x, y, z);
        
        // Color
        const colorIndex = Math.floor(Math.random() * colorPalette.length);
        const color = colorPalette[colorIndex];
        colors.push(color.r, color.g, color.b);
        
        // Store particle data for animation
        particles.push({
            position: new THREE.Vector3(x, y, z),
            originalPosition: new THREE.Vector3(x, y, z),
            speed: Math.random() * 0.02 + 0.01
        });
    }
    
    // Set attributes
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Make particles more visible
    const material = new THREE.PointsMaterial({
        size: 0.5, // Increased size
        transparent: true,
        opacity: 1.0, // Full opacity
        vertexColors: true,
        sizeAttenuation: true
    });
    
    // Create the points
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    
    return { points, data: particles, geometry };
}

// Update the scene based on scroll position and mouse movement
export function updateScene(scene, camera, particles, params) {
    const { scroll, mouseX, mouseY } = params;
    
    // Reduce camera movement to keep objects in view
    camera.position.y = -scroll * 5; // Reduced movement
    camera.rotation.x = scroll * 0.2; // Reduced rotation
    
    // Gently look at where the mouse is pointing - with reduced effect
    const targetX = mouseX * 1;
    const targetY = mouseY * 1;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    
    // Always look at the center of the scene
    camera.lookAt(0, 0, 0);
    
    // Update particles
    if (particles && particles.points) {
        const positions = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < particles.data.length; i++) {
            const particle = particles.data[i];
            const i3 = i * 3;
            
            // Movement based on scroll and mouse
            const amplitude = 2 * (1 - scroll); // Particles move more at the top
            const noiseX = Math.sin(Date.now() * 0.001 * particle.speed + i) * amplitude;
            const noiseY = Math.cos(Date.now() * 0.0015 * particle.speed + i) * amplitude;
            const noiseZ = Math.sin(Date.now() * 0.001 * particle.speed + i) * amplitude;
            
            // Apply mouse influence
            const mouseInfluence = 5;
            const distX = particle.originalPosition.x - mouseX * mouseInfluence;
            const distY = particle.originalPosition.y - mouseY * mouseInfluence;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const repelForce = Math.max(0, 3 - distance);
            
            // Update positions
            positions[i3] = particle.originalPosition.x + noiseX + (distX / distance) * repelForce * 0.2;
            positions[i3 + 1] = particle.originalPosition.y + noiseY + (distY / distance) * repelForce * 0.2;
            positions[i3 + 2] = particle.originalPosition.z + noiseZ;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Rotate the entire particle system slightly
        particles.points.rotation.y += 0.0005;
        particles.points.rotation.z += 0.0003;
    }
    
    // Rotate objects more noticeably
    scene.traverse((object) => {
        if (object.isMesh) {
            if (object.geometry.type === 'BoxGeometry') {
                object.rotation.x += 0.02;
                object.rotation.y += 0.02;
            } else if (object.geometry.type === 'SphereGeometry') {
                object.rotation.y += 0.01;
                object.rotation.z += 0.01;
            } else if (object.geometry.type === 'TorusKnotGeometry') {
                object.rotation.x += 0.01;
                object.rotation.y += 0.01;
                object.rotation.z += 0.01;
            }
        }
    });
}