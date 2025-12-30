<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests (Browser safety check)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Credentials Logic
$host = "localhost"; // Usually 'localhost' for both XAMPP and cPanel

// Detect Environment based on Server Name
if ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '127.0.0.1') {
    // LOCAL (XAMPP)
    $db_name = "mkchess_local";  // You need to create this in phpMyAdmin
    $username = "root";
    $password = "";
} else {
    // LIVE (cPanel)
    // Update these with the actual details from cPanel MySQL Database Wizard
    $db_name = "rajugda1_mkchess"; 
    $username = "rajugda1_mkuser";
    $password = "BOHPM6139n@"; 
}

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit();
}
?>