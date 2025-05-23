// Accès map et unités (variables globales) dans map.js
// units = [ ... ] défini dans map.js avec unités rouges et bleues

const mapDiv = document.getElementById('game-map');
const statusDiv = document.getElementById('status');
const unitInfoDiv = document.getElementById('unit-info');

let currentPlayer = 'rouge';
let selectedUnit = null;

// Vérifie si on peut marcher sur ce type de case
function isMovableTile(tileType) {
  return tileType !== 'lac' && tileType !== 'montagne' && tileType !== 'donjon';
}

function renderMap() {
  mapDiv.innerHTML = '';
  map.forEach((row, y) => {
    row.forEach((tile, x) => {
      const tileDiv = document.createElement('div');
      tileDiv.className = 'tile';
      tileDiv.style.backgroundColor = TILE_COLORS[tile];
      tileDiv.title = `${TILE_NAMES_FR[tile]} (${x},${y})`;

      // Si unité sur la case, afficher un cercle avec couleur et nombre
      const unit = units.find(u => u.position.x === x && u.position.y === y && u.PV > 0);
      if (unit) {
        const unitCircle = document.createElement('div');
        unitCircle.style.position = 'absolute';
        unitCircle.style.top = '4px';
        unitCircle.style.left = '4px';
        unitCircle.style.width = '32px';
        unitCircle.style.height = '32px';
        unitCircle.style.borderRadius = '50%';
        unitCircle.style.backgroundColor = unit.player === 'rouge' ? 'rgba(255,0,0,0.7)' : 'rgba(0,0,255,0.7)';
        unitCircle.style.color = 'white';
        unitCircle.style.fontWeight = 'bold';
        unitCircle.style.fontSize = '14px';
        unitCircle.style.lineHeight = '32px';
        unitCircle.style.textAlign = 'center';
        unitCircle.style.pointerEvents = 'none';
        unitCircle.textContent = unit.count;
        tileDiv.appendChild(unitCircle);
      }

      mapDiv.appendChild(tileDiv);
    });
  });
}

function clearHighlights() {
  for (const tileDiv of mapDiv.children) {
    tileDiv.classList.remove('movable');
    tileDiv.classList.remove('selected');
  }
}

function highlightMovableTiles(unit) {
  clearHighlights();

  const {x, y} = unit.position;

  // Cases adjacentes possibles
  const moves = [
    {x: x, y: y - 1},
    {x: x, y: y + 1},
    {x: x - 1, y: y},
    {x: x + 1, y: y},
  ];

  moves.forEach(pos => {
    if (
      pos.x >= 0 && pos.x < map[0].length &&
      pos.y >= 0 && pos.y < map.length &&
      isMovableTile(map[pos.y][pos.x]) &&
      !units.some(u => u.position.x === pos.x && u.position.y === pos.y && u.PV > 0)
    ) {
      const index = pos.y * map[0].length + pos.x;
      mapDiv.children[index].classList.add('movable');
    }
  });

  // Case de l’unité sélectionnée
  const index = y * map[0].length + x;
  mapDiv.children[index].classList.add('selected');
}

function showUnitInfo(unit) {
  if (!unit) {
    unitInfoDiv.textContent = 'Aucune unité sélectionnée.';
  } else {
    unitInfoDiv.textContent =
      `Joueur : ${unit.player.toUpperCase()}\n` +
      `Type : ${unit.type}\n` +
      `Nombre : ${unit.count}\n` +
      `PV par unité : ${unit.PV}\n` +
      `Attaque : ${unit.attaque}\n` +
      `Défense : ${unit.defense}\n` +
      `Déjà déplacé : ${unit.hasMoved ? 'Oui' : 'Non'}`;
  }
}

function selectUnit(unit) {
  if (unit.player !== currentPlayer || unit.PV <= 0 || unit.hasMoved) return;
  selectedUnit = unit;
  highlightMovableTiles(unit);
  showUnitInfo(unit);
}

function moveUnit(unit, newX, newY) {
  unit.position.x = newX;
  unit.position.y = newY;
  unit.hasMoved = true;

  renderMap();
  clearHighlights();
  selectedUnit = null;
  showUnitInfo(null);
  updateStatus();
}

function endTurn() {
  currentPlayer = currentPlayer === 'rouge' ? 'bleu' : 'rouge';
  units.forEach(u => {
    if (u.player === currentPlayer) u.hasMoved = false;
  });
  clearHighlights();
  selectedUnit = null;
  showUnitInfo(null);
  updateStatus();
  renderMap();
}

function updateStatus() {
  statusDiv.textContent = `Joueur actuel : ${currentPlayer.toUpperCase()}`;
}

mapDiv.addEventListener('click', (e) => {
  const index = Array.from(mapDiv.children).indexOf(e.target);
  if (index === -1) return;

  const x = index % map[0].length;
  const y = Math.floor(index / map[0].length);

  if (selectedUnit) {
    const tileDiv = mapDiv.children[index];
    if (tileDiv.classList.contains('movable')) {
      moveUnit(selectedUnit, x, y);
      return;
    }
  }

  const unitHere = units.find(u => u.position.x === x && u.position.y === y && u.PV > 0);
  if (unitHere && unitHere.player === currentPlayer && !unitHere.hasMoved) {
    selectUnit(unitHere);
  } else {
    clearHighlights();
    selectedUnit = null;
    showUnitInfo(null);
  }
});

document.getElementById('end-turn').addEventListener('click', () => {
  endTurn();
});

updateStatus();
renderMap();
