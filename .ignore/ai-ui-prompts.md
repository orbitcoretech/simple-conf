# SimpleConf AI UI Generation Prompts

> **Purpose:** Copy-paste these prompts into v0.dev, Lovable.ai, or similar AI UI generation tools to create high-fidelity mockups and functional React components.

> **Important:** All AI-generated code requires careful human review, testing, and refinement to be production-ready.

---

## Project Context Preamble

Use this preamble at the start of each prompt to give the AI full context:

```
PROJECT CONTEXT:
- App Name: SimpleConf - Internal Knowledge Base with Conversational Search
- Tech Stack: React 18+ with TypeScript, Vite, shadcn/ui (Radix + Tailwind CSS)
- Design System: shadcn/ui components, Lucide icons, Inter font family
- Color Palette: Primary #2563EB (Blue), Accent #8B5CF6 (Violet), Neutral Slate scale
- Target: Desktop-first web app (responsive but optimized for 1024px+)
- Key Feature: Natural language search as primary navigation method
```

---

## Prompt 1: App Shell & Layout

### High-Level Goal
Create the main application shell layout with a persistent header containing search bar and user menu, a collapsible left sidebar for folder navigation, and a main content area.

### Copy-Paste Prompt

```
PROJECT CONTEXT:
- App Name: SimpleConf - Internal Knowledge Base with Conversational Search
- Tech Stack: React 18+ with TypeScript, Vite, shadcn/ui (Radix + Tailwind CSS)
- Design System: shadcn/ui components, Lucide icons, Inter font family
- Color Palette: Primary #2563EB (Blue), Accent #8B5CF6 (Violet), Neutral Slate scale
- Target: Desktop-first web app (responsive but optimized for 1024px+)

HIGH-LEVEL GOAL:
Create the main application shell layout for a knowledge base app. The layout has three sections: header, sidebar, and main content area.

DETAILED INSTRUCTIONS:
1. Create an AppShell component with the following structure:
   - Fixed header (height: 64px) spanning full width
   - Left sidebar (width: 280px) below header, collapsible to 64px
   - Main content area filling remaining space

2. Header contains (left to right):
   - Logo: Text "SimpleConf" in semibold with a small book icon (Lucide: BookOpen)
   - Search bar: Centered, width 480px max, with placeholder "Ask a question or search..."
   - User menu: Avatar circle with dropdown (shows user name, department, logout option)

3. Search bar specifications:
   - Use shadcn/ui Input component with Search icon (Lucide) on left
   - Rounded-full border radius
   - On focus: subtle ring with primary color
   - Keyboard shortcut hint: Show "Cmd+K" badge on right side when not focused

4. Sidebar specifications:
   - Background: Slate-50 (#F8FAFC)
   - Collapse toggle button at top (ChevronLeft/ChevronRight icon)
   - When collapsed: only show icons, no text
   - Content area for folder tree (placeholder for now)

5. Main content area:
   - White background
   - Padding: 24px
   - Max-width container: 1200px, centered
   - Overflow-y: auto for scrolling

STYLING CONSTRAINTS:
- Use Tailwind CSS classes exclusively
- Font: Inter for all text
- All interactive elements need visible focus states (ring-2 ring-primary)
- Smooth transitions (duration-200) for sidebar collapse
- Use CSS Grid or Flexbox for layout

DO NOT:
- Add routing logic
- Create actual folder tree content
- Implement search functionality
- Add authentication logic

OUTPUT:
Create these files:
- components/layout/AppShell.tsx
- components/layout/Header.tsx
- components/layout/Sidebar.tsx
- components/layout/UserMenu.tsx
```

---

## Prompt 2: Home / Search Dashboard

### High-Level Goal
Create the home page with a hero search bar, recent searches, and popular documents sections.

### Copy-Paste Prompt

