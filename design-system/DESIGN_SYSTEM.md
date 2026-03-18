# CV Adapter Design System
## Bold Minimalist Style Guide

**Created:** March 2026  
**Version:** 1.0  
**Philosophy:** Cut through the noise. Bold typography. High contrast. No fluff.

---

## 🎨 Color Palette

### Primary Colors
- **Black**: `#000000` - Main background, text on light backgrounds
- **White**: `#FFFFFF` - Text on dark backgrounds, CTAs on black
- **Gray-900**: `#111827` - Secondary dark backgrounds
- **Gray-400**: `#9CA3AF` - Muted text, secondary information
- **Gray-300**: `#D1D5DB` - Light text on dark backgrounds

### Accent Colors (Gradients)
- **Blue-Purple Gradient**: `from-blue-400 via-purple-400 to-pink-400`
- **Blue-Indigo Gradient**: `from-blue-500 to-purple-500`
- **Stats Gradients**:
  - Blue-Purple: `from-blue-400 to-purple-400`
  - Purple-Pink: `from-purple-400 to-pink-400`
  - Pink-Red: `from-pink-400 to-red-400`
  - Green-Emerald: `from-green-400 to-emerald-400`

### Functional Colors
- **Success Green**: `#10B981` (green-400)
- **Warning Yellow**: `#FBBF24` (yellow-400)
- **Error Red**: `#EF4444` (red-500)

---

## 📝 Typography

### Font Weights
- **Black**: `font-black` (900) - Main headlines, numbers
- **Bold**: `font-bold` (700) - Subheadings, CTAs
- **Semibold**: `font-semibold` (600) - Secondary headings
- **Medium**: `font-medium` (500) - Body emphasis
- **Light**: `font-light` (300) - Subtext, descriptions

### Font Sizes (Responsive)
```tsx
// Massive Headlines (Hero)
text-5xl sm:text-6xl md:text-7xl lg:text-8xl

// Large Headlines (Sections)
text-5xl sm:text-6xl md:text-7xl

// Medium Headlines
text-3xl sm:text-4xl md:text-5xl

// Subheadings
text-2xl sm:text-3xl

// Body Large
text-xl sm:text-2xl

// Body Regular
text-base sm:text-lg

// Small Text
text-sm
```

### Letter Spacing
- **Headlines**: `tracking-tight` or `tracking-tighter`
- **Body**: Default tracking
- **Buttons**: Default tracking

### Line Height
- **Headlines**: `leading-none` or `leading-tight`
- **Body**: `leading-relaxed`

---

## 🎯 Layout Principles

### Spacing Scale
- **Massive**: `py-32` (128px) - Section spacing
- **Large**: `py-20` (80px) - Subsection spacing
- **Medium**: `py-12` (48px) - Component spacing
- **Small**: `py-8` (32px) - Element spacing
- **Tiny**: `py-4` (16px) - Tight spacing

### Container Widths
```tsx
// Full width sections
container mx-auto px-4

// Content width
max-w-6xl mx-auto  // Main content
max-w-4xl mx-auto  // Narrow content
max-w-2xl mx-auto  // Very narrow (pricing, forms)
```

### Grid Systems
```tsx
// Stats/Features (2-4 columns)
grid grid-cols-2 md:grid-cols-4 gap-8

// Two column
grid md:grid-cols-2 gap-8

// Three column
grid md:grid-cols-3 gap-8
```

---

## 🎭 Component Patterns

### Buttons

#### Primary CTA (White on Black)
```tsx
className="bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
```

#### Secondary CTA (Black on White)
```tsx
className="bg-black text-white px-12 py-6 rounded-full text-xl font-black hover:bg-gray-900 transition-all shadow-2xl"
```

#### Small Button
```tsx
className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
```

### Cards

#### Glass Morphism (on dark)
```tsx
className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12"
```

#### Minimal Card (on light)
```tsx
className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all"
```

#### Quote/Testimonial
```tsx
className="border-l-4 border-blue-600 pl-8"
```

### Headers

#### Fixed Header (Dark)
```tsx
className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10"
```

### Sections

#### Dark Section
```tsx
className="py-32 bg-black text-white"
```

#### Light Section
```tsx
className="py-32 bg-white"
```

#### Gradient Section
```tsx
className="py-32 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden"
```

---

## ✨ Animation & Effects

