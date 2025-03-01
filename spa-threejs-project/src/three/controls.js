import * as THREE from 'three';

// controls.js
// This file manages user controls for the 3D scene, allowing for interaction with the models.

let camera, scene, renderer, controls;

export function initControls(camera, scene) {
    // Store original camera position
    const originalPosition = {
        x: camera.position.x,
        y: camera.position.y, 
        z: camera.position.z
    };
    
    // Store original camera rotation
    const originalRotation = {
        x: camera.rotation.x,
        y: camera.rotation.y,
        z: camera.rotation.z
    };
    
    // Create simple controls to manage camera state
    const controls = {
        // Parameters that affect camera behavior
        mouseInfluence: 0.1,
        scrollInfluence: 0.5,
        damping: 0.05,
        
        // Current state
        targetPosition: { ...originalPosition },
        targetRotation: { ...originalRotation },
        
        // Reset camera to original position
        resetCamera() {
            camera.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
            camera.rotation.set(originalRotation.x, originalRotation.y, originalRotation.z);
        },
        
        // Apply scroll effect to camera
        applyScrollEffect(scrollFraction) {
            // Calculate changes based on scroll
            this.targetPosition.y = originalPosition.y - scrollFraction * this.scrollInfluence * 10;
            this.targetRotation.x = originalRotation.x + scrollFraction * this.scrollInfluence;
        },
        
        // Apply mouse effect to camera
        applyMouseEffect(mouseX, mouseY) {
            this.targetPosition.x = originalPosition.x + mouseX * this.mouseInfluence * 5;
            // Use a reduced influence for Y to keep the scene more stable
            this.targetPosition.y = originalPosition.y + mouseY * this.mouseInfluence * 3;
            
            this.targetRotation.y = originalRotation.y + mouseX * this.mouseInfluence * 0.5;
            this.targetRotation.x = originalRotation.x + mouseY * this.mouseInfluence * 0.5;
        },
        
        // Update camera position and rotation with smooth damping
        update(scrollFraction = 0) { // Add scrollFraction parameter with default value
            // Smooth position damping
            camera.position.x += (this.targetPosition.x - camera.position.x) * this.damping;
            camera.position.y += (this.targetPosition.y - camera.position.y) * this.damping;
            camera.position.z += (this.targetPosition.z - camera.position.z) * this.damping;
            
            // Smooth rotation damping
            camera.rotation.x += (this.targetRotation.x - camera.rotation.x) * this.damping;
            camera.rotation.y += (this.targetRotation.y - camera.rotation.y) * this.damping;
            camera.rotation.z += (this.targetRotation.z - camera.rotation.z) * this.damping;
            
            // Keep camera looking at center of scene
            camera.lookAt(new THREE.Vector3(0, -scrollFraction * 5, 0));
        }
    };
    
    return controls;
}