# Mobile Community Creation Flow - 3-Question AI-Guided Onboarding

## Overview
A conversational, AI-assisted flow where users answer 3 simple questions to create their community from scratch. Leapy AI helps at every step with suggestions and generates a complete community structure.

---

## 🎯 Flow Stages

### Stage 1: Introduction (Intro)
**Purpose**: Set expectations and excitement

**Screen Content:**
- Large Leapy AI avatar (gradient circle)
- Headline: "Let's build your community together"
- Subtext: "I'll ask you 3 simple questions..."
- 3 Preview cards showing what's coming:
  1. 👥 Tell me about your community
  2. 🎯 Define your goals
  3. ⚡ Get AI-powered setup

**User Action:** Tap "Let's Start" button

---

### Stage 2: Question 1 - Community Name
**AI Asks:** "What's your community about?"

**AI Context Panel:**
```
Leapy AI suggests:
- Design Thinking Practitioners
- Product Managers & Leaders
- UX Designers Community
- Tech Entrepreneurs Hub
```

**User Input:**
- Text input field: "Community Name"
- Voice button (mic icon) for hands-free input
- Tap any suggestion to auto-fill

**Validation:** Must enter text to continue

**Progress:** 1 of 3 (33% complete)

---

### Stage 3: Question 2 - Community Goal
**AI Asks:** "What's the main goal?"

**AI Context Panel:**
```
Leapy AI suggests:
- To learn best practices and share experiences
- To network and find collaboration opportunities
- To get mentorship and career guidance
- To build a business around my expertise
```

**User Input:**
- Textarea (3 rows): "Community Goal"
- Voice button for dictation
- Tap suggestions to use them

**Navigation:** Back button available

**Progress:** 2 of 3 (66% complete)

---

### Stage 4: Question 3 - Target Audience
**AI Asks:** "Who's your target audience?"

**AI Context Panel:**
```
Leapy AI suggests:
- Beginners looking to learn
- Professionals wanting to level up
- Experts seeking to share knowledge
- Mix of all experience levels
```

**User Input:**
- Textarea (3 rows): "Target Audience"
- Voice button for input
- Tap suggestions to apply

**Navigation:** Back button available

**CTA:** Button changes to "✨ Generate" (instead of Continue)

**Progress:** 3 of 3 (100% complete)

---

### Stage 5: AI Thinking (Processing)
**Purpose**: Show AI working magic

**Animation:**
- Large spinning Leapy avatar (gradient circle with loader)
- Headline: "AI is creating your community..."
- Subtext: "Analyzing your inputs..."

**Progress Steps (Sequential):**
1. ✅ Designing community structure (complete)
2. ✅ Creating channels & spaces (complete)
3. 🔄 Setting up engagement features (in progress)
4. ⏳ Personalizing recommendations (pending)

**Duration:** 3 seconds (simulated AI generation)

**Cannot dismiss:** No close button during processing

---

### Stage 6: Preview & Launch
**Purpose**: Show AI-generated structure, get approval

**Success Banner:**
```
✅ Your community is ready!
Review the structure and launch when ready
```

**Community Overview Card:**
- Community name (editable)
- Description (editable)
- 3 stat cards:
  - Type: "Academy"
  - Channels: 5
  - Features: "Active"

**Channels Created (Auto-generated):**
1. 👋 #welcome - "Welcome new members and guidelines"
2. 👥 #introductions - "Members introduce themselves"
3. 💬 #general-discussion - "Open discussions about [topic]"
4. 📚 #resources - "Helpful resources and materials"
5. 📅 #events - "Community events and meetups"

**AI Features Enabled Card:**
```
✨ AI-Powered Features Enabled
✓ Gamification (badges, points, leaderboard)
✓ Smart content recommendations
✓ Automated engagement tracking
✓ AI moderation assistance
```

**Actions:**
- ← Edit (go back to questions)
- ✅ Launch Community (complete setup)

---

## 📊 Complete User Journey