```
PROJECT CONTEXT:
- App Name: SimpleConf - Internal Knowledge Base
- Tech Stack: React 18+ with TypeScript, shadcn/ui, Tailwind CSS, Lucide icons
- Color Palette: Primary #2563EB, Accent #8B5CF6, backgrounds white/Slate-50

HIGH-LEVEL GOAL:
Create the Home/Search Dashboard page - the main landing page emphasizing search-first discovery.

DETAILED INSTRUCTIONS:
1. Create a HomePage component with this layout:
   - Hero section at top (vertically centered in viewport initially)
   - Two-column grid below: Recent Searches (left), Popular Documents (right)

2. Hero section:
   - Large heading: "What are you looking for?" (text-3xl, font-semibold, text-slate-800)
   - Subheading: "Search our knowledge base using natural language" (text-slate-500)
   - Large search input (height: 56px, width: 600px max)
   - Search input has: Search icon left, placeholder cycling through examples
   - Placeholder examples: "How do I integrate Razorpay?", "Find e-commerce PRDs", "Payment gateway docs"
   - Below input: subtle hint text "Press Enter to search or Cmd+K from anywhere"

3. Recent Searches section:
   - Card with header "Recent Searches" and Clock icon
   - List of 5 recent search queries as clickable items
   - Each item: query text + small "x" to remove
   - Empty state: "No recent searches"
   - Use mock data for display

4. Popular Documents section:
   - Card with header "Popular This Week" and TrendingUp icon
   - List of 5 documents as cards showing:
     - Document title (font-medium)
     - Folder path as breadcrumb (text-sm, text-slate-500)
     - View count with Eye icon (text-sm)
   - Hover state: subtle background change

5. Document card interactions:
   - Cursor pointer on hover
   - Background: hover:bg-slate-50
   - Transition duration-150

MOCK DATA TO USE:
```typescript
const recentSearches = [
  "razorpay integration",
  "e-commerce checkout flow",
  "API authentication",
  "deployment process",
  "code review guidelines"
];

const popularDocs = [
  { id: 1, title: "Razorpay Integration Guide", path: "Sales > Payment Gateways", views: 234 },
  { id: 2, title: "E-commerce PRD v2", path: "Product > E-commerce", views: 187 },
  { id: 3, title: "API Authentication Standards", path: "Engineering > Backend", views: 156 },
  { id: 4, title: "Onboarding Checklist", path: "HR > New Hires", views: 142 },
  { id: 5, title: "Code Review Best Practices", path: "Engineering > Standards", views: 128 }
];
```

STYLING:
- Use shadcn/ui Card component for sections
- Consistent spacing: gap-6 between sections
- Responsive: stack columns on tablet (<1024px)

DO NOT:
- Implement actual search logic
- Add localStorage for recent searches
- Create navigation/routing

OUTPUT:
- pages/HomePage.tsx
- components/home/HeroSearch.tsx
- components/home/RecentSearches.tsx
- components/home/PopularDocuments.tsx
```

---

## Prompt 3: Search Results Page

### High-Level Goal
Create the search results page showing matched documents with highlighted snippets and an external search toggle.

### Copy-Paste Prompt

