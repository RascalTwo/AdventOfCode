const fs = require('fs');
const assert = require('assert');



interface BaseEntity {
	type: 'file' | 'directory';
}

interface FileEntity {
	type: 'file';
	size: number;
}

interface DirectoryEntity {
	type: 'directory';
	children: Record<string, FullEntity>;
}

type FullEntity = FileEntity | DirectoryEntity;

interface CommandProps {
	args: string[]
	output: string[];
}


function buildFilesystem(data: string): DirectoryEntity {
	const root: DirectoryEntity = {
		type: 'directory',
		children: {}
	}
	let workPath: string[] = []

	function getDirectoryEntity(entity: DirectoryEntity, path: string[]): DirectoryEntity {
		if (!path.length) return entity;
		const [dir, ...rest] = path;
		return getDirectoryEntity(entity.children[dir] as DirectoryEntity, rest);
	}

	function cd({ args: [destination] }: CommandProps) {
		if (destination === '/') workPath = [];
		else if (destination === '..') workPath.pop();
		else workPath.push(destination);
	}

	function ls({ output }: CommandProps) {
		const cwd = getDirectoryEntity(root, workPath)
		for (const line of output) {
			if (line.startsWith('dir')) cwd.children[line.slice(4)] = {
				type: 'directory',
				children: {}
			}
			else {
				const [size, name] = line.split(' ');
				cwd.children[name] = {
					type: 'file',
					size: parseInt(size)
				}
			}
		}
	}

	for (const command of data.split(/^\$ /gm).slice(1)) {
		const [line, ...output] = command.split('\n').map(line => line.trim()).filter(Boolean);
		const [cmd, ...args] = line.split(' ');
		switch (cmd) {
			case 'cd': cd({ args, output });
			case 'ls': ls({ args, output });
		}
	}
	return root
}

function getSize(entity: FullEntity): number {
	return entity.type === 'directory'
		? Object.values(entity.children).reduce((size, child) => size + getSize(child), 0)
		: entity.size;
}

function solveOne(data: string, maximumDirectorySize = 100000): any {
	const root = buildFilesystem(data);

	const foundSizes: number[] = [];

	const stack: DirectoryEntity[] = [root];
	while (stack.length){
		const entity = stack.pop()!;

		let size = 0;
		for (const child of Object.values(entity.children)) {
			size += getSize(child);
			if (child.type === 'directory') stack.push(child);
		}
		if (size <= maximumDirectorySize) foundSizes.push(size);
	}

	return foundSizes.reduce((a, b) => a + b, 0);
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


function solveTwo(data: string, totalSpace = 70000000, neededSpace = 30000000): any {
	const root = buildFilesystem(data);
	const used = getSize(root);
	const needToDelete = used - totalSpace + neededSpace;

	function recur(entity: FullEntity): number[] {
		if (entity.type === 'file') return [];

		const size = getSize(entity)
		const deletables = size > needToDelete ? [size] : [];

		for (const child of Object.values(entity.children)) {
			deletables.push(...recur(child));
		}
		return deletables
	}

	return Math.min(...recur(root));
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
