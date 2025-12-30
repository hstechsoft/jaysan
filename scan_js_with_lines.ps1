# PowerShell script to scan JS files and find PHP API calls with line numbers
$jsPath = "e:\web\htdocs\jaysanERP\js"
$results = @()

# Get all JS files
$jsFiles = Get-ChildItem -Path $jsPath -Filter "*.js" -File

foreach ($file in $jsFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $lines = Get-Content -Path $file.FullName
    
    $apis = @{}
    
    # Scan each line for PHP file references
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        $lineNum = $i + 1  # Line numbers are 1-based
        
        # Match patterns like: url: "php/filename.php" or url:"php/filename.php"
        if ($line -match 'url\s*:\s*["\']php/([^"\']+\.php)["\']') {
            $phpFile = $matches[1]
            if (-not $apis.ContainsKey($phpFile)) {
                $apis[$phpFile] = @()
            }
            $apis[$phpFile] += $lineNum
        }
        
        # Match patterns like: url: '../php/filename.php'
        if ($line -match 'url\s*:\s*["\'][\.\/]*php/([^"\']+\.php)["\']') {
            $phpFile = $matches[1]
            if (-not $apis.ContainsKey($phpFile)) {
                $apis[$phpFile] = @()
            }
            $apis[$phpFile] += $lineNum
        }
        
        # Match patterns like: $.post("php/filename.php"
        if ($line -match '\$\.(?:post|get|ajax)\s*\(\s*["\'](?:[\.\/]*)?php/([^"\']+\.php)["\']') {
            $phpFile = $matches[1]
            if (-not $apis.ContainsKey($phpFile)) {
                $apis[$phpFile] = @()
            }
            $apis[$phpFile] += $lineNum
        }
    }
    
    if ($apis.Count -gt 0) {
        $apiList = @()
        foreach ($phpFile in $apis.Keys) {
            $apiList += @{
                name = $phpFile
                lines = $apis[$phpFile]
            }
        }
        
        $results += @{
            js = $file.Name
            apis = $apiList
        }
    }
}

# Output as JSON
$jsonOutput = $results | ConvertTo-Json -Depth 10 -Compress
Write-Output $jsonOutput
