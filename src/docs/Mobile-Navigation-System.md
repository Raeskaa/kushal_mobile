# Mobile Navigation System - Complete Architecture

## 🎯 Navigation Hierarchy

### **3-Layer Navigation Structure**

```
┌─────────────────────────────────────┐
│   1. GLOBAL NAVIGATION (Always)     │ ← Bottom Nav Bar
├─────────────────────────────────────┤
│   2. LEAPY AI (Always Accessible)   │ ← Floating Action Button
├─────────────────────────────────────┤
│   3. SECONDARY NAVIGATION (Context) │ ← Horizontal Tabs
└─────────────────────────────────────┘
```

---

## 1️⃣ Global Navigation (Primary)

### **Purpose**: App-wide navigation present everywhere (except welcome screen)

### **Component**: `/components/MobileGlobalNav.tsx`

### **Location**: Fixed bottom bar

### **Navigation Items**:
```
🏠 Home      - Main dashboard/communities
🧭 Explore   - Discover communities/courses
📚 Courses   - My courses & learning
📅 Events    - Upcoming & past events  
👤 Profile   - User settings & account
```

### **Features**:
- ✅ **Active indicator** - Purple gradient bar at top of active icon
- ✅ **Badges** - Red notification dots (e.g., "2" on Courses)
- ✅ **Scale animation** - Active icons scale to 110%
- ✅ **Safe area support** - Respects iOS notch/home indicator
- ✅ **Always visible** - Present on all screens except landing page

### **Visual Design**:
```tsx
Active state:
- Purple (#420D74) icon color
- Bold label text  
- Top gradient indicator bar
- Scale 110% icon

Inactive state:
- Gray icon color
- Normal weight text
- Tap activates gray background
```

---

## 2️⃣ Leapy AI (Persistent Assistant)

### **Purpose**: Context-aware AI assistant accessible anywhere

### **Component**: `/components/MobileEnhancedAI.tsx`

### **Location**: 
- **FAB**: Bottom-right floating button
- **Chat**: Full-screen bottom sheet (90vh)

### **Features**:

#### **Floating Action Button**:
```tsx
- Size: 56px (14 units)
- Position: Fixed right-4 bottom-20
- Background: Purple gradient
- Shadow: Large with purple tint
- Badge: Green "online" indicator (animated pulse)
- Icon: Sparkles (scales on hover)
```

#### **Enhanced AI Chat**:
- 🎨 **Gradient header** - Purple/blue background
- 🤖 **Leapy avatar** - With green online badge
- 📍 **Context awareness** - Shows current community/course
- 💬 **Smart responses** - Different based on context
- 🎯 **Quick actions grid** - 4 common actions
- ✨ **Suggested chips** - Follow-up action buttons
- 🔧 **Action buttons** - Create, Generate, Analyze buttons
- 🎤 **Voice input** - Mic button in textarea
- 📸 **Image upload** - Camera & image buttons
- 👍 **Feedback** - Like/dislike, copy, read aloud
- ⌚ **Timestamps** - On all messages

#### **Context Detection**:
```typescript
General → "Hi! I'm Leapy, your AI assistant..."
Community → "Hey! I'm here to help you manage **[Community Name]**..."
Course → "Ready to work on **[Course Name]**?"
Event → "Planning an event? I can help..."
```

#### **Smart Suggestions**:
```
Community context:
- Analyze member engagement
- Suggest new channels
- Create welcome message
- Review moderation needs

Course context:
- Generate curriculum outline
- Create quiz questions
- Write lesson descriptions
- Suggest assignments

General context:
- Create a new community
- Build a course
- Import from Slack
- Show me examples
```

---

## 3️⃣ Secondary Navigation (Contextual)

### **Purpose**: Context-specific navigation when inside a community/course/etc.

### **Component**: `/components/MobileSecondaryNav.tsx`

### **Location**: Sticky horizontal tabs below header

### **Use Cases**:

#### **A) Community Management**
```tsx
📨 Messages (badge: 5)
👥 Members
📚 Courses (badge: 2)
📅 Events
📊 Analytics
⚙️ Settings
```

#### **B) Course Building** (Future)
```tsx
📖 Curriculum
👨‍🎓 Students
📝 Content
🎯 Quizzes
📊 Analytics
⚙️ Settings
```

#### **C) Event Management** (Future)
```tsx
📋 Overview
🎟️ Attendees
💬 Discussion
📊 Engagement
⚙️ Settings
```

### **Features**:
- ✅ **Horizontal scroll** - Swipe to see all tabs
- ✅ **Active gradient** - Purple gradient background + shadow
- ✅ **Badge support** - Red notification badges
- ✅ **Smooth transitions** - 200ms duration
- ✅ **Touch-optimized** - 48px+ tap targets
- ✅ **Sticky header** - Stays visible while scrolling

### **Visual Design**:
```tsx
Active tab:
- bg-gradient-to-r from-[#420D74] to-[#5a1293]
- text-white
- shadow-lg shadow-purple-500/30
- Icon + Label + Badge (if any)

Inactive tab:
- text-gray-600
- hover:bg-gray-100
- active:scale-95 (press feedback)
```

---

## 📊 Navigation State Management

### **App-Level State** (`/MobileApp.tsx`):
```typescript
currentPage: 'home' | 'explore' | 'courses' | 'events' | 'profile'
stage: 'welcome' | 'community-dashboard' | 'course-builder' | 'marketplace'
showAIChat: boolean
aiContext: 'community' | 'course' | 'event' | 'general'
communityData: Partial<CommunityData>
```

