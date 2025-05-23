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

