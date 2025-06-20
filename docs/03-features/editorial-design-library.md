# Editorial Design Library

The project writeup system includes a comprehensive editorial design library that transforms project content into publication-quality articles. This library provides typography, layout, and component systems inspired by premium publications like The New York Times, Washington Post, and high-end design blogs.

## Overview

The editorial library automatically styles content within `.project-writeup .writeup-content` containers, providing:

- **Publication-quality typography** with optimal readability
- **Rich content components** including quotes, callouts, and media
- **Responsive design** that works across all devices
- **Complete dark/light mode** support
- **Accessibility-first** approach with proper contrast and semantic markup

---

## Typography System

### Base Typography
The library uses a carefully crafted type scale optimized for long-form reading:

```css
/* Base settings */
font-size: 17px;           /* Optimal reading size */
line-height: 1.7;          /* Comfortable line spacing */
max-width: 720px;          /* Ideal line length */
font-family: system-ui;    /* Platform-native fonts */
```

### Headings
Headings follow a semantic hierarchy with proper spacing:

```markdown
# Main Title (H1)
Large, bold heading for article titles

## Section Header (H2) 
Includes subtle underline border

### Subsection (H3)
Medium weight, slightly muted

#### Detail Header (H4)
Smaller, more subdued
```

**Implementation:**
```html
<h1>Article Title</h1>
<h2>Major Section</h2>
<h3>Subsection</h3>
<h4>Detail Point</h4>
```

### Special Typography

#### Lead Paragraph
Create larger, introductory text:

```html
<p class="lead">This larger paragraph introduces the article with enhanced visual weight and improved readability.</p>
```

#### Drop Caps
Automatic drop caps for paragraphs following H1/H2:

```html
<h1>Article Title</h1>
<p>This paragraph will automatically get a drop cap for the first letter.</p>
```

Or manually apply:
```html
<p class="drop-cap">This paragraph has a manual drop cap.</p>
```

#### Small Caps
```html
<span class="small-caps">Small Caps Text</span>
```

---

## Content Components

### Quotes & Citations

#### Standard Blockquote
```html
<blockquote>
  <p>This is a blockquote with proper styling and indentation.</p>
  <cite>Author Name</cite>
</blockquote>
```

#### Pull Quote
For highlighting key statements:
```html
<blockquote class="pullquote">
  <p>This quote stands out prominently in the center of the content.</p>
</blockquote>
```

### Lists

#### Unordered Lists
```html
<ul>
  <li>First item with custom styling</li>
  <li>Second item with proper spacing</li>
  <li>Nested lists are supported
    <ul>
      <li>Nested item</li>
      <li>Another nested item</li>
    </ul>
  </li>
</ul>
```

#### Ordered Lists
```html
<ol>
  <li>Numbered item with custom styling</li>
  <li>Proper counter and spacing</li>
  <li>Consistent with design system</li>
</ol>
```

### Code & Technical Content

#### Inline Code
```html
<p>Use <code>inline code</code> for technical terms.</p>
```

#### Code Blocks
```html
<pre><code>
function example() {
  return "Properly formatted code block";
}
</code></pre>
```

### Tables

```html
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
      <th>Header 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Row 1, Cell 1</td>
      <td>Row 1, Cell 2</td>
      <td>Row 1, Cell 3</td>
    </tr>
    <tr>
      <td>Row 2, Cell 1</td>
      <td>Row 2, Cell 2</td>
      <td>Row 2, Cell 3</td>
    </tr>
  </tbody>
</table>
```

---

## Media & Figures

### Standard Figure
```html
<figure>
  <img src="image.jpg" alt="Description">
  <figcaption>Caption text with italic styling</figcaption>
</figure>
```

### Wide Figure
For full-width images that break out of the content container:
```html
<figure class="figure-wide">
  <img src="wide-image.jpg" alt="Description">
  <figcaption>This image extends beyond the text width</figcaption>
</figure>
```

### Image Utilities

#### Full Width Image
```html
<img src="image.jpg" alt="Description" class="img-full">
```

#### Floating Images
```html
<!-- Float left -->
<img src="image.jpg" alt="Description" class="img-float-left">

<!-- Float right -->
<img src="image.jpg" alt="Description" class="img-float-right">
```

---

## Callouts & Alerts

The library includes semantic callout components for different types of information:

### Info Callout
```html
<div class="callout info">
  <p>This is informational content with blue accent styling.</p>
</div>
```

### Warning Callout
```html
<div class="callout warning">
  <p>This is a warning with yellow accent styling.</p>
</div>
```

