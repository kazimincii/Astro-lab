# iOS Widget Setup Guide

## Prerequisites

This app uses **Expo Managed Workflow**, which doesn't support native iOS extensions out of the box.

To enable iOS Widgets, you need to:

### Option 1: Eject to Bare Workflow (Recommended for Production)

```bash
cd mobile
npx expo prebuild
```

Then follow the steps in the main README.md to:
1. Add Widget Extension in Xcode
2. Configure App Groups
3. Add native bridge code

### Option 2: Use Expo Dev Client + Config Plugin

Coming soon - we're working on an expo config plugin for widgets.

### Option 3: Keep Managed Workflow (Widgets Disabled)

Widgets will not work in managed workflow. The app will function normally without widgets.

## For Development

Widget service is already implemented in `src/services/widgetService.ts` and will work once:

- App is ejected to bare workflow, OR
- Config plugin is added

Until then, widget-related features are gracefully disabled.

## Implementation Status

✅ Widget UI (Swift/SwiftUI)  
✅ Widget Service (TypeScript)  
⏳ Native Bridge (requires bare workflow)  
⏳ Xcode Integration (requires manual setup)  

See README.md in parent directory for full implementation details.
