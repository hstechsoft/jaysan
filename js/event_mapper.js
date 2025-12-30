document.getElementById('htmlForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const htmlFile = document.getElementById('htmlFile').value;
  
    fetch('php/analyze_event.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'html_file=' + encodeURIComponent(htmlFile)
    })
      .then(res => res.json())
      .then(data => {
        let html = '<table class="table table-bordered"><thead><tr><th>Selector</th><th>Event</th><th>Line</th><th>Open</th></tr></thead><tbody>';
        data.forEach(e => {
          html += `<tr>
            <td>${e.selector}</td>
            <td>${e.event}</td>
            <td>${e.line}</td>
            <td><a href="vscode://file/${e.file}:${e.line}" class="btn btn-sm btn-outline-primary">Open</a></td>
          </tr>`;
        });
        html += '</tbody></table>';
        document.getElementById('resultTable').innerHTML = html;
      });
  });
  