// map.js
const tileSize = 40;
const rows = 20;
const cols = 20;

const terrains = {
  plain: { color: '#7cfc00', walkable: true },
  forest: { color: '#228B22', walkable: false },
  lake: { color: '#1e90ff', walkable: false },
  dungeon: { color: '#444444', walkable: false },
  castle: { color: '#8B4513', walkable: false },
};

// Génération terrain sans désert, avec châteaux aux 4 coins
const terrainMap = [];
for(let y=0; y<rows; y++) {
  terrainMap[y] = [];
  for(let x=0; x<cols; x++) {
    if ((x === 0 && y === 0) || (x === 0 && y === rows-1) || (x === cols-1 && y === 0) || (x === cols-1 && y === rows-1)) {
      terrainMap[y][x] = 'castle';
      continue;
    }
    let rnd = Math.random();
    if(rnd < 0.05) terrainMap[y][x] = 'lake';
    else if(rnd < 0.15) terrainMap[y][x] = 'forest';
    else if(rnd < 0.18) terrainMap[y][x] = 'dungeon';
    else terrainMap[y][x] = 'plain';
  }
}

// Groupes positionnés dans les coins
const groups = [
  { id: 1, player: 1, x: 1, y: 1, size: 15, hp: 150, attack: 5, defense: 3, moved: false, class: "Sorciers", fed: true },
  { id: 2, player: 2, x: cols-2, y: rows-2, size: 15, hp: 150, attack: 6, defense: 2, moved: false, class: "Guerriers", fed: true },
];

export { tileSize, rows, cols, terrains, terrainMap, groups };

