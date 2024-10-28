graph TB
    subgraph "SDG Learning Platform"
        subgraph "Frontend Packages"
            Pages["pages"]
            Components["components"]
            Styles["styles"]
            Public["public"]
        end

        subgraph "Backend Packages"
            API["api"]
            Lib["lib"]
            Utils["utils"]
        end

        subgraph "Data Management"
            Models["models"]
            Hooks["hooks"]
        end

        subgraph "State Management"
            Store["store"]
            Reducers["reducers"]
            Actions["actions"]
        end

        subgraph "Authentication"
            Auth["auth"]
        end

        subgraph "Database Interface"
            SupabaseClient["supabaseClient"]
        end

        subgraph "Testing"
            Tests["tests"]
        end

        Config["config"]
    end

    Pages --> Components
    Pages --> Hooks
    Pages --> Store
    Components --> Styles
    Components --> Hooks
    API --> Lib
    API --> Utils
    API --> Models
    API --> SupabaseClient
    Lib --> Utils
    Lib --> SupabaseClient
    Hooks --> SupabaseClient
    Store --> Reducers
    Store --> Actions
    Auth --> SupabaseClient
    Tests --> Components
    Tests --> API