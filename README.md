Blinking Stars Healthcare Service Platform
=======================================

Project overview
----------------
This is a website for Blinking Stars Healthcare Services, built with HTML, CSS, JavaScript, and PHP. It includes:
- Home page (`index.html`)
- Contact page (`contactus.html`)
- Service and assessment pages (`children-assessments.html`, `adult-assessment.html`, `why-choose.html`, `internships.html`, `blog.html`, etc.)
- Contact form handling scripts (`contact-handler.php`, `contact-handler-db.php`, `popup-handler.php`)
- Client-side behavior (`script.js`, `contact-form.js`, `popup-form.js`)
- Styling files (`styles.css`, `navstyle.css`, `style.css`)
- Image folders and logo assets

How to use this repository on GitHub
------------------------------------
1. Upload the entire project folder to a GitHub repository.
2. If you want to host the static site on GitHub Pages, use the repository settings and enable GitHub Pages from the `main` branch.
3. GitHub Pages will serve the static files like `index.html`, `styles.css`, `script.js`, and image assets.

Important note about PHP files
-----------------------------
GitHub Pages only supports static content. PHP files such as:
- `contact-handler.php`
- `contact-handler-db.php`
- `popup-handler.php`
cannot run on GitHub Pages.

If you want the contact forms to work, you must host the project on a PHP-compatible web server or use a hosting service that supports PHP.

Local preview
-------------
To preview the site locally:
1. Open `index.html` in a web browser.
2. Use a local static server if you prefer, for example with Python:
   - `python -m http.server 8000`
   - Then open `http://localhost:8000`

To test the PHP contact form locally, use a local PHP server:
1. In the project folder, run:
   - `php -S localhost:8000`
2. Open `http://localhost:8000/index.html`

Recommended files to keep in the repository
------------------------------------------
- `index.html`
- `contactus.html`
- `children-assessments.html`
- `adult-assessment.html`
- `internships.html`
- `blog.html`
- `why-choose.html`
- `page2.html`
- `contact-handler.php`
- `contact-handler-db.php`
- `popup-handler.php`
- `contact-form.js`
- `popup-form.js`
- `script.js`
- `styles.css`
- `navstyle.css`
- `style.css`
- `Logo/`
- All image folders

Contact form setup
------------------
If the repository owner wants email notifications from the contact form:
- open `contact-handler.php`
- update `$your_email` to the real recipient email address
- make sure the site is hosted on a server that supports PHP and email sending

GitHub repository suggestions
-----------------------------
Suggested repository name:
- `Healthcare-Service-Platform---blinkingstars`

Suggested description:
- `Website for Blinking Stars Healthcare Services: special education and therapy support for children with special needs.`

Suggested tags:
- `html`, `css`, `javascript`, `php`, `healthcare`, `special-needs`, `therapy`, `education`, `responsive-design`
