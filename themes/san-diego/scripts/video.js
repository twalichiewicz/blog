/**
 * Video tag plugin for Hexo
 * Usage: {% video src="filename" [poster="poster.jpg"] [autoplay] [loop] [muted] [controls] %}
 * 
 * The plugin will:
 * - Automatically look for video files in the post's asset folder
 * - Support multiple formats (webm, mp4)
 * - Apply consistent styling
 * - Integrate with existing video components
 */

hexo.extend.tag.register('video', function(args) {
  // Parse arguments
  const attrs = {};
  let src = '';
  
  args.forEach(arg => {
    if (arg.includes('=')) {
      const [key, value] = arg.split('=');
      attrs[key] = value.replace(/['"]/g, '');
    } else if (arg.includes('.')) {
      // If it contains a dot, assume it's the source file
      src = arg;
    } else {
      // Boolean attributes (autoplay, loop, muted, controls)
      attrs[arg] = true;
    }
  });
  
  // If src is provided as attribute, use that
  if (attrs.src) {
    src = attrs.src;
    delete attrs.src;
  }
  
  if (!src) {
    return '<p>Error: Video source not provided</p>';
  }
  
  // Extract base filename and extension
  const lastDotIndex = src.lastIndexOf('.');
  const baseName = src.substring(0, lastDotIndex);
  const extension = src.substring(lastDotIndex + 1);
  
  // Default attributes
  const defaults = {
    controls: true,
    playsinline: true,
    style: 'width: 100%; height: auto; margin: 24px 0;'
  };
  
  // Merge defaults with provided attributes
  const finalAttrs = { ...defaults, ...attrs };
  
  // Build attribute string
  const attrString = Object.entries(finalAttrs)
    .map(([key, value]) => {
      if (value === true) {
        return key;
      }
      return `${key}="${value}"`;
    })
    .join(' ');
  
  // Build source elements
  // Always try to include both webm and mp4 for compatibility
  let sources = '';
  
  // If the provided file is webm, also look for mp4
  if (extension === 'webm') {
    sources = `
    <source src="${src}" type="video/webm">
    <source src="${baseName}.mp4" type="video/mp4">`;
  }
  // If the provided file is mp4, also look for webm
  else if (extension === 'mp4') {
    sources = `
    <source src="${baseName}.webm" type="video/webm">
    <source src="${src}" type="video/mp4">`;
  }
  // For other formats, just use the provided source
  else {
    sources = `<source src="${src}" type="video/${extension}">`;
  }
  
  // Build the video element
  const videoHtml = `
<div class="video-container">
  <video ${attrString}>
    ${sources}
    Your browser does not support the video tag.
  </video>
</div>`;
  
  return videoHtml.trim();
});