// This file handles the logic for the contact form, including validation and submission.

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (validateForm(data)) {
        // Here you can handle the form submission, e.g., send data to an API
        console.log('Form submitted successfully:', data);
        // Optionally reset the form
        event.target.reset();
    } else {
        console.error('Form validation failed');
    }
}

function validateForm(data) {
    // Basic validation logic
    if (!data.name || !data.email || !data.message) {
        alert('Please fill in all fields.');
        return false;
    }
    // Add more validation as needed
    return true;
}