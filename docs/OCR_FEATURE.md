# OCR & Chat Refinement Feature

## Overview
closedNote now includes **image-to-text OCR** with **AI-powered prompt refinement**, fully integrated with **Hugging Face Inference API** (free, no billing required) and **Tesseract.js** as an offline fallback.

---

## Features

### 1. **Online OCR via Hugging Face**
- Uses Microsoft TrOCR models (printed or handwritten text)
- Automatically retries on model warm-up (503 errors)
- Multilingual support via model selection

### 2. **Offline Fallback with Tesseract**
- If Hugging Face is unavailable, the app seamlessly switches to Tesseract.js
- Works 100% client-side (no server required)
- English OCR by default (expandable to other languages)

### 3. **Chat Refinement**
- Extracted text can be refined using lightweight Hugging Face chat models:
  - **Zephyr** (default): HuggingFaceH4/zephyr-7b-beta
  - **Mixtral**: mistralai/Mixtral-8x7B-Instruct-v0.1
  - **Mistral**: mistralai/Mistral-7B-Instruct-v0.2
- Cleans up OCR output, formats it as a reusable prompt
- Fully editable before saving

### 4. **Save as Prompt**
- Extracted (or refined) text is saved directly to your prompt library
- Tagged with `ocr` and mode (`printed` or `handwritten`)
- Collection: `ocr`

---

## Setup

### 1. Server Configuration (Admin Only)
The app owner (you) needs to configure the Hugging Face token **once** on the server:

