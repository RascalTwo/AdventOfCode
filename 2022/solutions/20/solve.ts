const fs = require('fs');
const assert = require('assert');

interface FileNumber {
	value: number;
	index: number;
}

const parseNumbers = (data: string, transformValue: (string: string) => number = parseInt): [FileNumber[], Map<number, FileNumber>] => {
	const map = new Map<number, FileNumber>();
	const numbers: FileNumber[] = data.split('\n').map((s, index) => {
		const number = { value: transformValue(s), index };
		map.set(number.index, number);
		return number
	});
	return [numbers, map];
}

function mixNumbers(numbers: FileNumber[], map: Map<number, FileNumber>) {
	for (let i = 0; i < numbers.length; i++) {
		const fileNumber = map.get(i)!;
		const currentIndex = numbers.indexOf(fileNumber);
		numbers.splice(currentIndex, 1);
		numbers.splice((currentIndex + fileNumber.value) % numbers.length, 0, fileNumber);
	}
	return numbers;
}

function sumGroveCoordinates(numbers: FileNumber[]) {
	const zeroIndex = numbers.findIndex(n => n.value === 0);
	return [1000, 2000, 3000].reduce((sum, io) => sum + numbers[(zeroIndex + io) % numbers.length].value, 0);
}


function solveOne(data: string): any {
	return sumGroveCoordinates(mixNumbers(...parseNumbers(data)));
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`1
2
-3
3
-2
0
4`), 3);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	const [numbers, map] = parseNumbers(data, s => parseInt(s) * 811589153);
	return sumGroveCoordinates(
		Array.from({ length: 10 }).reduce<FileNumber[]>(lastNumbers => mixNumbers(lastNumbers, map), numbers)
	);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`1
2
-3
3
-2
0
4`), 1623178306);
	console.log(solveTwo(data));
})();
