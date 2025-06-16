/**
 * Interactive Quote Hexo Tag - Simplified and Powerful
 * 
 * Usage examples:
 * {% quote "Text" "Author" %}
 * {% quote "Text" "Author" "2024" %}
 * {% quote "Text" author="Name" year="2024" variant="minimal" %}
 * 
 * Block version for multiline:
 * {% blockquote author="Name" variant="centered" decorated %}
 * Multiple lines of
 * quote text here
 * {% endblockquote %}
 */

const { encodeHTML } = require('hexo-util');

// Helper to parse arguments more safely
function parseArgs(args) {
  const params = {
    text: '',
    author: '',
    year: '',
    variant: null,
    decorated: false,
    animate: true,
    id: null,
    lang: null
  };

  // Join all args to handle quotes properly
  const argsString = args.join(' ');
  
  // First, extract named parameters
  const namedParams = {};
  const namedParamRegex = /(\w+)=(["']?)([^"']*)\2/g;
  let match;
  
  while ((match = namedParamRegex.exec(argsString)) !== null) {
    const [fullMatch, key, , value] = match;
    namedParams[key] = value || true;
  }
  
  // Remove named params from string to get positional args
  const cleanedArgs = argsString.replace(namedParamRegex, '').trim();
  
  // Parse positional arguments (quote text, author, year)
  if (cleanedArgs) {
    // Use a more robust quote parsing approach
    const quoteParts = cleanedArgs.match(/["']([^"']+)["']|([^\s]+)/g) || [];
    const values = quoteParts.map(part => part.replace(/^["']|["']$/g, ''));
    
    if (values[0]) params.text = values[0];
    if (values[1]) params.author = values[1];
    if (values[2] && /^\d{4}$/.test(values[2])) params.year = values[2];
  }
  
  // Apply named parameters (these override positional)
  Object.assign(params, namedParams);
  
  // Handle boolean conversions
  params.decorated = params.decorated === true || params.decorated === 'true';
  params.animate = params.animate !== 'false';
  
  return params;
}

// Register simple quote tag
hexo.extend.tag.register('quote', function(args) {
  const params = parseArgs(args);
  
  if (!params.text) {
    return '<p class="error">Quote tag requires text content</p>';
  }
  
  // Render using the partial
  try {
    const partial = hexo.theme.getView('_partial/interactive-quote.ejs');
    if (!partial) {
      throw new Error('Interactive quote partial not found');
    }
    
    return partial.render(params);
  } catch (error) {
    console.error('Error rendering quote:', error);
    // Fallback rendering
    return `
      <blockquote class="interactive-quote-fallback">
        <p>${encodeHTML(params.text)}</p>
        ${params.author ? `<cite>— ${encodeHTML(params.author)}${params.year ? ', ' + params.year : ''}</cite>` : ''}
      </blockquote>
    `;
  }
});

// Register block version for multiline quotes
hexo.extend.tag.register('blockquote', function(args, content) {
  const params = parseArgs(args);
  params.text = content ? content.trim() : '';
  
  if (!params.text) {
    return '<p class="error">Blockquote tag requires content</p>';
  }
  
  // Render using the partial
  try {
    const partial = hexo.theme.getView('_partial/interactive-quote.ejs');
    if (!partial) {
      throw new Error('Interactive quote partial not found');
    }
    
    return partial.render(params);
  } catch (error) {
    console.error('Error rendering blockquote:', error);
    // Fallback rendering
    return `
      <blockquote class="interactive-quote-fallback">
        <p>${encodeHTML(params.text)}</p>
        ${params.author ? `<cite>— ${encodeHTML(params.author)}${params.year ? ', ' + params.year : ''}</cite>` : ''}
      </blockquote>
    `;
  }
}, { ends: true });

// Also register the old tag names for backwards compatibility
hexo.extend.tag.register('interactiveQuote', function(args) {
  console.warn('interactiveQuote tag is deprecated. Use {% quote %} instead.');
  // Call the quote tag logic directly
  const params = parseArgs(args);
  
  if (!params.text) {
    return '<p class="error">Quote tag requires text content</p>';
  }
  
  try {
    const partial = hexo.theme.getView('_partial/interactive-quote.ejs');
    if (!partial) {
      throw new Error('Interactive quote partial not found');
    }
    
    return partial.render(params);
  } catch (error) {
    console.error('Error rendering quote:', error);
    return `
      <blockquote class="interactive-quote-fallback">
        <p>${encodeHTML(params.text)}</p>
        ${params.author ? `<cite>— ${encodeHTML(params.author)}${params.year ? ', ' + params.year : ''}</cite>` : ''}
      </blockquote>
    `;
  }
});

hexo.extend.tag.register('interactiveQuoteBlock', function(args, content) {
  console.warn('interactiveQuoteBlock tag is deprecated. Use {% blockquote %} instead.');
  // Call the blockquote tag logic directly
  const params = parseArgs(args);
  params.text = content ? content.trim() : '';
  
  if (!params.text) {
    return '<p class="error">Blockquote tag requires content</p>';
  }
  
  try {
    const partial = hexo.theme.getView('_partial/interactive-quote.ejs');
    if (!partial) {
      throw new Error('Interactive quote partial not found');
    }
    
    return partial.render(params);
  } catch (error) {
    console.error('Error rendering blockquote:', error);
    return `
      <blockquote class="interactive-quote-fallback">
        <p>${encodeHTML(params.text)}</p>
        ${params.author ? `<cite>— ${encodeHTML(params.author)}${params.year ? ', ' + params.year : ''}</cite>` : ''}
      </blockquote>
    `;
  }
}, { ends: true });