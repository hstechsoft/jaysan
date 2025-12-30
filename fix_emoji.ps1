# Fix UTF-8 emoji encoding issues
$file = 'api_analytics_dashboard.html'
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Replace corrupted sequences with proper emojis
$replacements = @{
    # Warning emoji
    "â\u009a\u00a0ï¸" = [char]0x26A0 + [char]0xFE0F
    "âš ï¸" = [char]0x26A0 + [char]0xFE0F
    # Document emoji
    "ð\u009f\u0093\u0084" = [char]0x1F4C4
    "📄Ÿ" = [char]0x1F4C4
    # Clipboard emoji  
    "ð\u009f\u0093\u008b" = [char]0x1F4CB
    "📄Ÿ"‹" = [char]0x1F4CB
}

foreach ($key in $replacements.Keys) {
    $content = $content.Replace($key, $replacements[$key])
}

# Write with UTF-8 encoding (no BOM)
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($file, $content, $utf8)

Write-Host "✓ Emoji encoding fixed" -ForegroundColor Green
