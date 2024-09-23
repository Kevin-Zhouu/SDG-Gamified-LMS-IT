sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Supabase

    Admin->>Frontend: Access login page
    Frontend->>Supabase: Authenticate(username, password)
    Supabase-->>Frontend: Authentication result
    alt Authentication successful
        Frontend->>Backend: Request admin data
        Backend->>Supabase: Fetch admin data
        Supabase-->>Backend: Admin data
        Backend-->>Frontend: Admin data
        Frontend-->>Admin: Display admin dashboard
    else Authentication failed
        Frontend-->>Admin: Display error message
    end

    Admin->>Frontend: Create new content module
    Frontend->>Backend: Create content module request
    Backend->>Supabase: Store new content module
    Supabase-->>Backend: Confirmation
    Backend-->>Frontend: Module creation confirmation
    Frontend-->>Admin: Display creation confirmation

    loop For each content block in module
        Admin->>Frontend: Add content block to module
        Frontend->>Backend: Create content block request
        Backend->>Supabase: Store new content block
        Supabase-->>Backend: Confirmation
        Backend-->>Frontend: Block creation confirmation
        Frontend-->>Admin: Display block creation confirmation

        alt If quiz for this block
            Admin->>Frontend: Create quiz for content block
            Frontend->>Backend: Create quiz request
            Backend->>Supabase: Store new quiz
            Supabase-->>Backend: Confirmation
            Backend-->>Frontend: Quiz creation confirmation
            Frontend-->>Admin: Display quiz creation confirmation

            loop For each question in quiz
                Admin->>Frontend: Add question to quiz
                Frontend->>Backend: Create question request
                Backend->>Supabase: Store new question
                Supabase-->>Backend: Confirmation
                Backend-->>Frontend: Question creation confirmation
                Frontend-->>Admin: Display question creation confirmation
            end
        end
    end

    Admin->>Frontend: Edit content module or block
    Frontend->>Backend: Edit module/block request
    Backend->>Supabase: Update module/block data
    Supabase-->>Backend: Confirmation
    Backend-->>Frontend: Module/block update confirmation
    Frontend-->>Admin: Display update confirmation

    Admin->>Frontend: Manage user accounts
    Frontend->>Backend: Request user list
    Backend->>Supabase: Fetch user data
    Supabase-->>Backend: User data
    Backend-->>Frontend: User list
    Frontend-->>Admin: Display user management interface