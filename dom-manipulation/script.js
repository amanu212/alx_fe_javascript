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

// Save selected category to local storage
function saveSelectedCategory(category) {
  localStorage.setItem('selectedCategory', category);
}

// Load last selected category
function getSavedCategory() {
  return localStorage.getItem('selectedCategory') || 'all';
}

// Show a random quote based on selected category
function showRandomQuote() {
  const selected = document.getElementById('categoryFilter').value;
  const filtered = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length === 0) return;
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" — [${quote.category}]`;
}

// Add a new quote and optionally post to server
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    postQuoteToServer(newQuote); // Post to mock server
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please fill in both fields.");
  }
}

// Populate category dropdown using .map()
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

// Filter quotes by selected category
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  saveSelectedCategory(category);
  showRandomQuote();
}

// Export quotes as a .json file
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

// Import quotes from a .json file
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

// Show message in the notification area
function showNotification(message) {
  const note = document.getElementById('notification');
  note.textContent = message;
  setTimeout(() => { note.textContent = ''; }, 3000);
}

// ✅ Required async fetch function with conflict resolution (server wins)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    const syncedQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Synced"
    }));

    quotes = syncedQuotes;
    saveQuotes();
    populateCategories();
    showNotification("Quotes synced from server and conflicts resolved.");
  } catch (error) {
    console.error("Sync failed:", error);
    showNotification("Failed to sync with server.");
  }
}

// ✅ Required POST to server with proper headers and JSON body
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    console.log("Posted to server:", result);
    showNotification("Quote posted to server successfully!");
  } catch (error) {
    console.error("Error posting quote:", error);
    showNotification("Failed to post quote to server.");
  }
}

// Event listener for showing new quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// App Initialization
loadQuotes();
populateCategories();
setInterval(fetchQuotesFromServer, 30000); // Auto sync every 30s

function syncQuotes() {
  fetchQuotesFromServer(); // This already does the async fetch + conflict resolution
}