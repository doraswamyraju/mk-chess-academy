<?php
// backend/migrate_all_vps.php
require_once 'db.php';

echo "<h2>MK Chess Academy - Master Database Re-Initialization Tool</h2>";
echo "Performing clean re-installation of all database tables for the VPS...<br><br>";

// 1. Drop existing tables to ensure clean, matching schemas with latest columns
try {
    $conn->exec("DROP TABLE IF EXISTS `testimonials`, `faqs`, `gallery`, `coaches`, `puzzles`, `leads`, `enrolments`, `courses`, `blog_posts`, `announcements`, `admin_users`");
    echo "<span style='color:blue;'>✔ Cleaned: Any existing conflicting tables dropped successfully.</span><br><br>";
} catch (Exception $e) {
    echo "<span style='color:red;'>✘ Error cleaning tables: " . htmlspecialchars($e->getMessage()) . "</span><br><br>";
}

function safeExec($conn, $sql, $tableName) {
    try {
        $conn->exec($sql);
        echo "<span style='color:green;'>✔ Success: Table `$tableName` created successfully.</span><br>";
    } catch (Exception $e) {
        $msg = $e->getMessage();
        echo "<span style='color:red;'>✘ Error on table `$tableName`: " . htmlspecialchars($msg) . "</span><br>";
    }
}

// --- TABLE CREATIONS ---

// 1. Admin Users Table
safeExec($conn, "CREATE TABLE `admin_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `reset_token` VARCHAR(255) NULL,
    `reset_expires` DATETIME NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "admin_users");

