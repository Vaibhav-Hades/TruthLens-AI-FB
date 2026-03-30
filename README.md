<div align="center">
  <img src="https://img.shields.io/badge/Powered%20by-Spring_Boot%203-6DB33F?style=for-the-badge&logo=springboot" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/AI_Engine-Gemini_Flash-4285F4?style=for-the-badge&logo=google" alt="Gemini AI" />
  <br/>
  <h1>TruthLens AI</h1>
  <p>An AI-powered digital authenticity and real-time mis/disinformation verification platform.</p>
</div>

---

## 🚀 Technical Stack

### Frontend Architecture
- **Framework**: React 19 + Vite (HMR & ultra-fast dev server proxying)
- **Routing**: React Router DOM (v6) with secure authenticated protection boundaries
- **Styling**: TailwindCSS with bespoke CSS variables (`index.css`) creating uniform glassmorphic dashboards
- **Design Tokens**: Custom UI/UX animations built natively with CSS keyframes & Lucide React icons
- **Internationalization (i18n)**: Extensive localization system supporting English (EN), Hindi (HI), Telugu (TE), Tamil (TA), Bengali (BN), Chinese (ZH), Japanese (JA), and Korean (KO) dynamically hot-swappable
- **AI Integrations**: 
  - Native Web Speech API rendering multi-lingual generative-summarization readouts
  - Tavus AI WebRTC Conversational Video integration acting as a live floating "Fact-Check Assistant"

### Backend Architecture
- **Framework**: Java Spring Boot 3.2.x
- **Build Server**: Apache Maven
- **Database Architecture**: MySQL powered by Spring Data JPA / Hibernate ORM
- **REST Handling**: `@RestController` endpoints strictly consuming and generating generic DTOs 
- **Security Protocols**: CORS (`@CrossOrigin`) configured rigorously against domain origin spoofing ensuring tight localhost development locks 

### AI & Third-Party APIs
- **Google Generative AI (Gemini SDK)**: Harnessing Gemini 1.5 Flash to automatically consume YouTube urls, read page logic, and rapidly summarize complex truth algorithms internally via Node.
- **Tavus AI**: Intercepts queries across a `POST /v2/conversations` handshake, resolving with real-time replica WebRTC streams directly into iframe windows globally initialized in the frontend DOM.

---

## 📁 Project Structure

### Frontend Stack (`/src`)
```text
src/
├── components/       # Globally reused blocks (Navbar, ChatBot, ProtectedRoute)
├── context/          # Prop-drilling mitigations via context providers (AuthContext)
├── hooks/            # Custom logic bindings (useAuth)
├── locales/          # Central localization nodes for the 8 platform languages
├── pages/            # View-Level layouts defining application pages
│   ├── About.jsx
│   ├── Analytics.jsx
│   ├── History.jsx
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Report.jsx    # Complex results ingestion and SVG D3-esque display UI
│   └── Verify.jsx    # Core dynamic ingestion field integrating Gemini AI + Text-to-Speech
├── utils/            # Abstract bindings handling asynchronous network connections
│   ├── api.js        # Dedicated Spring Boot / backend API gateway
│   └── gemini.js     # External Google LLM processing triggers
├── App.jsx           # Master parent wrapper executing Router and the ChatBot layout
├── index.css         # Foundational aesthetic design tokens
└── main.jsx          # Global DOM attachment handling i18n
```

### Backend Stack (`/src/main`)
```text
src/main/
├── java/com/example/truthlensai/
│   ├── TruthlensaiApplication.java     # The Spring Boot application runner
│   ├── controller/                     # Public routing channels handling REST payload requests
│   │   └── AnalyzeController.java      # Connects frontend AI requests to database tracking
│   ├── model/                          # Active database entities & discrete DTO packages
│   ├── repository/                     # Database interfacing handling logic via JpaRepository
│   └── service/                        # Background processing handling truth parsing layers
└── resources/
    └── application.properties          # Embedded configuration covering port mapping & DB strings
```

---

## ⚙️ Running Locally

The project uses a proxy-bypassing technique internally using Vite configurations to avoid deep-routed CORS pre-flights occurring on your standard development rig.

### 1. Database & Spring Boot
Ensure **MySQL** is running locally inside port `3306`. Create a database explicitly called `truthlensai`.
```bash
# Within the main project directory containing pom.xml
.\mvnw.cmd clean compile
.\mvnw.cmd spring-boot:run
```
The Java layer boots and attaches to `http://localhost:8080`.

Spin up the system:
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173`. All backend `/analyze` calls automatically tunnel securely to the Spring Boot layer on `:8080`.
