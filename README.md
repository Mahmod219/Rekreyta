🚀 Rekreyta - AI-Driven Job Matching Platform
Rekreyta is a cutting-edge HR platform that bridges the gap between talent and opportunities using Artificial Intelligence. Built with Next.js 15, it's not just a job board; it's a smart matching engine.

✨ Key Features
🤖 Smart AI Matching (The Core)
Semantic Job Matching: Uses OpenAI Embeddings and Vector Similarity Search (via pgvector) to match users with jobs based on skills and context, not just keywords.

AI Match Score: Every job displays a percentage match score unique to the user's profile.

Smart AI Assistant: A dedicated AI-driven floating assistant to guide users to their best career matches.

💼 Professional Job Board
Dynamic Filtering: Advanced URL-based filtering for Category, Location, and Job Type.

Real-time Listings: Instant updates using Supabase's powerful backend.

Modern UI/UX: A clean, Swedish-inspired design system built with Tailwind CSS.

🔐 Role-Based Access Control (RBAC)
User Dashboard: Profile management and AI-personalized job recommendations.

Admin Command Center: Full CRUD operations for job management with a secure dashboard.

Seamless Auth: Social login (Google) and email/password via Supabase Auth & NextAuth.

🛠️ Tech Stack & Architecture
Framework: Next.js 15 (App Router, Server Actions)

Language: TypeScript

Styling: Tailwind CSS

Backend & Real-time: Supabase

Database: PostgreSQL with pgvector for AI search.

AI Processing: Vector Embeddings for semantic analysis.

Icons & UI: Heroicons & Lucide React.

Notifications: Sonner (Toast notifications).

🏗️ Technical Deep Dive: How the AI Works
Unlike traditional platforms, Rekreyta treats resumes and job descriptions as high-dimensional vectors:

Embedding: Text data is converted into vectors using a machine learning model.

Vector Storage: These vectors are stored in PostgreSQL using the pgvector extension.

Similarity Calculation: When a user views jobs, the system runs a Cosine Similarity query (<=>) to find the shortest mathematical distance between the user's skills and the job requirements.

🚀 Getting Started
Prerequisites
Node.js 18+

Supabase Account (with pgvector enabled)

Installation
Clone the repository:

Bash
git clone https://github.com/your-username/rekreyta.git
cd rekreyta
Install dependencies:

Bash
npm install
Set up Environment Variables:
Create a .env.local file and add:


NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
NEXTAUTH_SECRET=your_secret
Run the development server:

Bash
npm run dev
📄 License
Distributed under the MIT License. See LICENSE for more information.
