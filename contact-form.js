// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Add event listener to form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i>Sending...';
        
        // Clear previous error messages
        clearErrorMessages();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Debug: Log form data to console
        console.log('Form data being sent:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ': ' + value);
        }
        
        // Submit form via AJAX
        fetch('contact-handler.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Success - show success message
                showSuccessMessage(data.message);
                // Reset form
                contactForm.reset();
            } else {
                // Error - show error messages
                if (data.errors) {
                    showErrorMessages(data.errors);
                } else {
                    showErrorMessage(data.message || 'An error occurred. Please try again.');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('Network error. Please check your connection and try again.');
        })
        .finally(() => {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });

    // Function to show success message
    function showSuccessMessage(message) {
        // Remove any existing messages
        removeMessages();
        
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6';
        successDiv.innerHTML = `
            <div class="flex items-center">
                <i class="ri-checkbox-circle-line text-green-600 mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Insert before form
        contactForm.parentNode.insertBefore(successDiv, contactForm);
        
        // Scroll to message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Function to show error message
    function showErrorMessage(message) {
        // Remove any existing messages
        removeMessages();
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="ri-error-warning-line text-red-600 mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Insert before form
        contactForm.parentNode.insertBefore(errorDiv, contactForm);
        
        // Scroll to message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Function to show multiple error messages
    function showErrorMessages(errors) {
        // Remove any existing messages
        removeMessages();
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6';
        
        let errorHTML = `
            <div class="flex items-start">
                <i class="ri-error-warning-line text-red-600 mr-2 mt-1"></i>
                <div>
                    <p class="font-medium mb-2">Please fix the following errors:</p>
                    <ul class="list-disc list-inside space-y-1">
        `;
        
        errors.forEach(error => {
            errorHTML += `<li>${error}</li>`;
        });
        
        errorHTML += `
                    </ul>
                </div>
            </div>
        `;
        
        errorDiv.innerHTML = errorHTML;
        
        // Insert before form
        contactForm.parentNode.insertBefore(errorDiv, contactForm);
        
        // Scroll to message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Function to clear error messages
    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.bg-red-50, .bg-green-50');
        errorMessages.forEach(msg => msg.remove());
    }

    // Function to remove all messages
    function removeMessages() {
        const messages = document.querySelectorAll('.bg-red-50, .bg-green-50');
        messages.forEach(msg => msg.remove());
    }

    // Add loading animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

// Alternative method using EmailJS (for client-side email sending)
// Uncomment and configure if you prefer this method

/*
// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

function sendEmailWithEmailJS(formData) {
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message'),
        to_email: 'your-email@example.com'
    };

    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}
*/
