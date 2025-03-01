// router.js

// Routes configuration - these should be the actual file names without additional paths
const routes = {
    '/': 'index.html',
    '/index.html': 'index.html',
    '/about.html': 'about.html',
    '/contact.html': 'contact.html'
};

// Load page content
async function loadContent(url) {
    try {
        // Find content container - try different possible selectors based on page structure
        let contentContainer = document.getElementById('app-content');
        
        // If app-content not found, try to find another suitable container
        if (!contentContainer) {
            contentContainer = document.querySelector('#scrollable-content') || 
                              document.querySelector('main') || 
                              document.querySelector('body');
            
            console.log('Using alternative container:', contentContainer);
            
            // If we're on the home page with sections, we need different behavior
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname === '/' ||
                window.location.pathname.endsWith('/')) {
                console.log('On home page - no need to replace content');
                return; // Don't replace content on home page
            }
        }
        
        // Extract just the path part (remove any base URL segments)
        const pathName = new URL(url, window.location.origin).pathname;
        
        // Get the last segment of the path (the actual HTML file name)
        const pathSegments = pathName.split('/').filter(Boolean);
        const lastSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
        
        // Default to index.html for root path
        const pageName = lastSegment || 'index.html';
        
        // If navigating to index.html, just reload the page instead of using SPA
        if (pageName === 'index.html' || pageName === '') {
            window.location.href = pageName || 'index.html';
            return;
        }
        
        // Determine which file to load - use the actual file name directly
        const pagePath = routes[`/${pageName}`] || '404.html';
        
        console.log(`Loading content from: ${pagePath}`);
        
        // Fetch the HTML content
        const response = await fetch(pagePath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract only the main content section from the HTML
        const mainContent = doc.querySelector('main')?.innerHTML || 
                            doc.querySelector('.main-content')?.innerHTML || 
                            doc.querySelector('body')?.innerHTML || '';
        
        // Make sure we have a container to put content into
        if (!contentContainer) {
            console.error('No suitable content container found!');
            // As a last resort, redirect to the page
            window.location.href = pagePath;
            return;
        }
        
        // Insert only the main content
        contentContainer.innerHTML = mainContent;
        
        // Update the page title if available
        const title = doc.querySelector('title')?.textContent;
        if (title) {
            document.title = title;
        }
    } catch (error) {
        console.error('Error loading content:', error);
        
        // Handle errors gracefully - if no container, redirect
        const contentContainer = document.getElementById('app-content') || 
                               document.querySelector('main') || 
                               document.querySelector('body');
        
        if (contentContainer) {
            contentContainer.innerHTML = '<h1>Page Not Found</h1><p>Sorry, the requested page could not be loaded.</p>';
        } else {
            // If we can't find any container, just redirect
            window.location.href = '404.html';
        }
    }
}

// Handle navigation
function handleNavigation(e) {
    // Make sure the target is an anchor tag and it's a local link
    if (e.target.tagName === 'A' && 
        e.target.href && 
        e.target.href.includes(window.location.origin)) {
        
        const url = e.target.href;
        const pathName = new URL(url).pathname;
        const lastSegment = pathName.split('/').filter(Boolean).pop() || '';
        
        // For home/index page, just do a regular navigation to ensure Three.js is properly initialized
        if (lastSegment === '' || lastSegment === 'index.html') {
            return; // Allow normal navigation
        }
        
        // For other pages, use SPA behavior
        e.preventDefault();
        history.pushState(null, '', url);
        loadContent(url);
    }
}

// Initialize router
function initRouter() {
    // Only add event listeners - don't load content yet as it might interfere with Three.js setup
    document.addEventListener('click', handleNavigation);
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
        loadContent(window.location.href);
    });
    
    console.log('Router initialized');
}

export { initRouter };