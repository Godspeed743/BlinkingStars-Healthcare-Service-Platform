<?php
// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ===============================
// CONFIGURATION - UPDATE THESE VALUES
// ===============================

// Your email address where you want to receive messages
$your_email = "blinkingstars.info.in@gmail.com";

// Your website name
$website_name = "Blinking Stars";

// Email subject prefix - detect if from popup form
$is_popup_form = isset($_POST['website']); // Popup form has honeypot field
$subject_prefix = $is_popup_form ? "[Popup Form]" : "[Contact Form]";

// ===============================
// FORM PROCESSING
// ===============================

// Get form data and sanitize
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? strip_tags(trim($_POST['email'])) : '';
$phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
$service = isset($_POST['service']) ? strip_tags(trim($_POST['service'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';
$website_hp = isset($_POST['website']) ? trim($_POST['website']) : ''; // Honeypot field

// Honeypot spam check - if filled, it's spam
if (!empty($website_hp)) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Thank you!']);
    exit;
}

// Normalize phone to last 10 digits
if (!empty($phone)) {
    $digitsOnly = preg_replace('/\D+/', '', $phone);
    if (strlen($digitsOnly) > 10) {
        $digitsOnly = substr($digitsOnly, -10);
    }
    $phone = $digitsOnly;
}

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = "Name is required";
}

if (empty($email)) {
    $errors[] = "Email is required";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}

if (empty($phone)) {
    $errors[] = "Phone number is required";
} elseif (!preg_match('/^\d{10}$/', $phone)) {
    $errors[] = "Phone number must be exactly 10 digits";
}

if (empty($service)) {
    $errors[] = "Service selection is required";
}

if (empty($message)) {
    $errors[] = "Message is required";
}

// If there are errors, return them
if (!empty($errors)) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// ===============================
// EMAIL COMPOSITION
// ===============================

// Map service codes to readable names
$service_names = [
    'aba' => 'ABA Therapy',
    'shadow-teacher' => 'Shadow Teacher',
    'guidance' => 'Guidance and Counselling',
    'physio' => 'Physiotherapy',
    'occupational' => 'Occupational Therapy',
    'speech' => 'Speech Therapy',
    'audiology' => 'Audiology Tests',
    'special-ed' => 'Special Education',
    'behavior' => 'Behavior Therapy',
    'psychological' => 'Psychological Assessment'
];

$service_display = isset($service_names[$service]) ? $service_names[$service] : $service;

// Email subject
$subject = $subject_prefix . " New inquiry from " . $name;

// Email body
$email_body = "
New {$subject_prefix} Submission from {$website_name}

=====================================
CONTACT DETAILS
=====================================
Name: {$name}
Email: {$email}
Phone: {$phone}
Service Interested In: {$service_display}

=====================================
MESSAGE
=====================================
{$message}

=====================================
SUBMISSION DETAILS
=====================================
Date: " . date('Y-m-d H:i:s') . "
IP Address: " . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'Unknown') . "
User Agent: " . (isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown') . "
Form Type: " . ($is_popup_form ? 'Popup Contact Form' : 'Contact Form') . "

=====================================
";

// Email headers
$headers = [
    'From: ' . $website_name . ' <noreply@' . (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'blinkingstars.in') . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// ===============================
// SEND EMAIL
// ===============================

// Set JSON header for all responses
header('Content-Type: application/json; charset=UTF-8');

$mail_sent = @mail($your_email, $subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Success response
    echo json_encode([
        'success' => true, 
        'message' => $is_popup_form ? 'Thank you! We will contact you within 24 hours for your free consultation.' : 'Thank you for your message! We will get back to you soon.'
    ]);
    
    // Auto-responder email to user (optional)
    $auto_reply_subject = "Thank you for contacting " . $website_name;
    $auto_reply_body = "
Hello {$name},

Thank you for contacting {$website_name}. We have received your inquiry about {$service_display} and will get back to you within 24 hours.

Here's a copy of your message:
----------------------------------------
{$message}
----------------------------------------

If you have any urgent questions, please feel free to call us directly.

Best regards,
The {$website_name} Team

---
This is an automated response. Please do not reply to this email.
";

    $auto_reply_headers = [
        'From: ' . $website_name . ' <noreply@' . (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'blinkingstars.in') . '>',
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8'
    ];

    @mail($email, $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_reply_headers));
} else {
    // Error response
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Sorry, there was an error sending your message. Please try again later or contact us directly.'
    ]);
}
?>