```
Welcome Screen
  ↓
Tap "Create a community" quick action
  ↓
Bottom sheet slides up: Introduction
  ↓
User taps "Let's Start"
  ↓
Question 1: Community Name
  - User sees 4 AI suggestions
  - User types: "Design Thinking Academy"
  - OR taps a suggestion
  - Progress: 33%
  ↓
Continue → Question 2: Goal
  - User sees 4 AI suggestions
  - User types or selects goal
  - Progress: 66%
  ↓
Continue → Question 3: Audience
  - User sees 4 AI suggestions
  - User types or selects audience
  - Progress: 100%
  ↓
Generate → AI Thinking (3 seconds)
  - Animated progress steps
  - User waits, cannot dismiss
  ↓
Preview Screen
  - AI-generated structure shown
  - 5 channels created
  - Gamification enabled
  - User reviews
  ↓
Launch Community → Community Dashboard!
  - Full dashboard with imported structure
  - Bottom nav appears
  - FAB visible
  - Ready to manage
```

**Total Time:** ~60-90 seconds

---

## 🎨 UI Components

### Progress Bar
```tsx
Question 1: 33% filled (purple gradient)
Question 2: 66% filled
Question 3: 100% filled
```

### AI Helper Panel (Dismissible)
```tsx
[Leapy Avatar] Leapy AI suggests:
               Tap any suggestion to use it
               [X close]

[💡 Suggestion 1]
[💡 Suggestion 2]
[💡 Suggestion 3]
[💡 Suggestion 4]
```

### Question Card (Consistent Design)
```tsx
[Icon] What's your community about?
       Give your community a name...

[AI Helper Panel - collapsible]

[Input Field with Voice Button]

[Continue Button]
```

---

## 💡 AI Assistance Features

### Context-Aware Suggestions
Each question has 4 carefully curated suggestions that:
- Match common use cases
- Inspire users who are stuck
- Speed up the process
- Showcase possibilities

### Voice Input Support
- Mic button on every text field
- Dictation instead of typing
- Mobile-first accessibility
- Faster than keyboard

### Smart Defaults
All AI features enabled by default:
- Gamification ✓
- Smart recommendations ✓
- Engagement tracking ✓
- Moderation assistance ✓

### AI-Generated Structure
Based on user inputs, AI creates:
- 5 relevant channels
- Channel names that fit the topic
- Channel descriptions
- Appropriate channel types
- Engagement features

---

## 🎯 Design Patterns

### Bottom Sheet Pattern
- Height: 90vh (almost full screen)
- Rounded top corners: 24px
- Cannot dismiss during AI processing
- Swipe down to dismiss (when allowed)

### Progress Indication
- Linear progress bar (top)
- Percentage shown (e.g., "33%")
- Question count ("Question 1 of 3")
- Step indicator in AI processing

### Touch Optimization
- All buttons: 48px+ height
- Generous padding: 16px
- Large tap targets for suggestions
- Voice buttons prominent

### Visual Hierarchy
1. Question headline (largest)
2. AI suggestions (prominent cards)
3. Input field (clear, focused)
4. Navigation buttons (bottom)

---

## 📱 Mobile-Specific Optimizations

### One-Handed Use
- Primary button at bottom (thumb zone)
- Back button bottom-left
- Continue button bottom-right
- Voice buttons right side of input

### Keyboard Handling
- Input auto-focuses
- Keyboard pushes content up
- Buttons remain visible
- Smooth transitions

### Safe Areas
- Respects iOS notch
- Bottom spacing for home indicator
- Content doesn't clip

---

## 🔄 State Management

### User Answers Stored
```typescript
communityName: string       // Question 1
communityGoal: string       // Question 2
targetAudience: string      // Question 3
```

### Generated Data
```typescript
generatedData: {
  title: string
  description: string
  type: 'academy'
  spaces: CommunitySpace[]   // 5 channels
  gamification: {
    leaderboard: true
    badges: true
    points: true
  }
}
```

### Flow State
```typescript
step: 'intro' | 'question1' | 'question2' | 'question3' | 'ai-thinking' | 'preview'
showAIHelp: boolean          // AI panel visible/hidden
isAIThinking: boolean        // Processing state
```

---

## ✅ Validation Rules

### Question 1 (Community Name)
- Required: Yes
- Min length: 1 character
- Max length: None
- Continue disabled until text entered

### Question 2 (Community Goal)
- Required: Yes
- Min length: 1 character
- Can be multi-line
- Continue disabled until text entered

### Question 3 (Target Audience)
- Required: Yes
- Min length: 1 character
- Can be multi-line
- Generate disabled until text entered

