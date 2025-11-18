## Nippon India Mutual Fund FAQ Assistant – Deployment Notes

### Setup Steps

1. **Clone and install**
   - `git clone <repo-url>`
   - `cd AI--RAG-based-Mutual-Fund-FAQ-Chatbot`
   - `npm install`

2. **Configure environment**
   - Create `.env` in the project root:
     - `GOOGLE_API_KEY=your_google_gemini_api_key`
     - (Optional) `PORT=3000` (or any port supported by your hosting platform)

3. **Generate embeddings (if not already present)**
   - Locally you can run:
     - `npm run build-embeddings`
   - On Railway / production:
     - The backend will auto-generate `embeddings.json` on first start if it’s missing and `GOOGLE_API_KEY` is set.

4. **Run locally**
   - `npm start`
   - Open `http://localhost:3000` in your browser.

5. **Deploy (example: Railway)**
   - Connect the GitHub repository.
   - Set environment variables in Railway project settings:
     - `GOOGLE_API_KEY=...`
     - (Optional) `PORT=3000`, `NODE_ENV=production`
   - Deploy; the service entrypoint is `npm start` (runs `node server.js`).

### Scope – AMC and Schemes Covered

- **AMC**: Nippon India Mutual Fund  
- **Schemes (Direct Growth plans only)**:
  - Nippon India Large Cap Fund Direct Growth  
  - Nippon India Flexi Cap Fund Direct Growth  
  - Nippon India ELSS Tax Saver Fund Direct Growth  
  - Nippon India Balanced Advantage Fund Direct Growth  
  - Nippon India Liquid Fund Direct Growth  

### Facts Covered per Scheme

- Expense ratio (Direct and Regular plan values, but questions are scoped to the above Direct schemes)
- Exit load
- Minimum SIP amount
- Minimum lump-sum investment
- Lock-in period (where applicable, e.g. ELSS)
- Riskometer
- Benchmark index

### Additional Context (Non-scheme)

- Statement download guidance for:
  - CAMS (capital gains / capital loss statements)
  - Groww (reports and statements)

### Known Limits and Design Choices

- **Facts-only assistant**
  - The assistant is explicitly designed to **refuse**:
    - Investment advice (e.g. “Should I invest in…”, “Is this fund good/bad?”)
    - Recommendations or opinions
    - Scheme comparisons (“Which is better/best/worst?”)
    - Return or performance forecasts (“How much will I get?”, “Expected returns?”)
    
- **Disclaimer snippet used in UI (facts-only, no advice).**

   <img width="1189" height="907" alt="image" src="https://github.com/user-attachments/assets/ada19387-4b3c-4f75-989d-d1c2a889905f" />

- **Scope-limited to 5 schemes**
  - Answers are derived from a structured `knowledge_base.json` that only contains the 5 listed Nippon India schemes and the statement-download links.
  - Questions outside this scope may return generic “I couldn’t find relevant information” responses.

- **Static snapshot of data**
  - All facts (expense ratios, exit loads, etc.) reflect the values encoded in `knowledge_base.json` (e.g. based on November 2025 factsheets / Groww pages).
  - The assistant does **not** fetch live NAVs, updated factsheets, or current platform data at runtime.

- **Single AMC**
  - Only Nippon India Mutual Fund is covered. Schemes from other AMCs are out of scope.

- **Language and phrasing**
  - The system expects English questions and is tuned for natural-language queries around the supported facts.

- **API dependency**
  - Embeddings and question understanding rely on Google Gemini (`@google/generative-ai`):
    - A valid `GOOGLE_API_KEY` is required.
    - If the key is missing or invalid, the assistant responds with a friendly error and does not attempt to hallucinate answers.


