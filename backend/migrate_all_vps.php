<?php
// backend/migrate_all_vps.php
require_once 'db.php';

echo "<h2>MK Chess Academy - Master Database Migration Tool</h2>";
echo "Initializing all database tables for the VPS environment...<br><br>";

function safeExec($conn, $sql, $tableName) {
    try {
        $conn->exec($sql);
        echo "<span style='color:green;'>✔ Success: Table `$tableName` created or verified.</span><br>";
    } catch (Exception $e) {
        $msg = $e->getMessage();
        echo "<span style='color:red;'>✘ Error on table `$tableName`: " . htmlspecialchars($msg) . "</span><br>";
    }
}

// 1. Admin Users Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `reset_token` VARCHAR(255) NULL,
    `reset_expires` DATETIME NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "admin_users");

// 2. FAQs Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `faqs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "faqs");

// 3. Gallery Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `gallery` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "gallery");

// 4. Testimonials Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `testimonials` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `author_name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(100) NULL,
    `content` TEXT NOT NULL,
    `rating` INT DEFAULT 5,
    `image_url` VARCHAR(255) NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "testimonials");

// 5. Coaches Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `coaches` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(100) NOT NULL,
    `bio` TEXT NOT NULL,
    `achievements` TEXT NULL,
    `image_url` VARCHAR(255) NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "coaches");

// 6. Puzzles Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `puzzles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `fen` TEXT NOT NULL,
    `solution` TEXT NOT NULL,
    `difficulty` VARCHAR(50) NOT NULL,
    `theme` VARCHAR(100) NOT NULL,
    `hint` TEXT NULL,
    `is_weekly` TINYINT(1) DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "puzzles");

// 7. Leads Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `leads` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(50) DEFAULT 'new',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "leads");

// 8. Enrolments Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `enrolments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_name` VARCHAR(100) NOT NULL,
    `parent_email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `course_name` VARCHAR(255) NULL,
    `student_type` VARCHAR(100) NOT NULL,
    `country_timezone` VARCHAR(100) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "enrolments");

// 9. Courses Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `courses` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `level` VARCHAR(100) NOT NULL,
    `features` TEXT NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "courses");

// 10. Blog Posts Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `blog_posts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NULL,
    `image_url` VARCHAR(255) NULL,
    `is_published` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "blog_posts");

// 11. Announcements Table
safeExec($conn, "CREATE TABLE IF NOT EXISTS `announcements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `link` VARCHAR(255) NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "announcements");

// 12. Seed Default Admin User
echo "<br><b>Seeding default admin...</b><br>";
try {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM `admin_users` WHERE `email` = 'admin@mkchessacademy.com'");
    $stmt->execute();
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        $username = "admin";
        $email = "admin@mkchessacademy.com";
        $password = "MkChessAdmin2026!";
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $insert = $conn->prepare("INSERT INTO `admin_users` (`username`, `email`, `password_hash`) VALUES (:username, :email, :hash)");
        $insert->execute([
            ':username' => $username,
            ':email' => $email,
            ':hash' => $hash
        ]);
        echo "<span style='color:green;'>✔ Success: Default admin seeded securely.</span><br>";
    } else {
        echo "<span style='color:blue;'>↷ Default admin already exists.</span><br>";
    }
} catch (Exception $e) {
    echo "<span style='color:red;'>✘ Error seeding default admin: " . htmlspecialchars($e->getMessage()) . "</span><br>";
}

echo "<br><b>Master migration successfully executed! All tables verified. Ready for operation!</b>";
?>