```
PROJECT CONTEXT:
- App Name: SimpleConf - Internal Knowledge Base
- Tech Stack: React 18+ with TypeScript, shadcn/ui, Tailwind CSS, Lucide icons
- Color Palette: Primary #2563EB, Accent #8B5CF6 (for highlights)

HIGH-LEVEL GOAL:
Create a search results page that displays documents matching a natural language query, with context snippets and similarity indicators.

DETAILED INSTRUCTIONS:
1. Create SearchResultsPage component:
   - Shows current query in header area
   - Results count and toggle for search mode
   - List of result cards
   - Separate section for external results (when enabled)

2. Results header:
   - Display: "12 results for 'razorpay integration'"
   - Toggle switch with labels: "Internal only" | "Search everywhere"
   - Use shadcn/ui Switch component

3. Result card design:
   - White background with subtle border (border-slate-200)
   - Padding: 16px
   - Hover: shadow-sm transition

   Card content (top to bottom):
   - Title row: Document title (font-semibold, text-lg) + relevance badge
   - Breadcrumb: Folder path in muted text (text-slate-500, text-sm)
   - Snippet: 2-3 lines of content with query terms highlighted in accent color (#8B5CF6 background with #5B21B6 text)
   - Footer row: View count (Eye icon), Last updated (relative time)

4. Relevance indicator:
   - High relevance (>0.8): Green badge "High match"
   - Medium relevance (0.5-0.8): No badge
   - Low relevance (<0.5): Muted card opacity

5. External results section (when toggle enabled):
   - Separate section with header "External Resources"
   - Different card style: dashed border, external link icon
   - Shows: Title, source domain, snippet
   - "Opens in new tab" indicator

6. Empty state:
   - Illustration or icon (SearchX from Lucide)
   - "No results found for '[query]'"
   - Suggestions: "Try different keywords" or "Search everywhere for external resources"

7. Loading state:
   - Skeleton cards (3-4) with pulsing animation
   - Use shadcn/ui Skeleton component

MOCK DATA:
```typescript
const searchResults = [
  {
    id: 1,
    title: "Razorpay Integration Guide",
    path: "Sales > Payment Gateways",
    snippet: "This guide covers the complete integration of <mark>Razorpay</mark> payment gateway including checkout flow, webhook handling, and error scenarios...",
    relevance: 0.92,
    views: 234,
    updatedAt: "2 days ago"
  },
  {
    id: 2,
    title: "Payment Gateway Comparison",
    path: "Sales > Research",
    snippet: "Comparing <mark>Razorpay</mark>, PhonePe, and Stripe for Indian market. <mark>Razorpay</mark> offers the best documentation and SDK support...",
    relevance: 0.78,
    views: 89,
    updatedAt: "1 week ago"
  },
  {
    id: 3,
    title: "E-commerce Checkout PRD",
    path: "Product > E-commerce",
    snippet: "The checkout flow should support multiple payment methods including <mark>Razorpay</mark> for cards and UPI...",
    relevance: 0.65,
    views: 156,
    updatedAt: "3 days ago"
  }
];

const externalResults = [
  {
    title: "Razorpay Documentation - Getting Started",
    domain: "razorpay.com",
    snippet: "Official documentation for integrating Razorpay payment gateway..."
  },
  {
    title: "Razorpay Node.js SDK - GitHub",
    domain: "github.com",
    snippet: "Official Node.js library for Razorpay API integration..."
  }
];
```

STYLING:
- Highlight marks: bg-violet-100 text-violet-800 px-1 rounded
- Cards: rounded-lg border hover:shadow-sm transition-shadow
- External cards: border-dashed border-slate-300

DO NOT:
- Implement actual search API calls
- Add click handlers for navigation
- Create the search input (it's in the header)

OUTPUT:
- pages/SearchResultsPage.tsx
- components/search/SearchResultCard.tsx
- components/search/ExternalResultCard.tsx
- components/search/SearchResultsSkeleton.tsx
```

---

## Prompt 4: Folder Browse View

### High-Level Goal
Create the folder browsing interface with document list and preview panel.

### Copy-Paste Prompt

