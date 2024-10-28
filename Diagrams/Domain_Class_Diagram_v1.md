classDiagram
    class User {
        +String username
        +String password
        +String email
        +login()
        +register()
    }

    class Student {
        +viewContentModules()
        +takeQuiz()
        +viewResults()
    }

    class Admin {
        +createContentModule()
        +editContentModule()
        +removeContentModule()
        +createQuiz()
        +editQuiz()
        +removeQuiz()
        +createQuestion()
        +editQuestion()
        +removeQuestion()
        +addContent()
        +manageUserBase()
    }

    class ContentModule {
        +String title
        +Date createdDate
        +Date lastUpdated
        +create()
        +edit()
        +remove()
    }

    class Quiz {
        +String title
        +String description
        +int timeLimit
        +Date createdDate
        +Date lastUpdated
        +create()
        +edit()
        +remove()
    }

    class Question {
        +String questionText
        +List~String~ options
        +String correctAnswer
        +create()
        +edit()
        +remove()
    }

    class Content {
        +String title
        +String body
        +Date createdDate
        +Date lastUpdated
        +create()
        +edit()
        +remove()
    }

    class SDG {
        +int number
        +String name
        +String description
    }

    User <|-- Student
    User <|-- Admin
    Admin "1..*" -- "0..*" ContentModule : manages
    Admin "1..*" -- "0..*" User : manages
    Student "1..*" -- "0..*" ContentModule : views
    ContentModule "1" -- "1" SDG : represents
    ContentModule "1" -- "0..1" Quiz : contains
    ContentModule "1" -- "1" Content : contains
    Quiz "1" -- "1..*" Question : contains