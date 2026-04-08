Speakers & Attendees Tab -- Complete Element Inventory
No code changes made. Below is every single element present on this page, organized by sub-tab.

Top-Level Structure
The tab renders when mainView === 'attendees' inside EventBuilderViewV2.tsx. It is a single <div className="space-y-6"> containing:

Sub-Tab Navigation Bar
A horizontal <div> with border-b border-border containing 3 underline-style tab buttons:

Tab ID	Label Text	State Variable
attendees	"Attendees"	attendeesSubTab === 'attendees'
speakers	"Speakers & Team"	attendeesSubTab === 'speakers'
form	"Registration Form"	attendeesSubTab === 'form'
Active style: border-primary text-primary (purple underline + purple text) Inactive style: border-transparent text-muted-foreground hover:text-foreground

Each tab button is px-4 py-2.5 text-sm font-medium border-b-2.

SUB-TAB 1: Attendees
Renders when attendeesSubTab === 'attendees'.

Section Header Row
A flex items-center justify-between row containing:

Left side:

Title: <h2> "Attendee Management" -- text-foreground font-semibold text-lg
Subtitle: <p> "Review applications and manage access." -- text-sm text-muted-foreground
Right side (flex gap-2):

Export CSV Button (conditional: only shown when attendees.length > 0):

Size: sm, Variant: outline
Classes: rounded-lg border-border
Icon: Download (size-3.5, mr-2)
Text: "Export CSV"
onClick: handleExportAttendees() -- generates a CSV file with columns Name, Email, Status, Ticket, Checked In and triggers a browser download of attendees.csv
Add Applicant Button (always shown):

Size: sm
Classes: bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-none
Icon: UserPlus (size-3.5, mr-2)
Text: "Add Applicant"
onClick: handleAddAttendee() -- prepends a mock attendee object to the list with: name "New Applicant", email "applicant@example.com", status "pending", ticket "General", checkedIn false, an application object containing reason text, linkedin URL, and role "Developer"
EMPTY STATE (when attendees.length === 0)
A centered flex column (py-20 text-center):

Icon container: size-20 rounded-2xl border-2 border-dashed border-border with Users icon (size-9, text-muted-foreground/40)
Heading: <h3> "No registrations yet" -- text-foreground mb-2
Description: <p> "Once you publish your event, registrations will appear here. You can also manually add attendees." -- text-sm text-muted-foreground max-w-sm mb-6
Action buttons (flex gap-3):
Add Manually: variant outline, class border-border, icon UserPlus (size-4, mr-2), text "Add Manually", onClick: handleAddAttendee()
Copy Invite Link (conditional: only when isDraft): variant outline, class border-border text-muted-foreground, icon Share2 (size-4, mr-2), text "Copy Invite Link" -- no onClick handler currently attached (button is present but non-functional)
POPULATED STATE (when attendees.length > 0)
Filter Tabs Bar
A flex border-b border-border row with 4 filter tab buttons:

Filter Value	Label	Active Border Color	Active Text Color	Count Badge
all	"All"	border-primary	text-primary	None
pending	"Pending Review"	border-orange-500	text-orange-600	Yes -- orange pill badge bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded-full showing count of pending attendees (only if > 0)
approved	"Approved"	border-green-500	text-green-600	None
rejected	"Rejected"	border-red-500	text-red-600	None
Each button: px-4 py-2 text-sm font-medium border-b-2 transition-colors

Filter logic (filteredAttendees):

all: shows all attendees
pending: shows attendees where status === 'pending' OR status === 'waitlist'
approved: shows attendees where status === 'confirmed'
rejected: shows attendees where status === 'rejected'
Attendee Table
Container: bg-card border border-border rounded-xl overflow-hidden

Table structure: <table className="w-full">

Table header (<thead className="bg-muted border-b border-border">):

Column	Alignment	Text
1	Left	"APPLICANT"
2	Left	"STATUS"
3	Left	"APPLICATION"
4	Right	"ACTIONS"
All headers: px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider

Table body (<tbody className="divide-y divide-border">):

For each filteredAttendees entry, renders one main row (and optionally an expanded detail row):

Main Row
Column 1 -- Applicant:

