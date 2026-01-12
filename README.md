MobileExpert AI - Smartphone Shopping Assistant

MobileExpert AI is a specialized retail chat agent designed to help users discover, compare, and understand mobile phones. It combines a local technical database with the real-world reasoning of the Gemini-1.5-Flash model to provide a premium shopping experience.


Live Demo & Repository
Public Deployment: [Insert Link Here, e.g., Vercel/Render]
GitHub Repository: [Insert Link Here]


Key Features
Conversational Discovery: Understands complex queries like "Best gaming phone with 5G under ₹40,000."
Comparison Mode: Side-by-side technical breakdown of 2-3 models covering RAM, Storage, Battery, and more.
Wikipedia Image Integration: Automatically fetches real-world product images from Wikipedia/Wikimedia Commons for models not in the local inventory.
Tech Glossary: Specialized "Indigo Cards" that explain complex terms like OIS, EIS, and mAh.
Configuration Spec-Sheet: Dedicated technical cards for specific variants (e.g., 12GB+256GB versions).

Tech Stack & Architecture
Backend (Python/Flask)
Framework: Flask with Flask-CORS for secure cross-origin requests.
AI Model: Google Gemini 1.5 Flash (via Generative Language API).
Data: Local JSON-based inventory (phones.json) for factual grounding.
Prompt Engineering: Modular system instructions separated into safety.py.

Frontend (React/Vite)
Framework: React.js with a modular component architecture.
Styling: CSS-in-JS (Standardized object-based styles) for dynamic flagship UI transitions.
State Management: React Hooks (useState, useEffect, useRef) for conversation memory and real-time UI updates.


Safety & Adversarial Handling
The agent is built with a Safety-First strategy to satisfy industrial requirements:
System Instruction Isolation: The core logic is passed via the system_instruction API parameter, making it harder for users to "jailbreak" or override rules via user messages.
Data Grounding: The model is strictly instructed to prioritize the PHONES_DATABASE before falling back to internal knowledge.
Adversarial Defenses: Explicitly programmed to refuse requests for API keys, system prompt reveals, or brand defamation.
Topic Filtering: Queries regarding non-mobile topics (e.g., "who won the world cup") are gracefully redirected to smartphone assistance.


Installation & Setup
Prerequisites
Python 3.8+
Node.js 16+
A Google AI Studio API Key (Get it here)  - AIzaSyBlHWSlskj1eboZE24V185OwQAhIR7_ha0
1. Backend Setup
code:

    cd backend
    python -m venv venv
    # Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
    pip install -r requirements.txt

Run the server:
Bash
python app.py


2. Frontend Setup

cd frontend: 
    npm install
    npm run dev



-> Known Limitations
Image Mapping: need to add url of each image of phones manually so just used  single pic of iphone 15 for all. by changing url exact image can be rendered
Stock Levels: Availability is simulated based on the mock JSON database.
Regional Pricing: Pricing is currently optimized for the Indian Market (INR).


Author
Aditya Jain