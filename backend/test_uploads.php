<?php
// backend/test_uploads.php
header('Content-Type: text/html; charset=UTF-8');

echo "<h2>MK Chess Academy - Uploads Folder Diagnostics</h2>";

$uploadDir = __DIR__ . '/uploads';
echo "<b>Target Directory:</b> " . htmlspecialchars($uploadDir) . "<br>";
echo "<b>Current PHP User:</b> " . htmlspecialchars(get_current_user()) . " (UID: " . posix_getuid() . ", GID: " . posix_getgid() . ")<br><br>";

// 1. Directory Existence
if (is_dir($uploadDir)) {
    echo "<span style='color:green;'>✔ Directory exists.</span><br>";
    echo "<b>Permissions:</b> " . substr(sprintf('%o', fileperms($uploadDir)), -4) . "<br>";
    
    $owner = posix_getpwuid(fileowner($uploadDir));
    $group = posix_getgrgid(filegroup($uploadDir));
    echo "<b>Owner:</b> " . htmlspecialchars($owner['name']) . "<br>";
    echo "<b>Group:</b> " . htmlspecialchars($group['name']) . "<br><br>";
} else {
    echo "<span style='color:red;'>✘ Directory does not exist!</span><br><br>";
}

// 2. Test Write Ability
echo "<b>Testing Write Ability...</b><br>";
$testFile = $uploadDir . '/test_write.txt';
if (@file_put_contents($testFile, "Write test successful at " . date('Y-m-d H:i:s'))) {
    echo "<span style='color:green;'>✔ Success: Wrote test file to uploads folder.</span><br>";
    @unlink($testFile);
} else {
    echo "<span style='color:red;'>✘ Error: Failed to write test file! Please check folder permissions.</span><br>";
}

// 3. List All Files
echo "<br><b>Files in uploads directory:</b><br>";
if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    $fileCount = 0;
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $filePath = $uploadDir . '/' . $file;
        $size = filesize($filePath);
        echo "- " . htmlspecialchars($file) . " (" . $size . " bytes)<br>";
        $fileCount++;
    }
    if ($fileCount === 0) {
        echo "<i>(Directory is empty)</i><br>";
    }
} else {
    echo "<i>(Cannot list files as directory doesn't exist)</i><br>";
}
?>