Avatar circle: size-9 rounded-full bg-primary/10 text-primary with first letter of name, font-bold text-sm, border border-primary/10
Name: text-sm font-medium text-foreground
Email: text-xs text-muted-foreground
Column 2 -- Status: A <Badge variant="secondary"> with conditional styling:

confirmed: displays "Approved" -- bg-green-50 text-green-700 border-green-100
pending: displays "Pending" -- bg-orange-50 text-orange-700 border-orange-100
waitlist: displays "Pending" -- same orange styling
rejected: displays "Rejected" -- bg-red-50 text-red-600 border-red-100
Badge classes: rounded-md font-medium text-[10px] px-2 py-0.5 border

Column 3 -- Application:

If pending/waitlist: "Review Application" / "Hide Application" toggle button
Size sm, variant outline
Classes: h-7 text-xs border-primary/20 text-primary hover:bg-primary/10
onClick: toggles selectedApplication state between the attendee ID and null
Text changes based on selectedApplication === attendee.id
If confirmed/rejected: plain text <span> "Processed" -- text-xs text-muted-foreground
Column 4 -- Actions:

If pending/waitlist: Two inline buttons (flex justify-end gap-2):

Approve button:
Size sm, classes: h-7 px-2 bg-green-600 hover:bg-green-700 text-white text-xs
Icon: Check (size-3, mr-1)
Text: "Approve"
onClick: handleUpdateAttendeeStatus(attendee.id, 'confirmed')
Reject button:
Size sm, variant outline
Classes: h-7 px-2 text-red-600 border-red-200 hover:bg-red-50 text-xs
Icon: X (size-3, mr-1)
Text: "Reject"
onClick: handleUpdateAttendeeStatus(attendee.id, 'rejected')
If confirmed/rejected: A <DropdownMenu>:

Trigger: Ghost icon button, h-8 w-8 text-muted-foreground hover:text-foreground, icon MoreVertical (size-4)
Content (align="end"):
Label: "Actions"
Item 1: icon Mail (size-4, mr-2) + "Send Email" -- onClick: handleOpenEmailModal(attendee) (opens the Email Automation Modal with recipient pre-filled)
Item 2: icon Ticket (size-4, mr-2) + "Resend Ticket" -- no onClick (placeholder)
Separator
Item 3: icon XCircle (size-4, mr-2) + "Revoke Access" -- class text-red-600, no onClick (placeholder)
Row highlight: If selectedApplication === attendee.id, the main row gets bg-primary/5; otherwise hover:bg-accent

Expanded Application Detail Row (conditional)
Shown when selectedApplication === attendee.id. Appears directly below the main row.

Container: <tr className="bg-primary/5"> with single <td colSpan={4} className="px-6 py-4 pt-0">

Inside: bg-card border border-primary/10 rounded-lg p-4

Content:

Heading: <h4> "Application Details" -- text-sm font-semibold text-foreground mb-2

2-column grid (grid grid-cols-2 gap-4):

Left column:
Label: "Role / LinkedIn" -- text-xs text-muted-foreground font-medium mb-1
Value: attendee.application.role (fallback "Developer") + " . " + clickable link attendee.application.linkedin (fallback "View Profile") -- text-primary hover:underline
Right column:
Label: "Reason for Joining" -- text-xs text-muted-foreground font-medium mb-1
Value: Quoted italic text from attendee.application.reason (fallback: "I am very interested in learning more about this topic to apply it in my current role.") -- text-sm text-foreground italic
Action buttons (mt-4, flex justify-end gap-2, pt-3 border-t border-border):

Reject: size sm, variant outline, class text-red-600 border-red-200 hover:bg-red-50, text "Reject", onClick: handleUpdateAttendeeStatus(attendee.id, 'rejected')
Approve & Send Ticket: size sm, class bg-green-600 hover:bg-green-700 text-white, text "Approve & Send Ticket", onClick: handleUpdateAttendeeStatus(attendee.id, 'confirmed')
Empty Filter State
When filteredAttendees.length === 0 (no attendees match current filter), shown inside the table card:

<div className="text-center py-12">
Icon: Users (size-10, text-muted-foreground/40, mx-auto, mb-3)
Text: "No attendees found in this filter" -- text-muted-foreground font-medium
SUB-TAB 2: Speakers & Team
Renders when attendeesSubTab === 'speakers'. Mounts the <SpeakersTeamTable /> component (from events/SpeakersTeamTable.tsx).

