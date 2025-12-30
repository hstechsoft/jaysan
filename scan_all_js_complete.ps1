# Complete JS to PHP API Scanner with Line Numbers
# Scans all JavaScript files and generates complete apiData array

$jsDir = "e:\web\htdocs\jaysanERP\js"
$results = @()

Write-Host "Scanning JavaScript files for PHP API calls..." -ForegroundColor Yellow

Get-ChildItem -Path $jsDir -Filter "*.js" | ForEach-Object {
    $fileName = $_.Name
    $content = Get-Content $_.FullName
    $apis = @()
    $lineNum = 0
    
    foreach ($line in $content) {
        $lineNum++
        # Match: url: "php/file.php" or url: 'php/file.php'
        # Allow alphanumeric, underscore, hyphen, space, and dots
        if ($line -match 'php/([a-zA-Z0-9_ -]+\.php)') {
            $phpFile = $matches[1].Trim()  # Trim any extra spaces
            $apis += [PSCustomObject]@{
                name = $phpFile
                line = $lineNum
            }
        }
    }
    
    if ($apis.Count -gt 0) {
        $results += [PSCustomObject]@{
            js = $fileName
            apis = $apis
        }
    }
}

# Generate JavaScript array format
Write-Host "`nconst apiData = ["

foreach ($r in $results) {
    Write-Host "  { js: '$($r.js)', apis: ["
    
    # Group by API name to combine line numbers
    $apiGroups = $r.apis | Group-Object -Property name
    
    foreach ($g in $apiGroups) {
        $apiName = $g.Name
        $lines = ($g.Group.line) -join ', '
        Write-Host "    { name: '$apiName', lines: [$lines] },"
    }
    
    Write-Host "  ]},"
}

Write-Host "];"
Write-Host "`n"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total JS files scanned: $(Get-ChildItem -Path $jsDir -Filter '*.js' | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor Green
Write-Host "JS files with PHP calls: $($results.Count)" -ForegroundColor Green
Write-Host "Total PHP API calls: $(($results | ForEach-Object { $_.apis.Count } | Measure-Object -Sum).Sum)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
