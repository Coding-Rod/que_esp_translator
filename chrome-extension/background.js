// background.js
const API_URL = "https://sadly-top-dove.ngrok-free.app";

// Listen for the "Translate Text" message from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message);
  if (message.action === "translate-text") {
    // Handle the text translation request
    const { text, target_language } = message;
    
    fetch(`${API_URL}/translate-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target_language }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Send the translated text back to the popup
        sendResponse({ translatedText: data.translated_text });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });

    // Indicate that the response will be sent asynchronously
    return true;
  }

  // Listen for "Translate Page" request from the popup
  if (message.action === "translate-page") {
    const { target_language } = message;

    // Get the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const url = tabs[0].url;

      try {
        // Check if API_URL host is equal to the current tab's host
      if (url.startsWith(API_URL)) {
        // Check if path param is equal to targetLanguage
        const path = new URL(url).pathname;
        if (path === `/translate-web/${targetLanguage}`) {
          return;
        }

        // Translation url will be the url query parameter
        url = new URL(url).searchParams.get("url");
      }
      const translatedUrl = `${API_URL}/translate-web/${targetLanguage}?url=${url}`;

      // Redirect the current tab to the translated URL
      chrome.tabs.update(tabs[0].id, { url: translatedUrl });
      } catch (error) {
        document.getElementById("result").textContent = error.message;
      }
    });
      
    return true;
  }
});
