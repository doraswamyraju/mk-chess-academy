<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// If data is null, it might be a multipart/form-data request
if (!$data && !empty($_POST)) {
    $data = $_POST;
    // For file uploads the JSON structure we used was nested (e.g. data['blog']['title']).
    // To support the new FormData flat structure, we map it into a 'blog' object if it's a blog action.
    if (isset($data['action'])) {
        if (in_array($data['action'], ['add_blog', 'update_blog'])) {
            $data['blog'] = [
                'id' => $data['id'] ?? null,
                'title' => $data['title'] ?? '',
                'category' => $data['category'] ?? '',
                'excerpt' => $data['excerpt'] ?? '',
                'content' => $data['content'] ?? '',
                'is_published' => $data['is_published'] ?? 0,
                'image_url' => $data['existing_image'] ?? ''
            ];
        } else if (in_array($data['action'], ['add_announcement', 'update_announcement'])) {
            $data['announcement'] = [
                'id' => $data['id'] ?? null,
                'title' => $data['title'] ?? '',
                'message' => $data['message'] ?? '',
                'is_active' => $data['is_active'] ?? 0
            ];
        } else if (in_array($data['action'], ['add_coach', 'update_coach'])) {
            $data['coach'] = [
                'id' => $data['id'] ?? null,
                'name' => $data['name'] ?? '',
                'role' => $data['role'] ?? '',
                'bio' => $data['bio'] ?? '',
                'achievements' => $data['achievements'] ?? '',
                'is_active' => isset($data['is_active']) ? intval($data['is_active']) : 0,
                'existing_image' => $data['existing_image'] ?? ''
            ];
        }
    }
}

if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid payload"]);
    exit();
}

$action = isset($data['action']) ? $data['action'] : '';

