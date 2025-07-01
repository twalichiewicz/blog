# Video Conversion Guide

Quick reference for creating optimized video files for the adaptive video system.

## 📋 Prerequisites

- **FFmpeg** installed (`brew install ffmpeg` on macOS)
- Source videos in good quality (preferably 1:1 and 16:9 aspect ratios)

## 🎯 Required Formats

For each project, create these versions:

| Format | Aspect Ratio | Use Case | Priority |
|--------|--------------|----------|----------|
| `project-square.webm` | 1:1 | 1x1, 2x2 grids | High |
| `project-square.mp4` | 1:1 | 1x1, 2x2 fallback | High |
| `project-wide.webm` | 16:9 | 3x1 grids | High |
| `project-wide.mp4` | 16:9 | 3x1 fallback | High |
| `project-compatible.webm` | Any | Universal fallback | Medium |
| `project-compatible.mp4` | Any | Universal fallback | Medium |

## ⚡ Quick Commands

### From 1:1 Source Video

```bash
# Square WebM (best compression)
ffmpeg -i source-square.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus project-square.webm

# Square MP4 (maximum compatibility)
ffmpeg -i source-square.mov -c:v libx264 -profile:v baseline -crf 23 -c:a aac -movflags +faststart project-square.mp4
```

### From 16:9 Source Video

```bash
# Wide WebM (best compression)
ffmpeg -i source-wide.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus project-wide.webm

# Wide MP4 (maximum compatibility)
ffmpeg -i source-wide.mov -c:v libx264 -profile:v baseline -crf 23 -c:a aac -movflags +faststart project-wide.mp4
```

### Universal Fallbacks

```bash
# Compatible WebM (from any source)
ffmpeg -i source.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus project-compatible.webm

# Compatible MP4 (from any source)
ffmpeg -i source.mov -c:v libx264 -profile:v baseline -crf 23 -c:a aac -movflags +faststart project-compatible.mp4
```

## 🎨 Aspect Ratio Conversion

### Create Square from Wide Video

```bash
# Crop to center square
ffmpeg -i wide-video.mov -vf "crop=min(iw\,ih):min(iw\,ih)" -c:v libx264 -profile:v baseline -crf 23 project-square.mp4
```

### Create Wide from Square Video

```bash
# Add letterboxing to create 16:9
ffmpeg -i square-video.mov -vf "pad=ih*16/9:ih:(ow-iw)/2:0:black" -c:v libx264 -profile:v baseline -crf 23 project-wide.mp4
```

## 📐 Quality Settings

### WebM (VP9) Settings

- **CRF 30**: Good quality, small file size
- **CRF 25**: Higher quality, larger file size
- **CRF 35**: Lower quality, smallest file size

### MP4 (H.264) Settings

- **CRF 23**: Good quality, reasonable file size
- **CRF 20**: Higher quality, larger file size
- **CRF 26**: Lower quality, smaller file size

## 🎯 Target File Sizes

For 4-5 second videos:

- **WebM**: 150-200KB
- **MP4**: 200-350KB

If files are too large:

- Increase CRF value (+3 for ~50% size reduction)
- Reduce resolution if source is very high
- Trim video length if possible

## 🔄 Batch Conversion Script

Create a script for multiple projects:

```bash
#!/bin/bash
# convert-project-videos.sh

PROJECT_NAME="$1"
SQUARE_SOURCE="$2"
WIDE_SOURCE="$3"

if [ -z "$PROJECT_NAME" ] || [ -z "$SQUARE_SOURCE" ] || [ -z "$WIDE_SOURCE" ]; then
    echo "Usage: $0 <project-name> <square-source.mov> <wide-source.mov>"
    exit 1
fi

echo "Converting videos for $PROJECT_NAME..."

# Square versions
ffmpeg -i "$SQUARE_SOURCE" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "${PROJECT_NAME}-square.webm"
ffmpeg -i "$SQUARE_SOURCE" -c:v libx264 -profile:v baseline -crf 23 -c:a aac -movflags +faststart "${PROJECT_NAME}-square.mp4"

# Wide versions
ffmpeg -i "$WIDE_SOURCE" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "${PROJECT_NAME}-wide.webm"
ffmpeg -i "$WIDE_SOURCE" -c:v libx264 -profile:v baseline -crf 23 -c:a aac -movflags +faststart "${PROJECT_NAME}-wide.mp4"

# Compatible versions (from wide source)
ffmpeg -i "$WIDE_SOURCE" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "${PROJECT_NAME}-compatible.webm"
ffmpeg -i "$WIDE_SOURCE" -c:v libx264 -profile:v baseline -crf 23 -c:a aac -movflags +faststart "${PROJECT_NAME}-compatible.mp4"

echo "✅ Conversion complete for $PROJECT_NAME"
echo "Files created:"
ls -lah "${PROJECT_NAME}"-*.{webm,mp4}
```

Usage:

```bash
chmod +x convert-project-videos.sh
./convert-project-videos.sh "my-project" "source-1x1.mov" "source-16x9.mov"
```

## 🚀 Deployment

1. **Copy files** to project directory:

   ```bash
   cp project-*.{webm,mp4} source/_posts/Project-Name/
   cp project-*.{webm,mp4} public/YYYY/MM/DD/Project-Name/
   ```

2. **Update markdown** frontmatter:

   ```yaml
   cover_image: /YYYY/MM/DD/Project-Name/project-simple.mp4
   ```

3. **Test** the adaptive system:
   - Visit test page: `http://localhost:4001/test-adaptive-video.html`
   - Check browser console for source selection logs

## 🐛 Troubleshooting

### Video Not Playing

- Check file paths in browser network tab
- Verify files exist in public directory
- Test individual video files directly

### Wrong Aspect Ratio Selected

- Check `data-grid-size` attribute on portfolio items
- Verify AdaptiveVideoManager is loading
- Check browser console for selection logs

### Large File Sizes

- Increase CRF values (lower quality, smaller size)
- Check source video resolution
- Consider shorter video duration

---

*For more details, see [Adaptive Video System Documentation](./README-adaptive-videos.md)*
