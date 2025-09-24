const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const movieInfo = document.getElementById('movieInfo');
const playerContainer = document.getElementById('playerContainer');





async function handleSearch(query) {
  if (!query) return;
  playerContainer.style.display = 'none';
  movieInfo.innerHTML = '<span>Loading...</span>';
  let data = null;
  try {
    // Call the Vercel serverless function instead of OMDb directly
    const res = await fetch(`/api/fetch-movie?title=${encodeURIComponent(query)}`);
    data = await res.json();
    if (data.Response === 'False') {
      movieInfo.innerHTML = `<span style='color:#ff6b6b;'>Movie not found on IMDb.<br>Try searching the exact name from <a href='https://www.imdb.com/' target='_blank'>IMDb</a>.</span>`;
      return;
    }
    renderMovieInfoWithWatch(data, query);
  } catch (err) {
    movieInfo.innerHTML = `<span style='color:#ff6b6b;'>Error fetching data. Try again later.</span>`;
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  handleSearch(query);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const query = searchInput.value.trim();
    handleSearch(query);
  }
});


function renderMovieInfoWithWatch(data, query) {
  movieInfo.innerHTML = `
    <div class="details movie-anim">
      <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/90x130?text=No+Image'}" alt="Poster">
      <div class="meta">
        <h2>${data.Title} (${data.Year})</h2>
        <p><b>Genre:</b> ${data.Genre}</p>
        <p><b>IMDB:</b> <a href="https://www.imdb.com/title/${data.imdbID}/" target="_blank" style="color:#26d0ce;">${data.imdbRating} ⭐</a></p>
        <p><b>Plot:</b> ${data.Plot}</p>
      </div>
    </div>
    <button id="watchBtn" class="watch-btn crazy-anim">▶️ Watch</button>
  `;
  const watchBtn = document.getElementById('watchBtn');
  watchBtn.addEventListener('click', () => {
    renderPlayerFallback(query);
    playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}



function renderPlayerForBoth(data, query) {
  // Always show the player4u.xyz embed using the search term, regardless of IMDb result
  const embedUrl = `https://player4u.xyz/embed?key=${encodeURIComponent(query)}`;
  playerContainer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
}

function renderPlayerFallback(query) {
  // Always try to show the player4u.xyz embed with the search term
  const embedUrl = `https://player4u.xyz/embed?key=${encodeURIComponent(query)}`;
  playerContainer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
  playerContainer.style.display = '';
}

// Hide player by default and show prompt
window.addEventListener('DOMContentLoaded', () => {
  playerContainer.style.display = 'none';
  movieInfo.innerHTML = '<div class="search-prompt"><span class="crazy-anim">🎬 Search a movie to begin!</span></div>';
});