1. Get a free Hugging Face token:
   - Sign up at [https://huggingface.co](https://huggingface.co)
   - Go to [Settings → Tokens](https://huggingface.co/settings/tokens)
   - Create a new **Read** token (no billing required)

2. Add to your server environment (`.env.local` or hosting platform):
```bash
HUGGINGFACE_API_KEY=hf_YourTokenHere
```

3. Restart the server

**That's it!** All users will now automatically use your token via the server. They don't need their own tokens.

### 2. User Experience
- Users simply upload images and click "Extract Text"
- The server handles all API calls using your token
- Users never see or need to configure any API keys
- If your token is missing, users get a friendly error message
```bash
npm install
npm run dev
```

Visit: [http://localhost:3000/ocr](http://localhost:3000/ocr)

---

## Usage

### Step 1: Upload Image
- Click "Choose File" and select a JPEG/PNG image with text
- Select **mode**: `Printed` (default) or `Handwritten`

### Step 2: Extract Text
- Click "Extract Text"
- The app tries **Hugging Face OCR** first
- If unavailable, it falls back to **Tesseract.js** (offline)
- Extracted text appears in the text area (editable)

### Step 3: Refine with Chat (Optional)
- Choose a chat model: `Zephyr`, `Mixtral`, or `Mistral`
- Click "Refine with Chat"
- The AI cleans up the OCR output and formats it as a reusable prompt
- Result appears in a second text area (also editable)

### Step 4: Save as Prompt
- Click "Save as Prompt"
- The refined (or original) text is saved to your prompt library
- Navigate to **My Prompts** to see it tagged with `ocr`

---

## Architecture

### Frontend
- **`/app/ocr/page.tsx`**: Main OCR page
  - File upload, mode selection, model selection
  - Online/offline OCR logic with fallback
  - Chat refinement UI
  - Save to prompt library

### Backend API Routes
- **`/api/ocr`**: Forwards images to Hugging Face TrOCR
  - Model: `microsoft/trocr-base-printed` (default) or `microsoft/trocr-base-handwritten`
  - Accepts `mode` and optional `model` override
  - Returns extracted text

- **`/api/chat`**: Sends text to Hugging Face chat model for refinement
  - Model: `HuggingFaceH4/zephyr-7b-beta` (default)
  - Accepts custom `instruction` and `model` override
  - Returns refined prompt

### Offline Fallback
- **Tesseract.js** (`v5.0.0`) runs in the browser
- Automatically invoked if `/api/ocr` fails
- English language default (configurable in code)

---

## Models Used

### OCR Models (Hugging Face)
| Model ID | Use Case | Accuracy |
|----------|----------|----------|
| `microsoft/trocr-base-printed` | Printed text (documents, screenshots) | High |
| `microsoft/trocr-base-handwritten` | Handwritten notes | Medium |

### Chat Models (Hugging Face)
| Model ID | Size | Speed | Quality |
|----------|------|-------|---------|
| `HuggingFaceH4/zephyr-7b-beta` | 7B | Fast | Good |
| `mistralai/Mixtral-8x7B-Instruct-v0.1` | 8x7B (MoE) | Medium | Excellent |
| `mistralai/Mistral-7B-Instruct-v0.2` | 7B | Fast | Good |

---

## Costs & Rate Limits

### Hugging Face Inference API (Free Tier)
- **Cost**: $0 (completely free)
- **Rate Limits**: ~1000 requests/day per token (soft limit)
- **Model Loading**: First request may take 10-30s if model is cold
- **No Billing Required**: Just a free account + token

### Tesseract.js (Offline)
- **Cost**: $0 (runs in browser)
- **No API calls**: Works offline
- **Performance**: Slower than online OCR, but reliable

---

## Troubleshooting

### "OCR service is currently unavailable"
- The server doesn't have `HUGGINGFACE_API_KEY` configured
- Administrator needs to add the token to `.env.local` or hosting environment
- OCR will automatically fall back to Tesseract (offline) if available

### "Model is loading. Please retry in a moment."
- Hugging Face models go to sleep after inactivity
- Wait 10-30s and click "Extract Text" again
- The app auto-retries with backoff

### OCR Returns Empty Text
- Ensure the image has clear, readable text
- Try switching between `Printed` and `Handwritten` modes
- Tesseract fallback may work better for low-quality images

### Offline Fallback Not Working
- Check browser console for Tesseract errors
- Ensure you're on a modern browser (Chrome, Firefox, Edge)
- Tesseract.js downloads language data on first use (~2MB)

---

## Extending the Feature

### Add New OCR Models
Edit `/app/api/ocr/route.ts`:
```typescript
const CUSTOM_MODEL = "your-org/your-ocr-model";
```

### Add New Chat Models
Edit `/app/api/chat/route.ts`:
```typescript
const DEFAULT_CHAT_MODEL = "your-org/your-chat-model";
```

### Support More Languages (Tesseract)
Edit `/app/ocr/page.tsx`:
```typescript
await Tesseract.recognize(imageFile!, "eng+spa+fra", { ... });
```

---

## Security Notes

- **Server-side token only**: `HUGGINGFACE_API_KEY` is stored on the server and never exposed to users
- **No client-side keys**: Users cannot see or access your Hugging Face token
- **Rate limiting**: All users share your token's rate limit (~1000 requests/day on free tier)
- **Image privacy**: Images are sent to Hugging Face API servers for processing (not stored by Hugging Face)
- **Offline mode**: Tesseract processes images locally in the browser if Hugging Face fails (no external requests)

---

## Next Steps

- [ ] Add support for PDF OCR (extract text from PDF pages)
- [ ] Batch OCR for multiple images
- [ ] Direct prompt editing in OCR page
- [ ] OCR history/cache to avoid re-processing
- [ ] Custom refinement instructions per user

---

## Resources

- [Hugging Face Inference API Docs](https://huggingface.co/docs/api-inference/index)
- [TrOCR Model Card](https://huggingface.co/microsoft/trocr-base-printed)
- [Tesseract.js GitHub](https://github.com/naptha/tesseract.js)
- [Zephyr Model Card](https://huggingface.co/HuggingFaceH4/zephyr-7b-beta)

---

**Built with ❤️ for closedNote v0.1 by Samuel Aboderin**
