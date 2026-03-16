<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
    exit();
}

$action = isset($data['action']) ? $data['action'] : '';

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
        $username = isset($data['username']) ? trim($data['username']) : '';
        $password = isset($data['password']) ? trim($data['password']) : '';

        try {
            $stmt = $conn->prepare("SELECT * FROM admin_users WHERE username = :username LIMIT 1");
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($admin && password_verify($password, $admin['password_hash'])) {
                // Simple token generation
                echo json_encode(["status" => "success", "token" => "mkca_admin_token_123"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Database error"]);
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
        try {
            $stmt = $conn->prepare("INSERT INTO blog_posts (title, category, excerpt, image_url, is_published) VALUES (:t, :c, :e, :i, :p)");
            $stmt->execute([':t' => $b['title'], ':c' => $b['category'], ':e' => $b['excerpt'], ':i' => $b['image_url'], ':p' => $b['is_published']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'update_blog':
        verifyToken($data, $conn);
        $b = $data['blog'];
        try {
            $stmt = $conn->prepare("UPDATE blog_posts SET title=:t, category=:c, excerpt=:e, image_url=:i, is_published=:p WHERE id=:id");
            $stmt->execute([':t' => $b['title'], ':c' => $b['category'], ':e' => $b['excerpt'], ':i' => $b['image_url'], ':p' => $b['is_published'], ':id' => $b['id']]);
            echo json_encode(["status" => "success"]);
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
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) { echo json_encode(["status" => "error", "message" => $e->getMessage()]); }
        break;

    case 'update_announcement':
        verifyToken($data, $conn);
        $a = $data['announcement'];
        try {
            $stmt = $conn->prepare("UPDATE announcements SET title=:t, message=:m, is_active=:a WHERE id=:id");
            $stmt->execute([':t' => $a['title'], ':m' => $a['message'], ':a' => $a['is_active'], ':id' => $a['id']]);
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

    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid action specified"]);
        break;
}
?>
