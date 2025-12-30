# PowerShell script to list all PHP files in the php/ directory
# Output as JavaScript array format

$phpPath = "e:\web\htdocs\jaysanERP\php"
$phpFiles = Get-ChildItem -Path $phpPath -Filter "*.php" -File | Select-Object -ExpandProperty Name | Sort-Object

Write-Host "Found $($phpFiles.Count) PHP files"
Write-Host ""
Write-Host "// Copy this into api_analytics_dashboard.html:"
Write-Host "const allPhpFilesInDirectory = ["

$chunks = @()
for ($i = 0; $i -lt $phpFiles.Count; $i += 10) {
    $chunk = $phpFiles[$i..([Math]::Min($i + 9, $phpFiles.Count - 1))] | ForEach-Object { "'$_'" }
    $chunks += "    " + ($chunk -join ', ')
}

Write-Host ($chunks -join ",`n")
Write-Host "];"
Write-Host ""
Write-Host "Total: $($phpFiles.Count) files"