```
PROJECT CONTEXT:
- App Name: SimpleConf - Internal Knowledge Base
- Tech Stack: React 18+ with TypeScript, shadcn/ui, Tailwind CSS, Lucide icons
- Access indicators: Unlocked folders use LockOpen icon, Locked use Lock icon

HIGH-LEVEL GOAL:
Create a folder browse view with breadcrumb navigation, document list, and a slide-in preview panel.

DETAILED INSTRUCTIONS:
1. Create FolderBrowsePage component with layout:
   - Breadcrumb navigation at top
   - Folder header with name, count, and actions
   - Two-column layout: Document list (left, 60%), Preview panel (right, 40%)

2. Breadcrumb navigation:
   - Use shadcn/ui Breadcrumb component
   - Format: Home > Department > Subfolder > Current
   - Each segment clickable except current (which is bold)
   - ChevronRight separators

3. Folder header:
   - Folder name as H1 (text-2xl, font-semibold)
   - Document count badge: "(7 documents)"
   - "New Document" button (primary, with Plus icon) - only if user has write access
   - Access indicator icon next to folder name

4. Document list:
   - Each document as a row/card with:
     - Document icon (FileText from Lucide)
     - Title (font-medium)
     - Last updated (relative time, text-sm, text-slate-500)
     - Owner name (text-sm, text-slate-500)
     - View count (Eye icon + number)
   - Hover state: bg-slate-50, show ">" chevron on right
   - Selected state: bg-blue-50, border-l-2 border-primary
   - Click selects and shows preview; double-click opens document

5. Preview panel:
   - Slide in from right when document selected
   - Sticky position, doesn't scroll with list
   - Header: Document title (H2)
   - Content preview: First 200 characters of document
   - Metadata: Owner, Last updated, View count, Comment count
   - "Open Document" primary button at bottom
   - Close button (X icon) in top right

6. Empty folder state:
   - FolderOpen icon (large, muted)
   - "No documents in this folder"
   - "Create the first document" button (if write access)

7. Folder tree component (for sidebar):
   - Hierarchical list with expand/collapse
   - Each folder shows: icon, name, document count badge
   - Access indicator: LockOpen (accessible) or Lock (restricted) icon
   - Restricted folders: opacity-60, italic text
   - Indent nested folders with left padding
   - Current folder highlighted with bg-slate-100

MOCK DATA:
```typescript
const currentFolder = {
  id: "pg-001",
  name: "Payment Gateways",
  path: ["Home", "Sales", "Payment Gateways"],
  documentCount: 7,
  isAccessible: true
};

const documents = [
  { id: 1, title: "Razorpay Integration Guide", updatedAt: "2 days ago", owner: "John Doe", views: 234, comments: 12 },
  { id: 2, title: "PhonePe Setup", updatedAt: "1 week ago", owner: "Jane Smith", views: 89, comments: 3 },
  { id: 3, title: "Stripe Configuration", updatedAt: "3 days ago", owner: "John Doe", views: 156, comments: 7 },
  { id: 4, title: "Payment Gateway Comparison", updatedAt: "2 weeks ago", owner: "Alex Chen", views: 67, comments: 5 },
  { id: 5, title: "Refund Processing Guide", updatedAt: "5 days ago", owner: "Jane Smith", views: 45, comments: 2 }
];

const folderTree = [
  { id: "sales", name: "Sales", count: 24, isAccessible: true, children: [
    { id: "pg", name: "Payment Gateways", count: 7, isAccessible: true },
    { id: "merchants", name: "Merchant Accounts", count: 5, isAccessible: true }
  ]},
  { id: "eng", name: "Engineering", count: 45, isAccessible: true, children: [
    { id: "frontend", name: "Frontend", count: 18, isAccessible: true },
    { id: "backend", name: "Backend", count: 27, isAccessible: true }
  ]},
  { id: "hr", name: "HR", count: 12, isAccessible: false, children: [] }
];
```

STYLING:
- Preview panel: shadow-lg, border-l, bg-white
- Document rows: py-3 px-4 border-b border-slate-100
- Folder tree: text-sm, py-1.5 px-2 for items

DO NOT:
- Implement actual data fetching
- Add routing/navigation logic
- Create the document view page

OUTPUT:
- pages/FolderBrowsePage.tsx
- components/folder/DocumentList.tsx
- components/folder/DocumentPreview.tsx
- components/folder/FolderTree.tsx
- components/folder/Breadcrumbs.tsx
```

---

## Prompt 5: Document View Page

### High-Level Goal
Create the document view page with rendered Markdown content, metadata bar, and comments section.

### Copy-Paste Prompt

