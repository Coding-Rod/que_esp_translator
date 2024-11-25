const API_URL = "https://sadly-top-dove.ngrok-free.app";

document.getElementById("translate-button").addEventListener("click", async () => {
  const text = document.getElementById("text-input").value;
  const targetLanguage = document.getElementById("language-select").value;

  if (!text) {
    document.getElementById("result").textContent = "Please enter text to translate.";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/translate-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target_language: targetLanguage }),
    });

    if (!response.ok) {
      throw new Error("Translation failed.");
    }

    const data = await response.json();
    document.getElementById("result").textContent = data.translated_text;
  } catch (error) {
    document.getElementById("result").textContent = error.message;
  }
});

document.getElementById("translate-page-button").addEventListener("click", async () => {
  const targetLanguage = document.getElementById("language-select").value;

  try {
    // Get the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let url = tabs[0].url;

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
    });
  } catch (error) {
    document.getElementById("result").textContent = error
  }
});