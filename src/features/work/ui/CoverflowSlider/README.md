# CoverflowSlider Component

A stunning 3D Coverflow-style image slider built with React, featuring dynamic background transitions and smooth animations.

## Features

- ✨ **Dynamic Background**: First two items serve as full-screen backgrounds
- 🎯 **Smooth Transitions**: Cards smoothly slide when navigating
- 📱 **Fully Responsive**: Optimized for all screen sizes
- 🎨 **Modern Design**: Text content on left, cards from middle to right
- 🔄 **Smart Animation**: Content appears with fade-in blur effect
- 🎮 **Interactive Controls**: Next/Previous buttons at the bottom
- ♿ **Accessible**: ARIA labels and semantic HTML

## How It Works

The slider uses a clever technique:
- **Items 1-2**: Full-screen background images (only #2 shows content)
- **Items 3+**: Visible cards positioned from middle to right
- **Navigation**: Clicking next/prev rotates the array of items
- **Background Change**: As items rotate, the background smoothly transitions

## Usage

```jsx
import CoverflowSlider from './components/ui/CoverflowSlider';
import image1 from './images/slide1.jpg';

const slides = [
  {
    image: image1,
    title: 'Amazing Design',
    description: 'Beautiful and engaging visual content that captures attention.',
    buttonText: 'Read More',
    buttonAction: () => console.log('Clicked!')
  },
  // ... more slides (minimum 6 recommended)
];

<CoverflowSlider slides={slides} />
```

## Props

### `slides` (required)
Array of slide objects with the following structure:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `image` | string | Yes | URL or import path to the slide image |
| `title` | string | Yes | Main heading for the slide |
| `description` | string | Yes | Description text for the slide |
| `buttonText` | string | No | Text for the call-to-action button |
| `buttonAction` | function | No | Click handler for the button |

### `autoPlay` (optional)
Boolean to enable/disable auto-play. Default: `false`

### `autoPlayInterval` (optional)
Number of milliseconds between auto-play transitions. Default: `5000` (5 seconds)

## Example Usage

```jsx
// Basic usage (manual navigation)
<CoverflowSlider slides={designSlides} />

// With auto-play enabled
<CoverflowSlider slides={designSlides} autoPlay={true} autoPlayInterval={4000} />
```

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────────┐              ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
│  │  TITLE   │     [BG 2]   │3 │ │4 │ │5 │ │6 │   │
│  │          │              └──┘ └──┘ └──┘ └──┘   │
│  │  DESC    │    (Content                         │
│  │          │     visible)     Cards from         │
│  │ [Button] │                  middle to right    │
│  └──────────┘                                      │
│   Text on left                                     │
│                    [Prev] [Next]                   │
└─────────────────────────────────────────────────────┘
     Background 1 (behind everything)
```

## Navigation Behavior

1. **Click Next**: First item moves to the end
   - Background changes from item #2 to the new item #2
   - All cards shift left
   
2. **Click Prev**: Last item moves to the beginning
   - Background changes accordingly
   - All cards shift right

## Responsive Breakpoints

- **Desktop** (>900px): 200px × 300px cards, 220px spacing
- **Tablet** (650-900px): 160px × 270px cards, 170px spacing
- **Mobile** (<650px): 130px × 220px cards, 140px spacing

## Customization

### Change Card Sizes
Modify in `CoverflowSlider.css`:

```css
.item {
  width: 200px;
  height: 300px;
}
```

### Adjust Card Spacing
```css
.item:nth-child(3) { left: 50%; }
.item:nth-child(4) { left: calc(50% + 220px); } /* Change spacing here */
.item:nth-child(5) { left: calc(50% + 440px); }
```

### Modify Animation Speed
```css
.item {
  transition: transform 0.1s, left 0.75s, top 0.75s, width 0.75s, height 0.75s;
  /* Adjust the timing values above */
}
```

### Change Content Animation
```css
@keyframes show {
  0% {
    filter: blur(5px);
    transform: translateY(calc(-50% + 75px));
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Uses CSS transforms for smooth animations
- Efficient array manipulation for item rotation
- Hardware-accelerated transitions
- Minimal re-renders with React

## Accessibility

- ARIA labels on navigation buttons
- Semantic HTML structure (`<main>`, `<nav>`, `<ul>`, `<li>`)
- Keyboard navigation ready
- Screen reader friendly

## Tips

1. **Minimum Slides**: Use at least 6 slides for the best effect
2. **Image Quality**: Use high-resolution images (at least 1920×1080)
3. **Content Length**: Keep titles short and descriptions concise
4. **Button Actions**: Add meaningful interactions to buttons

## Credits

Based on the amazing coverflow slider design pattern, adapted for React with modern best practices.

---

**Version**: 2.0.0  
**Updated**: October 29, 2025  
**License**: Part of MSS Project
