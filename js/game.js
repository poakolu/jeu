const map = generateMap();
const mapDiv = document.getElementById('game-map');
const infoPanel = document.getElementById('info-panel');

// Affichage de la carte
function drawMap() {
  mapDiv.innerHTML = '';
  map.forEach((row, y) => {
    row.forEach((tile, x) => {
      const tileDiv = document.createElement('div');
      tileDiv.className = 'tile';
      tileDiv.style.backgroundColor = TILE_COLORS[tile];
      tileDiv.title = `${TILE_NAMES[tile]} (${x},${y})`;
      tileDiv.dataset.x = x;
      tileDiv.dataset.y = y;
      tileDiv.dataset.type = tile;

      tileDiv.addEventListener('click', () => {
        infoPanel.textContent = `Case (${x},${y}) : ${TILE_NAMES[tile]}`;
      });

      mapDiv.appendChild(tileDiv);
    });
  });
}

drawMap();
