$jsFiles = Get-ChildItem -Path "e:\web\htdocs\jaysanERP\js" -Filter "*.js" -File
$result = @()

foreach ($jsFile in $jsFiles) {
    $content = Get-Content $jsFile.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    # Find all PHP API calls with line numbers
    $lines = Get-Content $jsFile.FullName
    $apiCalls = @{}
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $lineNum = $i + 1
        $line = $lines[$i]
        
        # Match PHP API patterns
        $pattern = 'url:\s*["' + "'" + '](\.\./)?php/([^"' + "'" + ']+\.php)|fetch\(["' + "'" + '](\.\./)?php/([^"' + "'" + ']+\.php)|\.post\(["' + "'" + '](\.\./)?php/([^"' + "'" + ']+\.php)|\.get\(["' + "'" + '](\.\./)?php/([^"' + "'" + ']+\.php)'
        if ($line -match $pattern) {
            # Extract PHP filename
            $phpFile = $null
            if ($matches[2]) { $phpFile = $matches[2] }
            elseif ($matches[4]) { $phpFile = $matches[4] }
            elseif ($matches[6]) { $phpFile = $matches[6] }
            elseif ($matches[8]) { $phpFile = $matches[8] }
            
            if ($phpFile) {
                if (-not $apiCalls.ContainsKey($phpFile)) {
                    $apiCalls[$phpFile] = @()
                }
                $apiCalls[$phpFile] += $lineNum
            }
        }
    }
    
    # Only include files with API calls
    if ($apiCalls.Count -gt 0) {
        $apis = @()
        foreach ($api in $apiCalls.GetEnumerator() | Sort-Object Name) {
            $apis += @{
                name = $api.Name
                lines = $api.Value
            }
        }
        
        $result += @{
            js = $jsFile.Name
            apis = $apis
        }
    }
}

# Output as JSON
$result | ConvertTo-Json -Depth 10
