# Improve Language Detection

## Current Issue
English CVs are sometimes detected as Czech (or other languages) due to:
1. Short text samples
2. Low confidence detection
3. Franc-min library limitations

## Proposed Solution

### Option 1: Increase Confidence Threshold (Recommended)

Modify `src/lib/language-detection.ts`:

```typescript
export function detectLanguage(text: string, minLength: number = 200): LanguageDetectionResult {
  // Increased from 50 to 200 characters for better accuracy
  const cleanText = text.trim()
  
  // Default to English if text is too short
  if (cleanText.length < minLength) {
    return {
      code: 'en',
      name: 'English',
      confidence: 'low'
    }
  }

  try {
    const detected = franc(cleanText, { minLength: 10 })
    
    if (detected === 'und') {
      return {
        code: 'en',
        name: 'English',
        confidence: 'low',
        rawCode: detected
      }
    }

    const languageCode = LANGUAGE_MAP[detected] || 'en'
    const languageName = LANGUAGE_NAMES[languageCode] || 'English'
    
    // More conservative confidence thresholds
    let confidence: 'high' | 'medium' | 'low' = 'high'
    if (cleanText.length < 1000) confidence = 'medium'
    if (cleanText.length < 500) confidence = 'low'

    // 🔥 NEW: Default to English for low confidence non-English detections
    if (confidence === 'low' && languageCode !== 'en') {
      console.log(`⚠️ Low confidence ${languageName} detection, defaulting to English`)
      return {
        code: 'en',
        name: 'English',
        confidence: 'low',
        rawCode: detected
      }
    }

    return {
      code: languageCode,
      name: languageName,
      confidence,
      rawCode: detected
    }
  } catch (error) {
    console.error('Language detection error:', error)
    return {
      code: 'en',
      name: 'English',
      confidence: 'low'
    }
  }
}
```

### Option 2: Multi-Sample Detection

Take multiple samples from different parts of the CV:

```typescript
export function detectLanguageFromCV(sections: CVSection[]): LanguageDetectionResult {
  // Combine text from multiple sections for better accuracy
  const samples: string[] = []
  
  // Get professional summary
  const summary = sections.find(s => s.type === 'summary')
  if (summary) {
    samples.push(typeof summary.content === 'string' ? summary.content : JSON.stringify(summary.content))
  }
  
  // Get work experience
  const experience = sections.find(s => s.type === 'experience')
  if (experience) {
    samples.push(typeof experience.content === 'string' ? experience.content : JSON.stringify(experience.content))
  }
  
  // Get education
  const education = sections.find(s => s.type === 'education')
  if (education) {
    samples.push(typeof education.content === 'string' ? education.content : JSON.stringify(education.content))
  }
  
  // Combine all samples
  const combinedText = samples.join('\n\n')
  
  // Detect language from combined text
  return detectLanguage(combinedText, 300)
}
```

### Option 3: Add Manual Confirmation UI

Show a confirmation when low-confidence detection:

```typescript
// In upload/route.ts
const detection = detectLanguage(fullText)

if (detection.confidence === 'low') {
  // Return detected language but flag it for user confirmation
  return NextResponse.json({
    success: true,
    cv_id: cvData.id,
    detected_language: detection.code,
    language_confidence: 'low',
    needs_confirmation: true,
    message: `We detected ${detection.name}, but we're not very confident. Please confirm or change the language.`
  })
}
```

## Recommended Implementation

**Start with Option 1** (easiest, most effective):

1. Increase `minLength` to 200
2. Add low-confidence English default
3. Adjust confidence thresholds

**Then add Option 2** if needed:
- Use multi-sample detection for better accuracy

**Finally Option 3** if still issues:
- Add UI confirmation for low-confidence detections

## Testing

After implementing, test with:
1. Short English CV (< 500 chars)
2. Long English CV (> 1000 chars)
3. Mixed language CV (English + Czech names)
4. Pure Czech CV
5. Pure French CV

## Want me to implement this?

Let me know and I can:
1. Implement Option 1 (5 minutes)
2. Test with sample CVs
3. Deploy and verify

Just say "improve language detection" and I'll do it! 🚀