Data & Types
TeamMember interface:

id: string
name: string
email: string
role: 'speaker' | 'moderator' | 'tech-support' | 'co-host' | 'panelist'
status: 'invited' | 'accepted' | 'declined'
bio?: string
invitedAt: string
Role Configuration (5 roles):

Role Key	Display Label	Badge Colors
speaker	"Speaker"	bg-primary/10 text-primary border-primary/20
co-host	"Co-host"	bg-blue-50 text-blue-700 border-blue-100
moderator	"Moderator"	bg-amber-50 text-amber-700 border-amber-100
tech-support	"Tech Support"	bg-teal-50 text-teal-700 border-teal-100
panelist	"Panelist"	bg-violet-50 text-violet-700 border-violet-100
Status Configuration (3 statuses):

Status Key	Display Label	Icon	Badge Colors
invited	"Invited"	Clock	bg-orange-50 text-orange-700 border-orange-100
accepted	"Accepted"	CheckCircle	bg-green-50 text-green-700 border-green-100
declined	"Declined"	XCircle	bg-red-50 text-red-600 border-red-100
Default Team (4 pre-populated members):

Sarah Chen -- speaker, accepted, bio "Design Systems Lead at Figma", invited 2026-01-15
Marcus Webb -- speaker, accepted, bio "Senior Frontend Engineer", invited 2026-01-16
Elena Rodriguez -- moderator, invited, no bio, invited 2026-02-01
James Park -- tech-support, declined, no bio, invited 2026-01-20
Mock LeapSpace Users (6 for search):

Priya Sharma (priya@leapspace.ai)
Alex Rivera (alex.r@leapspace.ai)
Jordan Kim (jordan.k@leapspace.ai)
Sam Okafor (sam.o@leapspace.ai)
Maya Chen (maya.c@leapspace.ai)
Diego Fernandez (diego.f@leapspace.ai)
Section Header Row
Left side:

Title: <h2> "Speakers & Team" -- text-foreground font-semibold text-lg
Subtitle: <p> "{acceptedCount} confirmed, {invitedCount} pending" -- text-sm text-muted-foreground
Right side:

Invite Button:
Size sm, classes: bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-none
Icon: UserPlus (size-3.5, mr-2)
Text: "Invite"
onClick: opens invite modal (setShowInviteModal(true))
Role Filter Pills
A flex gap-2 flex-wrap row with 6 pill-shaped filter buttons:

Filter ID	Label	Count Shown
all	"All"	No
speaker	"Speakers"	Yes (count of members with role speaker)
co-host	"Co-hosts"	Yes
moderator	"Moderators"	Yes
tech-support	"Tech Support"	Yes
panelist	"Panelists"	Yes
Each pill: px-3 py-1.5 text-xs rounded-full border transition-colors

Active: bg-primary text-primary-foreground border-primary
Inactive: bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground
Count appears as a <span> with ml-1.5 opacity-70 after the label text.

Speakers & Team Table
Container: bg-card border border-border rounded-xl overflow-hidden

Table header (bg-muted border-b border-border):

Column	Alignment	Header Text
1	Left	"PERSON"
2	Left	"ROLE"
3	Left	"STATUS"
4	Left	"INVITED"
5	Right	"ACTIONS"
All headers: px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider

Table body (divide-y divide-border):

For each filteredMembers entry:

Column 1 -- Person:

Avatar circle: size-9 rounded-full bg-primary/10 text-primary showing initials (first letter of each name word, max 2), font-bold text-sm, border border-primary/10
Name: text-sm font-medium text-foreground
Email: text-xs text-muted-foreground
Column 2 -- Role: An inline Select dropdown allowing role changes:

Trigger: h-7 w-[130px] text-xs border-border bg-transparent
Shows current role as a colored <Badge> inside the trigger
Dropdown options: all 5 roles (Speaker, Co-host, Moderator, Tech Support, Panelist)
On change: calls handleChangeRole(member.id, newRole) which updates the member and shows toast "Role updated"
Column 3 -- Status: A <Badge> with the status icon + label:

Classes: rounded-md font-medium text-[10px] px-2 py-0.5 border gap-1
Icon: Clock / CheckCircle / XCircle (size-3) depending on status
Color from STATUS_CONFIG
Column 4 -- Invited:

