# Frontend - Premium UI for Mutual Fund FAQ Assistant

A modern, premium-looking web interface for the Nippon India Mutual Fund FAQ Assistant, styled to match Groww's aesthetic.

## Features

- 🎨 **Premium Design**: Modern, clean UI with gradient backgrounds and smooth animations
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Real-time Chat**: Interactive chat interface with loading indicators
- 🔗 **Source Links**: Each answer includes clickable source URLs
- 🎯 **Quick Questions**: Pre-defined quick question buttons for common queries
- ✨ **Smooth Animations**: Fade-in effects and smooth transitions

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Express.js (Node.js)
- **Integration**: RESTful API connecting frontend to RAG backend

## File Structure

```
public/
├── index.html      # Main HTML structure
├── styles.css      # Premium styling and animations
└── app.js          # Frontend JavaScript and API integration

server.js           # Express server with API endpoints
```

## Running the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Ensure Embeddings are Built

```bash
npm run build-embeddings
```

### 3. Start the Server

```bash
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API Endpoint**: http://localhost:3000/api/ask
- **Health Check**: http://localhost:3000/api/health

## API Endpoints

### POST `/api/ask`

Send a question to the FAQ assistant.

**Request:**
```json
{
  "question": "What is the expense ratio of Nippon India Large Cap Fund?"
}
```

**Response:**
```json
{
  "answer": "The expense ratio for Nippon India Large Cap Fund Direct Growth is 0.67% for Direct plan and 1.49% for Regular plan.",
  "source_url": "https://mf.nipponindiaim.com/..."
}
```

### GET `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "FAQ Assistant API is running"
}
```

## UI Features

### Chat Interface
- User messages appear on the right with green gradient
- Assistant messages appear on the left with purple gradient
- Loading indicators while processing
- Source links for each answer

### Quick Questions
- Pre-defined buttons for common queries
- One-click access to frequently asked questions

### Responsive Design
- Adapts to different screen sizes
- Mobile-friendly layout
- Touch-optimized buttons

## Customization

### Colors
Edit CSS variables in `public/styles.css`:
```css
:root {
    --primary-color: #00D09C;
    --secondary-color: #7C3AED;
    /* ... */
}
```

### Port
Change the port in `server.js` or set `PORT` environment variable:
```bash
PORT=8080 npm start
```

## Development

### CLI Mode (Original)
To run the CLI version instead:
```bash
npm run start:cli
```

### Testing
```bash
npm test
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The frontend communicates with the backend via REST API
- All answers include source URLs for verification
- Advice-seeking questions are automatically refused
- The UI matches Groww's modern financial app aesthetic

