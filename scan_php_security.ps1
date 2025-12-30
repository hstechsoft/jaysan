# PHP Security Vulnerability Scanner
# Scans for SQL injection vulnerabilities and dangerous SQL operations

$phpFolder = "e:\web\htdocs\jaysanERP\php"
$results = @()

# Patterns to detect
$sqlInjectionPatterns = @(
    '\$_POST\[[^\]]+\](?!\s*\)).*?(SELECT|INSERT|UPDATE|DELETE|WHERE)',  # Direct POST usage in SQL
    '\$_GET\[[^\]]+\](?!\s*\)).*?(SELECT|INSERT|UPDATE|DELETE|WHERE)',   # Direct GET usage in SQL
    '\$_REQUEST\[[^\]]+\].*?(SELECT|INSERT|UPDATE|DELETE|WHERE)',        # Direct REQUEST usage in SQL
    'mysqli_query.*?\$_(POST|GET|REQUEST)',                               # Direct user input in mysqli_query
    'mysql_query.*?\$_(POST|GET|REQUEST)',                                # Direct user input in mysql_query (deprecated)
    '".*?\$_(POST|GET|REQUEST)\[.*?SELECT',                               # String concatenation in SELECT
    '".*?\$_(POST|GET|REQUEST)\[.*?DELETE',                               # String concatenation in DELETE
    '".*?\$_(POST|GET|REQUEST)\[.*?UPDATE',                               # String concatenation in UPDATE
    '".*?\$_(POST|GET|REQUEST)\[.*?INSERT'                                # String concatenation in INSERT
)

$dangerousOperations = @(
    'DELETE\s+FROM',
    'DROP\s+TABLE',
    'DROP\s+DATABASE',
    'TRUNCATE\s+TABLE',
    'ALTER\s+TABLE',
    'EXEC\s*\(',
    'EXECUTE\s*\(',
    'eval\s*\(',
    'system\s*\(',
    'shell_exec\s*\(',
    'passthru\s*\('
)

Get-ChildItem -Path $phpFolder -Filter "*.php" | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $fileName = $file.Name
    
    $vulnerabilities = @()
    $dangerous = @()
    $lines = Get-Content $file.FullName
    
    # Check for SQL injection patterns
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $lineNum = $i + 1
        $line = $lines[$i]
        
        foreach ($pattern in $sqlInjectionPatterns) {
            if ($line -match $pattern) {
                $vulnerabilities += @{
                    line = $lineNum
                    code = $line.Trim()
                    type = "SQL Injection Risk"
                }
            }
        }
        
        # Check for dangerous operations
        foreach ($operation in $dangerousOperations) {
            if ($line -match $operation) {
                $dangerous += @{
                    line = $lineNum
                    code = $line.Trim()
                    operation = $operation
                }
            }
        }
    }
    
    if ($vulnerabilities.Count -gt 0 -or $dangerous.Count -gt 0) {
        $results += @{
            file = $fileName
            sqlInjectionRisks = $vulnerabilities
            dangerousOperations = $dangerous
        }
    }
}

# Output as JavaScript array format
Write-Host "const securityFindings = ["

foreach ($result in $results) {
    $sqlRisks = ""
    if ($result.sqlInjectionRisks.Count -gt 0) {
        $sqlRisksArray = $result.sqlInjectionRisks | ForEach-Object {
            "{line: $($_.line), code: `"$($_.code -replace '"', '\"' -replace '\r?\n', ' ')`", type: `"$($_.type)`"}"
        }
        $sqlRisks = $sqlRisksArray -join ", "
    }
    
    $dangOps = ""
    if ($result.dangerousOperations.Count -gt 0) {
        $dangOpsArray = $result.dangerousOperations | ForEach-Object {
            "{line: $($_.line), code: `"$($_.code -replace '"', '\"' -replace '\r?\n', ' ')`", operation: `"$($_.operation)`"}"
        }
        $dangOps = $dangOpsArray -join ", "
    }
    
    Write-Host "    {file: '$($result.file)', sqlInjectionRisks: [$sqlRisks], dangerousOps: [$dangOps]},"
}

Write-Host "];"

Write-Host "`n`n// Total files with security issues: $($results.Count)"
Write-Host "// Files with SQL injection risks: $(($results | Where-Object { $_.sqlInjectionRisks.Count -gt 0 }).Count)"
Write-Host "// Files with dangerous operations: $(($results | Where-Object { $_.dangerousOperations.Count -gt 0 }).Count)"
