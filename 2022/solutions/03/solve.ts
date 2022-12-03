const fs = require('fs');
const assert = require('assert');



function solveOne(data: string): any{
	const found = [];
	for (const line of data.split('\n')){
		const middleLength = line.length / 2;
		const firstHalf = line.slice(0, middleLength);
		const secondHalf = line.slice(middleLength);
		const similarLetterInBothHalves = firstHalf.split('').find(char => secondHalf.includes(char));
		found.push(similarLetterInBothHalves);
	}
	const values = found.map(char => {
		// if is lowercase
		if (char === char.toLowerCase()){
			// a = 1
			// z = 26
			const value = char.charCodeAt(0) - 96;
			return value
		}
		// A = 27
		// Z = 52
		return char.charCodeAt(0) - 38;
	})
	//console.log(values);
	return values.reduce((acc, val) => acc + val, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`), 157);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any{
	const groupsOfThreeLines = [];
	let group = [];
	for (const line of data.split('\n')){
		group.push(line);
		if (group.length === 3){
			groupsOfThreeLines.push(group);
			group = [];
		}
	}

	const found = [];
	for (const group of groupsOfThreeLines){
		// get the once character that appears in all three lines
		const similarLetters = group[0].split('').filter(char => group[1].includes(char) && group[2].includes(char));
		found.push(similarLetters[0]);
	}
	console.log(found);
	const values = found.map(char => {
		// if is lowercase
		if (char === char.toLowerCase()){
			// a = 1
			// z = 26
			const value = char.charCodeAt(0) - 96;
			return value
		}
		// A = 27
		// Z = 52
		return char.charCodeAt(0) - 38;
	})
	console.log(values);
	return values.reduce((acc, val) => acc + val, 0);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`), 70);
	console.log(solveTwo(data));
})();