### Success Callout
```html
<div class="callout success">
  <p>This indicates success with green accent styling.</p>
</div>
```

### Error Callout
```html
<div class="callout error">
  <p>This indicates an error with red accent styling.</p>
</div>
```

---

## Dividers & Separators

### Standard Divider
```html
<hr>
```

### Ornamental Divider
```html
<div class="divider-ornament"></div>
```

---

## Text Utilities

### Text Sizing
```html
<p class="text-large">Larger text for emphasis</p>
<p class="text-small">Smaller text for footnotes</p>
```

### Text Alignment
```html
<p class="text-center">Centered text</p>
```

### Text Highlighting
```html
<p>This text has a <mark>highlighted section</mark> with subtle background.</p>
```

---

## Responsive Behavior

The editorial library is mobile-first and includes:

### Breakpoints
- **Mobile**: `≤ 768px` - Reduced font sizes, padding, and simplified layouts
- **Tablet**: `769px - 1024px` - Medium sizing and spacing
- **Desktop**: `≥ 1025px` - Full typography scale and spacing

### Mobile Optimizations
- Smaller font sizes (16px base instead of 17px)
- Reduced padding and margins
- Collapsed floating images to full width
- Simplified table layouts
- Adjusted figure margins

---

## Dark Mode Support

All components automatically adapt to dark mode preferences:

```css
@media (prefers-color-scheme: dark) {
  /* Automatic dark mode styling */
}
```

### Dark Mode Features
- **Inverted color schemes** with proper contrast
- **Adjusted accent colors** for callouts and links
- **Softened borders and dividers**
- **Optimized code highlighting**

---

## Best Practices

### Content Structure
1. **Start with H1** for the main article title
2. **Use H2** for major sections with natural breaks
3. **Apply lead class** to introductory paragraphs
4. **Include figures** with descriptive captions
5. **Use callouts** sparingly for important information

### Typography Guidelines
1. **Keep paragraphs** to 2-4 sentences for readability
2. **Use emphasis** (bold/italic) strategically
3. **Break up long content** with subheadings and media
4. **Include pull quotes** to highlight key points

### Accessibility
1. **Use semantic HTML** elements
2. **Include alt text** for all images
3. **Write descriptive** figure captions
4. **Maintain proper** heading hierarchy

---

## Examples

### Complete Article Structure
```html
<div class="project-writeup">
  <div class="writeup-content">
    <h1>Project Deep Dive: Revolutionizing User Experience</h1>
    
    <p class="lead">This comprehensive analysis explores how we transformed a complex enterprise platform into an intuitive, user-centered design system.</p>
    
    <h2>The Challenge</h2>
    <p>Our initial research revealed significant usability barriers...</p>
    
    <div class="callout info">
      <p>Key insight: Users were abandoning tasks due to cognitive overload in the interface.</p>
    </div>
    
    <figure>
      <img src="before-after.jpg" alt="Before and after interface comparison">
      <figcaption>Interface evolution from complex (left) to streamlined (right)</figcaption>
    </figure>
    
    <h2>Design Process</h2>
    <p>We approached this challenge through a systematic design thinking methodology:</p>
    
    <ol>
      <li>User research and journey mapping</li>
      <li>Information architecture restructuring</li>
      <li>Iterative prototyping and testing</li>
      <li>Design system development</li>
    </ol>
    
    <blockquote class="pullquote">
      <p>The key was understanding that simplicity isn't about removing features—it's about organizing them intelligently.</p>
    </blockquote>
    
    <h3>Technical Implementation</h3>
    <p>The solution required both design and development innovations:</p>
    
    <pre><code>
// Component-based architecture
const DesignSystem = {
  typography: { scale: 'modular', rhythm: 1.5 },
  spacing: { unit: 8, scale: [0.5, 1, 1.5, 2, 3, 4, 6] },
  colors: { primary: '#0066cc', semantic: ['success', 'warning', 'error'] }
};
    </code></pre>
    
    <h2>Results & Impact</h2>
    <p>The redesigned system delivered measurable improvements:</p>
    
    <div class="callout success">
      <p><strong>85% reduction</strong> in user task completion time</p>
      <p><strong>92% increase</strong> in user satisfaction scores</p>
      <p><strong>40% decrease</strong> in support ticket volume</p>
    </div>
    
    <hr>
    
    <h2>Lessons Learned</h2>
    <p>This project reinforced several key principles about user-centered design...</p>
  </div>
</div>
```

This editorial design library transforms technical project documentation into engaging, publication-quality articles that communicate design decisions and impact with clarity and visual appeal.