const form = document.getElementById('search-form');
const input = document.getElementById('word-input');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();
  const word = input.value.trim();
  resultsDiv.innerHTML = ''; // Clear previous results

  if (!word) {
    resultsDiv.textContent = 'Please enter a word.';
    return;
  }

  try {
    const data = await fetchWordData(word);
    displayWordData(data);
  } catch (error) {
    resultsDiv.textContent = 'Word not found or API error.';
    console.error(error);
  }
}

async function fetchWordData(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  if (!response.ok) {
    throw new Error('API request failed');
  }
  return response.json();
}

function displayWordData(data) {
  const wordObj = data[0];

  // Word title
  const wordTitle = document.createElement('div');
  wordTitle.className = 'word-title';
  wordTitle.textContent = wordObj.word;
  resultsDiv.appendChild(wordTitle);

  // Phonetics and audio
  if (wordObj.phonetics && wordObj.phonetics.length > 0) {
    const phoneticsDiv = document.createElement('div');
    phoneticsDiv.className = 'phonetics';
    phoneticsDiv.textContent = wordObj.phonetics[0].text || '';
    if (wordObj.phonetics[0].audio) {
      const audioBtn = document.createElement('button');
      audioBtn.textContent = '🔊';
      audioBtn.className = 'audio-button';
      audioBtn.addEventListener('click', () => {
        new Audio(wordObj.phonetics[0].audio).play();
      });
      phoneticsDiv.appendChild(audioBtn);
    }
    resultsDiv.appendChild(phoneticsDiv);
  }

  // Meanings
  wordObj.meanings.forEach(meaning => {
    const partSpeech = document.createElement('div');
    partSpeech.textContent = `Part of Speech: ${meaning.partOfSpeech}`;
    resultsDiv.appendChild(partSpeech);

    meaning.definitions.forEach(def => {
      const defDiv = document.createElement('div');
      defDiv.className = 'definition';
      defDiv.textContent = `Definition: ${def.definition}`;
      if (def.example) {
        const exampleDiv = document.createElement('div');
        exampleDiv.textContent = `Example: ${def.example}`;
        defDiv.appendChild(exampleDiv);
      }
      resultsDiv.appendChild(defDiv);
    });

    if (meaning.synonyms && meaning.synonyms.length > 0) {
      const synDiv = document.createElement('div');
      synDiv.className = 'synonyms';
      synDiv.textContent = `Synonyms: ${meaning.synonyms.join(', ')}`;
      resultsDiv.appendChild(synDiv);
    }
  });
}
