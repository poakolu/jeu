const menu = document.getElementById('menu');
const gameContainer = document.getElementById('gameContainer');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

document.getElementById('startGameBtn').addEventListener('click', () => {
  menu.style.display = 'none';
  gameContainer.style.display = 'block';

  // Réinitialiser le canvas avant de dessiner
  canvas.width = canvas.width;

  draw();
  updateResourcesDisplay();
});

// Exemple simplifié des fonctions draw, drawBoard, drawGroups (à adapter à ton code)
function draw() {
  drawBoard();
  drawGroups();
}

function drawBoard() {
  ctx.fillStyle = '#ccc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Dessin de la map ici...
}

function drawGroups() {
  // Dessin des unités ici...
}

function updateResourcesDisplay() {
  const resourcesDiv = document.getElementById('resourcesDisplay');
  // Exemple d'affichage
  resourcesDiv.textContent = 'Ressources du joueur: Nourriture 100 | Or 50';
}