---

## 🎭 Error Handling

### Empty Input
- Continue button disabled (grayed out)
- No error message shown
- User must type or select suggestion

### AI Generation Failed
- Retry button shown
- Error message: "Something went wrong. Please try again."
- User can go back and edit answers

### User Dismisses Mid-Flow
- Confirmation dialog: "Are you sure? Progress will be lost"
- If confirmed: Close sheet, reset state
- If cancelled: Stay in flow

---

## 📊 Success Metrics

### Flow Completion
- **Target**: 85%+ complete all 3 questions
- **Measure**: % who reach "Launch Community"

### AI Suggestion Adoption
- **Target**: 60%+ use at least 1 suggestion
- **Measure**: % who tap suggestion vs type

### Time to Complete
- **Target**: 60-90 seconds average
- **Measure**: Time from intro to launch

### Voice Input Usage
- **Target**: 25%+ use voice at least once
- **Measure**: Mic button taps

---

## 🔗 Integration Points

### Entry Points
1. Welcome screen → "Create a community" quick action
2. Welcome screen → Type "create community" → Hit Go
3. Quick prompts → Tap community card

### Exit Points
- Launch Community → Community Dashboard
- User created community appears in dashboard
- Bottom nav shows, FAB appears
- Ready for immediate use

### Data Flow
```
MobileWelcomeScreen
  ↓ (onStart with type='community')
MobileApp (opens creation flow)
  ↓
MobileCommunityCreationFlow (3 questions + AI)
  ↓ (onComplete with generatedData)
MobileApp (sets communityData, stage='dashboard')
  ↓
MobileCommunityDashboard (shows created community)
```

---

## 🎨 Visual Examples

### Introduction Screen
```
┌─────────────────────┐
│  [X]                │
│                     │
│    [Leapy Icon]     │
│        🤖           │
│                     │
│  Let's build your   │
│  community together │
│                     │
│  I'll ask 3 simple  │
│  questions...       │
│                     │
│  ┌───────────────┐  │
│  │ 👥 Tell me... │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ 🎯 Define...  │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ ⚡ Get AI...  │  │
│  └───────────────┘  │
│                     │
│ [✨ Let's Start]    │
└─────────────────────┘
```

### Question Screen
```
┌─────────────────────┐
│  [X]    Question 1  │
│         of 3  33%   │
│  ▓▓▓▓▓░░░░░         │
│                     │
│  💬 What's your     │
│     community about?│
│                     │
│  ┌───────────────┐  │
│  │ 🤖 Leapy AI   │  │
│  │  suggests:    │  │
│  │               │  │
│  │ [💡 Design... ]│  │
│  │ [💡 Product...]│  │
│  │ [💡 UX Des... ]│  │
│  │ [💡 Tech E... ]│  │
│  └───────────────┘  │
│                     │
│  Community Name     │
│  ┌───────────────┐  │
│  │ [text...] 🎤  │  │
│  └───────────────┘  │
│                     │
│  [Continue →]       │
└─────────────────────┘
```

### Preview Screen
```
┌─────────────────────┐
│  [X]                │
│                     │
│  ✅ Your community  │
│     is ready!       │
│                     │
│  Design Thinking... │
│  To learn best...   │
│                     │
│  [Academy] [5] [✓]  │
│                     │
│  Channels Created:  │
│  ┌───────────────┐  │
│  │ 👋 #welcome   │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ 👥 #intros    │  │
│  └───────────────┘  │
│  ...                │
│                     │
│  ✨ AI Features:    │
│  ✓ Gamification     │
│  ✓ Recommendations  │
│                     │
│  [← Edit] [Launch✅]│
└─────────────────────┘
```

---

## 🚀 Future Enhancements

### Phase 2
- [ ] More question types (tone, privacy, monetization)
- [ ] Community templates (pre-filled answers)
- [ ] AI avatar speaks questions (text-to-speech)
- [ ] Progress save (resume later)
- [ ] Share generated structure

### Phase 3
- [ ] Multi-language support
- [ ] Custom branding during creation
- [ ] Import members from contacts
- [ ] Schedule launch date
- [ ] Pre-launch checklist

---

**This flow makes community creation feel like a conversation with a helpful friend, not filling out a form.** 🎯✨
