# Notebook Sticker Examples

This guide shows how to use both regular and die-cut sticker styles on notebook covers.

## Basic Sticker Configuration

```yaml
notebook_stickers:
  - text: "SHIPPED"
    color: "#fff"
    bg: "#00c853"
    rotate: "-3deg"
```

## Die-Cut Stickers

Die-cut stickers have a tighter, text-hugging design with less padding and a more authentic look:

```yaml
notebook_stickers:
  - text: "AI/ML"
    color: "#fff"
    bg: "#1a237e"
    rotate: "-4deg"
    style: "die-cut"  # Enable die-cut style
```

## Shape Options

Both regular and die-cut stickers support different shapes:

```yaml
notebook_stickers:
  - text: "⭐"
    color: "#ffd600"
    bg: "#000"
    shape: "circle"    # Perfect for emoji/icons
    
  - text: "BETA"
    color: "#fff"
    bg: "#ff4444"
    shape: "rounded"   # Rounded corners
    
  - text: "v2.0"
    color: "#000"
    bg: "#ffeb3b"
    shape: "badge"     # Badge shape (die-cut only)
    style: "die-cut"
```

## Complete Example

```yaml
notebook_color: nordic-blue
notebook_texture: worn
notebook_brand: leuchtturm
notebook_stickers:
  - text: "SHIPPED"
    color: "#fff"
    bg: "#00c853"
    rotate: "-5deg"
    style: "regular"   # Traditional sticker
    
  - text: "2024"
    color: "#000"
    bg: "#ffd600"
    rotate: "3deg"
    style: "die-cut"   # Text-hugging style
    
  - text: "⚡"
    color: "#fff"
    bg: "#e91e63"
    shape: "circle"
    style: "regular"
    
  - text: "MVP"
    color: "#fff"
    bg: "#3f51b5"
    rotate: "-2deg"
    shape: "badge"
    style: "die-cut"
```

## Positioning

You can customize sticker positions with CSS variables:

```yaml
notebook_stickers:
  - text: "NEW"
    color: "#fff"
    bg: "#ff5722"
    top: "30px"
    right: "30px"
    style: "die-cut"
```

## Style Comparison

| Property | Regular Style | Die-Cut Style |
|----------|--------------|---------------|
| Padding | 6px 14px | 3px 8px |
| Border | 3px solid white | 2px solid white |
| Font Size | 11px | 13px |
| Font Weight | 700 | 900 |
| Shadow | Pronounced | Subtle |
| Best For | Status badges | Text labels |