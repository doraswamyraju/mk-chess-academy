<?php
// backend/migrate_puzzles_final.php
require_once 'db.php';

echo "<h2>MK Chess Academy Puzzles Table Migration</h2>";

try {
    $sql = "CREATE TABLE IF NOT EXISTS `puzzles` (
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
    )";
    $conn->exec($sql);
    echo "<span style='color:green;'><b>Success: `puzzles` table created or already exists.</b></span><br>";
} catch (Exception $e) {
    echo "<span style='color:red;'><b>Error: " . $e->getMessage() . "</b></span><br>";
}

echo "<br><a href='/Admin Login'>Go back to Dashboard</a>";
?>
