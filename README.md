# EchoBot AI 🤖🎤

![EchoBot AI](https://img.shields.io/badge/Status-Active-success) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Express](https://img.shields.io/badge/Express-4.18-green) ![Gemini](https://img.shields.io/badge/AI-Gemini_Pro-orange)

An intelligent, full-stack Voice and Text Communication Assistant powered by Google's Gemini AI. EchoBot AI seamlessly blends modern web technologies with advanced artificial intelligence to provide a futuristic, conversational, and highly accessible user experience.

## ✨ Features

- **🗣️ Advanced Speech-to-Text (STT):** Utilizes the Web Speech API for real-time continuous voice recognition and transcription.
- **🔊 Natural Text-to-Speech (TTS):** Beautifully synthesized voice responses using native browser speech synthesis, configurable by voice and speed.
- **🧠 Gemini AI Core:** Powered by the Gemini 3.5 Flash model for rapid, intelligent, and context-aware conversational replies.
- **✍️ Auto-Grammar Correction:** Automatically detects and gracefully corrects grammatical errors in user inputs before responding, making it an excellent tool for language learning and clear communication.
- **🎨 Futuristic UI/UX:** A stunning, responsive, and accessible interface built with Tailwind CSS and Lucide React icons, featuring a dark "Cosmic Slate" theme.
- **🔒 Secure Full-Stack Architecture:** Client-side React (Vite) SPA backed by a robust Express.js server, ensuring API keys and sensitive logic remain securely on the server.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React
- **Backend:** Node.js, Express, TypeScript
- **AI Integration:** `@google/genai` (Gemini API)
- **Web APIs:** Web Speech API (SpeechRecognition & SpeechSynthesis)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/echobot-ai.git
   cd echobot-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production deployment:

```bash
npm run build
npm run start
```

## 💡 How It Works

1. **Input:** Users can either type their message or use the microphone button to speak naturally.
2. **Processing:** The React frontend sends the transcribed text to the Express backend.
3. **AI Generation:** The backend securely communicates with the Gemini API. If the input contains grammatical errors, the AI corrects them first. It then formulates a concise, friendly response.
4. **Output:** The response is sent back to the client, displayed in the beautiful chat interface, and automatically read aloud using the configured text-to-speech engine.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/echobot-ai/issues).

## 📝 License

This project is licensed under the MIT License.
<img width="1770" height="917" alt="Screenshot 2026-07-21 010120" src="https://github.com/user-attachments/assets/56b738b9-432a-4361-be84-d4ebc60c4635" />


https://github.com/user-attachments/assets/5f3f35be-ca96-4f6f-a557-81a3bfac1fe9


<img width="1092" height="897" alt="Screenshot 2026-07-21 004250" src="https://github.com/user-attachments/assets/09f0c4c3-a467-474c-a0a4-2ab5f7913049" />
<img width="1891" height="886" alt="Screenshot 2026-07-21 011433" src="https://github.com/user-attachments/assets/3b272361-7388-4161-90a3-4f15cd0755a8" />
<img width="1913" height="1028" alt="Screenshot 2026-07-21 010621" src="https://github.com/user-attachments/assets/8d99fbeb-8ac4-4f32-aab6-f9fad61eef39" />
<img width="1626" height="906" alt="Screenshot 2026-07-21 010346" src="https://github.com/user-attachments/assets/c5931ab6-c0af-4f2b-9dc7-5cf3442dd30e" />
<img width="1918" height="1006" alt="Screenshot 2026-07-21 010328" src="https://github.com/user-attachments/assets/6a28c689-d9eb-42fc-ba10-c7de0d9f4c6d" />



