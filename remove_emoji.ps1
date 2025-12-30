$file = 'api_analytics_dashboard.html'
$content = Get-Content $file -Raw -Encoding UTF8

Write-Host "Removing all corrupted emoji characters..." -ForegroundColor Cyan

# Replace corrupted patterns with clean text
$content = $content -replace '📄ŸŒ™', ''
$content = $content -replace '📄Ÿ"', ''
$content = $content -replace '📄Ÿ'¡', ''
$content = $content -replace '📄Ÿ"„', ''
$content = $content -replace '📄Ÿ"§', ''
$content = $content -replace '📄Ÿ"‹', ''
$content = $content -replace '📄Ÿ"'', ''
$content = $content -replace '📄Ÿ"¥', ''
$content = $content -replace '📄Ÿ"Š', ''
$content = $content -replace '📄Ÿ"', ''
$content = $content -replace '📄Ÿš¨', ''
$content = $content -replace 'â„¹ï¸', ''
$content = $content -replace 'â˜€ï¸', ''

# Count remaining corrupted chars
$remaining = ([regex]::Matches($content, 'Ÿ|Å|ï¸|â„|â˜')).Count

$content | Set-Content $file -Encoding UTF8 -NoNewline

Write-Host "✓ Removed all corrupted emojis!" -ForegroundColor Green
Write-Host "Remaining corrupted chars: $remaining" -ForegroundColor Yellow
