# UNi SDG

## Overview

The frontend of the Learning Management System (LMS) is built with **React** and **Next.js** and deployed on **Vercel**. It follows a component-based architecture using Next.js’s latest app router and provides a clean and responsive user experience for both learners and administrators.

### Demo

Try the [https://sdg-gamified-lms-it.vercel.app/](https://sdg-gamified-lms-it.vercel.app/).

---

## System Configuration & Installation Guidelines

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase**: An account and project set up with necessary environment variables

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Kevin-Zhouu/SDG-Gamified-LMS-IT.git
   cd SDG-Gamified-LMS-IT
   ```

2. **Configure environment variables:**

   Rename `.env.local.example` to `.env.local` and update the following variables with your Supabase credentials:

   ```plaintext
   NEXT_PUBLIC_SUPABASE_URL=[YOUR_SUPABASE_PROJECT_URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_PROJECT_ANON_KEY]
   AWS_REGION=ap-southeast-2
   SMTP_HOST=[YOUR_CHOSEN_SMTP_HOST]
   SMTP_PORT=[YOUR_CHOSEN_SMTP_PORT]
   SMTP_USER=[YOUR_CHOSEN_SMTP_USER]
   SMTP_PASSWORD=[YOUR_CHOSEN_SMTP_PASSWORD]
   NEXT_PUBLIC_NEWS_API_KEY=[YOUR_NEWS_API_KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api).

   `NEXT_PUBLIC_NEWS_API_KEY` can be found in [news api provider](https://newsapi.org/).

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

---

## Project Structure

```
/app
├── /api               # API routes for handling backend logic
│   ├── /example       # Example routes and APIs
│   ├── /news          # News-related API routes
│   ├── /sdgs          # Fetch and Pushing SDG APIs
│   └── /search        # Search functionality route
├── /auth              # Authentication and callback handling
├── /builder           # (Admin) Page to build and customize modules
├── /components        # Reusable components (NavBar, SDGGrid, etc.)
│   ├── /_tests_       # Testing-related components
│   ├── /builder       # Builder-specific components
│   ├── /modulePlayer  # Components for interactive module playing
│   │   └── sections   # Sections within module player (flashcards, quizzes, etc.)
│   └── /ui            # UI components (buttons, modals, etc.)
├── /login             # Login page and related components
├── /play              # Interactive learning module pages
│   └── /[module_id]   # Dynamic route for each module
├── /profile           # User profile management
├── /reset-password    # Password reset functionality
├── /sdg               # Pages for viewing individual SDGs and module overview
│   └── /[slug]        # Dynamic route for SDG details
├── /search            # Search functionality
├── /update-password   # Password update functionality
├── /public            # Static assets (favicon, images)
├── /styles            # Global and component-level styling
├── /utils             # Utility functions (API calls, helpers)
│   └── /supabase      # Supabase client and related middleware
├── /types             # Type definitions
```
---

### Key Components and Their Functions

1. **SDGGrid** - Displays Sustainable Development Goals (SDGs) with links to specific pages.

2. **ModulePlayer** - Core component for interactive learning modules.
   - **Sections** - Subcomponents within `ModulePlayer` tailored to specific learning activities:
     - **Flashcards** (`Flashcards.tsx`) - Component to present flashcards for interactive learning.
     - **Header** (`Header.tsx`) - Displays header information for module sections.
     - **Quiz** (`Quiz.tsx`) - Contains quiz functionality for module completion.
     - **Text** (`Text.tsx`) - Displays text content as part of the learning module.

3. **UI Components** (`/ui`) - General UI components that enhance interactivity and user experience:
    - **Button** (`Button.tsx`) - General-purpose button for various actions.
    - **WaterContainer** (`WaterContainer.tsx`) - Specialized component, possibly for water-related visualizations or UI interactions.
    - **Checkbox** - Checkbox input component.
    - **Input** - Input field for text and other user data.
    - **Label** - Label component for form fields.
    - **Select** - Dropdown select component for choosing options.

4. **Footer** - Footer component that appears across the application, typically with links and copyright.

5. **NewsCarousel** - Rotating display component for news articles related to SDGs.

6. **NewsCard** - Card component for individual news items, used within the `NewsCarousel`.

---

## Changelog

- **v0.1** - Base full stack NEXTjs website with and auth
- **v0.2** - Create Infographic Demopage
- **v1.0** - Revise Infographic integrated with Modules and SDGs
- **v1.1** - More interactivity and debugging
---

## Known Bugs

1. **User Management** - Done in Supabase Interface
2. **SDG Management** - Not editable 

---

## Testing

### Test Cases

1. **Login/Signup Tests**
   - Validate user authentication flow.
   - Test incorrect credentials handling.

2. **User Functionality Tests**
   - Check user map and access to sdgs, modules and content.
   - Verify input to track and display completion
.
3. **Admin Privileges**
   - Ensure admin CRUD operations are functional.
   - Test SDG creation format and correct deletion.

### Traceability Matrix

| Feature                 | Test Case                         | Status |
|-------------------------|-----------------------------------|--------|
| User Authentication     | Login, Logout, Signup             | Passed |
| User Functionality      | Access, Interact, Results Display | Passed |
| Admin Module Management | Create, and Delete SDGs           | Passed |

---
**MIT License**

Copyright (c) [2024] UNi SDG

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.