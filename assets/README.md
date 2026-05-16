# GrowFresh assets

Drop these 4 production-quality PNGs here before building for the
Play Store. They are referenced by `app.json`:

| File                  | Size            | Used for                          |
| --------------------- | --------------- | --------------------------------- |
| `icon.png`            | 1024 × 1024     | iOS app icon + Play Store listing |
| `adaptive-icon.png`   | 1024 × 1024     | Android adaptive icon (foreground) |
| `splash.png`          | 1284 × 2778     | Launch splash screen              |
| `favicon.png`         | 48 × 48         | Web build                         |

Quick way to generate placeholder PNGs from a single SVG/logo:

```bash
# requires ImageMagick (brew install imagemagick)
cd assets
magick logo.png -resize 1024x1024 icon.png
magick logo.png -resize 1024x1024 adaptive-icon.png
magick -size 1284x2778 xc:'#0f7a3e' \( logo.png -resize 600x600 \) \
       -gravity center -composite splash.png
magick logo.png -resize 48x48 favicon.png
```

Or use Expo's online icon builder: <https://buildicon.netlify.app>
