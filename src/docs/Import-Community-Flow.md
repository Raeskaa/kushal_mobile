# Import Existing Community Flow

## Overview
Complete end-to-end flow for importing existing communities from external platforms (Slack, WhatsApp, Discord, etc.) into TrueLeap.

## Entry Points

### 1. Welcome Screen - Main Input Area
- Click the "+" attachment button in the chat input
- Dropdown reveals two options:
  - "Add file or image" - Standard attachment
  - **"Import existing community"** - Triggers import flow

### 2. Welcome Screen - Quick Actions
- New quick action button: **"Import community"**
- Located in the quick actions section below the main input

## Import Flow Steps

### Step 1: Platform Selection
**Screen:** Platform chooser grid

**Popular Platforms (Featured):**
- Slack (Primary - fully implemented mock flow)
- WhatsApp
- Discord

**Other Platforms:**
- Facebook Groups
- LinkedIn Groups
- Telegram
- Other/CSV Import

**User Action:** Select platform → Click "Continue"

---

### Step 2: Platform Connection (Slack)
**Screen:** OAuth/Connection screen

**Features:**
- Visual explanation of what TrueLeap can access
- Permission list with checkmarks:
  - View workspace details and member list
  - Read channel names and descriptions
  - Access message history (configurable)
  - View user profiles and roles
- Security reassurance message
- "Connect Slack Workspace" button with loading state

**User Action:** Click "Connect Slack Workspace" → Simulated OAuth flow (2 second delay)

---

### Step 3: Workspace Selection
**Screen:** List of available Slack workspaces

**Mock Data Shown:**
- Design Thinking Academy (247 members, 12 channels, High Activity)
- Product Management Hub (189 members, 8 channels, Medium Activity)
- Tech Entrepreneurs Network (512 members, 24 channels, High Activity)

**Each workspace card shows:**
- Emoji logo
- Workspace name
- Domain (e.g., design-thinking.slack.com)
- Member count
- Channel count
- Activity level badge

**User Action:** Select workspace → Click "Continue"

---

### Step 4: Channel Selection
**Screen:** Multi-select channel list

**Features:**
- "Select All" / "Deselect All" toggle
- Counter showing selected channels
- Scrollable list of all channels

