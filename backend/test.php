<?php
include_once 'db.php';

// If we got here, db.php connected successfully
echo json_encode([
    "status" => "success", 
    "message" => "Backend API is connected successfully!",
    "environment" => ($_SERVER['SERVER_NAME'] == 'localhost') ? "Local XAMPP" : "Live Server"
]);
?>