document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.discover-btn');
    const searchInput = document.querySelector('.search-box input');
    const resultsContainer = document.querySelector('.search-results');

    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            resultsContainer.innerHTML = `<p>${data.result}</p>`;
        } catch (error) {
            resultsContainer.innerHTML = `<p style="color:red;">Error fetching results</p>`;
        }
    });
});