### Hover Effects
```tsx
// Scale up
hover:scale-105

// Translate
group-hover:translate-x-2

// Shadow
hover:shadow-2xl

// Background
hover:bg-gray-100
```

### Transitions
```tsx
transition-all  // All properties
transition-colors  // Colors only
transition-transform  // Transform only
```

### Animated Blobs (Background)
```tsx
<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-blob"></div>
<div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
```

### Gradient Text
```tsx
className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
```

---

## 📐 Design Rules

### Content Hierarchy
1. **One massive headline per section** - Make it count
2. **Minimal subtext** - 1-2 sentences max
3. **Single CTA per section** - Clear action
4. **Breathing room** - Generous spacing everywhere

### Information Density
- **70% reduction** from traditional designs
- Every word must earn its place
- Remove all "marketing fluff"
- Show, don't tell

### Visual Weight
- **Headlines**: Font-black, massive size
- **Stats/Numbers**: Gradient text, huge
- **Body**: Light weight, smaller
- **CTAs**: Bold, high contrast

### Contrast Principles
- Black text on white backgrounds
- White text on black backgrounds
- No gray-on-gray
- High contrast always

---

## 🎪 Section Templates

### Hero Section Template
```tsx
<section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden pt-20">
  {/* Animated background */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
  
  {/* Content */}
  <div className="container mx-auto text-center max-w-6xl relative z-10">
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none tracking-tighter">
      Your Headline.
      <br />
      <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Gradient Word.
      </span>
    </h1>
    
    <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
      Short, powerful subheading.
    </p>
    
    <Link href="/cta" className="bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
      <span>Call to Action</span>
      <ArrowRight className="w-6 h-6" />
    </Link>
  </div>
</section>
```

### Stats Section Template
```tsx
<section className="py-32 bg-black text-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-20">
      <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight">
        Section Title
        <br />
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Gradient Emphasis
        </span>
      </h2>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
      <div className="text-center">
        <div className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          95%
        </div>
        <div className="text-lg text-gray-400">Metric Label</div>
      </div>
    </div>
  </div>
</section>
```

---

## 🚫 What NOT to Do

### Avoid
- ❌ Multiple CTAs in one section
- ❌ Long paragraphs (max 2 sentences)
- ❌ Feature lists with 10+ items
- ❌ Small typography
- ❌ Low contrast colors
- ❌ Cluttered layouts
- ❌ Generic stock photos
- ❌ Unnecessary sections
- ❌ Marketing jargon

### Instead
- ✅ Single, clear CTA
- ✅ Short, punchy copy
- ✅ 3-4 key features max
- ✅ Massive, bold typography
- ✅ Black/white contrast
- ✅ Generous whitespace
- ✅ Minimal or no images
- ✅ Essential sections only
- ✅ Direct, honest language

---

## 📱 Responsive Breakpoints

```tsx
// Mobile first approach
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
```

### Mobile Considerations
- Stack everything vertically
- Reduce font sizes (but keep them bold)
- Maintain generous spacing
- Single column layouts
- Full-width CTAs

---

## 🎨 Form Styling

### Input Fields
```tsx
className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
```

### Labels
```tsx
className="block text-sm font-semibold text-gray-300 mb-2"
```

### Error States
```tsx
className="border-red-500 focus:border-red-500"
```

---

## 🔗 Navigation

### Desktop Nav
```tsx
<nav className="hidden md:flex items-center space-x-8">
  <Link href="#" className="text-gray-400 hover:text-white font-medium transition-colors">
    Link
  </Link>
</nav>
```

### Mobile Nav
- Minimal links (3-4 max)
- Hamburger menu if needed
- Full-screen overlay for menu

---

## 💡 Key Principles Summary

1. **Bold Over Beautiful** - Impact over aesthetics
2. **Less is More** - Remove 70% of content
3. **Black & White** - High contrast always
4. **Massive Typography** - Go bigger than comfortable
5. **Single Focus** - One message, one CTA per section
6. **Generous Spacing** - Let content breathe
7. **Fast & Direct** - No fluff, no jargon
8. **Mobile First** - Design for small screens first

---

## 🎯 Success Metrics

A design following this system should:
- Load in < 2 seconds
- Have < 5 sections on any page
- Use < 100 words above the fold
- Feature 1 primary CTA per section
- Maintain 60%+ whitespace ratio
- Score 90+ on PageSpeed Insights

---

**Remember:** If in doubt, make it bigger, bolder, and remove more content.
