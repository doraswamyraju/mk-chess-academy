<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

$rawData = file_get_contents("php://input");
$jsonData = json_decode($rawData, true);

$action = $_GET['action'] ?? ($_POST['action'] ?? ($jsonData['action'] ?? null));

$response = ['status' => 'error', 'message' => 'Invalid action'];

switch ($action) {
    case 'get_public_content':
        // Fetch active announcements
        $announcements = [];
        try {
            $stmt = $conn->query("SELECT id, title, message, link FROM announcements WHERE is_active = 1 ORDER BY created_at DESC");
            $announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            // Ignore if table doesn't exist yet
        }

        // Fetch published blogs
        $blogs = [];
        try {
            $stmt = $conn->query("SELECT id, title, category, excerpt, image_url, created_at FROM blog_posts WHERE is_published = 1 ORDER BY created_at DESC LIMIT 6");
            $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {}

        // Fetch FAQs
        $faqs = [];
        try {
            $stmt = $conn->query("SELECT id, question, answer FROM faqs WHERE is_active = 1 ORDER BY display_order ASC");
            $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {}

        // Fetch Gallery
        $gallery = [];
        try {
            $stmt = $conn->query("SELECT id, title, description, image_url FROM gallery WHERE is_active = 1 ORDER BY created_at DESC LIMIT 12");
            $gallery = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {}

        // Fetch Testimonials
        $testimonials = [];
        try {
            $stmt = $conn->query("SELECT id, student_name, course_taken, review_text, avatar_url, rating FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC LIMIT 6");
            $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {}

        // Fetch Courses
        $courses = [];
        try {
            $stmt = $conn->query("SELECT id, title, level, features FROM courses WHERE is_active = 1 ORDER BY id ASC");
            $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {}

        // Fetch Coaches
        $coaches = [];
        try {
            $stmt = $conn->query("SELECT id, name, role, bio, achievements, image_url FROM coaches WHERE is_active = 1 ORDER BY created_at ASC");
            $coaches = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {}

        // Fetch Puzzles
        $puzzles = [];
        try {
            $stmt = $conn->query("SELECT * FROM puzzles WHERE is_active = 1 ORDER BY created_at DESC");
            $puzzles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Map solution from string to array if it's stored as JSON string
            foreach ($puzzles as &$p) {
                $p['solution'] = json_decode($p['solution'], true) ?: [$p['solution']];
                $p['is_weekly'] = (int)$p['is_weekly'];
            }
        } catch (Exception $e) {}

        $response = [
            'status' => 'success',
            'announcements' => $announcements,
            'blogs' => $blogs,
            'faqs' => $faqs,
            'gallery' => $gallery,
            'testimonials' => $testimonials,
            'courses' => $courses,
            'coaches' => $coaches,
            'puzzles' => $puzzles
        ];
        break;

    case 'get_blog_post':
        $id = $_GET['id'] ?? ($_POST['id'] ?? ($jsonData['id'] ?? null));
        if (!$id) {
            $response = ['status' => 'error', 'message' => 'Post ID is required'];
            break;
        }

        try {
            $stmt = $conn->prepare("SELECT id, title, category, content, image_url, created_at FROM blog_posts WHERE id = ? AND is_published = 1");
            $stmt->execute([$id]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($post) {
                $response = [
                    'status' => 'success',
                    'post' => $post
                ];
            } else {
                $response = ['status' => 'error', 'message' => 'Post not found'];
            }
        } catch (Exception $e) {
            $response = ['status' => 'error', 'message' => 'Database error'];
        }
        break;
}

echo json_encode($response);
