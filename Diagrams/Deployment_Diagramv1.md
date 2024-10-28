graph TD
    subgraph "Client Devices"
        B[Web Browser]
        M[Mobile Browser]
    end

    subgraph "Vercel Cloud Platform"
        V[Vercel Edge Network]
        subgraph "Next.js Server"
            NJ[Next.js Runtime]
            SR[Server-side Rendering]
            AR[API Routes]
        end
        S[Static File Server]
    end

    subgraph "GitHub"
        GR[GitHub Repository]
        GA[GitHub Actions]
    end

    subgraph "Supabase Cloud"
        subgraph "Supabase Services"
            SA[Supabase API]
            SAuth[Auth Service]
            SS[Storage Service]
        end
        PG[(PostgreSQL Database)]
    end

    B -->|HTTPS| V
    M -->|HTTPS| V
    V --> NJ
    V --> S
    NJ --> SR
    NJ --> AR
    AR -->|API Calls| SA
    AR -->|Auth Requests| SAuth
    AR -->|File Operations| SS
    SA --> PG
    SAuth --> PG
    SS --> PG
    GR -->|Trigger Deploy| GA
    GA -->|Deploy| V

    classDef vercel fill:#E8F6FF,stroke:#4285F4,stroke-width:2px;
    classDef nextjs fill:#FFEAEA,stroke:#FF0000,stroke-width:2px;
    classDef github fill:#F2F3F5,stroke:#24292E,stroke-width:2px;
    classDef supabase fill:#E5F8EC,stroke:#3ECF8E,stroke-width:2px;
    classDef database fill:#FFF2CC,stroke:#DAA520,stroke-width:2px;

    class V,S vercel;
    class NJ,SR,AR nextjs;
    class GR,GA github;
    class SA,SAuth,SS supabase;
    class PG database;