sequenceDiagram
    actor Student
    participant Frontend
    participant Backend
    participant Supabase

    Student->>Frontend: Access login page
    Frontend->>Supabase: Authenticate(username, password)
    Supabase-->>Frontend: Authentication result
    alt Authentication successful
        Frontend->>Backend: Request user data
        Backend->>Supabase: Fetch user data
        Supabase-->>Backend: User data
        Backend-->>Frontend: User data
        Frontend-->>Student: Display dashboard
    else Authentication failed
        Frontend-->>Student: Display error message
    end

    Student->>Frontend: Request content modules
    Frontend->>Backend: Get content modules
    Backend->>Supabase: Fetch content modules
    Supabase-->>Backend: Content modules data
    Backend->>Supabase: Fetch user progress
    Supabase-->>Backend: User progress data
    Backend-->>Frontend: Combined content and progress data
    Frontend-->>Student: Display content modules with progress

    Student->>Frontend: Select content module
    Frontend->>Backend: Get module details
    Backend->>Supabase: Fetch module details (including blocks)
    Supabase-->>Backend: Module details with blocks
    Backend-->>Frontend: Module data with blocks
    Frontend-->>Student: Display module overview

    loop For each content block
        Student->>Frontend: View content block
        Frontend->>Backend: Get block details
        Backend->>Supabase: Fetch block content
        Supabase-->>Backend: Block content
        Backend-->>Frontend: Block content
        Frontend-->>Student: Display block content

        alt If quiz exists for this block
            Student->>Frontend: Start quiz
            Frontend->>Backend: Request quiz questions
            Backend->>Supabase: Fetch quiz questions
            Supabase-->>Backend: Quiz questions
            Backend-->>Frontend: Quiz questions
            Frontend-->>Student: Display quiz

            Student->>Frontend: Submit quiz answers
            Frontend->>Backend: Submit answers
            Backend->>Supabase: Store quiz results
            Supabase-->>Backend: Confirmation
            Backend->>Supabase: Update user progress
            Supabase-->>Backend: Confirmation
            Backend-->>Frontend: Quiz results and updated progress
            Frontend-->>Student: Display quiz results and updated progress
        end
    end

    Frontend-->>Student: Display module completion