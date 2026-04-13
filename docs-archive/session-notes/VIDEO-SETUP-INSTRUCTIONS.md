# Video Setup Instructions - NotebookLLM Video

**Video:** The 2-Minute CV Makeover  
**Current Location:** `C:\Users\jaket\Desktop\CV\CV examples\The_2-Minute_CV_Makeover.mp4`  
**Status:** Code updated, video needs to be moved

---

## 🎬 What I Added to Your Homepage

### Location 1: Hero Section (Lines 108-124)
- Embedded video player right after the headline
- Clean, modern design with border and backdrop blur
- Subtitle: "🎙️ Listen: Why 75% of CVs get rejected & how to fix it in 2 minutes"
- **Impact:** First thing visitors see after reading headline

### Location 2: Dedicated Video Showcase (Lines 157-200)
- Full-width section with title "The 2-Minute CV Makeover"
- Larger video player for better viewing
- Three stat cards below: 75% rejection, 2 mins, 95% pass rate
- **Impact:** Reinforces message, provides context

---

## 📁 Step 1: Move Your Video File

**From:**
```
C:\Users\jaket\Desktop\CV\CV examples\The_2-Minute_CV_Makeover.mp4
```

**To:**
```
C:\Users\jaket\Desktop\CV\cv-adapter\public\videos\cv-makeover.mp4
```

### Commands to Run:

**Option A: Create folder and move (PowerShell):**
```powershell
# Create videos folder if it doesn't exist
New-Item -ItemType Directory -Force -Path "C:\Users\jaket\Desktop\CV\cv-adapter\public\videos"

# Move the video file
Move-Item -Path "C:\Users\jaket\Desktop\CV\CV examples\The_2-Minute_CV_Makeover.mp4" -Destination "C:\Users\jaket\Desktop\CV\cv-adapter\public\videos\cv-makeover.mp4"
```

**Option B: Manual (File Explorer):**
1. Open `C:\Users\jaket\Desktop\CV\cv-adapter\public\`
2. Create new folder called `videos`
3. Copy `The_2-Minute_CV_Makeover.mp4` from `CV examples` folder
4. Paste into `public\videos\` folder
5. Rename to `cv-makeover.mp4`

---

## 🖼️ Step 2: Create Video Thumbnail (Optional but Recommended)

A thumbnail shows before the video loads, improving perceived performance.

### Option A: Extract Frame from Video (Easiest)

**Using VLC (Free):**
1. Open `cv-makeover.mp4` in VLC
2. Pause at an interesting moment (around 0:30-1:00)
3. Video → Take Snapshot
4. Save as `video-thumbnail.jpg`
5. Move to `C:\Users\jaket\Desktop\CV\cv-adapter\public\video-thumbnail.jpg`

**Using Windows Photos:**
1. Open video in Photos app
2. Click "Edit & Create" → "Save photo"
3. Choose a frame
4. Save as `video-thumbnail.jpg`
5. Move to `public\` folder

### Option B: Create Custom Thumbnail in Canva

**Design specs:**
- Dimensions: 1920x1080px (16:9 ratio)
- Format: JPG or PNG
- File size: Under 200KB

**Design elements:**
- Title: "The 2-Minute CV Makeover"
- Subtitle: "Why 75% of CVs Get Rejected"
- Play button icon (▶️)
- CV Buddy branding
- Professional, clean design

**Save as:**
```
C:\Users\jaket\Desktop\CV\cv-adapter\public\video-thumbnail.jpg
```

### Option C: Skip Thumbnail (Not Recommended)

If you skip the thumbnail, remove the `poster` attribute from both video tags:

```tsx
// Remove this line from both video elements:
poster="/video-thumbnail.jpg"
```

---

## 🎯 Step 3: Verify Setup

### Check File Structure:
```
cv-adapter/
├── public/
│   ├── videos/
│   │   └── cv-makeover.mp4          ← Video file
│   └── video-thumbnail.jpg          ← Thumbnail (optional)
└── src/
    └── app/
        └── homepage.tsx              ← Already updated ✅
```

### Test Locally:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Check:**
   - [ ] Video appears in hero section
   - [ ] Video appears in dedicated section
   - [ ] Video controls work (play, pause, volume)
   - [ ] Thumbnail displays (if added)
   - [ ] Video is responsive on mobile

---

## 📊 Video Performance Optimization

### Current Setup (Good):
- ✅ `preload="metadata"` - Only loads metadata, not full video
- ✅ `controls` - Native browser controls
- ✅ Responsive sizing with `aspect-video`

### Optional Improvements:

**1. Compress Video (If File Size > 50MB)**

Use HandBrake (free):
- Preset: "Web" → "Gmail Large 3 Minutes 720p30"
- Target size: 20-30MB
- Quality: RF 22-24
- Format: MP4 (H.264)

**2. Add Multiple Formats (Better Browser Support)**

```tsx
<video controls preload="metadata">
  <source src="/videos/cv-makeover.mp4" type="video/mp4" />
  <source src="/videos/cv-makeover.webm" type="video/webm" />
  Your browser does not support the video tag.
