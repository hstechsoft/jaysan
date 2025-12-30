$file = 'api_analytics_dashboard.html'
$content = Get-Content $file -Raw

Write-Host "Fixing all emoji encodings..." -ForegroundColor Cyan

# Define all emoji replacements
$content = $content.Replace('📄ŸŒ™', '🌙')
$content = $content.Replace('📄Ÿ"Š', '📊')
$content = $content.Replace('📄Ÿ"', '📄')
$content = $content.Replace('📄Ÿ"„', '📄')
$content = $content.Replace('📄Ÿ"§', '🔧')
$content = $content.Replace('📄Ÿ"‹', '📋')
$content = $content.Replace('📄Ÿ"'', '🔒')
$content = $content.Replace('📄Ÿ"¥', '📥')
$content = $content.Replace('📄Ÿ'¡', '💡')
$content = $content.Replace('📄Ÿš¨', '🚨')
$content = $content.Replace('â˜€ï¸', '☀️')
$content = $content.Replace('📄Ÿ"', '📁')

# Save with UTF-8 encoding
$content | Set-Content $file -Encoding UTF8 -NoNewline

Write-Host "✓ All emoji encoding issues fixed!" -ForegroundColor Green
Write-Host "Total lines: $((Get-Content $file).Count)" -ForegroundColor Yellow
