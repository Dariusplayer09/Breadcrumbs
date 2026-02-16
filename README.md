# 🥖 Breadcrumbs

> Turn web browsing into structured thinking.


## Overview

Breadcrumbs is a Chrome extension that organizes browsing around intent rather than chronology.

Each Google search creates a new “thought.”  
All subsequent pages are grouped under that thought and organized by site (e.g., Wikipedia, YouTube). The result is a clean, collapsible structure that reflects how ideas evolve over time.

Instead of asking “Where did I go?”, Breadcrumbs helps answer:

> “Why did I go there?”

---

## How It Works

1. A Google search creates a new thought node.  
2. Pages visited afterward attach to that thought.  
3. Pages are grouped by site to prevent duplication.  
4. The popup renders a collapsible tree view.  
5. Users can manually clear thoughts.  

Example:

    Google Search — Mechanical Keyboard
      ▾ Wikipedia
        • Keyboard
        • Mechanical keyboard
      ▾ YouTube
        • Switch comparison review

---

## Tech Stack

- JavaScript  
- Chrome Extensions API  
- HTML / CSS  
- chrome.storage.local  

---

## Design Principles

- Minimal interface  
- Intent-based grouping  
- Persistent thoughts  
- User-controlled clearing  
- Subtle animations  

---

## Future Improvements

- Export thoughts  
- Session grouping  
- Smarter summaries  
