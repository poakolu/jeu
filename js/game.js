const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 40;
const rows = 20;
const cols = 20;

let currentPlayer = 1; // 1 ou 2
let selectedGroup = null;

const terrains = {
  plain: { color: '#7cfc00', walkable: true },
  forest: { color: '#228B22', walkable: false },
  lake: { color: '#1e90ff', walkable: false },
  desert: { color: '#edc9af', walkable: true },
  dungeon: { color: '#444444', walkable: false },
};

const terrainMap = [];
for(let y=0; y<rows; y++) {
  terrainMap[y] = [];
  for(let x=0; x<cols; x++) {
    // Aléatoire simple pour terrain
    let rnd = Math.random();
    if(rnd < 0.05) terrainMap[y][x] = 'lake';
    else if(rnd < 0.15) terrainMap[y][x] = 'forest';
    else if(rnd < 0.18) terrainMap[y][x] = 'dungeon';
    else if(rnd < 0.3) terrainMap[y][x] = 'desert';
    else terrainMap[y][x] = 'plain';
  }
}

// Groupes d’unités
const groups = [
  { id: 1, player: 1, x: 1, y: 1, size: 15, hp: 15*10, attack: 5, defense: 3, moved: false, class: 'Sorciers', fed: true },
  { id: 2, player: 2, x: 18, y: 18, size: 15, hp: 15*10, attack: 6, defense: 2, moved: false, class: 'Guerriers', fed: true },
];

// Ressources
let resources = {
  1: { food: 100, gold: 50 },
  2: { food: 100, gold: 50 },
};

// Events aléatoires (simplifiés)
function randomEvent(player) {
  const chance = Math.random();
  const info = document.getElementById('info');
  if(chance < 0.1) {
    // Maladie qui fait perdre 3 PV par groupe
    groups.filter(g => g.player === player).forEach(g => {
      g.hp -= 3;
      if(g.hp < 0) g.hp = 0;
    });
    info.innerText = `Joueur ${player} subit une maladie! 3 PV perdus sur tous ses groupes.`;
  } else if(chance < 0.2) {
    // Pénurie de nourriture
    resources[player].food -= 20;
    if(resources[player].food < 0) resources[player].food = 0;
    info.innerText = `Joueur ${player} manque de nourriture! -20 nourriture.`;
  } else {
    info.innerText = `Tour du joueur ${player}.`;
  }
}

// Dessiner le plateau
function drawBoard() {
  for(let y=0; y<rows; y++) {
    for(let x=0; x<cols; x++) {
      const terrain = terrains[terrainMap[y][x]];
      ctx.fillStyle = terrain.color;
      ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
      ctx.strokeStyle = '#333';
      ctx.strokeRect(x*tileSize, y*tileSize, tileSize, tileSize);
    }
  }
}

// Dessiner groupes
function drawGroups() {
  groups.forEach(g => {
    const px = g.x * tileSize + tileSize/2;
    const py = g.y * tileSize + tileSize/2;
    ctx.fillStyle = g.player === 1 ? 'blue' : 'red';
    ctx.beginPath();
    ctx.arc(px, py, tileSize/3, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(g.size, px, py + 5);
    if(selectedGroup && selectedGroup.id === g.id) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });
}

function canMoveTo(x, y) {
  if(x < 0 || y < 0 || x >= cols || y >= rows) return false;
  if(!terrains[terrainMap[y][x]].walkable) return false;
  if(groups.find(g => g.x === x && g.y === y)) return false;
  return true;
}

// Gestion clic pour sélectionner/déplacer/attaquer
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const cx = Math.floor((e.clientX - rect.left) / tileSize);
  const cy = Math.floor((e.clientY - rect.top) / tileSize);
  
  const clickedGroup = groups.find(g => g.x === cx && g.y === cy);
  
  if(selectedGroup) {
    // Déplacement simple d'une case adjacente
    const dx = Math.abs(cx - selectedGroup.x);
    const dy = Math.abs(cy - selectedGroup.y);
    if((dx + dy) === 1 && !selectedGroup.moved) {
      // Si case occupée par ennemi => combat
      if(clickedGroup && clickedGroup.player !== currentPlayer) {
        combat(selectedGroup, clickedGroup);
        selectedGroup.moved = true;
        selectedGroup = null;
        draw();
        return;
      }
      // Sinon déplacement normal
      if(canMoveTo(cx, cy)) {
        selectedGroup.x = cx;
        selectedGroup.y = cy;
        selectedGroup.moved = true;
        selectedGroup = null;
        draw();
        return;
      }
    }
    selectedGroup = null; // Annuler sélection si déplacement impossible
    draw();
    return;
  }
  
  if(clickedGroup && clickedGroup.player === currentPlayer && !clickedGroup.moved) {
    selectedGroup = clickedGroup;
    draw();
    return;
  }
  
  selectedGroup = null;
  draw();
});

// Combat simplifié
function combat(attacker, defender) {
  let damage = attacker.attack * attacker.size - defender.defense * defender.size;
  damage = Math.max(damage, 0);
  
  defender.hp -= damage;
  if(defender.hp <= 0) {
    const idx = groups.findIndex(g => g.id === defender.id);
    if(idx !== -1) groups.splice(idx,1);
  } else {
    defender.size = Math.ceil(defender.hp / 10);
  }
  const info = document.getElementById('info');
  info.innerText = `Combat! Joueur ${attacker.player} inflige ${damage} dégâts au groupe adverse.`;
}

// Fin de tour
function endTurn() {
  groups.forEach(g => {
    if(g.player === currentPlayer) g.moved = false;
  });
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  randomEvent(currentPlayer);
  updateResourcesDisplay();
  draw();
}

document.addEventListener('keydown', e => {
  if(e.key === 'Enter') endTurn();
});

// --- NOUVEAU : Affichage ressources joueurs ---
function updateResourcesDisplay() {
  const info = document.getElementById('info');
  let text = `Ressources Joueur 1: Nourriture = ${resources[1].food}, Or = ${resources[1].gold}\n`;
  text += `Ressources Joueur 2: Nourriture = ${resources[2].food}, Or = ${resources[2].gold}\n`;
  info.innerText = text;
}

// --- NOUVEAU : Affichage infos groupe au survol ---
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = Math.floor((e.clientX - rect.left) / tileSize);
  const my = Math.floor((e.clientY - rect.top) / tileSize);
  
  const hoveredGroup = groups.find(g => g.x === mx && g.y === my);
  const info = document.getElementById('info');
  if(hoveredGroup && hoveredGroup.player === currentPlayer) {
    info.innerText = `Groupe ${hoveredGroup.class} - Taille: ${hoveredGroup.size}, PV: ${hoveredGroup.hp}, Nourri: ${hoveredGroup.fed ? 'Oui' : 'Non'}`;
  } else {
    updateResourcesDisplay();
  }
});

function draw() {
  drawBoard();
  drawGroups();
  updateResourcesDisplay();
}

randomEvent(currentPlayer);
draw();

