// This file contains reusable utility functions that can be used throughout the application.

// Function to generate a unique ID
function generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 16);
}

// Function to format date to a readable string
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to validate email format
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Function to show a notification message
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}