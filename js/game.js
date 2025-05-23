const map = generateMap();
const mapDiv = document.getElementById('game-map');
const infoPanel = document.getElementById('info-panel');

const UNIT_TYPES = ['soldats', 'mages', 'voleurs', 'chevaliers'];

let units = [
  { x: 0, y: 0, type: 'soldats', count: 15, pv: 100, owner: 'bleu' },
  { x: 11, y: 11, type: 'chevaliers', count: 15, pv: 120, owner: 'rouge' }
];

let selectedUnit = null;
let currentPlayer = 'bleu';

function isWalkable(x, y) {
  if (x < 0 || y < 0 || x >= 12 || y >= 12) return false;
  const tile = map[y][x];
  if (tile === 'lac' || tile === 'montagne' || tile === 'donjon') return false;
  return true;
}

function getUnitAt(x, y) {
  return units.find(u => u.x === x && u.y === y) || null;
}

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

      const unit = getUnitAt(x, y);
      if (unit) {
        tileDiv.textContent = unit.count;
        tileDiv.style.color = unit.owner === 'bleu' ? 'blue' : 'red';
        tileDiv.style.fontWeight = 'bold';
        tileDiv.style.textAlign = 'center';
        tileDiv.style.lineHeight = '40px';
      }

      tileDiv.addEventListener('click', () => onTileClick(x, y));
      mapDiv.appendChild(tileDiv);
    });
  });
}

function onTileClick(x, y) {
  const unit = getUnitAt(x, y);

  if (selectedUnit) {
    if (canMove(selectedUnit, x, y)) {
      moveUnit(selectedUnit, x, y);
      selectedUnit = null;
      currentPlayer = currentPlayer === 'bleu' ? 'rouge' : 'bleu';
      infoPanel.textContent = `Joueur ${currentPlayer} à son tour`;
    } else {
      infoPanel.textContent = `Déplacement impossible vers (${x},${y})`;
    }
    drawMap();
  } else {
    if (unit && unit.owner === currentPlayer) {
      selectedUnit = unit;
      infoPanel.textContent = `Unité sélectionnée : ${unit.type} (${unit.count} soldats, PV: ${unit.pv}) en (${x},${y})`;
    } else {
      infoPanel.textContent = `Cliquez sur une unité de votre camp (${currentPlayer})`;
    }
  }
}

function canMove(unit, x, y) {
  if (!isWalkable(x, y)) return false;
  const dx = Math.abs(unit.x - x);
  const dy = Math.abs(unit.y - y);
  if (dx + dy !== 1) return false;
  if (getUnitAt(x, y)) return false;
  return true;
}

function moveUnit(unit, x, y) {
  unit.x = x;
  unit.y = y;
}

infoPanel.textContent = `Joueur ${currentPlayer} à son tour`;
drawMap();

