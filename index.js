// DOM Elements
const form = document.getElementById("word-form");
const input = document.getElementById("word-input");
const resultsDiv = document.getElementById("results");
const errorMessage = document.getElementById("error-message");

// Event Listener: Form Submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const word = input.value.trim();
  resultsDiv.innerHTML = "";
  clearError();

  if (!word) {
    displayError("Please enter a word.");
    return;
  }

  try {
    const data = await fetchWord(word);
    displayWordData(data);
  } catch (error) {
    displayError(error.message);
  }

  input.value = "";
});

// ==============================
// Fetch Data from Free Dictionary API
// ==============================
async function fetchWord(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

  if (!response.ok) {
    throw new Error("Word not found. Please try another.");
  }

  const data = await response.json();
  return data[0]; // Take the first entry
}

// ==============================
// Display Word Data
// ==============================
function displayWordData(data) {
  const { word, phonetics, meanings } = data;

  // Word Title
  const wordTitle = document.createElement("h3");
  wordTitle.textContent = word;
  resultsDiv.appendChild(wordTitle);

  // Pronunciation
  if (phonetics && phonetics.length > 0) {
    const phoneticText = phonetics.find(p => p.text)?.text || "";
    const audioSrc = phonetics.find(p => p.audio)?.audio || "";

    if (phoneticText) {
      const phoneticPara = document.createElement("p");
      phoneticPara.textContent = `Pronunciation: ${phoneticText}`;
      resultsDiv.appendChild(phoneticPara);
    }

    if (audioSrc) {
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = audioSrc;
      resultsDiv.appendChild(audio);
    }
  }

  // Definitions
  meanings.forEach(meaning => {
    const pos = document.createElement("h4");
    pos.textContent = `Part of Speech: ${meaning.partOfSpeech}`;
    resultsDiv.appendChild(pos);

    meaning.definitions.forEach(def => {
      const defDiv = document.createElement("div");
      defDiv.classList.add("definition");
      defDiv.innerHTML = `<strong>Definition:</strong> ${def.definition}`;
      if (def.example) {
        defDiv.innerHTML += `<br><em>Example:</em> ${def.example}`;
      }
      if (def.synonyms && def.synonyms.length > 0) {
        defDiv.innerHTML += `<br><strong>Synonyms:</strong> ${def.synonyms.join(", ")}`;
      }
      resultsDiv.appendChild(defDiv);
    });
  });
}

// ==============================
// Error Handling
// ==============================
function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}
