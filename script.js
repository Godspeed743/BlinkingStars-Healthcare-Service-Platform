document.addEventListener("DOMContentLoaded", function () {
  // Navigation menu functionality
  const mobileMenuButton = document.querySelector("#mobile-menu-button");
  const mobileMenu = document.createElement("div");
  mobileMenu.className =
    "fixed inset-0 bg-gray-800 bg-opacity-95 z-[9999] transform translate-x-full transition-transform duration-300 ease-in-out";
  mobileMenu.innerHTML = `
                    <div class="flex justify-end p-6">
                        <button class="text-white text-2xl mobile-close-btn">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>
                    <div class="flex flex-col items-start justify-start h-full pt-4 pb-20 px-8 overflow-y-auto">
                        <a href="index.html" class="text-white text-xl py-3 border-b border-gray-600 w-full">Home</a>
                        
                        <!-- Services Dropdown -->
                        <div class="w-full border-b border-gray-600">
                            <button class="mobile-services-toggle text-white text-xl py-3 w-full text-left flex items-center justify-between">
                                <span>Services</span>
                                <i class="ri-arrow-down-s-line mobile-services-arrow transition-transform duration-200"></i>
                            </button>
                            <div class="mobile-services-dropdown hidden pl-4 pb-2">
                                <a href="index.html#services" class="text-white/80 text-lg py-2 block hover:text-white">Home/Online based</a>
                                
                                <!-- Assessments Nested Dropdown -->
                                <div class="w-full">
                                    <button class="mobile-assessments-toggle text-white/80 text-lg py-2 w-full text-left flex items-center justify-between hover:text-white">
                                        <span>Assessments</span>
                                        <i class="ri-arrow-down-s-line mobile-assessments-arrow transition-transform duration-200 text-sm"></i>
                                    </button>
                                    <div class="mobile-assessments-dropdown hidden pl-4 pb-1">
                                        <a href="children-assessments.html" class="text-white/70 text-base py-1 block hover:text-white">Children Assessments</a>
                                        <a href="adult-assessment.html" class="text-white/70 text-base py-1 block hover:text-white">Adult Assessments</a>
                                    </div>
                                </div>
                                
                                <a href="index.html#audiology" class="text-white/80 text-lg py-2 block hover:text-white">Audiology Test</a>
                                <a href="art.html" class="text-white/80 text-lg py-2 block hover:text-white">Art</a>
                                <a href="music-dance.html" class="text-white/80 text-lg py-2 block hover:text-white">Music & Dance</a>
                                <a href="sports.html" class="text-white/80 text-lg py-2 block hover:text-white">Sports</a>
                                <a href="internships.html" class="text-white/80 text-lg py-2 block hover:text-white">Internships</a>
                            </div>
                        </div>
                        <a href="page2.html" class="text-white text-xl py-3 border-b border-gray-600 w-full">Join Our Team</a>
                        <a href="index.html#collaborations" class="text-white text-xl py-3 border-b border-gray-600 w-full">Collaborations</a>
                        
                        <!-- About Us Dropdown -->
                        <div class="w-full border-b border-gray-600">
                            <button class="mobile-about-toggle text-white text-xl py-3 w-full text-left flex items-center justify-between">
                                <span>About Us</span>
                                <i class="ri-arrow-down-s-line mobile-about-arrow transition-transform duration-200"></i>
                            </button>
                            <div class="mobile-about-dropdown hidden pl-4 pb-2">
                                <a href="why-choose.html" class="text-white/80 text-lg py-2 block hover:text-white">Why Choose Us</a>
                                <a href="blog.html" class="text-white/80 text-lg py-2 block hover:text-white">Blogs and Posts</a>
                                <a href="contactus.html" class="text-white/80 text-lg py-2 block hover:text-white">Contact Us</a>
                            </div>
                        </div>
                        
                        <a href="tel:+91 8860186082" class="flex items-center text-white text-lg py-4 mt-4">
                            <i class="ri-phone-line mr-3"></i>
                            +91 8860186082
                        </a>
                        
                        <div class="flex space-x-4 mt-6 mb-6">
                            <a href="https://facebook.com/blinkingstars" target="_blank" class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition duration-200">
                                <i class="ri-facebook-fill text-white text-lg"></i>
                            </a>
                            <a href="https://twitter.com/blinkingstars" target="_blank" class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition duration-200">
                                <i class="ri-twitter-fill text-white text-lg"></i>
                            </a>
                            <a href="https://instagram.com/blinkingstars" target="_blank" class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition duration-200">
                                <i class="ri-instagram-line text-white text-lg"></i>
                            </a>
                            <a href="https://linkedin.com/company/blinkingstars" target="_blank" class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition duration-200">
                                <i class="ri-linkedin-fill text-white text-lg"></i>
                            </a>
                            <a href="https://youtube.com/blinkingstars" target="_blank" class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition duration-200">
                                <i class="ri-youtube-fill text-white text-lg"></i>
                            </a>
                        </div>
                        
                        <a href="https://wa.me/918860186082" target="_blank" class="bg-white text-primary px-8 py-3 rounded-button font-medium hover:bg-gray-100 transition duration-200 whitespace-nowrap mt-4">Book Appointment</a>
                    </div>
                `;
  document.body.appendChild(mobileMenu);
  
  // Check if mobile menu button exists
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.remove("translate-x-full");
    });
    
    const closeButton = mobileMenu.querySelector(".mobile-close-btn");
    closeButton.addEventListener("click", function () {
      mobileMenu.classList.add("translate-x-full");
    });
  }
  // Mobile Menu Dropdown Functionality
  
  // Services Dropdown Toggle
  const servicesToggle = mobileMenu.querySelector('.mobile-services-toggle');
  const servicesDropdown = mobileMenu.querySelector('.mobile-services-dropdown');
  const servicesArrow = mobileMenu.querySelector('.mobile-services-arrow');
  
  if (servicesToggle && servicesDropdown && servicesArrow) {
    servicesToggle.addEventListener('click', function(e) {
      // Don't interfere if clicking on a link inside the dropdown
      if (e.target.closest('a')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const isHidden = servicesDropdown.classList.contains('hidden');
      
      if (isHidden) {
        servicesDropdown.classList.remove('hidden');
        servicesArrow.style.transform = 'rotate(180deg)';
      } else {
        servicesDropdown.classList.add('hidden');
        servicesArrow.style.transform = 'rotate(0deg)';
        // Also close nested assessments dropdown when closing services
        const assessmentsDropdown = mobileMenu.querySelector('.mobile-assessments-dropdown');
        const assessmentsArrow = mobileMenu.querySelector('.mobile-assessments-arrow');
        if (assessmentsDropdown) assessmentsDropdown.classList.add('hidden');
        if (assessmentsArrow) assessmentsArrow.style.transform = 'rotate(0deg)';
      }
    });
  }
  
  // Assessments Nested Dropdown Toggle
  const assessmentsToggle = mobileMenu.querySelector('.mobile-assessments-toggle');
  const assessmentsDropdown = mobileMenu.querySelector('.mobile-assessments-dropdown');
  const assessmentsArrow = mobileMenu.querySelector('.mobile-assessments-arrow');
  
  if (assessmentsToggle && assessmentsDropdown && assessmentsArrow) {
    assessmentsToggle.addEventListener('click', function(e) {
      // Don't interfere if clicking on a link inside the dropdown
      if (e.target.closest('a')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const isHidden = assessmentsDropdown.classList.contains('hidden');
      
      if (isHidden) {
        assessmentsDropdown.classList.remove('hidden');
        assessmentsArrow.style.transform = 'rotate(180deg)';
      } else {
        assessmentsDropdown.classList.add('hidden');
        assessmentsArrow.style.transform = 'rotate(0deg)';
      }
    });
  }
  
  // About Us Dropdown Toggle
  const aboutToggle = mobileMenu.querySelector('.mobile-about-toggle');
  const aboutDropdown = mobileMenu.querySelector('.mobile-about-dropdown');
  const aboutArrow = mobileMenu.querySelector('.mobile-about-arrow');
  
  if (aboutToggle && aboutDropdown && aboutArrow) {
    aboutToggle.addEventListener('click', function(e) {
      // Don't interfere if clicking on a link inside the dropdown
      if (e.target.closest('a')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const isHidden = aboutDropdown.classList.contains('hidden');
      
      if (isHidden) {
        aboutDropdown.classList.remove('hidden');
        aboutArrow.style.transform = 'rotate(180deg)';
      } else {
        aboutDropdown.classList.add('hidden');
        aboutArrow.style.transform = 'rotate(0deg)';
      }
    });
  }
  
  // Close mobile menu when clicking any navigation link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute('href');
      
      // Allow normal navigation for HTML file links (like music-dance.html, sports.html, etc.)
      if (href && (href.endsWith('.html') || href.includes('.html#'))) {
        // Close menu immediately and allow normal navigation
        mobileMenu.classList.add("translate-x-full");
        // Don't prevent default - allow browser to navigate normally
        return true;
      }
      
      // For anchor links on same page, close menu and let smooth scroll handle it
      if (href && href.startsWith('#')) {
        mobileMenu.classList.add("translate-x-full");
        return; // Let smooth scroll handler take over
      }
      
      // Don't close for social media links or external links (let them navigate normally)
      if (href && (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:'))) {
        // Don't interfere with external links
        return true;
      }
      
      // For other internal links, close menu
      if (href && !href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
        // Close the mobile menu with a slight delay to ensure smooth transition
        setTimeout(() => {
          mobileMenu.classList.add("translate-x-full");
        }, 100);
      }
    });
  });
  
  // Close mobile menu when clicking outside
  mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) {
      mobileMenu.classList.add("translate-x-full");
    }
  });

  // Smooth scroll functionality - only for links that start with # and are on the same page
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      
      // Don't intercept if it's a link to another page with an anchor (like index.html#services)
      if (href.includes('.html') || href.includes('/#')) {
        return; // Allow normal navigation
      }
      
      // Only prevent default for same-page anchor links
      e.preventDefault();
      const targetId = href;
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Form validation logic
  const contactForm = document.querySelector("#contact-form form"); // Correct targeting
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent form submission
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const phoneInput = document.getElementById("phone");
      const serviceInput = document.getElementById("service");
      const messageInput = document.getElementById("message");
      let isValid = true;

      // Simple validation
      if (!nameInput.value.trim()) {
        nameInput.classList.add("border-red-500");
        isValid = false;
      } else {
        nameInput.classList.remove("border-red-500");
      }
      if (!emailInput.value.trim() || !emailInput.value.includes("@")) {
        emailInput.classList.add("border-red-500");
        isValid = false;
      } else {
        emailInput.classList.remove("border-red-500");
      }
      // Phone number validation - must be exactly 10 digits
      const phoneValue = phoneInput.value.trim().replace(/\D/g, ''); // Remove all non-digits
      if (!phoneInput.value.trim()) {
        phoneInput.classList.add("border-red-500");
        alert("Phone number is required.");
        isValid = false;
      } else if (phoneValue.length !== 10) {
        phoneInput.classList.add("border-red-500");
        alert("Phone number entered is not of 10 digits. Kindly re-check the phone number.");
        isValid = false;
      } else {
        phoneInput.classList.remove("border-red-500");
      }
      if (serviceInput.value === "") {
        serviceInput.classList.add("border-red-500");
        isValid = false;
      } else {
        serviceInput.classList.remove("border-red-500");
      }
      if (!messageInput.value.trim()) {
        messageInput.classList.add("border-red-500");
        isValid = false;
      } else {
        messageInput.classList.remove("border-red-500");
      }
      if (isValid) {
        alert("Thank you for your message! We will contact you shortly.");
        contactForm.reset(); // Reset form fields
      }
    });
  }

  // Mobile free consultation icon positioning
  const popupIcon = document.getElementById('popup-notification-icon');
  if (popupIcon) {
    function adjustIconPosition() {
      const width = window.innerWidth;
      if (width <= 480) {
        // Extra small devices
        popupIcon.style.right = '8px';
        popupIcon.style.left = 'auto';
        popupIcon.style.top = '150px';
      } else if (width <= 640) {
        // Small devices
        popupIcon.style.right = '12px';
        popupIcon.style.left = 'auto';
        popupIcon.style.top = '160px';
      } else {
        // Reset for larger screens
        popupIcon.style.left = '';
        popupIcon.style.right = '';
        popupIcon.style.top = '';
      }
    }

    // Initial adjustment
    adjustIconPosition();

    // Adjust on window resize
    window.addEventListener('resize', adjustIconPosition);
  }
});
