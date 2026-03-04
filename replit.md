# 交易员能力评测 H5

## Overview
The Deltapex Trading H5 application is a mobile-first platform designed to assess users' trading capabilities. It includes a user system, a trading ability assessment inspired by MBTI, and modules for future expansion like games and a community. The assessment uses 12 scenario-based questions to generate a trader personality type, rank, and radar chart, all computed client-side. The project aims to provide personalized insights and recommendations to traders, driving engagement with Deltapex's educational and trading resources.

## User Preferences
I prefer the AI agent to prioritize information architecture and core functionality over granular implementation details. The agent should maintain the established design system and technical stack. When making changes, it should focus on enhancing performance, user experience, and scalability while adhering to the defined visual and interaction patterns. I prefer an iterative development approach, with clear communication before significant architectural changes or external dependency integrations.

## System Architecture
The application is built with a modern web stack: React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, and Recharts for the frontend, and Express.js with PostgreSQL and Drizzle ORM for the backend. Notifications are handled via WeChat Webhook.

**UI/UX and Design System:**
The design adheres to a permanent "Institutional Dark" theme (v2) inspired by Bloomberg/quant platforms.
- **Color Tokens**: A predefined palette (`--bg-0`, `--bg-1`, `--card`, `--primary`, `--gold`, etc.) ensures consistency.
- **Radius Tokens**: Standardized card (`16px`) and UI element (`12px`) rounded corners.
- **Tailwind Extensions**: Custom aliases for colors and rounded corners, plus custom easing and duration for animations.
- **Animations**: Framer Motion (`page`, `hoverLift`, `tap`), CSS breathing glow, and page transitions for a dynamic feel.
- **Typography**: Specific fonts for different elements: Oswald for headings/numbers, Noto Serif SC for character names, Barlow Condensed for data, Space Mono for English labels, and Noto Sans SC for body text.

**Core Features & Technical Implementations:**
- **User Management**: Mobile number-based registration and login.
- **Dashboard**: Displays assessment status, a 4-hour countdown for full report unlock, and links to external Deltapex resources.
- **Trading Ability Assessment**: A 12-question quiz with 6-dimension evaluation, results persisted to the database.
- **Assessment Results**: Animated rank reveal, card flip, radar chart, personalized descriptions, and a frosted glass overlay locking detailed content.
- **Character Display**: Embeds a full-body AlbionSVG character with radar, rank, and quote on the homepage and result pages.
- **Full Report Page**: A public `/report/:token` link showing detailed scores, strengths, weaknesses, suggestions, and personalized advancement plans, with animated character cards.
- **Time-gated Access**: Users can view the full report directly from the homepage after 4 hours post-assessment.
- **Re-assessment**: Users can retake the quiz.
- **Growth Journey**: Displays a timeline of historical assessment records, including character changes, score trends, and rank/type shifts.
- **Shareable Image**: Uses `html2canvas` to generate shareable result cards.
- **WeChat Integration**: "Claim Report" button triggers a webhook to push detailed user profiles and sales strategies to a WeChat group.
- **Responsive Design**: All pages are responsive, with specific layouts for mobile and desktop for modals, feature links, and report dimension cards.
- **Behavior Tracking**: Frontend event tracking and backend storage (`user_events` table) for all critical user actions for future AI analysis.

**Trader Visual System:**
Each of the 16 trader types has a unique visual identity including specific color palettes, Albion-style SVG character illustrations, abstract animated icons, and rank badges. Components like `CharacterCard.tsx` and `RankBadge.tsx` render these visuals.

**User Flow:**
- **New User**: Landing page -> Quiz (no login required) -> Loading -> Result page (animations) -> Login modal -> Home.
- **Returning User**: Landing page -> Login -> Home -> View history / Retake quiz / Access full report.
- **Customer Service Report Flow**: User clicks "Claim Report" -> Webhook sends report link to WeChat group -> Customer service shares link -> User views public `/report/:token`.

**Six Assessment Dimensions:** RISK, MENTAL, SYSTEM, ADAPT, EXEC, EDGE.

**16 Trader Types:** Defined by unique combinations of these dimensions, with rarity, descriptions, and corresponding sales strategies.

**Project Structure:** A clear separation of concerns with `client/` for frontend components, pages, hooks, data, and utilities; `server/` for API routes, database interaction, and webhooks; and `shared/` for common data schemas.

## External Dependencies
- **Frontend Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Animations**: Framer Motion
- **Charting**: Recharts
- **Backend Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Notifications**: Enterprise WeChat Webhook
- **Live Room**: B站直播间 `https://live.bilibili.com/1874453448` + 腾讯会议 `https://meeting.tencent.com/p/3621520297`（浮动按钮展开面板双入口）
- **Font Hosting**: Noto Sans SC, Noto Serif SC, Oswald, Barlow Condensed, Space Mono (implied by usage, likely Google Fonts or self-hosted)
- **Image Generation**: `html2canvas` (for sharing result cards)