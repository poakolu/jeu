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
  dungeon: { color: '#444444', walkable: false },
};

// Génération de la map sans désert et avec châteaux aux coins
const terrainMap = [];
for(let y=0; y<rows; y++) {
  terrainMap[y] = [];
  for(let x=0; x<cols; x++) {
    // Cases des coins = "dungeon" (château)
    if((x === 0 && y === 0) || (x === cols-1 && y === 0) || (x === 0 && y === rows-1) || (x === cols-1 && y === rows-1)) {
      terrainMap[y][x] = 'dungeon';
      continue;
    }
    let rnd = Math.random();
    if(rnd < 0.05) terrainMap[y][x] = 'lake';
    else if(rnd < 0.20) terrainMap[y][x] = 'forest';
    else terrainMap[y][x] = 'plain';
  }
}

// Groupes placés aux coins
const groups = [
  { id: 1, player: 1, x: 1, y: 1, size: 15, hp: 15*10, attack: 5, defense: 3, moved: false, class: 'Sorciers', fed: true },
  { id: 2, player: 2, x: cols - 2, y: rows - 2, size: 15, hp: 15*10, attack: 6, defense: 2, moved: false, class: 'Guerriers', fed: true },
];

let resources = {
  1: { food: 100, gold: 50 },
  2: { food: 100, gold: 50 },
};

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

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const cx = Math.floor((e.clientX - rect.left) / tileSize);
  const cy = Math.floor((e.clientY - rect.top) / tileSize);

  const hoveredGroup = groups.find(g => g.x === cx && g.y === cy);
  const info = document.getElementById('info');

  if(hoveredGroup) {
    info.innerText = `Groupe: ${hoveredGroup.class} | PV: ${hoveredGroup.hp} | Taille: ${hoveredGroup.size} | Nourri: ${hoveredGroup.fed ? 'Oui' : 'Non'}`;
  } else {
    info.innerText = `Tour du joueur ${currentPlayer}.`;
  }
});

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const cx = Math.floor((e.clientX - rect.left) / tileSize);
  const cy = Math.floor((e.clientY - rect.top) / tileSize);

  const clickedGroup = groups.find(g => g.x === cx && g.y === cy);

  if(selectedGroup) {
    const dx = Math.abs(cx - selectedGroup.x);
    const dy = Math.abs(cy - selectedGroup.y);
    if((dx + dy) === 1 && !selectedGroup.moved) {
      if(clickedGroup && clickedGroup.player !== currentPlayer) {
        combat(selectedGroup, clickedGroup);
        selectedGroup.moved = true;
        selectedGroup = null;
        updateResourcesDisplay();
        draw();
        return;
      }
      if(canMoveTo(cx, cy)) {
        selectedGroup.x = cx;
        selectedGroup.y = cy;
        selectedGroup.moved = true;
        selectedGroup = null;
        draw();
        return;
      }
    }
    selectedGroup = null;
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

function combat(attacker, defender) {
  let damage = attacker.attack * attacker.size - defender.defense * defender.size;
  damage = Math.max(damage, 0);
  
  defender.hp -= damage;
  if(defender.hp <= 0) {
    const idx = groups.findIndex(g => g.id === defender.id);
    if(idx !== -1) groups.splice(idx, 1);
  } else {
    defender.size = Math.ceil(defender.hp / 10);
  }
  const info = document.getElementById('info');
  info.innerText = `Combat! Joueur ${attacker.player} inflige ${damage} dégâts.`;
}

function updateResourcesDisplay() {
  const resDiv = document.getElementById('resourcesDisplay');
  resDiv.innerHTML = `
    Joueur 1 - Nourriture: ${resources[1].food} | Or: ${resources[1].gold} &nbsp;&nbsp;&nbsp; 
    Joueur 2 - Nourriture: ${resources[2].food} | Or: ${resources[2].gold}
  `;
}

function endTurn() {
  groups.forEach(g => {
    if(g.player === currentPlayer) g.moved = false;
  });
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateResourcesDisplay();
  draw();
}

document.addEventListener('keydown', e => {
  if(e.key === 'Enter') endTurn();
});

// Initialisation
updateResourcesDisplay();
draw();
