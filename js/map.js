const tileSize = 40;
const rows = 20;
const cols = 20;

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
    let rnd = Math.random();
    if(rnd < 0.05) terrainMap[y][x] = 'lake';
    else if(rnd < 0.15) terrainMap[y][x] = 'forest';
    else if(rnd < 0.18) terrainMap[y][x] = 'dungeon';
    else if(rnd < 0.3) terrainMap[y][x] = 'desert';
    else terrainMap[y][x] = 'plain';
  }
}

