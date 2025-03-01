// main.js - Main JavaScript file for initializing the SPA application

// Importing the router for SPA navigation
import { initRouter } from './router.js';
import { initScene, updateScene } from '../three/scene.js';
import { initControls } from '../three/controls.js';

// Global variables
let currentScroll = 0;
let targetScroll = 0;
let scrollFraction = 0;
let mouseX = 0;
let mouseY = 0;

// Initialize the application
function initApp() {
    // Initialize the router for SPA navigation
    initRouter();

    // Initialize Three.js scene if on the homepage
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' ||
        window.location.pathname.endsWith('/')) {

        console.log('On homepage - attempting to initialize Three.js');

        // Find canvas with more robust error handling
        const canvas = document.getElementById('threejs-canvas');
        if (!canvas) {
            console.error('Canvas element not found! Make sure the HTML includes an element with id="threejs-canvas"');
            return;
        }

        try {
            console.log('Initializing Three.js scene...');

            // Ensure canvas is visible
            canvas.style.display = 'block';

            const { scene, camera, renderer, particles } = initScene(canvas);

            // Verify renderer was created
            if (!renderer) {
                throw new Error('Renderer was not created properly');
            }

            console.log('Renderer created successfully', renderer);

            const controls = initControls(camera, scene);

            // DOM elements for scroll animations
            const sections = document.querySelectorAll('.content-section');
            const sectionContents = document.querySelectorAll('.section-content');

            // Force an initial render to make sure something appears
            renderer.render(scene, camera);
            console.log('Initial render complete');

            // Handle scrolling
            function handleScroll() {
                const scrollTop = window.scrollY;
                const docHeight = document.body.offsetHeight;
                const winHeight = window.innerHeight;
                targetScroll = scrollTop / (docHeight - winHeight);

                // Check which sections are in view
                sections.forEach((section, index) => {
                    const rect = section.getBoundingClientRect();
                    const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;

                    if (inView) {
                        sectionContents[index].classList.add('visible');
                    } else {
                        sectionContents[index].classList.remove('visible');
                    }
                });
            }

            // Handle mouse movement
            function handleMouseMove(event) {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            }

            // Animation loop with error handling
            function animate() {
                try {
                    requestAnimationFrame(animate);

                    // Smooth scrolling effect
                    currentScroll += (targetScroll - currentScroll) * 0.05;
                    scrollFraction = currentScroll;

                    // Update the scene based on scroll and mouse position
                    updateScene(scene, camera, particles, {
                        scroll: scrollFraction,
                        mouseX: mouseX,
                        mouseY: mouseY
                    });

                    // Pass scrollFraction to the update method
                    controls.update(scrollFraction);

                    // Render the scene
                    renderer.render(scene, camera);
                } catch (e) {
                    console.error('Error in animation loop:', e);
                }
            }

            // Handle window resize
            function handleResize() {
                const width = window.innerWidth;
                const height = window.innerHeight;

                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                renderer.setSize(width, height);
            }

            // Initialize everything
            function init() {
                // Add event listeners
                window.addEventListener('scroll', handleScroll);
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('resize', handleResize);

                // Force the canvas to fill its container
                handleResize();

                // Start the animation loop
                console.log('Starting animation loop...');
                animate();

                // Trigger initial scroll check
                handleScroll();
            }

            // Start when the page is loaded
            window.addEventListener('load', init);

            // Also start immediately in case we're already loaded
            if (document.readyState === 'complete') {
                console.log('Document already loaded, initializing now');
                init();
            }

            console.log('Three.js initialization complete');

        } catch (error) {
            console.error('Failed to initialize Three.js scene:', error);
        }
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

export { initApp };