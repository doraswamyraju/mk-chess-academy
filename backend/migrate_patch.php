<?php
// backend/migrate_patch.php
// Run this ONCE on the live server to add missing columns.
require_once 'db.php';

echo "<h2>MK Chess Academy - Patch Migration</h2>";
echo "Adding missing columns...<br><br>";

function safeAlter($conn, $label, $sql) {
    echo "<b>$label</b><br>";
    try {
        $conn->exec($sql);
        echo "<span style='color:green;'>Success.</span><br><br>";
    } catch (Exception $e) {
        $msg = $e->getMessage();
        // 1060 = Duplicate column (already exists) — safe to ignore
        if (strpos($msg, 'Duplicate column') !== false || strpos($msg, '1060') !== false) {
            echo "<span style='color:blue;'>Skipped: Column already exists.</span><br><br>";
        } else {
            echo "<span style='color:red;'>Error: " . htmlspecialchars($msg) . "</span><br><br>";
        }
    }
}

// 1. Add `content` column to blog_posts (was missing — only excerpt was stored before)
safeAlter($conn,
    "Adding `content` column to `blog_posts`...",
    "ALTER TABLE `blog_posts` ADD COLUMN `content` LONGTEXT NULL AFTER `excerpt`"
);

// 2. Add `display_order` column to faqs (needed for FAQ ordering)
safeAlter($conn,
    "Adding `display_order` column to `faqs`...",
    "ALTER TABLE `faqs` ADD COLUMN `display_order` INT DEFAULT 0 AFTER `is_active`"
);

echo "<br><b>Patch migration complete!</b><br>";
echo "<a href='javascript:history.back()'>Go Back</a>";
?>