// --- HELPER FOR UPLOADS ---
function handleImageUpload($fileFieldName) {
    if (isset($_FILES[$fileFieldName]) && $_FILES[$fileFieldName]['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $fileName = time() . '_' . basename($_FILES[$fileFieldName]['name']);
        // Sanitize file name
        $fileName = preg_replace('/[^a-zA-Z0-9.\-_]/', '', $fileName);
        $targetFilePath = $uploadDir . $fileName;
        
        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        $allowTypes = array('jpg', 'png', 'jpeg', 'gif', 'webp', 'svg');
        
        if (in_array($fileType, $allowTypes)) {
            if (move_uploaded_file($_FILES[$fileFieldName]['tmp_name'], $targetFilePath)) {
                // Return relative URL from the backend folder
                return '/backend/uploads/' . $fileName;
            }
        }
    }
    return null;
}

// 1. Authentication Check Helper
function verifyToken($data, $conn) {
    // For this simple implementation, we just expect a valid 'adminToken' string
    // In production, use JWT or proper sessions
    if (!isset($data['token']) || empty($data['token'])) {
        http_response_code(401);
        echo json_encode(["status" => "unauthorized", "message" => "Authentication required"]);
        exit();
    }
    // Very simple check: In our login, we issue 'mkca_admin_token_123'
    if ($data['token'] !== 'mkca_admin_token_123') {
        http_response_code(401);
        echo json_encode(["status" => "unauthorized", "message" => "Invalid token"]);
        exit();
    }
}

switch ($action) {
    // --- AUTHENTICATION ---
    case 'login':
        $email = isset($data['email']) ? trim($data['email']) : '';
        $password = isset($data['password']) ? trim($data['password']) : '';

        try {
            $stmt = $conn->prepare("SELECT * FROM admin_users WHERE email = :email LIMIT 1");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($admin && password_verify($password, $admin['password_hash'])) {
                // Set simple token
                echo json_encode(["status" => "success", "token" => "mkca_admin_token_123"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
        }
        break;

    case 'forgot_password':
        $email = isset($data['email']) ? trim($data['email']) : '';
        try {
            // Check if email exists
            $stmt = $conn->prepare("SELECT id FROM admin_users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($admin) {
                // Generate secure token
                $token = bin2hex(random_bytes(32));
                
                // Save token to DB with 1 hour expiration
                $update = $conn->prepare("UPDATE admin_users SET reset_token = :token, reset_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = :id");
                $update->execute([':token' => $token, ':id' => $admin['id']]);

                // Send Email via native mail()
                $resetLink = "https://mkchessacademy.com/admin/reset-password?token=" . $token;
                
                $to = $email;
                $subject = "Password Reset Request - MK Chess Academy";
                
                $message = "
                <html>
                <head><title>Password Reset</title></head>
                <body>
                    <p>Hello Admin,</p>
                    <p>We received a request to reset your MKCA dashboard password.</p>
                    <p>Click the link below to set a new password. This link will expire in 1 hour.</p>
                    <p><a href='$resetLink'>$resetLink</a></p>
                    <br>
                    <p>If you did not request a password reset, you can safely ignore this email.</p>
                </body>
                </html>
                ";

                // Standard headers for HTML email
                $headers = "MIME-Version: 1.0" . "\r\n";
                $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
                // Optionally define From header based on server config
                $headers .= "From: no-reply@mkchessacademy.com\r\n";

                // Silence errors if mail system is not configured on local dev env
                @mail($to, $subject, $message, $headers);
            }
            
            // Always return success to prevent email enumeration
            echo json_encode(["status" => "success"]);
            
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Error processing request."]);
        }
        break;

    case 'reset_password':
        $token = isset($data['token']) ? trim($data['token']) : '';
        $newPassword = isset($data['password']) ? trim($data['password']) : '';

        if(empty($token) || empty($newPassword)) {
            echo json_encode(["status" => "error", "message" => "Missing token or password"]);
            break;
        }

        try {
            // Validate token and not expired
            $stmt = $conn->prepare("SELECT id FROM admin_users WHERE reset_token = :token AND reset_expires > NOW() LIMIT 1");
            $stmt->execute([':token' => $token]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($admin) {
                // Hash new password
                $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
                
                // Update password and clear tokens
                $update = $conn->prepare("UPDATE admin_users SET password_hash = :hash, reset_token = NULL, reset_expires = NULL WHERE id = :id");
                $update->execute([':hash' => $newHash, ':id' => $admin['id']]);
                
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Invalid or expired reset token"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Database error."]);
        }
        break;

    // --- DASHBOARD OVERVIEW ---
    case 'get_stats':
        verifyToken($data, $conn);
        try {
            $leads = $conn->query("SELECT COUNT(*) FROM leads WHERE status = 'new'")->fetchColumn();
            $enrolments = $conn->query("SELECT COUNT(*) FROM enrolments WHERE status = 'pending'")->fetchColumn();
            $courses = $conn->query("SELECT COUNT(*) FROM courses WHERE is_active = 1")->fetchColumn();
            $blogs = $conn->query("SELECT COUNT(*) FROM blog_posts WHERE is_published = 1")->fetchColumn();

            echo json_encode([
                "status" => "success", 
                "stats" => ["leads" => $leads, "enrolments" => $enrolments, "courses" => $courses, "blogs" => $blogs]
            ]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    // --- LEADS MANAGEMENT ---
    case 'get_leads':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->query("SELECT * FROM leads ORDER BY created_at DESC");
            echo json_encode(["status" => "success", "leads" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'update_lead_status':
        verifyToken($data, $conn);
        $id = $data['id']; $status = $data['status'];
        try {
            $stmt = $conn->prepare("UPDATE leads SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $status, ':id' => $id]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'update_lead':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("UPDATE leads SET name=:n, email=:e, message=:m, status=:s WHERE id=:id");
            $stmt->execute([':n' => $data['name'], ':e' => $data['email'], ':m' => $data['message'], ':s' => $data['status'], ':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'delete_lead':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("DELETE FROM leads WHERE id = :id");
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    // --- ENROLMENTS MANAGEMENT ---
    case 'get_enrolments':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->query("SELECT * FROM enrolments ORDER BY created_at DESC");
            echo json_encode(["status" => "success", "enrolments" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'update_enrolment_status':
        verifyToken($data, $conn);
        $id = $data['id']; $status = $data['status'];
        try {
            $stmt = $conn->prepare("UPDATE enrolments SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $status, ':id' => $id]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'update_enrolment':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("UPDATE enrolments SET student_name=:sn, parent_email=:pe, student_type=:st, country_timezone=:ct, status=:s WHERE id=:id");
            $stmt->execute([':sn' => $data['student_name'], ':pe' => $data['parent_email'], ':st' => $data['student_type'], ':ct' => $data['country_timezone'], ':s' => $data['status'], ':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'delete_enrolment':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("DELETE FROM enrolments WHERE id = :id");
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    // --- COURSES MANAGEMENT ---
    case 'get_courses':
        try { // Public, no token needed to read
            $stmt = $conn->query("SELECT * FROM courses ORDER BY id DESC");
            echo json_encode(["status" => "success", "courses" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'add_course':
        verifyToken($data, $conn);
        $c = $data['course'];
        try {
            $stmt = $conn->prepare("INSERT INTO courses (title, level, features, is_active) VALUES (:t, :l, :f, :a)");
            $stmt->execute([':t' => $c['title'], ':l' => $c['level'], ':f' => $c['features'], ':a' => $c['is_active']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'update_course':
        verifyToken($data, $conn);
        $c = $data['course'];
        try {
            $stmt = $conn->prepare("UPDATE courses SET title=:t, level=:l, features=:f, is_active=:a WHERE id=:id");
            $stmt->execute([':t' => $c['title'], ':l' => $c['level'], ':f' => $c['features'], ':a' => $c['is_active'], ':id' => $c['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'delete_course':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("DELETE FROM courses WHERE id = :id");
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    // --- BLOG MANAGEMENT ---
    case 'get_blogs':
        try { // Public
            $stmt = $conn->query("SELECT * FROM blog_posts ORDER BY created_at DESC");
            echo json_encode(["status" => "success", "blogs" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'add_blog':
        verifyToken($data, $conn);
        $b = $data['blog'];
        $uploadedPath = handleImageUpload('image');
        $imageUrl = $uploadedPath ? $uploadedPath : $b['image_url'];

        try {
            $stmt = $conn->prepare("INSERT INTO blog_posts (title, category, excerpt, content, image_url, is_published) VALUES (:t, :c, :e, :ct, :i, :p)");
            $stmt->execute([':t' => $b['title'], ':c' => $b['category'], ':e' => $b['excerpt'], ':ct' => $b['content'] ?? '', ':i' => $imageUrl, ':p' => $b['is_published']]);
            echo json_encode(["status" => "success", "image_url" => $imageUrl]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'update_blog':
        verifyToken($data, $conn);
        $b = $data['blog'];
        $uploadedPath = handleImageUpload('image');
        $imageUrl = $uploadedPath ? $uploadedPath : $b['image_url'];

        try {
            $stmt = $conn->prepare("UPDATE blog_posts SET title=:t, category=:c, excerpt=:e, content=:ct, image_url=:i, is_published=:p WHERE id=:id");
            $stmt->execute([':t' => $b['title'], ':c' => $b['category'], ':e' => $b['excerpt'], ':ct' => $b['content'] ?? '', ':i' => $imageUrl, ':p' => $b['is_published'], ':id' => $b['id']]);
            echo json_encode(["status" => "success", "image_url" => $imageUrl]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'delete_blog':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("DELETE FROM blog_posts WHERE id = :id");
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    // --- ANNOUNCEMENTS MANAGEMENT ---
    case 'get_announcements':
        try { // Public
            $stmt = $conn->query("SELECT * FROM announcements ORDER BY created_at DESC");
            echo json_encode(["status" => "success", "announcements" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'add_announcement':
        verifyToken($data, $conn);
        $a = $data['announcement'];
        try {
            $stmt = $conn->prepare("INSERT INTO announcements (title, message, is_active) VALUES (:t, :m, :a)");
            $stmt->execute([':t' => $a['title'], ':m' => $a['message'], ':a' => $a['is_active']]);
            
            // Handle multiple images to sync with gallery
            if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
                $total = count($_FILES['images']['name']);
                for ($i = 0; $i < $total; $i++) {
                    if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
                        $uploadDir = __DIR__ . '/uploads/';
                        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
                        $fileName = time() . '_' . $i . '_' . preg_replace('/[^a-zA-Z0-9.\-_]/', '', basename($_FILES['images']['name'][$i]));
                        $targetFilePath = $uploadDir . $fileName;
                        
                        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
                        $allowTypes = array('jpg', 'png', 'jpeg', 'gif', 'webp', 'svg');
                        
                        if (in_array($fileType, $allowTypes)) {
                            if (move_uploaded_file($_FILES['images']['tmp_name'][$i], $targetFilePath)) {
                                $imageUrl = '/backend/uploads/' . $fileName;
                                $gstmt = $conn->prepare("INSERT INTO gallery (title, description, image_url, is_active) VALUES (:t, :d, :i, 1)");
                                $gstmt->execute([
                                    ':t' => "Announcement: " . $a['title'], 
                                    ':d' => $a['message'], 
                                    ':i' => $imageUrl
                                ]);
                            }
                        }
                    }
                }
            }

            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'update_announcement':
        verifyToken($data, $conn);
        $a = $data['announcement'];
        try {
            $stmt = $conn->prepare("UPDATE announcements SET title=:t, message=:m, is_active=:a WHERE id=:id");
            $stmt->execute([':t' => $a['title'], ':m' => $a['message'], ':a' => $a['is_active'], ':id' => $a['id']]);
            
            // Handle multiple images to sync with gallery
            if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
                $total = count($_FILES['images']['name']);
                for ($i = 0; $i < $total; $i++) {
                    if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
                        $uploadDir = __DIR__ . '/uploads/';
                        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
                        $fileName = time() . '_' . $i . '_' . preg_replace('/[^a-zA-Z0-9.\-_]/', '', basename($_FILES['images']['name'][$i]));
                        $targetFilePath = $uploadDir . $fileName;
                        
                        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
                        $allowTypes = array('jpg', 'png', 'jpeg', 'gif', 'webp', 'svg');
                        
                        if (in_array($fileType, $allowTypes)) {
                            if (move_uploaded_file($_FILES['images']['tmp_name'][$i], $targetFilePath)) {
                                $imageUrl = '/backend/uploads/' . $fileName;
                                $gstmt = $conn->prepare("INSERT INTO gallery (title, description, image_url, is_active) VALUES (:t, :d, :i, 1)");
                                $gstmt->execute([
                                    ':t' => "Announcement: " . $a['title'], 
                                    ':d' => $a['message'], 
                                    ':i' => $imageUrl
                                ]);
                            }
                        }
                    }
                }
            }

            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'delete_announcement':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("DELETE FROM announcements WHERE id = :id");
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    // --- FAQS MANAGEMENT ---
    case 'get_faqs':
        try { // Public
            $stmt = $conn->query("SELECT * FROM faqs ORDER BY display_order ASC, created_at DESC");
            echo json_encode(["status" => "success", "faqs" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'add_faq':
        verifyToken($data, $conn);
        $f = $data['faq'];
        try {
            $stmt = $conn->prepare("INSERT INTO faqs (question, answer, display_order, is_active) VALUES (:q, :a, :d, :v)");
            $stmt->execute([':q' => $f['question'], ':a' => $f['answer'], ':d' => $f['display_order'], ':v' => $f['is_active']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'update_faq':
        verifyToken($data, $conn);
        $f = $data['faq'];
        try {
            $stmt = $conn->prepare("UPDATE faqs SET question=:q, answer=:a, display_order=:d, is_active=:v WHERE id=:id");
            $stmt->execute([':q' => $f['question'], ':a' => $f['answer'], ':d' => $f['display_order'], ':v' => $f['is_active'], ':id' => $f['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'delete_faq':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("DELETE FROM faqs WHERE id = :id");
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    // --- GALLERY MANAGEMENT ---
    case 'get_gallery':
        try { // Public
            $stmt = $conn->query("SELECT * FROM gallery ORDER BY created_at DESC");
            echo json_encode(["status" => "success", "gallery" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'add_gallery':
        verifyToken($data, $conn);
        $uploadedPath = handleImageUpload('image');
        // fallback to existing_image isn't strictly needed for add, but keeps logic uniform if reusing code
        $imageUrl = $uploadedPath ? $uploadedPath : ($data['existing_image'] ?? '');
        try {
            $stmt = $conn->prepare("INSERT INTO gallery (title, description, image_url, is_active) VALUES (:t, :d, :i, :v)");
            $stmt->execute([':t' => $data['title'], ':d' => $data['description'], ':i' => $imageUrl, ':v' => $data['is_active']]);
            echo json_encode(["status" => "success", "image_url" => $imageUrl]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'update_gallery':
        verifyToken($data, $conn);
        $uploadedPath = handleImageUpload('image');
        $imageUrl = $uploadedPath ? $uploadedPath : ($data['existing_image'] ?? '');
        try {
            $stmt = $conn->prepare("UPDATE gallery SET title=:t, description=:d, image_url=:i, is_active=:v WHERE id=:id");
            $stmt->execute([':t' => $data['title'], ':d' => $data['description'], ':i' => $imageUrl, ':v' => $data['is_active'], ':id' => $data['id']]);
            echo json_encode(["status" => "success", "image_url" => $imageUrl]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'delete_gallery':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("DELETE FROM gallery WHERE id = :id");
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    // --- TESTIMONIALS MANAGEMENT ---
    case 'get_testimonials':
        try { // Public
            $stmt = $conn->query("SELECT * FROM testimonials ORDER BY created_at DESC");
            echo json_encode(["status" => "success", "testimonials" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'add_testimonial':
        verifyToken($data, $conn);
        $uploadedPath = handleImageUpload('image');
        $avatarUrl = $uploadedPath ? $uploadedPath : ($data['existing_image'] ?? '');
        try {
            $stmt = $conn->prepare("INSERT INTO testimonials (student_name, course_taken, review_text, avatar_url, rating, is_active) VALUES (:n, :c, :r, :a, :rt, :v)");
            $stmt->execute([':n' => $data['student_name'], ':c' => $data['course_taken'], ':r' => $data['review_text'], ':a' => $avatarUrl, ':rt' => $data['rating'], ':v' => $data['is_active']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'update_testimonial':
        verifyToken($data, $conn);
        $uploadedPath = handleImageUpload('image');
        $avatarUrl = $uploadedPath ? $uploadedPath : ($data['existing_image'] ?? '');
        try {
            $stmt = $conn->prepare("UPDATE testimonials SET student_name=:n, course_taken=:c, review_text=:r, avatar_url=:a, rating=:rt, is_active=:v WHERE id=:id");
            $stmt->execute([':n' => $data['student_name'], ':c' => $data['course_taken'], ':r' => $data['review_text'], ':a' => $avatarUrl, ':rt' => $data['rating'], ':v' => $data['is_active'], ':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'delete_testimonial':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("DELETE FROM testimonials WHERE id = :id");
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;



    // --- COACHES MANAGEMENT ---
    case 'get_coaches':
        try { // Public
            $stmt = $conn->query("SELECT * FROM coaches ORDER BY created_at ASC");
            echo json_encode(["status" => "success", "coaches" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'add_coach':
        verifyToken($data, $conn);
        $c = $data['coach'];
        $uploadedPath = handleImageUpload('image');
        $imageUrl = $uploadedPath ? $uploadedPath : ($c['existing_image'] ?? '');
        try {
            $stmt = $conn->prepare("INSERT INTO coaches (name, role, bio, achievements, image_url, is_active) VALUES (:n, :r, :b, :ach, :i, :a)");
            $stmt->execute([':n' => $c['name'], ':r' => $c['role'], ':b' => $c['bio'], ':ach' => $c['achievements'], ':i' => $imageUrl, ':a' => $c['is_active']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'update_coach':
        verifyToken($data, $conn);
        $c = $data['coach'];
        $uploadedPath = handleImageUpload('image');
        $imageUrl = $uploadedPath ? $uploadedPath : ($c['existing_image'] ?? '');
        try {
            $stmt = $conn->prepare("UPDATE coaches SET name=:n, role=:r, bio=:b, achievements=:ach, image_url=:i, is_active=:a WHERE id=:id");
            $stmt->execute([':n' => $c['name'], ':r' => $c['role'], ':b' => $c['bio'], ':ach' => $c['achievements'], ':i' => $imageUrl, ':a' => $c['is_active'], ':id' => $c['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'delete_coach':
        verifyToken($data, $conn);
        try {
            $stmt = $conn->prepare("DELETE FROM coaches WHERE id = :id");
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid action specified"]);
        break;
}
?>
