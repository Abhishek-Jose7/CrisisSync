1. Frontend Design Rules (Anthropic frontend-design)
Design Principles

Always prioritize:

clarity over decoration
usability over visual novelty
speed over unnecessary animation
action visibility over aesthetic complexity
trust over visual experimentation

Avoid:

decorative-only UI
confusing layouts
hidden actions
excessive modal usage
ambiguous status indicators
Layout Rules

Use:

strong visual hierarchy
predictable navigation
obvious call-to-action placement
consistent spacing
clear section grouping
stable dashboard structures

Prefer:

cards
panels
tables
filters
command surfaces
dashboards

over abstract landing-page layouts.

Interaction Rules

Users must understand immediately:

what happened
what is happening
what needs action
what is blocked
what is urgent

Every important state must be visually explicit.

Examples:

active rescue request
unresolved emergency
pending volunteer approval
failed donation verification

Never rely only on color for status.

2. React Best Practices (Vercel React Best Practices)
Architecture Rules

Build:

small focused components
reusable modules
isolated responsibilities
predictable state flow

Avoid:

giant components
business logic inside UI markup
unnecessary prop drilling
duplicated state
deeply nested conditionals
Component Rules

Prefer:

composition over inheritance
explicit props
single responsibility components
reusable primitives
shared UI foundations

Bad:

MegaDashboard.jsx with everything inside

Good:

AlertCard
VolunteerPanel
IncidentMap
DonationTracker
RequestTable
State Management

Keep state:

local when possible
lifted only when necessary
normalized when shared

Avoid:

unnecessary global state
state duplication
mutation-heavy patterns
Async Handling

Always handle:

loading states
empty states
failure states
retry paths

Never assume network success.

Performance

Use:

lazy loading where needed
memoization only when justified
optimized rendering patterns

Do not prematurely optimize. Optimize bottlenecks only.

3. Composition Patterns (Vercel Composition Patterns)
Composition First

Prefer:

composable UI systems
slot-based design
reusable containers
modular feature blocks

Avoid:

rigid one-off components
duplicated layouts
tightly coupled structures
Example Pattern

Use: Dashboard → Section → Card → Action → Status

instead of rebuilding every screen separately.

Shared Structures

Create reusable systems for:

notifications
alert cards
approval flows
assignment panels
role dashboards
status indicators
action bars
Extensibility

Every component should support future roles like:

admin
NGO
volunteer
government
donor
victim

without rewriting the architecture.

4. Accessibility Rules (AccessLint)
Accessibility Is Mandatory

This platform must work during stress, panic, and urgency. Accessibility is a core requirement.

Keyboard Access

Everything must be usable by keyboard.

Required:

logical tab order
visible focus states
keyboard navigation
accessible forms
accessible dialogs
Visual Accessibility

Required:

strong contrast
readable font sizes
clear labels
visible error states
distinguishable statuses

Avoid:

low contrast UI
tiny text
icon-only actions without labels
Screen Reader Support

Required:

semantic HTML
proper labels
ARIA only when necessary
meaningful button names
meaningful form descriptions

Avoid:

div-only interfaces
inaccessible custom controls
Error Handling

Users must clearly understand:

what failed
why it failed
how to fix it

Never use vague messages like: “Something went wrong”

5. Emergency UX Rules (UI/UX Pro Max Adaptation)
Urgency-First UX

The interface must reduce decision friction.

Users should not need to think hard. They should act fast.

Prioritize

Show first:

urgent incidents
blocked requests
high-risk alerts
rescue assignments
response deadlines

Do not bury critical actions.

Reduce Cognitive Load

Use:

fewer decisions
clearer actions
stronger defaults
direct workflows

Avoid:

multi-step unnecessary flows
hidden actions
unclear ownership
Confirmation Rules

Critical actions require confirmation:

close emergency case
cancel rescue dispatch
approve funding release
reject urgent request

Routine actions should stay fast.

6. Folder Structure Rules

Use clean scalable structure.

Example:

src/ components/ ui/ dashboard/ alerts/ donations/ volunteers/ pages/ hooks/ services/ utils/ context/ types/ constants/

Avoid chaotic flat structures.

7. Code Quality Rules

Required:

readable code
meaningful naming
predictable logic
strong separation of concerns
production-safe implementation

Avoid:

clever unreadable code
magic values
duplicated business logic
hidden assumptions

Code must be maintainable by teams.

8. CrisisSync Specific Features

All implementations should support:

real-time alerts
rescue coordination
victim request management
volunteer assignment
NGO dashboard
government dashboard
donation tracking
incident map visualization
analytics and reporting
admin control panels
mobile responsiveness

Design for real usage, not presentation demos.

Final Instruction

When generating UI, code, workflows, or architecture:

Follow these rules by default.

If a decision must be made between: beauty vs clarity

choose clarity.

If a decision must be made between: complexity vs reliability

choose reliability.

If a decision must be made between: speed of development vs production quality

choose production quality.