```
PROJECT CONTEXT:
- App Name: SimpleConf - Internal Knowledge Base
- Tech Stack: React 18+ with TypeScript, shadcn/ui, Tailwind CSS, Lucide icons
- Markdown: Use react-markdown with syntax highlighting (highlight.js or prism)
- Typography: Tailwind prose classes for Markdown content

HIGH-LEVEL GOAL:
Create a document view page that displays Markdown content with metadata and a comments section.

DETAILED INSTRUCTIONS:
1. Create DocumentViewPage with layout:
   - Breadcrumb navigation
   - Document title (H1)
   - Metadata bar
   - Rendered Markdown content
   - Comments section (below fold)

2. Document header:
   - Breadcrumb: Home > Folder > Subfolder > Document Title
   - Title as H1 (text-3xl, font-bold)
   - Edit button (secondary, with Pencil icon) - positioned top right, only for owner

3. Metadata bar (horizontal, below title):
   - Created by: Avatar + name
   - Modified by: Avatar + name (if different from creator)
   - Last updated: Relative time with Calendar icon
   - View count: Eye icon + "234 views"
   - Comment count: MessageSquare icon + "12 comments"
   - Separator: vertical divider (|) between items
   - Style: text-sm text-slate-500, items spaced with gap-4

4. Markdown content area:
   - Use Tailwind Typography plugin (prose class)
   - Max width: prose-lg (65ch)
   - Code blocks: dark theme (bg-slate-800), with syntax highlighting
   - Copy button on code blocks (top right corner on hover)
   - Headings: proper hierarchy with anchor links (hover to show #)
   - Tables: bordered, striped rows
   - Links: primary color, underline on hover

5. Comments section:
   - Section header: "Comments (12)" with MessageSquare icon
   - Add comment input at top:
     - Textarea (2 rows, expands on focus)
     - "Add Comment" button (primary, disabled when empty)
     - User avatar shown next to input
   - Comment list (chronological, oldest first):
     - Each comment: Avatar, Name (font-medium), Timestamp (text-slate-500), Content
     - Delete button (Trash2 icon) on hover, only for comment author
     - Subtle divider between comments
   - Empty state: "No comments yet. Be the first to share your thoughts!"

6. Loading state:
   - Skeleton for title, metadata, and content blocks
   - Pulsing animation

MOCK DATA:
```typescript
const document = {
  id: 1,
  title: "Razorpay Integration Guide",
  path: ["Home", "Sales", "Payment Gateways"],
  content: `# Overview

This guide covers the complete integration of Razorpay payment gateway for our e-commerce platform.

## Prerequisites

- Node.js 18+
- Razorpay merchant account
- API keys from Razorpay dashboard

## Installation

\`\`\`bash
npm install razorpay
\`\`\`

## Basic Setup

\`\`\`typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
\`\`\`

## Creating an Order

| Field | Type | Required |
|-------|------|----------|
| amount | number | Yes |
| currency | string | Yes |
| receipt | string | No |

## Error Handling

Always wrap API calls in try-catch blocks...
`,
  createdBy: { name: "John Doe", avatar: "/avatars/john.jpg" },
  modifiedBy: { name: "Jane Smith", avatar: "/avatars/jane.jpg" },
  updatedAt: "2 hours ago",
  views: 234,
  isOwner: true
};

const comments = [
  { id: 1, author: { name: "Alex Chen", avatar: "/avatars/alex.jpg" }, content: "Great documentation! This helped me set up the checkout flow.", timestamp: "2 days ago", isAuthor: false },
  { id: 2, author: { name: "Sarah Wilson", avatar: "/avatars/sarah.jpg" }, content: "Can you add a section about handling webhooks?", timestamp: "1 day ago", isAuthor: false },
  { id: 3, author: { name: "John Doe", avatar: "/avatars/john.jpg" }, content: "Good suggestion Sarah, I'll add that this week.", timestamp: "5 hours ago", isAuthor: true }
];
```

STYLING:
- Metadata bar: flex items-center gap-4 text-sm text-slate-500
- Prose content: prose prose-slate prose-lg max-w-none
- Code blocks: rounded-lg overflow-hidden
- Comments: divide-y divide-slate-100

DO NOT:
- Implement actual Markdown parsing (just show structure)
- Add edit functionality
- Create comment submission logic

OUTPUT:
- pages/DocumentViewPage.tsx
- components/document/MetadataBar.tsx
- components/document/MarkdownRenderer.tsx
- components/document/CommentsSection.tsx
- components/document/CommentItem.tsx
```

