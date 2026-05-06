// Contact Form Test Handler (Local Testing Version)
// This version simulates form submission without requiring a server

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.error('🧪 TEST MODE: Contact form not found!');
        return;
    }
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!submitButton) {
        console.error('🧪 TEST MODE: Submit button not found!');
        return;
    }
    
    const originalButtonText = submitButton.textContent;
    
    // Remove any existing form attributes that might cause HTTP requests
    contactForm.removeAttribute('action');
    contactForm.removeAttribute('method');

    // Add event listener to form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('🧪 LOCAL TEST MODE - Form submission intercepted');
        
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i>Sending...';
        
        // Clear previous messages
        removeMessages();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Validate form
        const validation = validateForm(formData);
        
        if (!validation.isValid) {
            // Show validation errors
            showErrorMessages(validation.errors);
            resetButton();
            return;
        }
        
        // Simulate server processing delay
        setTimeout(() => {
            // Log form data to console for testing
            logFormData(formData);
            
            // Show success message
            showSuccessMessage('🧪 TEST MODE: Form data logged to console. Check developer tools!');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            resetButton();
        }, 2000); // 2 second delay to simulate server processing
    });

    function validateForm(formData) {
        const errors = [];
        
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const phone = formData.get('phone')?.trim();
        const service = formData.get('service');
        const message = formData.get('message')?.trim();
        
        if (!name) errors.push('Name is required');
        if (!email) {
            errors.push('Email is required');
        } else if (!isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        }
        if (!phone) {
            errors.push('Phone number is required');
        } else if (!/^\d{10}$/.test(phone)) {
            errors.push('Phone number must be exactly 10 digits');
        }
        if (!service) errors.push('Please select a service');
        if (!message) errors.push('Message is required');
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function logFormData(formData) {
        console.log('📧 FORM SUBMISSION DATA:');
        console.log('=======================');
        console.log('Name:', formData.get('name'));
        console.log('Email:', formData.get('email'));
        console.log('Phone:', formData.get('phone'));
        console.log('Service:', formData.get('service'));
        console.log('Message:', formData.get('message'));
        console.log('Timestamp:', new Date().toLocaleString());
        console.log('=======================');
        
        // Also create a formatted email preview
        const emailPreview = createEmailPreview(formData);
        console.log('📧 EMAIL PREVIEW:');
        console.log(emailPreview);
    }

    function createEmailPreview(formData) {
        const serviceNames = {
            'shadow' : 'Shadow Teacher',
            'special-ed': 'Special Education',
            'aba': 'ABA Therapy',
            'behavior': 'Behavior Therapy',
            'speech': 'Speech Therapy',
            'occupational': 'Occupational Therapy',
            'physio': 'Physiotherapy',
            'audiology': 'Audiology Tests',
            'guidance': 'Guidance and Counselling',
            'psychological': 'Psychological Assessment'
        };

        const service = formData.get('service');
        const serviceDisplay = serviceNames[service] || service;

        return `
Subject: [Contact Form] New inquiry from ${formData.get('name')}

New Contact Form Submission from Blinking Stars

=====================================
CONTACT DETAILS
=====================================
Name: ${formData.get('name')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone')}
Service Interested In: ${serviceDisplay}

=====================================
MESSAGE
=====================================
${formData.get('message')}

=====================================
SUBMISSION DETAILS
=====================================
Date: ${new Date().toLocaleString()}
Test Mode: YES (Local Testing)
=====================================
        `.trim();
    }

    function resetButton() {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }

    // Success message function
    function showSuccessMessage(message) {
        removeMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6';
        successDiv.innerHTML = `
            <div class="flex items-center">
                <i class="ri-checkbox-circle-line text-green-600 mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        contactForm.parentNode.insertBefore(successDiv, contactForm);
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove after 7 seconds
        setTimeout(() => successDiv.remove(), 7000);
    }

    // Error messages function
    function showErrorMessages(errors) {
        removeMessages();
        
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
        contactForm.parentNode.insertBefore(errorDiv, contactForm);
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Remove messages function
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

    // Show test mode indicator
    setTimeout(() => {
        console.log('🧪 CONTACT FORM IN TEST MODE');
        console.log('📝 Fill out the form and submit to see the data that would be emailed to you');
        console.log('🔍 Open Developer Tools (F12) to see the console logs');
        console.log('⚠️ No HTTP requests will be made - this is purely for testing form validation and display');
    }, 1000);
});

// Test mode indicator on page
window.addEventListener('load', function() {
    // Override the form action to prevent FormSubmit calls
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.removeAttribute('action');
        contactForm.removeAttribute('method');
    }
    
    // Add a small test indicator to the page
    const testIndicator = document.createElement('div');
    testIndicator.innerHTML = `
        <div style="
            position: fixed; 
            top: 10px; 
            right: 10px; 
            background: #ff9800; 
            color: white; 
            padding: 8px 12px; 
            border-radius: 4px; 
            font-size: 12px; 
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
            🧪 TEST MODE
        </div>
    `;
    document.body.appendChild(testIndicator);
});
