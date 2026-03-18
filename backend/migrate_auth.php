<?php
// backend/migrate_auth.php
require_once 'db.php';

echo "Starting migration...\n";

function safeExec($conn, $sql) {
    try {
        $conn->exec($sql);
        echo "Success: $sql\n";
    } catch (Exception $e) {
        echo "Ignored: " . $e->getMessage() . "\n";
    }
}

// 1. Add email column
safeExec($conn, "ALTER TABLE `admin_users` ADD COLUMN `email` VARCHAR(100) NULL AFTER `username`");

// 2. Add reset_token and reset_expires
safeExec($conn, "ALTER TABLE `admin_users` ADD COLUMN `reset_token` VARCHAR(255) NULL");
safeExec($conn, "ALTER TABLE `admin_users` ADD COLUMN `reset_expires` DATETIME NULL");

// 3. Set a fallback default email if none exists (required for login to work before manual update)
try {
    $stmt = $conn->prepare("UPDATE `admin_users` SET `email` = 'admin@mkchessacademy.com' WHERE `email` IS NULL");
    $stmt->execute();
    echo "Updated existing admins with a default email address 'admin@mkchessacademy.com'.\n";
} catch (Exception $e) {
    echo "Failed to update emails: " . $e->getMessage() . "\n";
}

// 4. Try making email unique
safeExec($conn, "ALTER TABLE `admin_users` ADD UNIQUE (`email`)");

echo "Migration completed.\n";
?>
