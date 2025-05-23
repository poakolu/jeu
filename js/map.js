// map.js

const TILE_TYPES = ['plaine', 'foret', 'lac', 'montagne', 'donjon', 'chateau'];

// Couleurs et probabilités gérées dans le HTML, ici on génère la map avec contraintes basiques
function generateMap() {
  const width = 12;
  const height = 12;
  const map = [];

  // Initialise la map avec que des plaines
  for (let y = 0; y < height; y++) {
    map[y] = [];
    for (let x = 0; x < width; x++) {
      map[y][x] = 'plaine';
    }
  }

  // Place 2 châteaux aux coins opposés (ex : haut-gauche et bas-droite)
  map[0][0] = 'chateau';
  map[height-1][width-1] = 'chateau';

  // Fonction pour placer des zones connexes (lacs, montagnes, forêts) selon ta règle 25%
  function placeZone(type, count) {
    let placed = 0;
    while (placed < count) {
      let x = Math.floor(Math.random() * width);
      let y = Math.floor(Math.random() * height);

      if (map[y][x] === 'plaine') {
        map[y][x] = type;
        placed++;

        // Propage avec 25% de chance aux cases adjacentes
        const directions = [
          [0,1], [1,0], [0,-1], [-1,0]
        ];
        directions.forEach(([dx,dy]) => {
          let nx = x + dx;
          let ny = y + dy;
          if (
            nx >= 0 && nx < width &&
            ny >= 0 && ny < height &&
            map[ny][nx] === 'plaine' &&
            Math.random() < 0.25
          ) {
            map[ny][nx] = type;
          }
        });
      }
    }
  }

  // Place zones : forêts, lacs, montagnes (exemple : 10 cases chacune)
  placeZone('foret', 10);
  placeZone('lac', 8);
  placeZone('montagne', 8);

  // Place quelques donjons isolés (1 case chacun, pas côte à côte)
  let donjonsPlaces = 0;
  while (donjonsPlaces < 4) {
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    if (map[y][x] === 'plaine') {
      // Vérifie qu’aucun donjon autour
      let noDonjonNearby = true;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          let nx = x + dx;
          let ny = y + dy;
          if (
            nx >= 0 && nx < width &&
            ny >= 0 && ny < height &&
            map[ny][nx] === 'donjon'
          ) {
            noDonjonNearby = false;
          }
        }
      }
      if (noDonjonNearby) {
        map[y][x] = 'donjon';
        donjonsPlaces++;
      }
    }
  }

  return map;
}

