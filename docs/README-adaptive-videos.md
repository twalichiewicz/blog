# Adaptive Video System

The adaptive video system automatically selects the best video version based on the grid layout size, ensuring optimal aspect ratios for different portfolio item sizes.

## How It Works

1. **Grid Size Detection**: The system detects the `data-grid-size` attribute on portfolio items
2. **Aspect Ratio Mapping**: Maps grid sizes to optimal aspect ratios
3. **Dynamic Source Switching**: Automatically updates video sources to use the best version
4. **Graceful Fallbacks**: Falls back to compatible versions if specific aspect ratios aren't available

## Grid Size to Aspect Ratio Mapping

| Grid Size | Aspect Ratio | Video Suffix | Use Case |
|-----------|--------------|--------------|----------|
| `1x1`     | Square (1:1) | `-square`    | Small square tiles |
| `2x2`     | Square (1:1) | `-square`    | Large square tiles |
| `1x2`     | Tall (9:16)  | `-tall`      | Vertical rectangles |
| `3x1`     | Wide (16:9)  | `-wide`      | Horizontal banners |

## File Naming Convention

For a project with `cover_image: /path/to/onboarding-tool-simple.mp4`, the system expects:

```
/path/to/onboarding-tool-square.webm    # 1:1 aspect ratio (WebM)
/path/to/onboarding-tool-square.mp4     # 1:1 aspect ratio (MP4)
/path/to/onboarding-tool-tall.webm      # 9:16 aspect ratio (WebM)
/path/to/onboarding-tool-tall.mp4       # 9:16 aspect ratio (MP4)
/path/to/onboarding-tool-wide.webm      # 16:9 aspect ratio (WebM)
/path/to/onboarding-tool-wide.mp4       # 16:9 aspect ratio (MP4)
/path/to/onboarding-tool-compatible.webm # Default fallback (WebM)
/path/to/onboarding-tool-compatible.mp4  # Default fallback (MP4)
/path/to/onboarding-tool-simple.mp4     # Original file (final fallback)
```

## Source Priority Order

For each grid size, the system tries sources in this order:

1. **Aspect-specific WebM** (e.g., `onboarding-tool-square.webm`)
2. **Aspect-specific MP4** (e.g., `onboarding-tool-square.mp4`)
3. **Compatible WebM** (`onboarding-tool-compatible.webm`)
4. **Compatible MP4** (`onboarding-tool-compatible.mp4`)
5. **Original file** (`onboarding-tool-simple.mp4`)

## Usage in Markdown

Simply use your existing cover_image setup:

```yaml
---
title: My Project
cover_image: /2017/01/01/My-Project/project-video-simple.mp4
cover_video_poster: /2017/01/01/My-Project/project-poster.jpg
---
```

The system automatically:

- Detects this is a video file
- Adds the `data-base-path` attribute
- Switches sources based on grid layout
- Falls back gracefully if specific versions don't exist

## Creating Video Versions

### 1. Square Version (1:1)

```bash
ffmpeg -i original-video.mov -vf "crop=min(iw\,ih):min(iw\,ih)" -c:v libvpx-vp9 -crf 30 -b:v 0 project-square.webm
ffmpeg -i original-video.mov -vf "crop=min(iw\,ih):min(iw\,ih)" -c:v libx264 -profile:v baseline -crf 23 project-square.mp4
```

### 2. Tall Version (9:16)

```bash
ffmpeg -i original-video.mov -vf "crop=ih*9/16:ih" -c:v libvpx-vp9 -crf 30 -b:v 0 project-tall.webm
ffmpeg -i original-video.mov -vf "crop=ih*9/16:ih" -c:v libx264 -profile:v baseline -crf 23 project-tall.mp4
```

### 3. Wide Version (16:9)

```bash
ffmpeg -i original-video.mov -vf "crop=iw:iw*9/16" -c:v libvpx-vp9 -crf 30 -b:v 0 project-wide.webm
ffmpeg -i original-video.mov -vf "crop=iw:iw*9/16" -c:v libx264 -profile:v baseline -crf 23 project-wide.mp4
```

## Benefits

1. **Optimal Presentation**: Each grid size shows the video with the best possible aspect ratio
2. **Reduced Cropping**: Less important content is cropped out
3. **Better Performance**: Smaller files for specific use cases
4. **Graceful Degradation**: Works even if only some versions are provided
5. **Automatic**: No manual configuration needed per project

## Fallback Strategy

If you don't want to create all versions for every video:

1. **Minimum**: Just provide the `-compatible` versions (works for all grid sizes)
2. **Recommended**: Provide `-square` and `-compatible` versions (covers most use cases)
3. **Complete**: Provide all aspect ratio versions for perfect optimization

The system will automatically use the best available version and fall back gracefully.
