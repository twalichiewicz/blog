const path = require('path');
const sass = require('sass');
const CleanCSS = require('clean-css');
const { config } = require('./scripts/minify-assets');

const scssPath = path.join(__dirname, 'themes', 'san-diego', 'source', 'styles', 'styles.scss');

let compiled;
try {
  compiled = sass.compile(scssPath, { style: 'expanded' });
} catch (error) {
  console.error('Failed to compile SCSS for border lint check.');
  console.error(error);
  process.exit(1);
}

const minifier = new CleanCSS(config.css);
const result = minifier.minify(compiled.css);

if (result.errors && result.errors.length) {
  console.error('CleanCSS reported errors during border lint check:');
  result.errors.forEach((err) => console.error(`- ${err}`));
  process.exit(1);
}

const missingColorPattern =
  /(?:^|[;{])(?:border(?:-(?:top|right|bottom|left))?):\\s*[\\d.]+px\\s+solid(?:\\s*!important)?(?=;|})/g;

const matches = [...result.styles.matchAll(missingColorPattern)];

if (matches.length) {
  console.error('Detected border declarations without colors after minification.');
  console.error('This usually means a shorthand border color was stripped by CleanCSS.');
  const previewSize = 60;
  const samples = matches.slice(0, 6).map((match) => {
    const index = match.index || 0;
    const start = Math.max(0, index - previewSize);
    const end = Math.min(result.styles.length, index + previewSize);
    return `...${result.styles.slice(start, end)}...`;
  });
  samples.forEach((sample) => console.error(sample));
  console.error(`Total occurrences: ${matches.length}`);
  process.exit(1);
}

console.log('✓ CSS border declarations preserved after minification.');
