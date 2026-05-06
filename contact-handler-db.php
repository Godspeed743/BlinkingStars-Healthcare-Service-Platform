<?php
// Contact Form Handler with MySQL Database + Email
// This saves to database AND sends email for maximum reliability

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method not allowed');
}

// ===============================
// DATABASE CONFIGURATION - UPDATE THESE
// ===============================

$db_host = 'localhost';        // Usually 'localhost' for XAMPP
$db_username = 'root';         // Usually 'root' for XAMPP
$db_password = '';             // Usually empty for XAMPP
$db_name = 'blinking_stars_db'; // Database name from setup.sql

// ===============================
// EMAIL CONFIGURATION - UPDATE THESE
// ===============================

$your_email = "mohdhammad743@gmail.com";  // CHANGE THIS TO YOUR EMAIL
$website_name = "Blinking Stars";
$subject_prefix = "[Contact Form]";

// ===============================
// FORM PROCESSING & VALIDATION
// ===============================

// Get form data and sanitize
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$service = isset($_POST['service']) ? trim($_POST['service']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Get additional data
$ip_address = $_SERVER['REMOTE_ADDR'];
$user_agent = $_SERVER['HTTP_USER_AGENT'];

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
}

if (empty($service)) {
    $errors[] = "Service selection is required";
}

if (empty($message)) {
    $errors[] = "Message is required";
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// ===============================
// DATABASE CONNECTION & SAVE
// ===============================

try {
    // Connect to database
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_username, $db_password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Prepare and execute insert statement
    $stmt = $pdo->prepare("
        INSERT INTO contact_submissions 
        (name, email, phone, service, message, ip_address, user_agent) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([$name, $email, $phone, $service, $message, $ip_address, $user_agent]);
    
    // Get the ID of the inserted record
    $submission_id = $pdo->lastInsertId();
    
    $database_saved = true;
    
} catch(PDOException $e) {
    $database_saved = false;
    $database_error = $e->getMessage();
    
    // Log database error (optional)
    error_log("Database Error: " . $e->getMessage());
}

// ===============================
// EMAIL COMPOSITION & SENDING
// ===============================

// Map service codes to readable names
$service_names = [
    'aba' => 'ABA Therapy',
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
New Contact Form Submission from {$website_name}

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
Submission ID: " . ($database_saved ? $submission_id : 'Not saved to database') . "
Date: " . date('Y-m-d H:i:s') . "
IP Address: {$ip_address}
User Agent: {$user_agent}

=====================================
DATABASE STATUS
=====================================
Saved to Database: " . ($database_saved ? 'YES' : 'NO') . "
" . (!$database_saved ? "Database Error: {$database_error}" : '') . "

=====================================
";

// Email headers
$headers = [
    'From: ' . $website_name . ' <noreply@' . $_SERVER['HTTP_HOST'] . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// Send email
$email_sent = false;
if (function_exists('mail')) {
    $email_sent = mail($your_email, $subject, $email_body, implode("\r\n", $headers));
} else {
    $email_error = "Mail function not available";
}

// Update database with email status
if ($database_saved && isset($pdo)) {
    try {
        $stmt = $pdo->prepare("UPDATE contact_submissions SET email_sent = ?, email_sent_date = NOW() WHERE id = ?");
        $stmt->execute([$email_sent ? 1 : 0, $submission_id]);
    } catch(PDOException $e) {
        // Ignore update errors for now
    }
}

// ===============================
// RESPONSE TO CLIENT
// ===============================

if ($database_saved || $email_sent) {
    // Success if either database OR email worked
    $response = [
        'success' => true,
        'message' => 'Thank you for your message! We will get back to you soon.',
        'details' => [
            'database_saved' => $database_saved,
            'email_sent' => $email_sent,
            'submission_id' => $database_saved ? $submission_id : null
        ]
    ];
    
    // Send auto-responder email to user
    if ($email_sent) {
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
Reference ID: " . ($database_saved ? $submission_id : 'N/A') . "
This is an automated response. Please do not reply to this email.
";

        $auto_reply_headers = [
            'From: ' . $website_name . ' <noreply@' . $_SERVER['HTTP_HOST'] . '>',
            'X-Mailer: PHP/' . phpversion(),
            'Content-Type: text/plain; charset=UTF-8'
        ];

        mail($email, $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_reply_headers));
    }
    
    echo json_encode($response);
    
} else {
    // Both failed
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error processing your message. Please try again later.',
        'details' => [
            'database_saved' => $database_saved,
            'email_sent' => $email_sent,
            'database_error' => isset($database_error) ? $database_error : null,
            'email_error' => isset($email_error) ? $email_error : null
        ]
    ]);
}

// Close database connection
if (isset($pdo)) {
    $pdo = null;
}
?>
