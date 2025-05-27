# Blog Documentation

This directory contains documentation for the blog's features and systems.

## 📁 Documentation Index

### Video Systems

- **[Adaptive Video System](./README-adaptive-videos.md)** - Automatically serves optimal video versions based on grid layout

### Features

- **Video Autoplay** - Apple-style background video autoplay with intersection observer
- **Dynamic Grid Layout** - Responsive portfolio grid with multiple sizes (1x1, 2x2, 3x1, 1x2)
- **Mobile Optimization** - Touch-friendly interface with adaptive layouts

## 🎯 Quick Start

### Adding Video Cover Images

1. **Create video versions** (minimum required):

   ```bash
   # Square version (1:1) for 1x1, 2x2 grids
   ffmpeg -i source.mov -c:v libx264 -profile:v baseline -crf 23 project-square.mp4
   ffmpeg -i source.mov -c:v libvpx-vp9 -crf 30 -b:v 0 project-square.webm
   
   # Wide version (16:9) for 3x1 grids  
   ffmpeg -i source-169.mov -c:v libx264 -profile:v baseline -crf 23 project-wide.mp4
   ffmpeg -i source-169.mov -c:v libvpx-vp9 -crf 30 -b:v 0 project-wide.webm
   ```

2. **Add to project markdown**:

   ```yaml
   ---
   title: My Project
   cover_image: /path/to/project-simple.mp4
   cover_video_poster: /path/to/project-poster.jpg
   ---
   ```

3. **The system automatically**:
   - Detects video files
   - Serves optimal versions based on grid size
   - Falls back gracefully if versions are missing

## 🏗️ Architecture

### File Structure

```
blog/
├── docs/                          # Documentation
├── source/_posts/                 # Blog posts and projects
│   └── Project-Name/             # Project media folder
│       ├── project-square.webm   # 1:1 aspect ratio
│       ├── project-square.mp4    # 1:1 fallback
│       ├── project-wide.webm     # 16:9 aspect ratio
│       ├── project-wide.mp4      # 16:9 fallback
│       └── project-compatible.*  # Universal fallbacks
├── themes/san-diego/
│   ├── layout/                   # EJS templates
│   ├── source/js/components/     # JavaScript modules
│   └── source/styles/            # SCSS stylesheets
└── public/                       # Generated site
```

### Key Components

- **AdaptiveVideoManager** - Handles dynamic video source switching
- **VideoAutoplayManager** - Manages autoplay with intersection observer
- **Portfolio Grid System** - Dynamic grid layouts with data attributes
- **Mobile Tabs** - Touch-friendly navigation

## 🔧 Development

### Running the Development Server

```bash
hexo server --port 4001
```

### Testing Video Systems

- **Main site**: `http://localhost:4001`
- **Test page**: `http://localhost:4001/test-adaptive-video.html`

### File Optimization

The system is optimized for minimal file sizes:

- WebM for modern browsers (best compression)
- MP4 for maximum compatibility
- Automatic fallbacks for missing versions

## 📊 Performance

### File Size Targets

- **Square videos**: ~180-300KB
- **Wide videos**: ~180-230KB  
- **Total per project**: ~1.5MB (all versions)

### Browser Support

- **WebM**: Chrome, Firefox, Edge
- **MP4**: Universal support
- **Autoplay**: All modern browsers (muted videos only)

---

*Last updated: May 27, 2025*
