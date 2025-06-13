# Custom Emoji Directory

This directory contains custom emoji images for use in blog posts and pages.

## Usage

In your markdown posts, you can use custom emojis with the syntax:
```
:emoji-name:
```

For example:
- `:jim:` - Jim from The Office
- `:skully:` - Your skull mascot
- `:party-skully:` - Party version of skull
- `:thomas:` - Your avatar

## Adding New Emojis

1. Add your image file to this directory (PNG, JPG, or GIF)
2. Update the `customEmojis` object in `/themes/san-diego/scripts/emoji-processor.js`
3. Use optimal image sizes (recommended: 128x128px for static, max 256x256px for GIFs)

## Supported Formats

- PNG (recommended for static emojis)
- JPG/JPEG (for photos)
- GIF (for animated emojis)

## Standard Emojis

You can also use any standard emoji by name, like:
- `:smile:` → 😊
- `:fire:` → 🔥
- `:rocket:` → 🚀
- `:thumbs-up:` → 👍

See the full list in the emoji processor script.