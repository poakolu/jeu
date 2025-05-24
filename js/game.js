const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let currentPlayer = 1; // 1 ou 2
let selectedGroup = null;

// Groupes d’unités avec infos supplémentaires
const groups = [
  { id: 1, player: 1, x: 1, y: 1, size: 15, hp: 15*10, attack: 5, defense: 3, moved: false, class: "Sorciers", fed: true },
  { id: 2, player: 2, x: 18, y: 18, size: 15, hp: 15*10, attack: 6, defense: 2, moved: false, class: "Guerriers", fed: true },
];

// Ressources des joueurs
let resources = {
  1: { food: 100, gold: 50 },
  2: { food: 100, gold: 50 },
};

// Mise à jour de l'affichage des ressources
function updateResourcesDisplay() {
  const resDiv = document.getElementById('resources');
  resDiv.innerHTML = `
    <div><b>Joueur 1</b> - Nourriture: ${resources[1].food} | Or: ${resources[1].gold}</div>
    <div><b>Joueur 2</b> - Nourriture: ${resources[2].food} | Or: ${resources[2].gold}</div>
  `;
}

// Affichage des infos d'un groupe dans la div info
function showGroupInfo(group) {
  if(!group) {
    document.getElementById('info').innerText = '';
    return;
  }
  const fedStatus = group.fed ? "Oui" : "Non";
  document.getElementById('info').innerText =
    `Groupe joueur ${group.player} - ${group.class}\n` +
    `Taille: ${group.size}\n` +
    `PV: ${group.hp}\n` +
    `Nourri: ${fedStatus}`;
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

// Gestion survol souris pour afficher infos groupe sous la souris
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const cx = Math.floor((e.clientX - rect.left) / tileSize);
  const cy = Math.floor((e.clientY - rect.top) / tileSize);
  const hoveredGroup = groups.find(g => g.x === cx && g.y === cy && g.player === currentPlayer);
  showGroupInfo(hoveredGroup);
});

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

function randomEvent(player) {
  const chance = Math.random();
  const info = document.getElementById('info');
  if(chance < 0.1) {
    groups.filter(g => g.player === player).forEach(g => {
      g.hp -= 3;
      if(g.hp < 0) g.hp = 0;
    });
    info.innerText = `Joueur ${player} subit une maladie! 3 PV perdus sur tous ses groupes.`;
  } else if(chance < 0.2) {
    resources[player].food -= 20;
    if(resources[player].food < 0) resources[player].food = 0;
    info.innerText = `Joueur ${player} a une mauvaise récolte! -20 nourriture.`;
  } else {
    info.innerText = '';
  }
}

function nextTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  groups.forEach(g => {
    if(g.player === currentPlayer) g.moved = false;
  });
  resources[currentPlayer].food += 10;
  resources[currentPlayer].gold += 5;
  randomEvent(currentPlayer);
  updateResourcesDisplay();
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawGroups();
  updateResourcesDisplay();
}

updateResourcesDisplay();
draw();

// Tour automatique toutes les 60s
setInterval(nextTurn, 60000);

