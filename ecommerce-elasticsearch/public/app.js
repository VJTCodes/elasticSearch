const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');

searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) return alert('Enter a search term');

  resultsDiv.innerHTML = 'Searching...';

  try {
    const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.length === 0) {
      resultsDiv.innerHTML = '<p>No products found.</p>';
      return;
    }

    resultsDiv.innerHTML = data.map(product => `
      <div class="product">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Category:</strong> ${product.category}</p>
      </div>
    `).join('');

  } catch (err) {
    resultsDiv.innerHTML = '<p>Error fetching products.</p>';
    console.error(err);
  }
});
