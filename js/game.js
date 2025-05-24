// game.js

import { tileSize, rows, cols, terrains, terrainMap, groups } from './map.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let currentPlayer = 1;
let turnCount = 0;

const resources = {
  1: { food: 100, gold: 50 },
  2: { food: 100, gold: 50 },
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Dessiner la map
  for(let y=0; y<rows; y++) {
    for(let x=0; x<cols; x++) {
      ctx.fillStyle = terrains[terrainMap[y][x]].color;
      ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(x*tileSize, y*tileSize, tileSize, tileSize);
    }
  }
  // Dessiner groupes
  groups.forEach(g => {
    ctx.fillStyle = g.player === 1 ? 'blue' : 'red';
    ctx.beginPath();
    ctx.arc(g.x * tileSize + tileSize/2, g.y * tileSize + tileSize/2, tileSize/3, 0, 2*Math.PI);
    ctx.fill();

    // Texte taille groupe
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(g.size, g.x * tileSize + tileSize/2, g.y * tileSize + tileSize/2 + 5);
  });
}

function updateResourcesDisplay() {
  const resDiv = document.getElementById('resources');
  resDiv.innerHTML = `
    <div><b>Joueur 1</b> - Nourriture: ${resources[1].food} | Or: ${resources[1].gold}</div>
    <div><b>Joueur 2</b> - Nourriture: ${resources[2].food} | Or: ${resources[2].gold}</div>
  `;
}

function nextTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  turnCount++;

  groups.forEach(g => {
    if(g.player === currentPlayer) g.moved = false;
  });

  resources[currentPlayer].food += 10;
  resources[currentPlayer].gold += 5;

  if (turnCount % 5 === 0) {
    groups.filter(g => g.player === currentPlayer).forEach(g => {
      g.fed = true;
    });
  }

  updateResourcesDisplay();
  draw();
}

document.getElementById('feedButton').addEventListener('click', () => {
  groups.filter(g => g.player === currentPlayer).forEach(g => {
    if(resources[currentPlayer].food >= g.size) {
      resources[currentPlayer].food -= g.size;
      g.fed = true;
    }
  });
  updateResourcesDisplay();
  draw();
});

// Affichage infos groupe au survol de la souris
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const tileX = Math.floor(mouseX / tileSize);
  const tileY = Math.floor(mouseY / tileSize);

  const infoDiv = document.getElementById('info');
  let found = false;

  groups.forEach(g => {
    if(g.x === tileX && g.y === tileY) {
      infoDiv.innerHTML = `
        <b>Joueur ${g.player}</b><br>
        Classe: ${g.class}<br>
        PV: ${g.hp}<br>
        Nourri: ${g.fed ? 'Oui' : 'Non'}<br>
        Taille: ${g.size}
      `;
      found = true;
    }
  });
  if(!found) infoDiv.innerHTML = '';
});

// Écran d’accueil, gestion menu
const menu = document.getElementById('menu');
const gameContainer = document.getElementById('gameContainer');
const credits = document.getElementById('credits');

document.getElementById('startGameBtn').addEventListener('click', () => {
  menu.style.display = 'none';
  gameContainer.style.display = 'block';
  draw();
  updateResourcesDisplay();
});

document.getElementById('creditsBtn').addEventListener('click', () => {
  menu.style.display = 'none';
  credits.style.display = 'block';
});

document.getElementById('backFromCredits').addEventListener('click', () => {
  credits.style.display = 'none';
  menu.style.display = 'block';
});

