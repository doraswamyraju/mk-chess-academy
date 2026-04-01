<?php
require 'db.php'; // Includes CORS headers and DB connection

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

// Get the raw POST data
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
    exit();
}

// Extract the 'action' to determine which form was submitted
$action = isset($data['action']) ? $data['action'] : '';

switch ($action) {
    case 'submit_lead':
        // Handle "Request a Demo" and "Contact Us" forms
        $name    = isset($data['name'])    ? trim($data['name'])    : '';
        $email   = isset($data['email'])   ? trim($data['email'])   : '';
        $phone   = isset($data['phone'])   ? trim($data['phone'])   : '';
        $message = isset($data['message']) ? trim($data['message']) : '';

        if (empty($name) || empty($email)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Name and Email are required"]);
            exit();
        }

        try {
            // Try inserting with phone column first; fall back gracefully if column doesn't exist yet
            try {
                $stmt = $conn->prepare("INSERT INTO leads (name, email, phone, message) VALUES (:name, :email, :phone, :message)");
                $stmt->bindParam(':name',    $name);
                $stmt->bindParam(':email',   $email);
                $stmt->bindParam(':phone',   $phone);
                $stmt->bindParam(':message', $message);
                $stmt->execute();
            } catch (PDOException $colErr) {
                // If the phone column doesn't exist yet, append phone to message
                $fullMessage = $phone ? "[Phone: $phone] $message" : $message;
                $stmt = $conn->prepare("INSERT INTO leads (name, email, message) VALUES (:name, :email, :message)");
                $stmt->bindParam(':name',    $name);
                $stmt->bindParam(':email',   $email);
                $stmt->bindParam(':message', $fullMessage);
                $stmt->execute();
            }

            echo json_encode(["status" => "success", "message" => "Lead submitted successfully"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
        }
        break;

    case 'submit_enrolment':
        // Handle enrollment forms
        $student_name     = isset($data['student_name'])     ? trim($data['student_name'])     : '';
        $parent_email     = isset($data['parent_email'])     ? trim($data['parent_email'])     : '';
        $phone            = isset($data['phone'])            ? trim($data['phone'])            : '';
        $course_name      = isset($data['course_name'])      ? trim($data['course_name'])      : '';
        $student_type     = isset($data['student_type'])     ? trim($data['student_type'])     : 'indian';
        $country_timezone = isset($data['country_timezone']) ? trim($data['country_timezone']) : null;

        if (empty($student_name) || empty($parent_email)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Student Name and Parent Email are required"]);
            exit();
        }

        try {
            // Try with phone + course_name columns first
            try {
                $stmt = $conn->prepare("INSERT INTO enrolments (student_name, parent_email, phone, course_name, student_type, country_timezone) VALUES (:student_name, :parent_email, :phone, :course_name, :student_type, :country_timezone)");
                $stmt->bindParam(':student_name',     $student_name);
                $stmt->bindParam(':parent_email',     $parent_email);
                $stmt->bindParam(':phone',            $phone);
                $stmt->bindParam(':course_name',      $course_name);
                $stmt->bindParam(':student_type',     $student_type);
                $stmt->bindParam(':country_timezone', $country_timezone);
                $stmt->execute();
            } catch (PDOException $colErr) {
                // Fallback: append extra info to country_timezone field
                $extra = ($phone ? "Phone:$phone " : '') . ($course_name ? "Course:$course_name " : '') . ($country_timezone ?? '');
                $stmt = $conn->prepare("INSERT INTO enrolments (student_name, parent_email, student_type, country_timezone) VALUES (:student_name, :parent_email, :student_type, :country_timezone)");
                $stmt->bindParam(':student_name',     $student_name);
                $stmt->bindParam(':parent_email',     $parent_email);
                $stmt->bindParam(':student_type',     $student_type);
                $stmt->bindParam(':country_timezone', $extra);
                $stmt->execute();
            }

            echo json_encode(["status" => "success", "message" => "Enrolment application submitted successfully"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid action specified"]);
        break;
}
?>