---

## Prompt 6: Document Editor

### High-Level Goal
Create a split-pane Markdown editor with live preview.

### Copy-Paste Prompt

```
PROJECT CONTEXT:
- App Name: SimpleConf - Internal Knowledge Base
- Tech Stack: React 18+ with TypeScript, shadcn/ui, Tailwind CSS, Lucide icons
- Editor: Split view with Markdown input and live preview

HIGH-LEVEL GOAL:
Create a document editor page with a split-pane layout: Markdown textarea on the left, live preview on the right.

DETAILED INSTRUCTIONS:
1. Create DocumentEditorPage with layout:
   - Header bar with title input, Cancel and Save buttons
   - Split pane: Editor (50%) | Preview (50%)
   - Resizable divider between panes

2. Editor header:
   - Cancel button (secondary/ghost, left side)
   - Title: "New Document" or "Edit: [Document Title]"
   - Save button (primary, right side, disabled if no title)
   - Unsaved changes indicator (yellow dot next to title if modified)

3. Title input:
   - Full-width input below header
   - Placeholder: "Document title..."
   - Large text (text-xl font-semibold)
   - No border, just underline on focus
   - Required validation

4. Editor pane (left):
   - Textarea filling available height
   - Monospace font (JetBrains Mono or similar)
   - Line numbers gutter (optional, nice to have)
   - Tab key inserts 2 spaces (not focus change)
   - Placeholder: "Write your document in Markdown..."
   - Simple toolbar above textarea:
     - Bold (B), Italic (I), Code (`), Link, Heading dropdown
     - Buttons insert Markdown syntax at cursor

5. Preview pane (right):
   - Header: "Preview" label
   - Rendered Markdown using same styles as DocumentView
   - Updates live as user types (debounced 300ms)
   - Scroll sync with editor (nice to have)
   - Empty state: "Start typing to see preview..."

6. Divider:
   - Vertical line between panes
   - Draggable to resize (cursor: col-resize)
   - Double-click resets to 50/50

7. Keyboard shortcuts:
   - Cmd/Ctrl + S: Save
   - Cmd/Ctrl + B: Bold selection
   - Cmd/Ctrl + I: Italic selection
   - Escape: Focus out of editor

8. Unsaved changes warning:
   - If user tries to navigate away with unsaved changes
   - Show confirmation dialog: "You have unsaved changes. Discard?"

MOCK DATA:
```typescript
const existingDocument = {
  id: 1,
  title: "Razorpay Integration Guide",
  content: `# Overview

This guide covers the complete integration of Razorpay.

## Prerequisites

- Node.js 18+
- Razorpay account

## Installation

\`\`\`bash
npm install razorpay
\`\`\`
`
};

// For new document, start with empty state
const newDocument = {
  id: null,
  title: "",
  content: ""
};
```

STYLING:
- Editor textarea: font-mono text-sm bg-slate-50 p-4
- Preview: prose prose-slate max-w-none p-4
- Toolbar buttons: p-2 hover:bg-slate-100 rounded
- Divider: w-1 bg-slate-200 hover:bg-slate-300 cursor-col-resize

DO NOT:
- Implement actual save API call
- Add file upload/attachment support
- Create autosave functionality

OUTPUT:
- pages/DocumentEditorPage.tsx
- components/editor/EditorToolbar.tsx
- components/editor/MarkdownEditor.tsx
- components/editor/EditorPreview.tsx
- components/editor/UnsavedChangesDialog.tsx
```

---

## Prompt 7: Login & Registration