Plain text: member.invitedAt date string -- text-xs text-muted-foreground
Column 5 -- Actions: A <DropdownMenu>:

Trigger: ghost icon button h-8 w-8 text-muted-foreground hover:text-foreground, icon MoreVertical (size-4)
Content (align="end"):
Label: "Actions"
Resend Invite (conditional: only shown when member.status === 'invited'): icon RefreshCw (size-4, mr-2) + "Resend Invite", onClick: handleResendInvite(member) -> toast "Invitation resent to {email}"
Send Message (always): icon Mail (size-4, mr-2) + "Send Message", onClick: toast "Email opened for {name}"
Separator
Remove (always): icon Trash2 (size-4, mr-2) + "Remove", class text-red-600, onClick: handleRemoveMember(id) -> filters member out + toast "Team member removed"
Row hover: hover:bg-accent transition-colors

Table Empty State (when filteredMembers is 0)
Inside the table card, centered: text-center py-12

Icon: Users (size-10, text-muted-foreground/40, mx-auto, mb-3)
Text: "No team members in this filter" -- text-muted-foreground font-medium
Button: "Invite Someone" -- size sm, variant outline, class mt-3 border-border, icon UserPlus (size-3.5, mr-2), onClick: opens invite modal
Invite Team Member Dialog
State: showInviteModal Container: <Dialog> with <DialogContent className="sm:max-w-[480px] bg-card border-border">

Header:

Title: "Invite Team Member" -- text-foreground
Description: "Search your LeapSpace contacts or invite by email." -- text-muted-foreground
Mode Switcher: Two toggle buttons in a flex border border-border rounded-lg overflow-hidden:

Mode	Button Text	Active Style	Inactive Style
leapspace	"LeapSpace Users"	bg-primary text-primary-foreground	bg-card text-muted-foreground hover:text-foreground
email	"Invite by Email"	bg-primary text-primary-foreground	same as above + border-l border-border
Each: flex-1 px-4 py-2 text-sm font-medium transition-colors

Role Selector (always shown):

Label: "Role" -- text-sm text-muted-foreground
<Select> dropdown with trigger border-border h-9
Options: all 5 roles from ROLE_CONFIG (Speaker, Co-host, Moderator, Tech Support, Panelist)
Default: speaker
LeapSpace Mode Content (inviteMode === 'leapspace')
Search Input:

Icon: Search (absolute positioned left, size-4, text-muted-foreground)
Input: pl-9 border-border h-9, placeholder "Search by name or email..."
Filters LEAPSPACE_USERS by name or email match, excludes already-added members
User List: Container: max-h-[240px] overflow-y-auto space-y-1 border border-border rounded-lg p-1

If no users found:

Centered div py-6
Text: "No users found" -- text-sm text-muted-foreground
Link: "Try inviting by email instead" -- text-xs text-primary hover:underline mt-1, onClick switches to email mode
For each matching user: A row flex items-center justify-between p-2.5 rounded-lg hover:bg-accent transition-colors:

Left: Avatar circle (size-8, bg-primary/10 text-primary, initials, text-xs font-bold, border), name (text-sm font-medium text-foreground), email (text-xs text-muted-foreground)
Right: "Invite" button -- size sm, variant outline, class h-7 text-xs border-primary/20 text-primary hover:bg-primary/10
onClick: handleInviteLeapSpaceUser(user) -- creates a new TeamMember with status "invited", adds to list, shows toast "Invitation sent to {name}"
Email Mode Content (inviteMode === 'email')
Two input fields in space-y-4:

Full Name:

Label: "Full Name" -- text-sm text-muted-foreground
Input: border-border h-9, placeholder "e.g. Alex Rivera"
Email Address:

Label: "Email Address" -- text-sm text-muted-foreground
Input: type email, border-border h-9, placeholder "e.g. alex@example.com"
Dialog Footer (gap-2)
Cancel Button: variant outline, class border-border text-foreground, onClick: resetInviteForm() (clears all inputs, closes modal)
Send Invitation Button (only shown in email mode): class bg-primary hover:bg-primary/90 text-primary-foreground shadow-none, icon Mail (size-3.5, mr-2), text "Send Invitation", disabled when inviteEmail is empty
onClick: handleInviteByEmail() -- creates TeamMember with name (or email prefix), adds to list, shows toast "Invitation sent to {email}", resets form
SUB-TAB 3: Registration Form
Renders when attendeesSubTab === 'form'.

