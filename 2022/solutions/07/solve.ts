const fs = require('fs');
const assert = require('assert');



interface Entity {
	children: Record<string, Entity>,
	size?: number;
}

function solveOne(data: string): any{
	const root: Entity = {
		children: {}
	}
	let path = ['/']
	for (const command of data.split('$ ').slice(1)){
		const [cmd, ...args] = command.split('\n')[0].split(' ');
		const output = command.split('\n').slice(1).map(line => line.trim()).filter(line => line)
		if (cmd === 'cd'){
			if (args[0] === '/') path = ['/'];
			else if (args[0] === '..') path.pop();
			else path.push(args[0]);
		}
		else if (cmd === 'ls') {
			let currentEntity = root;
			for (const dir of path){
				if (!currentEntity.children[dir]) currentEntity.children[dir] = {
					children: {}
				}
				currentEntity = currentEntity.children[dir];
			}
			for (const line of output){
				if (line.startsWith('dir')){
					currentEntity.children[line.slice(4)] = {
						children: {}
					}
				} else {
					const [size, name] = line.split(' ');
					currentEntity.children[name] = {
						children: {},
						size: parseInt(size)
					}
				}
			}
		}
	}
	let found: number[] = [];
	function getSize(entity: Entity){
		if (entity.size) return entity.size;
		let size = 0;
		for (const child of Object.values(entity.children)){
			size += getSize(child);
		}
		if (size < 100000) found.push(size);
		return size;
	}
	getSize(root);

	return found.reduce((a, b) => a + b, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`), 95437);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	const root: Entity = {
		children: {}
	}
	let path = []
	for (const command of data.split('$ ').slice(1)){
		const [cmd, ...args] = command.split('\n')[0].split(' ');
		const output = command.split('\n').slice(1).map(line => line.trim()).filter(line => line)
		if (cmd === 'cd'){
			if (args[0] === '/') path = [];
			else if (args[0] === '..') path.pop();
			else path.push(args[0]);
		}
		else if (cmd === 'ls') {
			let currentEntity = root;
			for (const dir of path){
				if (!currentEntity.children[dir]) currentEntity.children[dir] = {
					children: {}
				}
				currentEntity = currentEntity.children[dir];
			}
			for (const line of output){
				if (line.startsWith('dir')){
					currentEntity.children[line.slice(4)] = {
						children: {}
					}
				} else {
					const [size, name] = line.split(' ');
					currentEntity.children[name] = {
						children: {},
						size: parseInt(size)
					}
				}
			}
		}
	}
	const needed = 40000000;
	const used = getSize(root);
	function getSize(entity: Entity){
		if (entity.size) return entity.size;
		let size = 0;
		for (const child of Object.values(entity.children)){
			size += getSize(child);
		}
		return size;
	}

	let possibles: number[] = [];
	function findDeletableDirsThatWillFreeUpEnoughSpace(entity: Entity){
		if (entity.size) return;
		let sizeOfChildren = 0;
		for (const child of Object.values(entity.children)){
			sizeOfChildren += getSize(child);
		}
		if (used - sizeOfChildren < needed) possibles.push(sizeOfChildren);
		for (const child of Object.values(entity.children)){
			findDeletableDirsThatWillFreeUpEnoughSpace(child);
		}
	}
	findDeletableDirsThatWillFreeUpEnoughSpace(root);
	return Math.min(...possibles);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
	`), 24933642);
	console.log(solveTwo(data));
})();
