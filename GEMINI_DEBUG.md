# Gemini Integration Debug Guide

## How to Debug the Issue

1. **Open the Dashboard** in your browser
2. **Open Developer Console** with `F12`
3. **Go to the Uplink tab**
4. **Enter your Gemini API key** and click "Save API Key"
5. **Look at the console** - You should see: `[System] API key saved successfully. Gemini AI is now online.`
6. **Type a message** in the chat input and press Enter
7. **Watch the console** for debug logs:
   - `Sending message: [your message]`
   - `Calling Gemini API with key: [first 10 chars]***`
   - `Request URL: ...`
   - `Response status: 200` (if successful)
   - `Gemini response: [the response]`

## Common Issues

### Issue: "No API key configured" error
- **Solution**: Make sure you saved the API key and it appears in localStorage
- **Check**: In console, type `localStorage.getItem('gemini-api-key')` 
- **Expected**: Should show your API key, not `null`

### Issue: API Error 403 (Permission Denied)
- **Problem**: API key is valid but doesn't have access to Generative Language API
- **Solution**: 
  1. Go to https://aistudio.google.com/app/apikey
  2. Make sure "Generative Language API" is enabled for your project
  3. Check that billing is set up on your Google account
  4. Generate a new API key

### Issue: API Error 400 (Bad Request)
- **Problem**: API request format is incorrect or API key is invalid
- **Solution**: 
  1. Double-check the API key is copied correctly (no spaces)
  2. Make sure you're using a Gemini API key, not a different Google API key
  3. Try generating a new key from https://aistudio.google.com/app/apikey

### Issue: Request Timeout
- **Problem**: Network is slow or API is not responding
- **Solution**: 
  1. Check your internet connection
  2. Try again after a few seconds
  3. Check if the Gemini API service is down

### Issue: "No response generated. Content may have been filtered"
- **Problem**: Your message was filtered by content policy
- **Solution**: Try a different message that doesn't violate content policy

## What to Check

1. **localStorage** contains the API key:
   ```javascript
   localStorage.getItem('gemini-api-key')
   ```

2. **Elements exist** in the DOM:
   ```javascript
   document.getElementById('uplink-chat-input') // Should not be null
   document.getElementById('uplink-chat-output') // Should not be null
   document.getElementById('clearChatButton') // Should not be null
   ```

3. **API Key Format**:
   - Should start with `AIza` (for Generative Language API)
   - Should be around 39 characters long
   - No spaces or special characters (except hyphens in older keys)

## Test Commands

### In Console, you can manually test:

```javascript
// Check if API key is saved
localStorage.getItem('gemini-api-key')

// Send a test request directly
const apiKey = localStorage.getItem('gemini-api-key');
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: 'Hello' }]
    }]
  })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))
```

## Getting Help

If you still have issues after checking the above:
1. Take a screenshot of the console errors
2. Note the exact error message displayed in the chat
3. Verify your API key is correct and has the right permissions
