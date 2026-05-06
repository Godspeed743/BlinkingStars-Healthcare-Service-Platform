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

// Email subject prefix
$subject_prefix = "[Popup Form]";

// ===============================
// FORM PROCESSING
// ===============================

// Get form data and sanitize
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
$service = isset($_POST['service']) ? strip_tags(trim($_POST['service'])) : '';
$age = isset($_POST['age']) ? strip_tags(trim($_POST['age'])) : '';
$website_hp = isset($_POST['website']) ? trim($_POST['website']) : '';

// Normalize phone to last 10 digits
if (!empty($phone)) {
    $digitsOnly = preg_replace('/\D+/', '', $phone);
    if (strlen($digitsOnly) > 10) {
        $digitsOnly = substr($digitsOnly, -10);
    }
    $phone = $digitsOnly;
}

// Honeypot spam check
if (!empty($website_hp)) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Thank you!']);
    exit;
}

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = "Name is required";
}

if (empty($phone)) {
    $errors[] = "Phone number is required";
} elseif (!preg_match('/^\d{10}$/', $phone)) {
    $errors[] = "Phone number must be exactly 10 digits";
}

if (empty($service)) {
    $errors[] = "Service selection is required";
}

if (empty($age)) {
    $errors[] = "Child's age is required";
} elseif (!is_numeric($age) || $age < 1) {
    $errors[] = "Age must be Greater than 1";
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

// Debug logging (remove in production)
error_log("Popup Form - Service selected: " . $service);
error_log("Popup Form - Service display: " . $service_display);

// Email subject
$subject = $subject_prefix . " New lead from " . $name;

// Email body
$email_body = "
New Popup Form Submission from {$website_name}

=====================================
LEAD DETAILS
=====================================
Name: {$name}
Phone: {$phone}
Service Interested In: {$service_display}
Age: {$age} years

=====================================
SUBMISSION DETAILS
=====================================
Date: " . date('Y-m-d H:i:s') . "
IP Address: " . $_SERVER['REMOTE_ADDR'] . "
User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "
Form Type: Popup Contact Form

=====================================
QUICK ACTION REQUIRED
=====================================
This is a high-intent lead from the popup form. 
Please contact them within 24 hours for best conversion.

=====================================
";

// Email headers
$headers = [
    'From: ' . $website_name . ' <noreply@' . $_SERVER['HTTP_HOST'] . '>',
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// ===============================
// SEND EMAIL
// ===============================

$mail_sent = mail($your_email, $subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Success response
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you! We will contact you within 24 hours for your free consultation.'
    ]);
} else {
    // Error response
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Sorry, there was an error sending your request. Please try again later.'
    ]);
}

// Auto-responder SMS/WhatsApp message (optional)
// You can integrate with SMS/WhatsApp API here to send immediate confirmation
?>