### High-Level Goal
Create login and registration forms with a clean, centered layout.

### Copy-Paste Prompt

```
PROJECT CONTEXT:
- App Name: SimpleConf - Internal Knowledge Base
- Tech Stack: React 18+ with TypeScript, shadcn/ui, Tailwind CSS, Lucide icons
- Auth: Email/password based, no social login for MVP

HIGH-LEVEL GOAL:
Create login and registration pages with a clean, centered card layout.

DETAILED INSTRUCTIONS:
1. Create shared AuthLayout component:
   - Centered vertically and horizontally
   - SimpleConf logo at top
   - Tagline: "Find knowledge, not folders"
   - Card container for form (max-width: 400px)
   - Subtle gradient or pattern background (optional)

2. Login page (LoginPage):
   - Email input with Mail icon
   - Password input with Lock icon and show/hide toggle (Eye/EyeOff)
   - "Forgot password?" link (disabled for MVP, shows tooltip "Coming soon")
   - Login button (primary, full width)
   - Divider with "or"
   - "Don't have an account? Register" link

3. Registration page (RegisterPage):
   - Display name input with User icon
   - Email input with Mail icon
   - Password input with Lock icon and show/hide toggle
   - Password requirements hint: "At least 8 characters"
   - Department dropdown with Building icon:
     - Options: Frontend, Backend, Flutter, Infrastructure, Sales, HR, Management
   - "Create Account" button (primary, full width)
   - "Already have an account? Login" link

4. Form validation:
   - Email: Required, valid email format
   - Password: Required, min 8 characters
   - Display name: Required, min 2 characters
   - Department: Required
   - Show inline error messages below inputs
   - Disable submit button until form is valid

5. Error states:
   - Invalid credentials: Alert banner above form "Invalid email or password"
   - Email exists: Alert banner "An account with this email already exists"
   - Generic error: Alert banner "Something went wrong. Please try again."

6. Loading state:
   - Button shows spinner and "Logging in..." or "Creating account..."
   - Inputs disabled during submission

7. Success state (registration):
   - Show success message "Account created! Please log in."
   - Redirect to login page

MOCK DATA:
```typescript
const departments = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "flutter", label: "Flutter" },
  { value: "infra", label: "Infrastructure" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "HR" },
  { value: "management", label: "Management" }
];
```

STYLING:
- Card: bg-white shadow-lg rounded-xl p-8
- Logo: text-2xl font-bold text-primary
- Tagline: text-slate-500 text-sm mb-8
- Inputs: shadcn/ui Input with icon prefix
- Error messages: text-red-500 text-sm mt-1
- Links: text-primary hover:underline

DO NOT:
- Implement actual authentication logic
- Add password reset functionality
- Create session management

OUTPUT:
- pages/LoginPage.tsx
- pages/RegisterPage.tsx
- components/auth/AuthLayout.tsx
- components/auth/LoginForm.tsx
- components/auth/RegisterForm.tsx
```

---

## Usage Tips

### For v0.dev
1. Paste one prompt at a time
2. Start with the App Shell (Prompt 1) to establish the layout
3. Build subsequent pages within that context
4. Use "iterate" to refine specific parts

### For Lovable.ai
1. You can combine multiple prompts for a more complete generation
2. Reference the design system consistently
3. Ask for TypeScript types to be generated alongside components

### General Tips
1. **Start simple**: Generate the layout first, then add complexity
2. **Iterate**: Don't expect perfection on first try; refine specific parts
3. **Review carefully**: AI-generated code needs human review for edge cases
4. **Customize**: Adjust colors, spacing, and typography to match your exact needs
5. **Test accessibility**: Verify keyboard navigation and screen reader compatibility

---

## Next Steps After Generation

1. Review generated code for TypeScript errors
2. Connect components to your routing system (React Router)
3. Replace mock data with actual API calls
4. Add proper error handling and loading states
5. Test responsive behavior at all breakpoints
6. Run accessibility audit (axe DevTools)
7. Add unit tests for critical components
