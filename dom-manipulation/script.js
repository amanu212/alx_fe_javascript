// Array of quote objects with 'text' and 'category' properties
let quotes = [
  { text: "Believe in yourself and all that you are.", category: "Motivation" },
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

// ✅ Function must be named exactly 'showRandomQuote'
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const display = document.getElementById('quoteDisplay');
  // ✅ Must use innerHTML
  display.innerHTML = `"${quote.text}" — [${quote.category}]`;
}

// ✅ Function to add a new quote
function addQuote() {
  const newText = document.getElementById('newQuoteText').value.trim();
  const newCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    showRandomQuote(); // Show new quote after adding
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please fill in both the quote and category.");
  }
}

// ✅ Event listener for the button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);