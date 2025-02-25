# Pathformance Logo Files

This directory is where you should place your Pathformance logo image files. The application is configured to look for the following files:

- `pathformance-logo-primary.png` - The primary logo used for the main branding
- `pathformance-logo-secondary.png` - The secondary/simplified logo used in the header

## Logo Requirements

- **Format**: PNG files with transparency are recommended
- **Size**: Logos should be high resolution (at least 200x200px)
- **Aspect Ratio**: The logos should maintain their proper aspect ratio
- **Background**: Transparent backgrounds work best

Simply replace these files with your actual Pathformance logo images, and they will automatically be used throughout the application. If the image files are not found, the application will fall back to the SVG logo.

## Custom Logo Paths

If you want to use different file names or locations, you can pass custom paths to the PathformanceLogo component:

```tsx
<PathformanceLogo 
  primaryLogoSrc="/custom/path/to/logo.png" 
  secondaryLogoSrc="/custom/path/to/icon.png" 
/>
``` 