Conditional: Draft Empty State vs Form Builder
IF isDraft && !hasRegistrationForm: Shows empty state OTHERWISE: Shows <RegistrationFormBuilder> component

Empty State (no form yet)
Centered flex column py-16 text-center:

Icon container: size-16 bg-muted rounded-xl with FileText icon (size-8, text-muted-foreground/40)
Heading: <h3> "No registration form yet" -- text-foreground mb-2
Current setting note: "Currently using: Default (Name + Email only)" -- text-sm text-muted-foreground max-w-sm mb-2, bold part is font-semibold text-foreground
Description: "Add custom fields to collect additional info from attendees -- company, dietary needs, experience level, and more." -- text-sm text-muted-foreground max-w-sm mb-6
Action buttons (flex gap-3):
Keep Default: variant outline, class rounded-lg border-border, onClick: toast "Using default form with Name and Email." + sets hasRegistrationForm(true)
Customize Form: class bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-none, icon Plus (size-3.5, mr-2), text "Customize Form", onClick: sets hasRegistrationForm(true) (which shows the builder on next render)
Registration Form Builder
Component: events/RegistrationFormBuilder.tsx

Data Structures
Field Types (7):

Type Key	Display Label	Icon
text	"Short Text"	Type
email	"Email"	Mail
textarea	"Long Text"	AlignLeft
select	"Dropdown"	ListChecks
checkbox	"Checkbox"	CheckSquare
phone	"Phone"	Phone
url	"URL / Link"	LinkIcon
Default Fields (2, locked/non-removable):

"Full Name" -- text, required, placeholder "Enter your full name", isDefault: true
"Email Address" -- email, required, placeholder "you@example.com", isDefault: true
Template Fields (9, available for quick-add):

"Company / Organization" -- text, optional, placeholder "Your company name"
"Job Title / Role" -- text, optional, placeholder "e.g. Product Manager"
"Phone Number" -- phone, optional, placeholder "+1 (555) 000-0000"
"LinkedIn Profile" -- url, optional, placeholder "https://linkedin.com/in/..."
"Why do you want to attend?" -- textarea, optional, placeholder "Tell us about your interest..."
"Experience Level" -- select, optional, options: Beginner, Intermediate, Advanced, Expert
"Dietary Requirements" -- select, optional, options: None, Vegetarian, Vegan, Gluten-free, Halal, Kosher, Other
"I agree to the terms and conditions" -- checkbox, required
"Subscribe to event updates" -- checkbox, optional
Section Header Row
Left side:

Title: <h2> "Registration Form" -- text-foreground font-semibold text-lg
Subtitle: "{fields.length} fields ({requiredCount} required)" -- text-sm text-muted-foreground
Right side (flex gap-2):

Preview/Edit Toggle Button:

Size sm, variant outline, class rounded-lg border-border
Icon: Eye (size-3.5, mr-2)
Text: "Preview" (or "Edit" when in preview mode)
onClick: toggles showPreview state
Add Field Button:

Size sm, class bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-none
Icon: Plus (size-3.5, mr-2)
Text: "Add Field"
onClick: toggles showAddField panel
Add Field Templates Panel (conditional: showAddField)
Container: bg-card border border-border rounded-xl p-4 space-y-3

Header row:

Left: <h3> "Quick Add" -- text-sm font-medium text-foreground
Right: Close button with ChevronUp icon (size-4) -- text-muted-foreground hover:text-foreground
Template Grid: grid grid-cols-2 md:grid-cols-3 gap-2

For each availableTemplates (templates not already added):

Button: flex items-center gap-2 p-2.5 rounded-lg border border-border text-left hover:border-primary/30 hover:bg-primary/5 transition-colors
Icon: field type icon (size-3.5, text-muted-foreground)
Text: template label (text-xs text-foreground truncate)
onClick: handleAddField(tpl) -- adds template field, expands it, closes panel, toast "Field added"
Custom Field button (always last):

