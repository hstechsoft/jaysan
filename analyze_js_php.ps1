$results = @()
Get-ChildItem -Path "e:\web\htdocs\jaysanERP" -Filter "*.js" -Recurse | ForEach-Object {
    $jsFile = $_.FullName
    $relativePath = $jsFile.Replace("e:\web\htdocs\jaysanERP\", "")
    $content = Get-Content $jsFile -Raw -ErrorAction SilentlyContinue
    
    if ($content) {
        # Extract all PHP file references with more comprehensive regex
        $phpFiles = @()
        
        # Pattern 1: url: "php/..."
        $matches1 = [regex]::Matches($content, 'url:\s*["\']php/([^"\']+\.php)["\']')
        $matches1 | ForEach-Object { $phpFiles += "php/" + $_.Groups[1].Value }
        
        # Pattern 2: fetch("php/...")
        $matches2 = [regex]::Matches($content, 'fetch\(["\']php/([^"\']+\.php)["\']')
        $matches2 | ForEach-Object { $phpFiles += "php/" + $_.Groups[1].Value }
        
        # Pattern 3: $.get("php/...")
        $matches3 = [regex]::Matches($content, '\$\.get\(["\']php/([^"\']+\.php)["\']')
        $matches3 | ForEach-Object { $phpFiles += "php/" + $_.Groups[1].Value }
        
        # Pattern 4: $.post("php/...")
        $matches4 = [regex]::Matches($content, '\$\.post\(["\']php/([^"\']+\.php)["\']')
        $matches4 | ForEach-Object { $phpFiles += "php/" + $_.Groups[1].Value }
        
        # Get unique PHP files
        $uniquePhpFiles = $phpFiles | Select-Object -Unique | Sort-Object
        
        if ($uniquePhpFiles.Count -gt 0) {
            $results += [PSCustomObject]@{
                JSFile = $relativePath
                PHPFiles = ($uniquePhpFiles -join ', ')
                Count = $uniquePhpFiles.Count
            }
        }
    }
}

# Sort by count descending
$results = $results | Sort-Object -Property Count -Descending

# Output as pipe-delimited format
$results | ForEach-Object {
    Write-Output "$($_.JSFile)|$($_.PHPFiles)|$($_.Count)"
}
