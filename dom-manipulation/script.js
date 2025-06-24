let quotes = [];

// Load from localStorage
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

// Save to localStorage
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

// Display random quote from current filter
function showRandomQuote() {
  const selected = document.getElementById('categoryFilter').value;
  const filtered = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length === 0) return;
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" — [${quote.category}]`;
}

// Add new quote
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

// Populate category dropdown
function populateCategories() {
  const select = document.getElementById('categoryFilter');

  // Clear all except the "All Categories" option
  while (select.options.length > 1) {
    select.remove(1);
  }

  // ✅ Use map() to extract categories
  const categories = quotes.map(q => q.category);
  const uniqueCategories = [...new Set(categories)];

  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  // Reapply saved filter
  const saved = getSavedCategory();
  select.value = saved;
  filterQuotes();
}

// Filter and display a quote
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  saveSelectedCategory(category);
  showRandomQuote();
}

// Export quotes to JSON
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

// Import quotes from JSON file
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

// Event binding
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// App start
loadQuotes();
populateCategories();