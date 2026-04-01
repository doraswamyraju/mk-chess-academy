<?php
// backend/migrate_phone_course.php
// Run this once on the server to add phone & course_name columns
require_once 'db.php';

echo "<h2>MK Chess Academy - Column Migration</h2>";

function safeAlter($conn, $sql, $label) {
    try {
        $conn->exec($sql);
        echo "<span style='color:green;'>✔ $label</span><br>";
    } catch (Exception $e) {
        $msg = $e->getMessage();
        if (strpos($msg, 'Duplicate column') !== false || strpos($msg, 'already exists') !== false) {
            echo "<span style='color:blue;'>↷ Already exists: $label</span><br>";
        } else {
            echo "<span style='color:red;'>✘ Error ($label): " . htmlspecialchars($msg) . "</span><br>";
        }
    }
}

echo "<b>Adding phone to leads table...</b><br>";
safeAlter($conn, "ALTER TABLE leads ADD COLUMN phone VARCHAR(20) NULL AFTER email", "leads.phone");

echo "<b>Adding phone to enrolments table...</b><br>";
safeAlter($conn, "ALTER TABLE enrolments ADD COLUMN phone VARCHAR(20) NULL AFTER parent_email", "enrolments.phone");

echo "<b>Adding course_name to enrolments table...</b><br>";
safeAlter($conn, "ALTER TABLE enrolments ADD COLUMN course_name VARCHAR(255) NULL AFTER phone", "enrolments.course_name");

// Also add display_order to faqs if missing
echo "<b>Adding display_order to faqs table...</b><br>";
safeAlter($conn, "ALTER TABLE faqs ADD COLUMN display_order INT DEFAULT 0 AFTER is_active", "faqs.display_order");

echo "<br><b>Migration complete! You can delete this file now.</b>";
?>