**Each channel shows:**
- Channel name (with # prefix)
- Public/Private badge
- Member count
- Total message count
- Checkbox for selection

**Mock Channels:**
- #general (247 members, 12,543 messages)
- #introductions (189 members, 2,341 messages)
- #design-critique (156 members, 8,234 messages)
- #resources (234 members, 1,456 messages)
- #events (198 members, 876 messages)
- #job-board (223 members, 534 messages)
- #random (201 members, 6,789 messages)
- #announcements (247 members, 234 messages)

**User Action:** Select channels → Click "Continue"

---

### Step 5: Import Settings
**Screen:** Configuration options

**Message History:**
- Radio buttons:
  - Last 30 days (default)
  - Last 90 days
  - All time

**Additional Options (Checkboxes):**
- ✓ Include files and attachments
- ✓ Auto-map roles and permissions (Slack admins → TrueLeap admins)
- ✓ Send invitation emails to members

**User Action:** Configure settings → Click "Continue"

---

### Step 6: Import Preview
**Screen:** Review & confirmation

**Community Details (Editable):**
- Community Name (pre-filled from workspace name)
- Description (pre-filled)

**Import Summary Cards:**
- Channels: X selected
- Members: XXX total
- Messages: XX,XXX total
- History: 30d / 90d / All

**Selected Channels List:**
- Scrollable list showing all selected channels
- Message counts for each

**User Action:** Review details → Click "Continue"

---

### Step 7: AI Enhancement Options
**Screen:** AI-powered analysis options

**AI Features (Checkboxes, all enabled by default):**

1. **Analyze conversation trends**
   - Icon: TrendingUp
   - Description: Identify popular topics, peak engagement times, and trending discussions

2. **Suggest course opportunities**
   - Icon: Brain
   - Description: AI will recommend courses based on common questions and popular topics

3. **Identify potential moderators**
   - Icon: Crown
   - Description: Find highly active and helpful members who could become moderators

4. **Create engagement playbooks**
   - Icon: Zap
   - Description: Generate automated workflows and engagement strategies based on activity

**Info Banner:**
- "AI Analysis will run in the background"
- "You can start using your community immediately. AI insights available in 5-10 minutes."

**User Action:** Configure AI options → Click "Start Import" (with Sparkles icon)

---

### Step 8: Processing & Import
**Screen:** Progress indicator

**Progress Steps (with animations):**
1. Importing channels... (0-20%)
2. Importing members... (20-40%)
3. Analyzing message history... (40-60%)
4. Setting up roles and permissions... (60-80%)
5. Finalizing setup... (80-100%)

**Visual Elements:**
- Animated spinner (Loader2)
- Progress bar showing percentage
- Checkmarks appear as steps complete
- Success message when complete

**Duration:** ~5-8 seconds (simulated)

**Completion:**
- Green success banner: "Import Complete!"
- "Redirecting to your community dashboard..."
- Auto-redirect after 1 second

---

### Step 9: Community Preview
**Screen:** CommunityGenerationPreview component

**Shows:**
- Imported community data
- Channel structure
- Member count
- Preview of spaces/sections
- "Continue to Dashboard" button

---

### Step 10: Community Dashboard
**Screen:** Full CommunityBuilderView with 6 sections

**Imported Data Visible:**
- All selected channels mapped to community spaces
- Member information
- Message history indicators
- AI Hub with analysis results (background processing)

---

## Data Mapping Logic

### Slack → TrueLeap Mapping

**Channels → Community Spaces:**
- Channel name preserved
- Channel type mapped:
  - announcement → Announcement space (megaphone icon)
  - resources → Resources space (book icon)
  - directory → Directory space (users icon)
  - discussion → Discussion space (message-circle icon)

**Roles:**
- Slack Workspace Owner → TrueLeap Community Owner
- Slack Workspace Admin → TrueLeap Admin
- Slack Channel Moderator → TrueLeap Moderator
- Slack Member → TrueLeap Member

**Content:**
- Message history imported based on selected timeframe
- Files/attachments included if enabled
- User profiles and avatars preserved

---

## Technical Implementation

### Components Created
1. **ImportCommunityDialog** (`/components/ImportCommunityDialog.tsx`)
   - Main wizard component
   - 8-step flow management
   - Platform-specific logic

### State Management
```typescript
- step: 'platform' | 'connect' | 'workspace' | 'channels' | 'members' | 'preview' | 'enhance' | 'processing'
- selectedPlatform: string
- selectedWorkspace: WorkspaceData
- selectedChannels: string[]
- importSettings: { messageHistory, includeFiles, autoMapRoles, inviteMembers }
- aiEnhancement: { analyzeTrends, suggestCourses, identifyModerators, createPlaybooks }
- importProgress: number (0-100)
```

### Integration Points
1. **WelcomeScreen** - Entry point with popover menu
2. **App.tsx** - `handleImportCommunity()` handler
3. **CommunityGenerationPreview** - Import completion preview
4. **CommunityBuilderView** - Final destination with imported data

---

## Mock Data Structure

### Slack Workspaces
```typescript
{
  id: 'ws1',
  name: 'Design Thinking Academy',
  domain: 'design-thinking.slack.com',
  members: 247,
  channels: 12,
  activity: 'high',
  logo: '🎨'
}
```

### Channels
```typescript
{
  id: 'ch1',
  name: 'general',
  members: 247,
  messages: 12543,
  type: 'public',
  category: 'announcement'
}
```

---

## User Experience Features

### Progress Indicators
- Step-by-step wizard UI
- Back/Continue navigation
- Progress percentage during import
- Animated loading states

### Visual Feedback
- Platform icons with brand colors
- Selection states with purple highlights
- Checkmarks for completed steps
- Success/error states

### Smart Defaults
- All AI enhancements enabled
- 30-day message history
- Auto-map roles enabled
- Send invitations enabled
- All channels selected by default

### Error Handling
- Connection timeout handling
- Invalid workspace detection
- No channels selected warning
- Import cancellation support

---

## Future Enhancements

### Phase 2 Features
1. **WhatsApp Import**
   - Group export file upload
   - Contact list mapping
   - Media file handling

2. **Discord Import**
   - Server selection
   - Role hierarchy preservation
   - Bot integration mapping

3. **LinkedIn Groups Import**
   - Professional context preservation
   - Industry tagging
   - Job board integration

4. **CSV Import**
   - Custom field mapping
   - Bulk member upload
   - Data validation

### Advanced Features
- Incremental sync after initial import
- Selective re-import of channels
- Member invitation tracking
- Import analytics dashboard
- Duplicate detection
- Merge existing communities

---

## Testing Flow

### Quick Test Path
1. Go to Welcome Screen
2. Click "+" button (or "Import community" quick action)
3. Select "Slack"
4. Click "Connect Slack Workspace"
5. Wait 2 seconds for connection
6. Select "Design Thinking Academy"
7. Keep all channels selected → Continue
8. Keep default settings → Continue
9. Review preview → Continue
10. Keep all AI enhancements → Start Import
11. Watch progress animation (5-8 seconds)
12. Redirected to Community Preview
13. Click "Continue to Dashboard"
14. Arrive at Community Dashboard with imported data

**Total Time:** ~45 seconds for complete flow

---

## Key Differentiators

### Why This Flow is Better
1. **Guided Experience** - Step-by-step wizard vs overwhelming form
2. **Smart Previews** - See what you're importing before committing
3. **AI Enhancement** - Not just import, but intelligent optimization
4. **Transparency** - Clear permission requests and data usage
5. **Fast Processing** - Optimized import with background AI analysis
6. **Instant Usability** - Community ready immediately, AI insights follow

### Competitive Advantages
- Most platforms require manual setup after import
- We auto-map roles and structure intelligently
- AI suggests improvements based on imported data
- Seamless transition to active community management
- No downtime or migration period

---

## Success Metrics

### User Onboarding
- Time to first imported community: ~45 seconds
- User drop-off at each step (track abandonment)
- Import completion rate

### Data Quality
- Successful channel mapping rate
- Member invitation acceptance rate
- AI suggestion adoption rate

### Engagement Post-Import
- Time to first post in imported community
- AI Hub feature usage
- Course creation from AI suggestions
- Member retention vs. original platform