Same styling but border-dashed
Icon: Plus (size-3.5, text-muted-foreground)
Text: "Custom Field" (text-xs text-muted-foreground)
onClick: handleAddField() -- adds blank field with label "New Field", type "text"
PREVIEW MODE (showPreview === true)
Container: bg-card border border-border rounded-xl p-6 space-y-5

Form header:

Title: "Registration" -- text-foreground font-medium
Subtitle: "Fill out the form below to register for this event." -- text-xs text-muted-foreground mt-1
Separated by border-b border-border pb-4 mb-2
For each field, renders a read-only preview:

Label: text-sm text-foreground font-normal with red asterisk * if required
text/email/phone/url: grey placeholder box h-10 rounded-lg border border-border bg-muted/30 px-3
textarea: grey placeholder box min-h-[80px] rounded-lg border border-border bg-muted/30 p-3
select: grey box with placeholder text + ChevronDown icon
checkbox: unchecked square size-4 rounded border border-border bg-muted/30 + label text
Register button (disabled, full-width): w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-none mt-4

EDIT MODE (showPreview === false)
Container: space-y-2

For each field: A collapsible card bg-card border rounded-xl transition-all

Expanded: border-primary ring-1 ring-primary/20
Collapsed: border-border hover:border-primary/20
Collapsed Row (always visible)
flex items-center gap-3 px-4 py-3 cursor-pointer, onClick toggles expansion

Elements left to right:

Drag handle OR lock icon:
Custom fields: GripVertical (size-4, text-muted-foreground/40)
Default fields: Lock (size-3.5, text-muted-foreground/40)
Type icon: Field type icon (size-4, text-muted-foreground)
Label text: text-sm font-medium text-foreground flex-1
Type badge: <Badge variant="secondary"> showing type label (e.g. "Short Text") -- text-[10px] bg-muted text-muted-foreground border-border px-1.5 py-0
Required badge (if required): <Badge> "Required" -- text-[10px] bg-red-50 text-red-600 border-red-100 px-1.5 py-0
Move buttons (custom fields only):
Move up: ChevronUp (size-3.5), disabled if field is at position <= DEFAULT_FIELDS.length
Move down: ChevronDown (size-3.5), disabled if field is last
Each: p-1 text-muted-foreground hover:text-foreground rounded
Expand/collapse chevron: ChevronDown (size-4, text-muted-foreground), rotates 180 when expanded
Expanded Editor (conditional: expandedField === field.id)
Container: px-4 pb-4 pt-1 border-t border-border space-y-4

Row 1: Label + Type (grid grid-cols-2 gap-4):

Label input:
Label: "Label" (text-xs text-muted-foreground)
Input: border-border h-8 text-sm, disabled if isDefault
Type select:
Label: "Type" (text-xs text-muted-foreground)
Select dropdown: border-border h-8 text-sm, disabled if isDefault
Options: all 7 field types
Row 2: Placeholder (conditional: not shown for checkbox type):

Label: "Placeholder Text" (text-xs text-muted-foreground)
Input: border-border h-8 text-sm, placeholder "Enter placeholder text..."
Row 3: Options (conditional: only for select type):

Label: "Options (comma-separated)" (text-xs text-muted-foreground)
Input: border-border h-8 text-sm, placeholder "Option 1, Option 2, Option 3"
Value: comma-joined options array
onChange: splits by comma, trims, filters empty
Row 4: Required toggle + Remove (flex items-center justify-between pt-2):

Required toggle:
Label: "Required" (text-xs text-muted-foreground)
Custom toggle button (not Switch component): h-5 w-9 rounded-full
Active: bg-primary with white dot translated right
Inactive: bg-muted border border-border with white dot translated left
Remove button (custom fields only):
Size sm, variant outline, class h-7 text-xs text-red-600 border-red-200 hover:bg-red-50
Icon: Trash2 (size-3, mr-1.5)
Text: "Remove"
onClick: handleRemoveField(field.id) -> removes field + toast "Field removed"
Save Button
At bottom: flex justify-end pt-2

Button: class bg-primary hover:bg-primary/90 text-primary-foreground shadow-none
Icon: FileText (size-3.5, mr-2)
Text: "Save Form"
onClick: toast "Registration form saved"
That is every single element, button, input, badge, icon, dropdown, table column, empty state, modal, toggle, filter pill, and text string present across all three sub-tabs of the Speakers & Attendees page. No changes were made to any files.