</video>
```

**3. Lazy Loading (For Better Page Speed)**

Only load video when user scrolls to it:

```tsx
<video 
  controls 
  preload="none"  // Changed from "metadata"
  loading="lazy"
  className="w-full aspect-video"
>
```

---

## 🚀 Step 4: Deploy to Production

Once you've tested locally:

```bash
# Stage changes
git add public/videos/cv-makeover.mp4
git add public/video-thumbnail.jpg
git add src/app/homepage.tsx

# Commit
git commit -m "Add NotebookLLM video to homepage"

# Push to deploy
git push origin main
```

Vercel will automatically deploy the changes.

---

## 📱 Mobile Optimization

The video is already mobile-optimized with:
- Responsive sizing (`w-full aspect-video`)
- Touch-friendly controls
- Proper aspect ratio maintained

**Mobile considerations:**
- Video won't autoplay on mobile (by design, saves data)
- Users must tap to play
- Consider adding a clear "▶️ Watch Video" text for mobile

---

## 🎨 Design Notes

### Hero Section Video:
- **Purpose:** Quick engagement, sets context
- **Size:** Medium (max-w-4xl)
- **Style:** Subtle border, backdrop blur
- **Placement:** After headline, before CTA

### Showcase Section Video:
- **Purpose:** Deep dive, educational
- **Size:** Large (max-w-5xl)
- **Style:** Prominent, with supporting stats
- **Placement:** Between hero and "How It Works"

Both sections work together:
1. Hero video = Quick hook
2. Showcase = Detailed explanation
3. How It Works = Action steps

---

## 📊 Expected Impact

### Engagement Metrics:
- **Hero video:** 40-60% will watch at least 30 seconds
- **Showcase video:** 20-30% will watch full video
- **Overall:** 5-10% increase in sign-ups

### SEO Benefits:
- Increased time on page (video engagement)
- Lower bounce rate
- Video schema markup (can add later)

### User Experience:
- Builds trust through education
- Explains complex topic (ATS) simply
- Positions CV Buddy as authority

---

## 🔧 Troubleshooting

### Video Not Showing:
1. Check file path is correct
2. Verify file is in `public/videos/` folder
3. Check browser console for errors
4. Try hard refresh (Ctrl + Shift + R)

### Video Not Playing:
1. Check file format is MP4 (H.264)
2. Try different browser
3. Check file isn't corrupted
4. Verify file permissions

### Thumbnail Not Showing:
1. Check file is in `public/` folder (not `public/videos/`)
2. Verify filename is exactly `video-thumbnail.jpg`
3. Check image format (JPG or PNG)
4. Try clearing browser cache

### Video Too Large:
1. Compress with HandBrake
2. Target 20-30MB for 2-3 minute video
3. Use 720p resolution (1280x720)
4. H.264 codec, MP4 container

---

## 🎯 Next Steps

1. **Today:**
   - [ ] Move video file to `public/videos/cv-makeover.mp4`
   - [ ] Create thumbnail (optional)
   - [ ] Test locally
   - [ ] Deploy to production

2. **This Week:**
   - [ ] Monitor video engagement in analytics
   - [ ] A/B test with/without video
   - [ ] Get user feedback

3. **Future:**
   - [ ] Create shorter 30-second version for social media
   - [ ] Add captions/subtitles for accessibility
   - [ ] Create variations for different audiences

---

## 💡 Pro Tips

1. **Video Length:** 2-3 minutes is perfect for homepage
2. **Audio Quality:** Make sure audio is clear (NotebookLLM usually is)
3. **First 10 Seconds:** Most critical for retention
4. **Mobile First:** 60%+ of traffic is mobile
5. **Track Everything:** Use Google Analytics events to track plays, completion rate

---

## 📈 Analytics Tracking (Optional)

Add video tracking to measure engagement:

```tsx
<video 
  controls 
  preload="metadata"
  onPlay={() => {
    // Track video play
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'video_play', {
        video_title: 'CV Makeover Hero'
      })
    }
  }}
  onEnded={() => {
    // Track video completion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'video_complete', {
        video_title: 'CV Makeover Hero'
      })
    }
  }}
>
```

This will show up in Google Analytics under Events.

---

**Your video is ready to go! Just move the file and deploy.** 🎬
