# API Analytics Dashboard - Line Number Feature

## 🎯 Overview
The dashboard now supports **line number tracking** - showing exactly which line in each JavaScript file calls each PHP API, with clickable links to jump directly to that line in VS Code!

## ✨ New Features

### 1. **Line Number Display**
- Each PHP API now shows green badges with line numbers (e.g., `L41`, `L88`)
- Click any line number badge to open the JS file at that exact line in VS Code
- Multiple line numbers shown if an API is called multiple times in the same file

### 2. **Three View Modes**
- **📄 JS Files View**: See all JavaScript files and their PHP dependencies with line numbers
- **🔧 PHP APIs View**: Reverse lookup showing which JS files use each PHP API (with line numbers)
- **📁 Category View**: Files organized by functionality (Admin, Employee, Customer, etc.)

### 3. **Dark Mode**
- Toggle button in top-right corner (🌙/☀️)
- Preference saved in browser

### 4. **Enhanced Reverse Lookup**
- See all JavaScript files using each PHP API
- Identifies unused PHP files with ⚠️ warning badge
- Click to jump to exact usage lines

## 📊 How to Use

### Open the Dashboard
1. Open `api_analytics_dashboard.html` in your browser
2. Browse the different views using the tabs at the top

### Using Line Numbers
- **Green badges** (L##) indicate line numbers
- Click any badge to open VS Code at that exact line
- Hover to see tooltip: "Jump to line ## in filename.js"

### Generate Complete Line Number Data

#### Option 1: Browser-Based Scanner (Recommended)
1. Open `js_php_line_scanner.html` in your browser
2. Click "Select JS Folder" and choose your `js/` directory
3. Click "Scan Files" to analyze all JavaScript files
4. Click "Copy JSON" or "Download JSON"
5. Replace the `apiData` array in `api_analytics_dashboard.html` with the generated data

#### Option 2: PowerShell Script
```powershell
# Run the scanner script
.\scan_js_with_lines.ps1 > js_php_mapping_with_lines.json

# Then manually copy the JSON into api_analytics_dashboard.html
```

## 🔧 Data Format

The dashboard supports two formats for backward compatibility:

### Simple Format (no line numbers)
```javascript
{ 
  js: 'login.js', 
  apis: ['get_employee_id.php', 'get_user_data.php'] 
}
```

### Enhanced Format (with line numbers)
```javascript
{ 
  js: 'login.js', 
  apis: [
    { name: 'get_employee_id.php', lines: [82] },
    { name: 'get_user_data.php', lines: [125, 234] }
  ]
}
```

You can mix both formats in the same `apiData` array!

## 🎨 Visual Features

- **Line Number Badges**: Green rounded badges with white text
- **PHP API Tags**: Blue rounded badges with hover effects
- **Clickable Links**: All file names and line numbers open in VS Code
- **Color Coding**: 
  - Green badges = Line numbers (clickable)
  - Blue tags = PHP APIs (clickable)
  - Red badges = Unused PHP files

## 📁 Files

- `api_analytics_dashboard.html` - Main interactive dashboard
- `js_php_line_scanner.html` - Browser-based line number scanner
- `scan_js_with_lines.ps1` - PowerShell script for line scanning
- `README_LINE_NUMBERS.md` - This documentation

## 💡 Examples

### Example 1: Single Usage
```
login.js → get_employee_id.php [L82]
```
Clicking **L82** opens `js/login.js` at line 82 in VS Code

### Example 2: Multiple Usages
```
create_work_p.js → get_customer_autocomplete.php [L125] [L234]
```
Two separate clickable badges for different usage locations

### Example 3: Reverse Lookup
In the "PHP APIs View" tab:
```
get_current_employee_id_byphoneid.php
Used by 30 files

📄 login.js [L82]
📄 att_req.js [L88]
📄 admin_index_phone.js [L98]
...
```

## 🚀 Benefits

1. **Faster Debugging**: Jump directly to the line where an API is called
2. **Code Navigation**: Quickly explore API usage patterns across your codebase
3. **Refactoring**: Easily find all usages when changing API signatures
4. **Code Review**: See exactly where and how APIs are being used
5. **Unused Code Detection**: Identify PHP files that are never called

## 🔍 Technical Details

### Line Number Detection Patterns
The scanner detects these patterns:
- `url: "php/filename.php"`
- `url: "../php/filename.php"`
- `$.post("php/filename.php"`
- `$.get("php/filename.php"`
- `$.ajax( url: "php/filename.php"`
- `fetch("php/filename.php"`

### VS Code URI Format
Links use the format: `vscode://file/FULL_PATH#L##`
- Example: `vscode://file/e:/web/htdocs/jaysanERP/js/login.js#L82`

## 📝 Notes

- Line numbers are 1-based (matching VS Code's numbering)
- Multiple calls to the same API in one file show multiple line badges
- The simple string format (without line numbers) still works for backward compatibility
- Run the scanner tool whenever you modify your JavaScript files to keep line numbers accurate

## 🎯 Next Steps

1. Use `js_php_line_scanner.html` to generate complete line number data for all 50+ JS files
2. Replace the sample data in `api_analytics_dashboard.html` with the generated JSON
3. Enjoy precise code navigation with clickable line numbers!

---

**Happy Coding! 🚀**
