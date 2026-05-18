<?php
// backend/migrate_admin_user.php
require_once 'db.php';

echo "<h2>MK Chess Academy - Admin Seeder</h2>";
echo "Initializing admin authentication table...<br><br>";

try {
    // 1. Create the admin_users table if it does not exist
    $conn->exec("CREATE TABLE IF NOT EXISTS `admin_users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(50) NOT NULL,
        `email` VARCHAR(100) UNIQUE NOT NULL,
        `password_hash` VARCHAR(255) NOT NULL,
        `reset_token` VARCHAR(255) NULL,
        `reset_expires` DATETIME NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "<span style='color:green;'>Success: Created `admin_users` table.</span><br>";

    // 2. Check if the default admin already exists
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
        echo "<span style='color:green;'>Success: Seeded default admin user 'admin@mkchessacademy.com' with password 'MkChessAdmin2026!'.</span><br>";
    } else {
        echo "<span style='color:blue;'>Skipped: Admin user 'admin@mkchessacademy.com' already exists.</span><br>";
    }

    echo "<br><b>Admin initialization complete!</b>";
} catch (Exception $e) {
    echo "<span style='color:red;'>Error: " . htmlspecialchars($e->getMessage()) . "</span><br>";
}
?>
