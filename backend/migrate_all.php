<?php
// backend/migrate_all.php
require_once 'db.php';

echo "<h2>MK Chess Academy Database Migration Tool</h2>";
echo "Starting migration...<br><br>";

function safeExec($conn, $sql) {
    try {
        $conn->exec($sql);
        echo "<span style='color:green;'>Success: Query Executed.</span><br>";
    } catch (Exception $e) {
        $msg = $e->getMessage();
        // Ignore "already exists" errors gracefully
        if(strpos($msg, 'already exists') !== false) {
             echo "<span style='color:blue;'>Skipped: Table already exists.</span><br>";
        } else {
             echo "<span style='color:red;'>Error: " . htmlspecialchars($msg) . "</span><br>";
        }
    }
}

// 1. FAQs Table
echo "<b>Creating `faqs` table...</b><br>";
safeExec($conn, "CREATE TABLE IF NOT EXISTS `faqs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// 2. Gallery Table
echo "<b>Creating `gallery` table...</b><br>";
safeExec($conn, "CREATE TABLE IF NOT EXISTS `gallery` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `image_url` VARCHAR(255) NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// 3. Testimonials Table
echo "<b>Creating `testimonials` table...</b><br>";
safeExec($conn, "CREATE TABLE IF NOT EXISTS `testimonials` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `author_name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(100),
    `content` TEXT NOT NULL,
    `rating` INT DEFAULT 5,
    `image_url` VARCHAR(255),
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// 4. Coaches Table
echo "<b>Creating `coaches` table...</b><br>";
safeExec($conn, "CREATE TABLE IF NOT EXISTS `coaches` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(100) NOT NULL,
    `bio` TEXT NOT NULL,
    `achievements` TEXT,
    `image_url` VARCHAR(255),
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// 5. Puzzles Table
echo "<b>Creating `puzzles` table...</b><br>";
safeExec($conn, "CREATE TABLE IF NOT EXISTS `puzzles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `fen` TEXT NOT NULL,
    `solution` TEXT NOT NULL,
    `difficulty` VARCHAR(50) NOT NULL,
    `theme` VARCHAR(100) NOT NULL,
    `hint` TEXT,
    `is_weekly` TINYINT(1) DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

echo "<br><b>Migration completed! You can now access the Admin Dashboard.</b>";
?>
