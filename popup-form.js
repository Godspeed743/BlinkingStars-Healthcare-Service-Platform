// Popup Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Skip on m.html, children-assessments.html, and adult-assessment.html as requested
    try {
        var path = (window.location && window.location.pathname) || '';
        if (path && (/(^|\/)m\.html$/i.test(path) || /(^|\/)children-assessments\.html$/i.test(path) || /(^|\/)adult-assessment\.html$/i.test(path))) {
            return;
        }
    } catch (e) {}

    // Ensure required UI is present on all pages
    ensureRemixIcon();
    // Ensure popup styles and icon are always available
    ensurePopupStyles();
    ensurePopupMarkup();
    const popupOverlay = document.getElementById('popup-form-overlay');
    const popupForm = document.getElementById('popup-contact-form');
    const closePopupBtn = document.getElementById('close-popup');
    const submitBtn = popupForm ? popupForm.querySelector('.popup-submit-btn') : null;
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnLoading = submitBtn ? submitBtn.querySelector('.btn-loading') : null;
    const notificationIcon = document.getElementById('popup-notification-icon');

    // Respect permanent dismissal
    const popupPermanentlyDismissed = localStorage.getItem('popupPermanentlyDismissed');
    // Always show the notification icon on load (no auto-open)
    if (!popupPermanentlyDismissed) {
        showNotificationIcon();
    }
    
    // If critical elements are missing, stop safely
    // Skip popup form logic since we're using contact form instead
    // The icon will still work for navigation
    if (!popupOverlay || !popupForm || !closePopupBtn || !submitBtn || !btnText || !btnLoading) {
        // Icon functionality still works even if popup form elements are missing
        return;
    }

    // Notification icon click/keyboard handler - open popup form
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            if (popupOverlay && popupForm) {
                showPopup();
            }
        });
        notificationIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (popupOverlay && popupForm) {
                    showPopup();
                }
            }
        });
    }

    // Show notification icon
    function showNotificationIcon() {
        if (notificationIcon) {
            notificationIcon.classList.remove('hidden');
            notificationIcon.classList.add('show');
        }
    }
    
    // Hide notification icon
    function hideNotificationIcon() {
        if (notificationIcon) {
            notificationIcon.classList.remove('show');
            notificationIcon.classList.add('hidden');
        }
    }

    // Show popup function
    function showPopup() {
        popupOverlay.classList.add('show');
        popupOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        hideNotificationIcon(); // Hide notification when popup is shown
        // Focus management
        const container = popupOverlay.querySelector('.popup-form-container');
        if (container) {
            container.focus();
        }
        const firstInput = popupForm.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 0);
        }
    }

    // Hide popup function
    function hidePopup() {
        popupOverlay.classList.remove('show');
        popupOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        
        // Show notification icon again when popup is closed (unless permanently dismissed)
        const permanentlyDismissed = localStorage.getItem('popupPermanentlyDismissed');
        if (!permanentlyDismissed) {
            setTimeout(() => {
                showNotificationIcon();
            }, 1000); // Show notification icon after 1 second
        }
    }

    // Close popup when clicking close button
    closePopupBtn.addEventListener('click', hidePopup);

    // Enhanced click-outside-to-close functionality
    popupOverlay.addEventListener('click', function(e) {
        // Close if clicking on the overlay itself (not the form container)
        if (e.target === popupOverlay) {
            hidePopup();
        }
    });
    
    // Prevent form container clicks from bubbling to overlay
    const popupContainer = popupOverlay.querySelector('.popup-form-container');
    if (popupContainer) {
        popupContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupOverlay.classList.contains('show')) {
            hidePopup();
        }
    });

    // Form submission handler
    popupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // No longer persisting dismissal via checkbox (removed UI)
        // Client-side phone normalization
        const phoneInput = document.getElementById('popup-phone');
        if (phoneInput && phoneInput.value) {
            const digits = phoneInput.value.replace(/\D+/g, '');
            // If starts with country code like 91 and total length 12, attempt to keep last 10
            const normalized = digits.length > 10 ? digits.slice(-10) : digits;
            phoneInput.value = normalized;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline-flex';
        
        // Clear previous messages
        clearMessages();
        
        // Get form data
        const formData = new FormData(popupForm);
        
        // Debug: Log form data
        console.log('Popup form data being sent:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ': ' + value);
        }
        
        // Submit form via AJAX - use contact-handler.php for consistency
        fetch('contact-handler.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Success - show success message
                showSuccessMessage(data.message);
                // Reset form
                popupForm.reset();
                // Hide popup after 3 seconds
                setTimeout(() => {
                    hidePopup();
                }, 3000);
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
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        });
    });

    // Function to show success message
    function showSuccessMessage(message) {
        clearMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'popup-success';
        successDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center;">
                <i class="ri-checkbox-circle-line" style="margin-right: 8px; font-size: 18px;"></i>
                <span>${message}</span>
            </div>
        `;
        
        popupForm.insertBefore(successDiv, popupForm.firstChild);
        successDiv.style.display = 'block';
    }

    // Function to show error message
    function showErrorMessage(message) {
        clearMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'popup-error';
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center;">
                <i class="ri-error-warning-line" style="margin-right: 8px; font-size: 18px;"></i>
                <span>${message}</span>
            </div>
        `;
        
        popupForm.insertBefore(errorDiv, popupForm.firstChild);
        errorDiv.style.display = 'block';
    }

    // Function to show multiple error messages
    function showErrorMessages(errors) {
        clearMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'popup-error';
        
        let errorHTML = `
            <div>
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                    <i class="ri-error-warning-line" style="margin-right: 8px; font-size: 18px;"></i>
                    <span style="font-weight: 600;">Please fix the following errors:</span>
                </div>
                <ul style="text-align: left; margin: 0; padding-left: 20px;">
        `;
        
        errors.forEach(error => {
            errorHTML += `<li style="margin-bottom: 5px;">${error}</li>`;
        });
        
        errorHTML += `
                </ul>
            </div>
        `;
        
        errorDiv.innerHTML = errorHTML;
        popupForm.insertBefore(errorDiv, popupForm.firstChild);
        errorDiv.style.display = 'block';
    }

    // Function to clear messages
    function clearMessages() {
        const messages = popupForm.querySelectorAll('.popup-success, .popup-error');
        messages.forEach(msg => msg.remove());
    }

    // Add loading animation styles if not already present
    if (!document.querySelector('#popup-loading-styles')) {
        const style = document.createElement('style');
        style.id = 'popup-loading-styles';
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
    }

    // Inject Remix Icon if not present
    function ensureRemixIcon() {
        var hasRemix = !!document.querySelector('link[href*="remixicon"]');
        if (!hasRemix) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css';
            document.head.appendChild(link);
        }
    }

    // Inject minimal styles for popup and icon if missing
    function ensurePopupStyles() {
        if (document.getElementById('popup-shared-styles')) return;
        var style = document.createElement('style');
        style.id = 'popup-shared-styles';
        style.textContent = `
            .popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.7); backdrop-filter: blur(5px); z-index: 9999; display: none; align-items: center; justify-content: center; padding: 20px; }
            .popup-overlay.show { display: flex; }
            .popup-form-container { background: #fff; border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,.3); max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; animation: popupSlideIn .3s ease-out; outline: none; }
            @keyframes popupSlideIn { from { opacity: 0; transform: translateY(-50px) scale(.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
            .popup-form-header { background: linear-gradient(135deg,#6366f1,#8b5cf6,#14b8a6); color: #fff; padding: 30px; border-radius: 20px 20px 0 0; text-align: center; position: relative; }
            .close-popup-btn { position:absolute; top:15px; right:15px; background: rgba(255,255,255,.2); border:none; color:#fff; width:35px; height:35px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:18px; transition:all .3s ease; }
            .popup-form { padding: 30px; }
            .form-group { margin-bottom: 20px; }
            .form-group label { display:block; font-weight:600; color:#374151; margin-bottom:8px; font-size:14px; }
            .form-group input, .form-group select, .form-group textarea { width:100%; padding:12px 16px; border:2px solid #e5e7eb; border-radius:10px; font-size:16px; transition:all .3s ease; background:#f9fafb; font-family:inherit; }
            .form-group textarea { resize:vertical; min-height:100px; }
            .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline:none; border-color:#6366f1; background:#fff; box-shadow:0 0 0 3px rgba(99,102,241,.1); }
            .popup-submit-btn { width:100%; background: linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border:none; padding:15px; border-radius:12px; font-size:16px; font-weight:600; cursor:pointer; transition:all .3s ease; position:relative; overflow:hidden; }
            .popup-success { background:#d1fae5; color:#065f46; padding:15px; border-radius:10px; margin-bottom:20px; text-align:center; display:none; }
            .popup-error { background:#fee2e2; color:#991b1b; padding:15px; border-radius:10px; margin-bottom:20px; text-align:center; display:none; }
            .popup-notification-icon { position:fixed; top:20px; right:20px; width:60px; height:60px; background: linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:1000; box-shadow:0 10px 25px rgba(99,102,241,.3); transition:all .3s ease; animation: popBounce 2s infinite; }
            .popup-notification-icon.show { display:flex; }
            .popup-notification-icon:hover { transform: scale(1.1); box-shadow: 0 15px 35px rgba(99,102,241,.4); }
            .popup-notification-icon i { color:#fff; font-size:30px; position:relative; z-index:1; }
            .popup-notification-icon.hidden { display:none; }
            .popup-notification-icon::before { content:''; position:absolute; top:-5px; left:-5px; right:-5px; bottom:-5px; border-radius:50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); opacity:.3; animation: pulse 2s infinite; z-index:-1; }
            .popup-icon-glow { position:absolute; width:100%; height:100%; border-radius:50%; background: radial-gradient(rgba(139,92,246,.35), rgba(99,102,241,0) 70%); filter: blur(2px); z-index:0; }
            .popup-icon-ring { position:absolute; inset:-6px; border-radius:50%; border:2px dashed rgba(255,255,255,.35); animation: ringSpin 6s linear infinite; pointer-events:none; z-index:0; }
            .popup-notification-badge { position:absolute; top:-6px; right:-6px; background:#22c55e; color:#fff; font-size:10px; font-weight:800; padding:4px 6px; border-radius:9999px; box-shadow:0 8px 20px rgba(34,197,94,.4); z-index:2; }
            .popup-notification-label { position:absolute; white-space:nowrap; right:70px; background:rgba(255,255,255,.95); color:#111827; font-size:12px; font-weight:700; padding:6px 10px; border-radius:9999px; box-shadow:0 10px 25px rgba(0,0,0,.15); border:1px solid rgba(17,24,39,.06); z-index:1; }
            @keyframes ringSpin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
            @keyframes popBounce { 0%,100%{ transform: translateY(0) scale(1);} 50%{ transform: translateY(-10px) scale(1.05);} }
            @keyframes pulse { 0%{ transform: scale(1); opacity:.2;} 50%{ transform: scale(1.2); opacity:.15;} 100%{ transform: scale(1.4); opacity:0; } }
            @media (max-width:640px){ 
                .popup-form-container{ margin:10px; max-width:none;} 
                .popup-notification-icon{ top:140px; right:12px; width:50px; height:50px;} 
                .popup-notification-icon i{ font-size:26px;} 
                .popup-notification-badge{ top:-4px; right:-4px; font-size:8px; padding:3px 5px;}
                .popup-notification-label{ right:70px; font-size:11px; padding:5px 8px; } 
                .popup-form{ padding:20px;} 
            }
            @media (max-width:480px){ 
                .popup-notification-icon{ top:130px; right:8px; width:45px; height:45px;} 
                .popup-notification-icon i{ font-size:24px;} 
                .popup-notification-badge{ top:-3px; right:-3px; font-size:7px; padding:2px 4px;}
                .popup-notification-label{ right:63px; font-size:10px; padding:4px 7px; }
            }
            @media (min-width:641px) and (max-width:1023px){
                .popup-notification-icon{ top:15px; right:15px; width:55px; height:55px;}
                .popup-notification-icon i{ font-size:28px;}
                .popup-notification-label{ right:65px; font-size:11px;}
            }
        `;
        document.head.appendChild(style);
    }

    // Inject icon + overlay markup if not present
    function ensurePopupMarkup() {
        if (!document.getElementById('popup-notification-icon')) {
            var icon = document.createElement('div');
            icon.id = 'popup-notification-icon';
            icon.className = 'popup-notification-icon';
            icon.title = 'Contact Us - Get Free Consultation!';
            icon.setAttribute('role','button');
            icon.setAttribute('aria-label','Go to contact form');
            icon.tabIndex = 0;
            icon.innerHTML = '<span class="popup-icon-glow"></span><span class="popup-icon-ring"></span><i class="ri-message-3-line"></i><span class="popup-notification-badge" aria-hidden="true">FREE</span><span class="popup-notification-label" aria-hidden="true">Contact Us</span>';
            document.body.appendChild(icon);
        }
        if (!document.getElementById('popup-form-overlay')) {
            var overlay = document.createElement('div');
            overlay.id = 'popup-form-overlay';
            overlay.className = 'popup-overlay';
            overlay.setAttribute('role','dialog');
            overlay.setAttribute('aria-modal','true');
            overlay.setAttribute('aria-labelledby','popup-form-title');
            overlay.setAttribute('aria-hidden','true');
            overlay.innerHTML = `
                <div class="popup-form-container" tabindex="-1">
                  <div class="popup-form-header">
                    <h3 id="popup-form-title">Get Started Today!</h3>
                    <p>Let us know how we can help your child</p>
                    <button id="close-popup" class="close-popup-btn" aria-label="Close popup"><i class="ri-close-line"></i></button>
                  </div>
                  <form id="popup-contact-form" class="popup-form" novalidate>
                    <div style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;" aria-hidden="true">
                      <label for="popup-website">Website</label>
                      <input type="text" id="popup-website" name="website" tabindex="-1" autocomplete="off">
                    </div>
                    <div class="form-group">
                      <label for="popup-name">Name *</label>
                      <input type="text" id="popup-name" name="name" required placeholder="Enter your name">
                    </div>
                    <div class="form-group">
                      <label for="popup-email">Email Address *</label>
                      <input type="email" id="popup-email" name="email" required placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                      <label for="popup-phone">Phone Number *</label>
                      <input type="tel" id="popup-phone" name="phone" required placeholder="Enter your phone number">
                    </div>
                    <div class="form-group">
                      <label for="popup-service">Service Interested In *</label>
                      <select id="popup-service" name="service" required>
                        <option value="" disabled selected>Select a service</option>
                        <option value="shadow-teacher">Shadow Teacher</option>
                        <option value="special-ed">Special Education</option>
                        <option value="aba">ABA Therapy</option>
                        <option value="behavior">Behavior Therapy</option>
                        <option value="speech">Speech Therapy</option>
                        <option value="occupational">Occupational Therapy</option>
                        <option value="physio">Physiotherapy</option>
                        <option value="audiology">Audiology Tests</option>
                        <option value="guidance">Guidance and Counselling</option>
                        <option value="psychological">Psychological Assessment</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="popup-message">Message *</label>
                      <textarea id="popup-message" name="message" rows="4" required placeholder="Tell us about your child's needs..."></textarea>
                    </div>
                    <button type="submit" class="popup-submit-btn">
                      <span class="btn-text">Send Message</span>
                      <span class="btn-loading" style="display:none;"><i class="ri-loader-4-line animate-spin"></i> Sending...</span>
                    </button>
                  </form>
                  <div class="popup-form-footer"><p>We'll contact you within 24 hours</p></div>
                </div>`;
            document.body.appendChild(overlay);
        }
    }
});
