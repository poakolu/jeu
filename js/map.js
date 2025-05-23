const TILE_COLORS = {
  plaine: '#98fb98',      // vert clair
  foret: '#2e8b57',       // vert foncé
  lac: '#1e90ff',         // bleu vif
  montagne: '#a9a9a9',    // gris
  donjon: '#4b4b4b',      // gris très foncé
  chateau: '#8b4513'      // marron
};

const tileNames = {
  plaine: 'Plaine',
  foret: 'Forêt',
  lac: 'Lac',
  montagne: 'Montagne',
  donjon: 'Donjon',
  chateau: 'Château'
};

const map = generateMap();  // ta fonction qui génère la map 12x12

const mapDiv = document.getElementById('game-map');
mapDiv.style.display = 'grid';
mapDiv.style.gridTemplateColumns = `repeat(${map[0].length}, 40px)`;
mapDiv.style.gridGap = '1px';

let selectedUnit = null;
let units = [
  { x: 0, y: 0, type: 'soldats', nombre: 15, pv: 100, team: 'bleu' },
  { x: 11, y: 11, type: 'chevaliers', nombre: 15, pv: 100, team: 'rouge' }
];

function drawMap() {
  mapDiv.innerHTML = '';
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const tile = map[y][x];
      const tileDiv = document.createElement('div');
      tileDiv.className = 'tile';
      tileDiv.style.backgroundColor = TILE_COLORS[tile];
      tileDiv.title = `${tileNames[tile]} (${x},${y})`;
      tileDiv.style.width = '40px';
      tileDiv.style.height = '40px';
      tileDiv.style.display = 'flex';
      tileDiv.style.justifyContent = 'center';
      tileDiv.style.alignItems = 'center';
      tileDiv.style.cursor = 'pointer';
      tileDiv.dataset.x = x;
      tileDiv.dataset.y = y;

      // Afficher unité si présente
      const unitHere = units.find(u => u.x === x && u.y === y);
      if (unitHere) {
        tileDiv.textContent = unitHere.nombre;
        tileDiv.style.color = unitHere.team === 'bleu' ? 'blue' : 'red';
        tileDiv.style.fontWeight = 'bold';
      }

      // Gestion clic sur case
      tileDiv.addEventListener('click', () => {
        onTileClick(x, y);
      });

      mapDiv.appendChild(tileDiv);
    }
  }
}

function onTileClick(x, y) {
  const unit = units.find(u => u.x === x && u.y === y);
  if (unit) {
    // Sélectionner l'unité
    selectedUnit = unit;
    afficherInfosUnit(unit);
  } else if (selectedUnit) {
    // Tenter déplacement si case accessible et adjacente
    if (isAdjacent(selectedUnit.x, selectedUnit.y, x, y) && canMoveTo(x, y)) {
      selectedUnit.x = x;
      selectedUnit.y = y;
      selectedUnit = null;
      clearInfos();
      drawMap();
    } else {
      alert('Déplacement impossible ! Case non accessible ou trop loin.');
    }
  }
}

function isAdjacent(x1, y1, x2, y2) {
  return (Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2);
}

function canMoveTo(x, y) {
  const tile = map[y][x];
  if (tile === 'lac' || tile === 'montagne') return false; // cases interdites
  // pas d'unité déjà présente
  if (units.some(u => u.x === x && u.y === y)) return false;
  return true;
}

function afficherInfosUnit(unit) {
  const infoDiv = document.getElementById('unit-info');
  if (!infoDiv) return;
  infoDiv.innerHTML = `
    <h3>Unité sélectionnée</h3>
    <p>Type: ${unit.type}</p>
    <p>Nombre: ${unit.nombre}</p>
    <p>PV: ${unit.pv}</p>
    <p>Position: (${unit.x},${unit.y})</p>
    <p>Équipe: ${unit.team}</p>
  `;
}

function clearInfos() {
  const infoDiv = document.getElementById('unit-info');
  if (infoDiv) infoDiv.innerHTML = '';
}

// Initialisation
drawMap();

