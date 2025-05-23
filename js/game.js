// Variables globales de jeu
let currentPlayer = 'rouge'; // joueur courant
let selectedUnit = null;     // unité sélectionnée
let mapDiv = document.getElementById('game-map');

function isMovableTile(tileType) {
  // On ne peut pas marcher sur lacs ni montagnes
  return tileType !== 'lac' && tileType !== 'montagne' && tileType !== 'donjon';
}

// Trouver les unités d'un joueur
function getUnitsByPlayer(player) {
  return units.filter(u => u.player === player && u.PV > 0);
}

// Fonction pour afficher la sélection et cases accessibles
function highlightMovableTiles(unit) {
  clearHighlights();
  const {x, y} = unit.position;

  // On peut bouger sur les cases adjacentes (N,S,E,O) si autorisées
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

  // Mettre la case de l’unité en sélectionnée
  const index = y * map[0].length + x;
  mapDiv.children[index].classList.add('selected');
}

function clearHighlights() {
  for (const tileDiv of mapDiv.children) {
    tileDiv.classList.remove('movable');
    tileDiv.classList.remove('selected');
  }
}

function selectUnit(unit) {
  if (unit.player !== currentPlayer || unit.PV <= 0) return;
  selectedUnit = unit;
  highlightMovableTiles(unit);
  showUnitInfo(unit);
}

function moveUnit(unit, newX, newY) {
  // Déplacer unité à newX, newY
  unit.position.x = newX;
  unit.position.y = newY;
  unit.hasMoved = true; // indique qu’elle a bougé ce tour

  renderMap(); // rafraîchir affichage
  clearHighlights();
  selectedUnit = null;
  showUnitInfo(null);
}

function endTurn() {
  // Changer joueur et réinitialiser déplacements
  currentPlayer = currentPlayer === 'rouge' ? 'bleu' : 'rouge';
  units.forEach(u => {
    if (u.player === currentPlayer) u.hasMoved = false;
  });
  clearHighlights();
  selectedUnit = null;
  updateStatus();
  renderMap();
}

function updateStatus() {
  document.getElementById('status').textContent = `Joueur actuel : ${currentPlayer.toUpperCase()}`;
}

function showUnitInfo(unit) {
  const infoDiv = document.getElementById('unit-info');
  if (!unit) {
    infoDiv.textContent = 'Aucune unité sélectionnée.';
  } else {
    infoDiv.textContent = 
      `${unit.player.toUpperCase()} - ${unit.type} \n` +
      `Nombre: ${unit.count} \n` +
      `PV par unité: ${unit.PV} \n` +
      `Attaque: ${unit.attaque} \n` +
      `Défense: ${unit.defense}`;
  }
}

// Event listener pour clic sur la carte
mapDiv.addEventListener('click', (e) => {
  const index = Array.from(mapDiv.children).indexOf(e.target);
  if (index === -1) return;

  const x = index % map[0].length;
  const y = Math.floor(index / map[0].length);

  // Si une unité est sélectionnée et la case cliquée est dans movable, on déplace
  if (selectedUnit) {
    const tileDiv = mapDiv.children[index];
    if (tileDiv.classList.contains('movable')) {
      moveUnit(selectedUnit, x, y);
      return;
    }
  }

  // Sinon, essayer de sélectionner une unité présente ici
  const unitHere = units.find(u => u.position.x === x && u.position.y === y && u.PV > 0);
  if (unitHere && unitHere.player === currentPlayer && !unitHere.hasMoved) {
    selectUnit(unitHere);
  } else {
    clearHighlights();
    selectedUnit = null;
    showUnitInfo(null);
  }
});

// Bouton fin de tour
document.getElementById('end-turn').addEventListener('click', () => {
  endTurn();
});

// Initialisation
updateStatus();
renderMap();
// game.js

// Exemple : objet qui contiendra les unités
const units = [
  {
    type: 'soldats',
    count: 15,
    pv: 100,
    attaque: 20,
    defense: 10,
    position: { x: 0, y: 0 },
    team: 'rouge'
  },
  {
    type: 'mages',
    count: 15,
    pv: 80,
    attaque: 30,
    defense: 5,
    position: { x: 11, y: 11 },
    team: 'bleu'
  }
];

// Fonction initiale pour déplacer une unité (à améliorer)
function moveUnit(unit, newX, newY, map) {
  // Vérifie si nouvelle case est valide (pas lac ou montagne)
  const tile = map[newY][newX];
  if (tile === 'lac' || tile === 'montagne') {
    console.log("Déplacement impossible sur lac ou montagne !");
    return false;
  }
  // Mise à jour position
  unit.position.x = newX;
  unit.position.y = newY;
  console.log(`${unit.type} déplacé en (${newX},${newY})`);
  return true;
}