### **Navigation Flow**:
```
User lands → Welcome screen (no nav)
  ↓
Creates/imports community
  ↓
Global Nav appears (bottom bar)
Leapy FAB appears (bottom-right)
Secondary Nav appears (community tabs)
  ↓
User taps "Explore" in global nav
  ↓
Global Nav updates (Explore active)
Secondary Nav hides (not in community)
Leapy FAB stays visible
  ↓
User opens Leapy
  ↓
AI knows context (general/community/course)
Provides relevant suggestions
```

---

## 🎨 Design System

### **Colors**:
```css
Primary Purple: #420D74
Light Purple: #5a1293
Purple 50: bg-purple-50
Purple 100: bg-purple-100
Purple 500/30: shadow-purple-500/30 (shadows)

Active/Success: Green (#10B981)
Badges/Alerts: Red (#EF4444)
Warning: Orange (#F59E0B)
Info: Blue (#3B82F6)
```

### **Spacing**:
```
FAB position: right-4 bottom-20 (accounting for nav bar)
Nav bar height: 64px (16 units)
Safe area padding: safe-area-inset-bottom
Tab padding: px-4 py-2.5
Icon sizes: 4-6 units (16-24px)
```

### **Animations**:
```css
Transitions: duration-200 ease
Active scale: scale-110
Press feedback: active:scale-95
Pulse animation: animate-pulse (online badge)
```

---

## 🔄 User Journeys

### **Journey 1: New User → Create Community**
```
1. Welcome Screen
   - No navigation visible
   - AI input with gradient border
   - Quick action cards

2. Tap "Create a community"
   - 3-question flow opens (bottom sheet)
   - Leapy helps with suggestions

3. Complete creation
   - Redirected to Community Dashboard
   - Global Nav appears (Home active)
   - Leapy FAB appears
   - Secondary Nav shows (Messages active)

4. Tap "Members" tab
   - Secondary Nav updates (Members active)
   - Content changes to members view
   - Global Nav & Leapy stay visible

5. Tap Leapy FAB
   - AI chat opens (90vh sheet)
   - Context: Community mode
   - Shows community name in header
   - Suggestions: community-specific

6. Tap "Courses" in global nav
   - Navigate to courses page
   - Secondary Nav hides
   - Global Nav updates (Courses active)
   - Leapy FAB stays visible
```

### **Journey 2: Existing User → Manage Community**
```
1. Home (Community Dashboard)
   - Global Nav: Home active
   - Secondary Nav: Messages tab
   - Leapy FAB visible

2. Tap "Analytics" in secondary nav
   - Secondary Nav: Analytics active
   - View switches to analytics
   - Global Nav unchanged

3. Tap Leapy FAB
   - AI chat opens
   - Context: Community + Analytics
   - Smart suggestion: "Analyze engagement trends"

4. AI generates insights
   - Action buttons appear
   - "View Details" | "Export Report" | "Share"

5. Close AI, tap "Events" in global nav
   - Navigate to Events page
   - Secondary Nav hides
   - Global Nav: Events active
```

---

## 📱 Responsive Behavior

### **Mobile (≤768px)**:
- ✅ Full 3-layer navigation active
- ✅ Bottom nav bar (global)
- ✅ Floating AI button
- ✅ Horizontal scrolling tabs (secondary)
- ✅ Bottom sheets for modals

### **Tablet (769-1024px)** (Future):
- Side navigation instead of bottom
- AI panel instead of FAB
- Tabs with more visible items

### **Desktop (>1024px)** (Future):
- Use existing desktop navigation
- AI panel always visible (right side)
- No FAB needed

---

## 🎯 Best Practices

### **Navigation Do's**:
✅ Always show global nav (except landing)
✅ Always show Leapy FAB (except landing)
✅ Show secondary nav only in context (community/course)
✅ Use badges sparingly (only important notifications)
✅ Provide visual feedback on all taps (scale/color change)
✅ Keep active states clearly visible
✅ Respect safe areas on iOS

### **Navigation Don'ts**:
❌ Don't hide global nav when scrolling
❌ Don't overlap FAB with nav items
❌ Don't use more than 6 secondary tabs
❌ Don't forget loading states
❌ Don't use confusing icons
❌ Don't make tap targets < 44px
❌ Don't auto-scroll secondary nav

---

## 🔧 Implementation Checklist

### **For Each New Page/Feature**:
- [ ] Determine which navigation layer(s) to show
- [ ] Set correct global nav active state
- [ ] Add secondary nav if contextual
- [ ] Ensure Leapy FAB is visible & positioned correctly
- [ ] Set AI context appropriately
- [ ] Add notification badges if needed
- [ ] Test navigation flow in/out of page
- [ ] Verify safe area padding
- [ ] Test on iOS (notch/home indicator)
- [ ] Test horizontal scroll (secondary nav)

---

## 📊 Navigation Metrics (Suggested)

### **Track**:
- Global nav item taps (which pages are popular)
- Leapy FAB open rate (how often users need help)
- Secondary nav switches (how users explore features)
- AI context accuracy (does AI understand user intent)
- Badge click-through rate (are notifications effective)

### **Goals**:
- >80% users should find what they need in <3 taps
- >60% users should use Leapy AI at least once per session
- <5% navigation confusion (users going back/forth)

---

## 🚀 Future Enhancements

### **Phase 2**:
- [ ] Gesture navigation (swipe between tabs)
- [ ] Voice-activated Leapy ("Hey Leapy")
- [ ] Quick switcher (search all pages/features)
- [ ] Navigation history/breadcrumbs
- [ ] Deep linking support
- [ ] Keyboard shortcuts (tablet/desktop)

### **Phase 3**:
- [ ] Personalized navigation (reorder based on usage)
- [ ] AI-suggested next actions
- [ ] Multi-community switcher
- [ ] Workspaces (group communities/courses)
- [ ] Collaborative navigation (share current view)

---

**This navigation system provides a clear, intuitive, and context-aware experience that scales from mobile to desktop!** 🎉
