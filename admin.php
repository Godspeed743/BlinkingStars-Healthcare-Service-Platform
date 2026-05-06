<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Submissions - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com/3.4.16"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css">
    <style>
        .fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-gray-50">

<?php
// Simple authentication (for testing only - use proper auth in production)
session_start();
$admin_password = 'admin123'; // CHANGE THIS!

if (isset($_POST['login'])) {
    if ($_POST['password'] === $admin_password) {
        $_SESSION['admin_logged_in'] = true;
    } else {
        $login_error = 'Invalid password';
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Check if logged in
if (!isset($_SESSION['admin_logged_in'])) {
?>
    <!-- Login Form -->
    <div class="min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Admin Login</h1>
                <p class="text-gray-600">Contact Form Management</p>
            </div>
            
            <?php if (isset($login_error)): ?>
                <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
                    <i class="ri-error-warning-line mr-2"></i><?php echo $login_error; ?>
                </div>
            <?php endif; ?>
            
            <form method="POST">
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Password</label>
                    <input type="password" name="password" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none">
                </div>
                <button type="submit" name="login"
                        class="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200">
                    <i class="ri-login-box-line mr-2"></i>Login
                </button>
            </form>
            
            <div class="mt-6 text-center text-sm text-gray-500">
                <p>Default password: admin123</p>
                <p class="text-red-500 mt-2">⚠️ Change this password in production!</p>
            </div>
        </div>
    </div>
<?php
    exit;
}

// Database configuration (same as contact form)
$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'blinking_stars_db';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_username, $db_password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Handle status updates
    if (isset($_POST['update_status'])) {
        $stmt = $pdo->prepare("UPDATE contact_submissions SET status = ? WHERE id = ?");
        $stmt->execute([$_POST['status'], $_POST['submission_id']]);
        $success_message = "Status updated successfully!";
    }
    
    // Get submissions with pagination
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $per_page = 10;
    $offset = ($page - 1) * $per_page;
    
    // Count total submissions
    $count_stmt = $pdo->query("SELECT COUNT(*) FROM contact_submissions");
    $total_submissions = $count_stmt->fetchColumn();
    $total_pages = ceil($total_submissions / $per_page);
    
    // Get submissions
    $stmt = $pdo->prepare("
        SELECT id, name, email, phone, service, message, submission_date, status, email_sent,
               CASE service
                   WHEN 'aba' THEN 'ABA Therapy'
                   WHEN 'physio' THEN 'Physiotherapy'
                   WHEN 'occupational' THEN 'Occupational Therapy'
                   WHEN 'speech' THEN 'Speech Therapy'
                   WHEN 'audiology' THEN 'Audiology Tests'
                   WHEN 'special-ed' THEN 'Special Education'
                   WHEN 'behavior' THEN 'Behavior Therapy'
                   WHEN 'psychological' THEN 'Psychological Assessment'
                   ELSE service
               END as service_name
        FROM contact_submissions 
        ORDER BY submission_date DESC 
        LIMIT ? OFFSET ?
    ");
    $stmt->execute([$per_page, $offset]);
    $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get statistics
    $stats_stmt = $pdo->query("
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
            SUM(CASE WHEN email_sent = 1 THEN 1 ELSE 0 END) as emails_sent,
            COUNT(DISTINCT DATE(submission_date)) as days_active
        FROM contact_submissions
    ");
    $stats = $stats_stmt->fetch(PDO::FETCH_ASSOC);
    
} catch(PDOException $e) {
    $db_error = $e->getMessage();
}
?>

<!-- Admin Dashboard -->
<div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">Contact Form Admin</h1>
                <p class="text-gray-600">Blinking Stars - Submission Management</p>
            </div>
            <a href="?logout=1" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200">
                <i class="ri-logout-box-line mr-2"></i>Logout
            </a>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-8">
        
        <?php if (isset($success_message)): ?>
            <div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6 fade-in">
                <i class="ri-checkbox-circle-line mr-2"></i><?php echo $success_message; ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($db_error)): ?>
            <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
                <i class="ri-error-warning-line mr-2"></i>Database Error: <?php echo $db_error; ?>
            </div>
        <?php else: ?>
        
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow border">
                <div class="flex items-center">
                    <div class="bg-blue-100 p-3 rounded-full mr-4">
                        <i class="ri-mail-line text-blue-600 text-xl"></i>
                    </div>
                    <div>
                        <p class="text-gray-600 text-sm">Total Submissions</p>
                        <p class="text-2xl font-bold text-gray-800"><?php echo $stats['total']; ?></p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow border">
                <div class="flex items-center">
                    <div class="bg-orange-100 p-3 rounded-full mr-4">
                        <i class="ri-notification-line text-orange-600 text-xl"></i>
                    </div>
                    <div>
                        <p class="text-gray-600 text-sm">New/Unread</p>
                        <p class="text-2xl font-bold text-gray-800"><?php echo $stats['new_count']; ?></p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow border">
                <div class="flex items-center">
                    <div class="bg-green-100 p-3 rounded-full mr-4">
                        <i class="ri-send-plane-line text-green-600 text-xl"></i>
                    </div>
                    <div>
                        <p class="text-gray-600 text-sm">Emails Sent</p>
                        <p class="text-2xl font-bold text-gray-800"><?php echo $stats['emails_sent']; ?></p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow border">
                <div class="flex items-center">
                    <div class="bg-purple-100 p-3 rounded-full mr-4">
                        <i class="ri-calendar-line text-purple-600 text-xl"></i>
                    </div>
                    <div>
                        <p class="text-gray-600 text-sm">Days Active</p>
                        <p class="text-2xl font-bold text-gray-800"><?php echo $stats['days_active']; ?></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Submissions Table -->
        <div class="bg-white rounded-lg shadow border">
            <div class="px-6 py-4 border-b">
                <h2 class="text-lg font-semibold text-gray-800">Recent Submissions</h2>
                <p class="text-gray-600">Page <?php echo $page; ?> of <?php echo $total_pages; ?></p>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <?php foreach ($submissions as $submission): ?>
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4">
                                <div>
                                    <p class="font-medium text-gray-800"><?php echo htmlspecialchars($submission['name']); ?></p>
                                    <p class="text-sm text-gray-600"><?php echo htmlspecialchars($submission['email']); ?></p>
                                    <p class="text-sm text-gray-600"><?php echo htmlspecialchars($submission['phone']); ?></p>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-800">
                                <?php echo htmlspecialchars($submission['service_name']); ?>
                            </td>
                            <td class="px-6 py-4">
                                <p class="text-sm text-gray-800 max-w-xs truncate" title="<?php echo htmlspecialchars($submission['message']); ?>">
                                    <?php echo htmlspecialchars(substr($submission['message'], 0, 100)); ?><?php echo strlen($submission['message']) > 100 ? '...' : ''; ?>
                                </p>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600">
                                <?php echo date('M j, Y g:i A', strtotime($submission['submission_date'])); ?>
                            </td>
                            <td class="px-6 py-4">
                                <form method="POST" class="inline">
                                    <input type="hidden" name="submission_id" value="<?php echo $submission['id']; ?>">
                                    <select name="status" onchange="this.form.submit()" 
                                            class="text-sm border border-gray-300 rounded px-2 py-1 
                                            <?php echo $submission['status'] === 'new' ? 'bg-orange-50 text-orange-800' : 
                                                      ($submission['status'] === 'read' ? 'bg-blue-50 text-blue-800' : 
                                                      ($submission['status'] === 'responded' ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-800')); ?>">
                                        <option value="new" <?php echo $submission['status'] === 'new' ? 'selected' : ''; ?>>New</option>
                                        <option value="read" <?php echo $submission['status'] === 'read' ? 'selected' : ''; ?>>Read</option>
                                        <option value="responded" <?php echo $submission['status'] === 'responded' ? 'selected' : ''; ?>>Responded</option>
                                        <option value="archived" <?php echo $submission['status'] === 'archived' ? 'selected' : ''; ?>>Archived</option>
                                    </select>
                                    <input type="hidden" name="update_status" value="1">
                                </form>
                            </td>
                            <td class="px-6 py-4">
                                <?php if ($submission['email_sent']): ?>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <i class="ri-checkbox-circle-fill mr-1"></i>Sent
                                    </span>
                                <?php else: ?>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <i class="ri-close-circle-fill mr-1"></i>Failed
                                    </span>
                                <?php endif; ?>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <?php if ($total_pages > 1): ?>
            <div class="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
                <div class="text-sm text-gray-600">
                    Showing <?php echo $offset + 1; ?> to <?php echo min($offset + $per_page, $total_submissions); ?> of <?php echo $total_submissions; ?> results
                </div>
                <div class="flex space-x-2">
                    <?php if ($page > 1): ?>
                        <a href="?page=<?php echo $page - 1; ?>" class="px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">Previous</a>
                    <?php endif; ?>
                    
                    <?php for ($i = max(1, $page - 2); $i <= min($total_pages, $page + 2); $i++): ?>
                        <a href="?page=<?php echo $i; ?>" 
                           class="px-3 py-2 border border-gray-300 rounded text-sm <?php echo $i === $page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'; ?>">
                            <?php echo $i; ?>
                        </a>
                    <?php endfor; ?>
                    
                    <?php if ($page < $total_pages): ?>
                        <a href="?page=<?php echo $page + 1; ?>" class="px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">Next</a>
                    <?php endif; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
        
        <?php endif; ?>
    </div>
</div>

</body>
</html>
