const fs = require('fs');
const assert = require('assert');



function solveOne(data: string, width: number, height: number): any{
  const robots = data.split('\n').map(line => {
    const [p, [vx, vy]] = line.split(' ').map(part => part.split('=')[1].split(',').map(Number))
    return {
      position: {
        x: p[0],
        y: p[1]
      },
      velocity: {
        x: vx,
        y: vy
      }
    }
  });

  const world: number[][] = [];
  for (let y = 0; y < height; y++){
    world.push(new Array(width).fill(0))
  }

  // simulate movement for 100 seconds
  for (let s = 0; s < 100; s++){
    for (const robot of robots){
      robot.position.x += robot.velocity.x
      robot.position.y += robot.velocity.y
      if (robot.position.x >= width) robot.position.x = robot.position.x % width;
      if (robot.position.y >= height) robot.position.y = robot.position.y % height;
      if (robot.position.x < 0) robot.position.x += width
      if (robot.position.y < 0) robot.position.y += height
    }
  }
  for (const robot of robots){
    world[robot.position.y][robot.position.x]++;
  }

  // count robots in each quad
  const top = world.slice(0, height / 2)
  const topLeft = top.map(row => row.slice(0, width / 2))
  const topRight = top.map(row => row.slice(width / 2 + 1))
  const bottom = world.slice(height / 2 + 1)
  const bottomLeft = bottom.map(row => row.slice(0, width / 2))
  const bottomRight = bottom.map(row => row.slice(width / 2 + 1))

  const sums = [topLeft, topRight, bottomLeft, bottomRight].map(quad => quad.flat().reduce((sum, robotCount) => sum + robotCount, 0))

	return sums.reduce((total, sum) => total * sum, 1);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`, 11, 7), 12);
	console.log(solveOne(data, 101, 103));
})();

const CARDINAL_DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]]

function wrapAroundNumber(max: number, value: number){
  if (value >= max) return value % max
  else if (value < 0) return value + max
  else return value 
}

function isLineAt(world: number[][], y: number, x: number, yo: number, xo: number, length: number){
  for (let o = 0; o < length; o++){
    const [ny, nx] = [wrapAroundNumber(world.length, y + yo * o), wrapAroundNumber(world[0].length, x + xo * o)];
    if (!world[ny][nx]){
      return false
    }
  }
  return true
}

function hasLineOfLength(world: number[][], length: number){
  for (let y = 0; y < world.length; y++){
    for (let x = 0; x < world[y].length; x++){
      if (!world[y][x]) continue;
      for (const [yo, xo] of CARDINAL_DIRECTIONS){
        if (isLineAt(world, y, x, yo, xo, length)){
          return true
        }
      }
    }
  }
  return false
}

function solveTwo(data: string, width: number, height: number): any{
  const robots = data.split('\n').map(line => {
    const [p, [vx, vy]] = line.split(' ').map(part => part.split('=')[1].split(',').map(Number))
    return {
      position: {
        x: p[0],
        y: p[1]
      },
      velocity: {
        x: vx,
        y: vy
      }
    }
  });

  const world: number[][] = [];
  for (let y = 0; y < height; y++){
    world.push(new Array(width).fill(0))
  }

  const possibles = []

  // simulate movement for 100 seconds
  for (let s = 1; s <= 10000; s++){
    for (const robot of robots){
      robot.position.x += robot.velocity.x
      robot.position.y += robot.velocity.y
      if (robot.position.x >= width) robot.position.x = robot.position.x % width;
      if (robot.position.y >= height) robot.position.y = robot.position.y % height;
      if (robot.position.x < 0) robot.position.x += width
      if (robot.position.y < 0) robot.position.y += height
    }

    const currentWorld: number[][] = JSON.parse(JSON.stringify(world));
    for (const robot of robots){
      currentWorld[robot.position.y][robot.position.x]++;
    }

    currentWorld

    if (hasLineOfLength(currentWorld, 10)){
      console.log(s)
      possibles.push([s, currentWorld])
    }
  }

  for (const [s, world] of possibles){
    console.log(s)
    console.log(world.map(row => row.map(c => c === 0 ? ' ' : c).join('')).join('\n'))
  }
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	console.log(solveTwo(data, 101, 103));
})();
