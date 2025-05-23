// Constants
const MAP_SIZE = 12;
const TILE_TYPES = {
  PLAINE: 'plaine',
  FORET: 'foret',
  LAC: 'lac',
  MONTAGNE: 'montagne',
  DONJON: 'donjon',
  CHATEAU: 'chateau'
};

const TILE_COLORS = {
  [TILE_TYPES.PLAINE]: '#8FBC8F',       // Vert clair
  [TILE_TYPES.FORET]: '#2E8B57',        // Vert foncé
  [TILE_TYPES.LAC]: '#1E90FF',          // Bleu vif
  [TILE_TYPES.MONTAGNE]: '#A9A9A9',     // Gris clair
  [TILE_TYPES.DONJON]: '#2F4F4F',       // Gris foncé
  [TILE_TYPES.CHATEAU]: '#8B4513'       // Marron
};

// Génère la map avec les règles de placement
function generateMap() {
  const map = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(TILE_TYPES.PLAINE));

  // Fonction utilitaire pour poser des biomes liés (lac, forêt, montagne)
  function placeBiomes(type, chance = 0.05, spreadChance = 0.25) {
    for (let y = 0; y < MAP_SIZE; y++) {
      for (let x = 0; x < MAP_SIZE; x++) {
        if (map[y][x] !== TILE_TYPES.PLAINE) continue;
        if (Math.random() < chance || hasAdjacentType(x, y, type, spreadChance)) {
          map[y][x] = type;
        }
      }
    }
  }

  function hasAdjacentType(x, y, type, chance) {
    const dirs = [[0,1],[1,0],[-1,0],[0,-1]];
    return dirs.some(([dx,dy]) => {
      const nx = x+dx, ny = y+dy;
      return inBounds(nx,ny) && map[ny][nx] === type && Math.random() < chance;
    });
  }

  function inBounds(x, y) {
    return x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE;
  }

  // Place les différents types de terrain
  placeBiomes(TILE_TYPES.FORET, 0.07, 0.25);
  placeBiomes(TILE_TYPES.LAC, 0.04, 0.25);
  placeBiomes(TILE_TYPES.MONTAGNE, 0.04, 0.25);

  // Place les donjons (isolés)
  let donjons = 0;
  while (donjons < 3) {
    const x = Math.floor(Math.random() * MAP_SIZE);
    const y = Math.floor(Math.random() * MAP_SIZE);
    if (map[y][x] === TILE_TYPES.PLAINE && noAdjacentType(x, y, TILE_TYPES.DONJON)) {
      map[y][x] = TILE_TYPES.DONJON;
      donjons++;
    }
  }

  // Place les châteaux dans les coins
  map[0][0] = TILE_TYPES.CHATEAU;
  map[MAP_SIZE-1][MAP_SIZE-1] = TILE_TYPES.CHATEAU;

  return map;
}

function noAdjacentType(x, y, type) {
  const dirs = [[0,1],[1,0],[-1,0],[0,-1]];
  return dirs.every(([dx,dy]) => {
    const nx = x+dx, ny = y+dy;
    return !inBounds(nx,ny) || map[ny][nx] !== type;
  });
}

