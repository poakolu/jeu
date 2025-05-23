// Déclaration unique des constantes, pas en double ailleurs
const TILE_COLORS = {
  plaine: '#8fbc8f',
  foret: '#2e8b57',
  lac: '#3399ff',
  montagne: '#a9a9a9',
  donjon: '#555555',
  chateau: '#8b4513'
};

const TILE_NAMES = {
  plaine: 'Plaine',
  foret: 'Forêt',
  lac: 'Lac',
  montagne: 'Montagne',
  donjon: 'Donjon',
  chateau: 'Château'
};

function generateMap() {
  // Carte 12x12 simple
  const map = Array(12).fill(null).map(() => Array(12).fill('plaine'));

  map[0][0] = 'chateau';
  map[11][11] = 'chateau';

  map[2][2] = 'foret';
  map[2][3] = 'foret';
  map[5][5] = 'lac';
  map[5][6] = 'lac';
  map[7][7] = 'montagne';
  map[8][7] = 'montagne';
  map[4][10] = 'donjon';

  return map;
}

