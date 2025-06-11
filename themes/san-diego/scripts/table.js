/**
 * Table tag plugin for Hexo
 * Usage: {% table %}
 * | Header 1 | Header 2 | Header 3 |
 * |----------|----------|----------|
 * | Cell 1   | Cell 2   | Cell 3   |
 * | Cell 4   | Cell 5   | Cell 6   |
 * {% endtable %}
 * 
 * Or with options:
 * {% table caption="Skills Matrix" class="skills-matrix" %}
 * 
 * Features:
 * - Responsive tables with horizontal scroll on mobile
 * - Optional caption
 * - Custom CSS classes
 * - Consistent styling across light/dark modes
 */

hexo.extend.tag.register('table', function(args, content) {
  // Parse arguments
  const attrs = {};
  
  // Parse key=value pairs from args
  args.forEach(arg => {
    const match = arg.match(/(\w+)="([^"]+)"/);
    if (match) {
      attrs[match[1]] = match[2];
    }
  });
  
  // Extract caption and class
  const caption = attrs.caption || '';
  const customClass = attrs.class || '';
  
  // Process the table content
  // Remove leading/trailing whitespace but preserve the table structure
  const tableContent = content.trim();
  
  // Parse markdown table to HTML
  const lines = tableContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return '<p>Error: Invalid table format</p>';
  }
  
  let html = '<div class="table-wrapper ' + customClass + '">';
  
  // Add caption if provided
  if (caption) {
    html += '<div class="table-caption">' + caption + '</div>';
  }
  
  // Add scroll container
  html += '<div class="table-scroll-container">';
  html += '<table>';
  
  // Process each line
  let inHeader = true;
  let headerCount = 0;
  
  lines.forEach((line, index) => {
    // Skip separator line (line with dashes)
    if (line.match(/^\s*\|?\s*[-:\s|]+\s*\|?\s*$/)) {
      inHeader = false;
      return;
    }
    
    // Split by pipe and clean up cells
    const cells = line
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell); // Remove empty cells from start/end
    
    if (cells.length === 0) return;
    
    if (inHeader) {
      if (headerCount === 0) {
        html += '<thead>';
      }
      html += '<tr>';
      cells.forEach(cell => {
        // Check if cell contains special formatting
        const isBold = cell.includes('**');
        const cleanCell = cell.replace(/\*\*/g, '');
        html += '<th>' + cleanCell + '</th>';
      });
      html += '</tr>';
      headerCount++;
    } else {
      if (headerCount > 0 && index === lines.indexOf(line)) {
        html += '</thead><tbody>';
        headerCount = 0;
      }
      html += '<tr>';
      cells.forEach(cell => {
        // Process cell content for bold text
        let processedCell = cell;
        // Convert **text** to <strong>text</strong>
        processedCell = processedCell.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html += '<td>' + processedCell + '</td>';
      });
      html += '</tr>';
    }
  });
  
  // Close tbody if we had body rows
  if (!inHeader) {
    html += '</tbody>';
  } else if (headerCount > 0) {
    html += '</thead>';
  }
  
  html += '</table>';
  html += '</div>'; // Close scroll container
  html += '</div>'; // Close table wrapper
  
  return html;
}, {ends: true});