<?php
// db_backup.php
// Uses your existing credentials file
include __DIR__ . '/db_head.php'; // must define $servername, $username, $password, $dbname

// Where to store backups + logs
$backupDir = __DIR__ . '/backups';
if (!is_dir($backupDir)) { mkdir($backupDir, 0775, true); }

$stamp      = date('Y-m-d_H-i-s');
$backupFile = $backupDir . "/backup_{$stamp}.sql";
$logFile    = $backupDir . "/backup_log.txt";

// Try to locate mysqldump
$candidates = [
  '/usr/bin/mysqldump',
  '/bin/mysqldump',
  '/usr/local/bin/mysqldump',
  'mysqldump' // fallback to PATH
];
$mysqldump = null;
foreach ($candidates as $c) {
  // We can't reliably check is_executable() on some shared hosts, so just pick first
  $mysqldump = $c; break;
}

// Build safe command (escape everything!)
$cmd = sprintf(
  '%s --user=%s --password=%s --host=%s --single-transaction --quick --lock-tables=false %s > %s 2>&1',
  $mysqldump,
  escapeshellarg($username),
  escapeshellarg($password),
  escapeshellarg($servername),
  escapeshellarg($dbname),
  escapeshellarg($backupFile)
);

// Execute
$output = [];
$return_var = 0;
exec($cmd, $output, $return_var);

// Write a log to inspect errors
$log = "=== ".date('c')." ===\nCMD: $cmd\nRC: $return_var\nOUTPUT:\n".implode("\n", $output)."\n\n";
file_put_contents($logFile, $log, FILE_APPEND);

// Report
if ($return_var === 0 && file_exists($backupFile) && filesize($backupFile) > 0) {
  echo "✅ Backup successful: " . basename($backupFile);
} else {
  echo "❌ Backup failed (RC=$return_var). See log: " . basename($logFile);
}
