# Mobile Navigation System Architecture

## 📱 Navigation Hierarchy

This document defines the complete 4-level navigation hierarchy for the mobile app.

---

## Level 1: Primary Bottom Navigation
**Component:** `MobileGlobalNav`  
**Style:** Icons + Labels, Purple highlight when active  
**Location:** Fixed bottom bar, always visible

```
Home | Communities | Courses | Events | Settings | Leapy
```

---

## Level 2: Page Tabs (Horizontal Tabs)
**Component:** `MobileHorizontalTabs`  
**Style:** Bottom border (2px), purple when active  
**Location:** Below top bar, scrollable horizontally

### Used On:
- **Home**: Overview | Analytics | Reports | Team
- **Communities List**: All | My Communities | Joined | Archived
- **Courses List**: All | My Courses | Enrolled | Drafts
- **Events List**: All | Upcoming | Past | Registered
- **Marketplace**: All | Communities | Courses | Events
- **Settings**: General | Integrations | Notifications | Billing | Profile | Security

**Visual Style:**
```tsx
<button className={`
  flex-shrink-0 px-4 py-3 border-b-2 transition-all active:scale-95 
  ${isActive 
    ? 'border-[#420D74] text-[#420D74]' 
    : 'border-transparent text-gray-500'
  }
`}>
```

---

## Level 3: Builder Tabs (Card-Style Pills)
**Component:** `MobileBuilderTabs`  
**Style:** Rounded-lg cards, purple filled when active, gray background when inactive  
**Location:** Below page header, scrollable horizontally

### Used On:
- **Community Builder**: Overview | Members | Events | Courses | Content | Analytics | Settings
- **Course Builder**: Overview | Curriculum | Students | Pricing | Analytics | Settings
- **Event Builder**: Overview | Schedule | Attendees | Registration | Promotion | Analytics | Settings
- **Community Member View**: Feed | Events | Courses | Members | Resources

**Visual Style:**
```tsx
<button className={`
  flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all active:scale-95 
  ${isActive 
    ? 'bg-[#420D74] text-white shadow-sm' 
    : 'bg-gray-100 text-gray-700'
  }
`}>
```

**Usage Example:**
```tsx
import { MobileBuilderTabs } from './components/MobileBuilderTabs';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members' },
  { id: 'events', label: 'Events' },
  // ...
];

<MobileBuilderTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

---

## Level 4a: Filter Chips
**Component:** `MobileFilterChips`  
**Style:** Rounded-full pills, purple filled when active  
**Location:** Within content area, wraps to multiple lines if needed

### Used On:
- **Community Builder > Events Tab**: All Events | Upcoming | Past | Draft
- **Community Builder > Courses Tab**: All Courses | Active | Draft | Archived
- **Any list view needing filters**

**Visual Style:**
```tsx
<button className={`
  px-4 py-2 rounded-full text-sm transition-all active:scale-95 
  ${isActive 
    ? 'bg-[#420D74] text-white' 
    : 'bg-gray-100 text-gray-700 border border-gray-200'
  }
`}>
```

**Usage Example:**
```tsx
import { MobileFilterChips } from './components/MobileFilterChips';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
];

<MobileFilterChips
  filters={filters}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
/>
```

---

## Level 4b: Segmented Control (Tight Version)
**Component:** `MobileSegmentedControl`  
**Style:** iOS-style segmented control, tight padding (p-0.5)  
**Location:** Within content area, typically at the top of a section

### Used On:
- **Course Player**: Overview | Resources | Notes | Discussion
- **Meeting Room Sidebar**: Chat | Participants | Q&A | Resources
- **Content sections with 2-4 options**

**Visual Style:**
```tsx
<div className="inline-flex bg-gray-100 rounded-lg p-0.5 w-full">
  <button className={`
    flex-1 px-2 py-1.5 rounded-md text-xs transition-all active:scale-95 
    ${isActive 
      ? 'bg-white text-gray-900 shadow-sm' 
      : 'text-gray-600'
    }
  `}>
```

**Usage Example:**
```tsx
import { MobileSegmentedControl } from './components/MobileSegmentedControl';

const segments = [
  { id: 'overview', label: 'Overview' },
  { id: 'resources', label: 'Resources' },
  { id: 'notes', label: 'Notes' },
];

<MobileSegmentedControl
  segments={segments}
  activeSegment={activeSegment}
  onSegmentChange={setActiveSegment}
/>
```

---

## Visual Hierarchy Summary

| Level | Component | Style | Use Case |
|-------|-----------|-------|----------|
| **L1** | `MobileGlobalNav` | Icons + Labels | Primary app navigation |
| **L2** | `MobileHorizontalTabs` | Bottom Border | Page-level tabs |
| **L3** | `MobileBuilderTabs` | Rounded Cards | Builder/detailed view tabs |
| **L4a** | `MobileFilterChips` | Rounded Pills | List filtering |
| **L4b** | `MobileSegmentedControl` | iOS Segmented | Content section switching |

---

## Design Principles

### Visual Distinction
Each level has a **distinct visual style** to help users understand their location in the navigation hierarchy:
- L1: Largest touch targets, icons + text
- L2: Simple, minimal border indicator
- L3: Card-style with background fills
- L4a: Standalone chips for filtering
- L4b: Grouped buttons for toggling

### Scrolling Behavior
- **L1**: Fixed position, always visible
- **L2**: Horizontal scroll if needed
- **L3**: Horizontal scroll if needed
- **L4a**: Wraps to multiple rows
- **L4b**: Full width, no scroll

### Color Consistency
All active states use the primary purple color: `#420D74`

### Interaction
All buttons have:
- `active:scale-95` for touch feedback
- `transition-all` for smooth animations
- Sufficient touch target size (minimum 44x44px)

---

## Maximum Nesting Depth

**Recommended Maximum: 4 levels**

Example deepest path:
1. **L1**: Tap "Communities" (Bottom Nav)
2. **L2**: Tap "My Communities" (Page Tabs)
3. **L3**: Open a community → Tap "Events" (Builder Tabs)
4. **L4a**: Filter by "Upcoming" (Filter Chips)

This keeps the navigation predictable and prevents users from feeling lost.

---

## Special Cases

### Accordion Navigation
For hierarchical content like Course Curriculum (Module 1 → Lesson 1.1), use an accordion/expandable list instead of tabs.

**Not a navigation level** - this is content organization within a tab.

### Modal/Overlay Navigation
Settings within a profile modal are **contextual**, not part of the main navigation hierarchy.

---

## Components Reference

### Created Components
1. ✅ `MobileGlobalNav.tsx` - Level 1 (Primary Bottom Nav)
2. ✅ `MobileHorizontalTabs.tsx` - Level 2 (Page Tabs)
3. ✅ `MobileBuilderTabs.tsx` - Level 3 (Builder Tabs)
4. ✅ `MobileFilterChips.tsx` - Level 4a (Filter Chips)
5. ✅ `MobileSegmentedControl.tsx` - Level 4b (Segmented Control)

### Usage Pattern
```tsx
// Import the appropriate component
import { MobileBuilderTabs } from './components/MobileBuilderTabs';

// Define your tabs/segments
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members' },
];

// Track state
const [activeTab, setActiveTab] = useState('overview');

// Render
<MobileBuilderTabs 
  tabs={tabs} 
  activeTab={activeTab} 
  onTabChange={setActiveTab} 
/>
```

---

## Next Steps

When implementing new pages:
1. Identify which navigation level you need
2. Use the appropriate component from the table above
3. Follow the visual style guidelines
4. Test on mobile devices for touch target sizes

---

**Last Updated:** January 2, 2026
