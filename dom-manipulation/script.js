let quotes = [];

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Load quotes from local storage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "Believe in yourself.", category: "Motivation" },
      { text: "Work hard in silence.", category: "Discipline" },
      { text: "Never stop learning.", category: "Education" }
    ];
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Save selected category filter
function saveSelectedCategory(category) {
  localStorage.setItem('selectedCategory', category);
}

// Load selected category filter
function getSavedCategory() {
  return localStorage.getItem('selectedCategory') || 'all';
}

// Show random quote from selected category
function showRandomQuote() {
  const selected = document.getElementById('categoryFilter').value;
  const filtered = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length === 0) return;
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" — [${quote.category}]`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    showRandomQuote();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please fill in both fields.");
  }
}

// Populate the category dropdown
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  while (select.options.length > 1) {
    select.remove(1);
  }

  const categories = quotes.map(q => q.category);
  const uniqueCategories = [...new Set(categories)];

  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  const saved = getSavedCategory();
  select.value = saved;
  filterQuotes();
}

// Filter quotes based on dropdown selection
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  saveSelectedCategory(category);
  showRandomQuote();
}

// Export quotes to a .json file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from uploaded .json file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert('Quotes imported!');
      } else {
        alert('Invalid file format.');
      }
    } catch {
      alert('Error reading file.');
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Show user notification
function showNotification(message) {
  const note = document.getElementById('notification');
  note.textContent = message;
  setTimeout(() => { note.textContent = ''; }, 3000);
}

// Sync with server and resolve conflicts (server wins)
function syncWithServer() {
  fetch(SERVER_URL)
    .then(response => response.json())
    .then(serverData => {
      const syncedQuotes = serverData.slice(0, 5).map(post => ({
        text: post.title,
        category: "Synced"
      }));
      quotes = syncedQuotes;
      saveQuotes();
      populateCategories();
      showNotification("Quotes synced from server and conflicts resolved.");
    })
    .catch(err => {
      console.error("Sync failed:", err);
      showNotification("Failed to sync with server.");
    });
}

// Event binding
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial setup
loadQuotes();
populateCategories();
setInterval(syncWithServer, 30000); // Automatic sync every 30s