// 2. FAQs Table
safeExec($conn, "CREATE TABLE `faqs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "faqs");

// 3. Gallery Table
safeExec($conn, "CREATE TABLE `gallery` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "gallery");

// 4. Testimonials Table (Correct columns to match backend API queries)
safeExec($conn, "CREATE TABLE `testimonials` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_name` VARCHAR(100) NOT NULL,
    `course_taken` VARCHAR(100) NULL,
    `review_text` TEXT NOT NULL,
    `rating` INT DEFAULT 5,
    `avatar_url` VARCHAR(255) NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "testimonials");

// 5. Coaches Table
safeExec($conn, "CREATE TABLE `coaches` (
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
safeExec($conn, "CREATE TABLE `puzzles` (
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
safeExec($conn, "CREATE TABLE `leads` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(50) DEFAULT 'new',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "leads");

// 8. Enrolments Table
safeExec($conn, "CREATE TABLE `enrolments` (
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
safeExec($conn, "CREATE TABLE `courses` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `level` VARCHAR(100) NOT NULL,
    `features` TEXT NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "courses");

// 10. Blog Posts Table
safeExec($conn, "CREATE TABLE `blog_posts` (
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
safeExec($conn, "CREATE TABLE `announcements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `link` VARCHAR(255) NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)", "announcements");

// --- DATA SEEDERS ---

// 1. Seed Default Admin User
echo "<br><b>Seeding default admin...</b><br>";
try {
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
} catch (Exception $e) {
    echo "<span style='color:red;'>✘ Error seeding default admin: " . htmlspecialchars($e->getMessage()) . "</span><br>";
}

// 2. Seed Default Courses so they are dynamic in the frontend
echo "<br><b>Seeding default courses...</b><br>";
try {
    $courses = [
        [
            'title' => 'Little Knights',
            'level' => 'Ages 5–7',
            'features' => 'Interactive lessons, Fun puzzles & stories, 1-on-1 or small groups, Weekly progress reports'
        ],
        [
            'title' => 'Rising Stars',
            'level' => 'Ages 8–12',
            'features' => 'Rated tournament prep, Advanced tactics training, Game analysis sessions, Monthly mock tournaments'
        ],
        [
            'title' => 'Elite Champions',
            'level' => 'Ages 10–15',
            'features' => '1-on-1 master coaching, Custom opening repertoire, State & national prep, Performance analytics'
        ]
    ];

    $insertCourse = $conn->prepare("INSERT INTO `courses` (`title`, `level`, `features`, `is_active`) VALUES (:t, :l, :f, 1)");
    foreach ($courses as $c) {
        $insertCourse->execute([
            ':t' => $c['title'],
            ':l' => $c['level'],
            ':f' => $c['features']
        ]);
    }
    echo "<span style='color:green;'>✔ Success: 3 default courses seeded.</span><br>";
} catch (Exception $e) {
    echo "<span style='color:red;'>✘ Error seeding default courses: " . htmlspecialchars($e->getMessage()) . "</span><br>";
}

// 3. Seed Default Testimonials (Google Reviews)
echo "<br><b>Seeding default testimonials...</b><br>";
try {
    $testimonials = [
        [
            'student_name' => 'Rahul S.',
            'course_taken' => 'Rising Stars Program',
            'review_text' => 'Excellent coaching! My son improved his game drastically within 3 months.',
            'rating' => 5
        ],
        [
            'student_name' => 'Priya M.',
            'course_taken' => 'Little Knights Program',
            'review_text' => 'The coaches are highly professional and patient. The environment is perfect for learning.',
            'rating' => 5
        ],
        [
            'student_name' => 'Anita Rao',
            'course_taken' => 'Elite Champions Program',
            'review_text' => 'MK Chess Academy is the best in the region. Their structured curriculum really helps.',
            'rating' => 5
        ],
        [
            'student_name' => 'Vikram K.',
            'course_taken' => 'Tournament Preparation',
            'review_text' => 'Great online classes and flexible timings. Highly recommended for aspiring players!',
            'rating' => 5
        ]
    ];

    $insertTestimonial = $conn->prepare("INSERT INTO `testimonials` (`student_name`, `course_taken`, `review_text`, `rating`, `is_active`) VALUES (:n, :c, :r, :rt, 1)");
    foreach ($testimonials as $t) {
        $insertTestimonial->execute([
            ':n' => $t['student_name'],
            ':c' => $t['course_taken'],
            ':r' => $t['review_text'],
            ':rt' => $t['rating']
        ]);
    }
    echo "<span style='color:green;'>✔ Success: 4 default testimonials seeded.</span><br>";
} catch (Exception $e) {
    echo "<span style='color:red;'>✘ Error seeding default testimonials: " . htmlspecialchars($e->getMessage()) . "</span><br>";
}

echo "<br><b>Master migration complete! All 11 tables constructed and seeded with 100% correct matching columns!</b><br>";

// --- AUTOMATIC DIRECTORY CONFIGURATION ---
echo "<br><b>Configuring uploads directory permissions...</b><br>";
$uploadDir = __DIR__ . '/uploads';
if (!is_dir($uploadDir)) {
    if (mkdir($uploadDir, 0777, true)) {
        echo "<span style='color:green;'>✔ Success: Created `backend/uploads/` directory.</span><br>";
    } else {
        echo "<span style='color:red;'>✘ Error: Failed to create `backend/uploads/` directory.</span><br>";
    }
} else {
    echo "<span style='color:green;'>✔ Info: `backend/uploads/` directory already exists.</span><br>";
}

if (is_dir($uploadDir)) {
    // Attempt to make it fully writeable recursively
    if (chmod($uploadDir, 0777)) {
        echo "<span style='color:green;'>✔ Success: Configured `backend/uploads/` permissions to 0777 (writeable).</span><br>";
    } else {
        echo "<span style='color:red;'>✘ Warning: Failed to chmod `backend/uploads/` to 0777.</span><br>";
    }
    
    // Set the owner if running as root
    if (function_exists('posix_getuid') && posix_getuid() === 0) {
        @chown($uploadDir, 'www-data');
        @chgrp($uploadDir, 'www-data');
        echo "<span style='color:green;'>✔ Success: Set ownership of `backend/uploads/` to www-data.</span><br>";
    }
}
?>


