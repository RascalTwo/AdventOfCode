const fs = require('fs');
const assert = require('assert');


const calculateValue = (char: string) => char.charCodeAt(0) - (char === char.toLowerCase() ? 96 : 38);

function solveOne(data: string): any{
	return data.split('\n').reduce((sum, rucksack) => {
		const middleLength = rucksack.length / 2;
		const secondHalf = new Set(rucksack.slice(middleLength));
		const commonItem = [...rucksack.slice(0, middleLength)].find(char => secondHalf.has(char));
		return sum + calculateValue(commonItem);
	}, 0);
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
	return data.split(/(.+\n.+\n.+)/g).map(x => x.trim()).filter(x => x.length > 0).map(x => x.split('\n')).reduce((sum, group) => {
		const firstIndex = group.reduce((firstIndex, line, index) => line.length < group[firstIndex].length ? index : firstIndex, 0);
		const [second, third] = [0, 1, 2].filter(i => i !== firstIndex).map(i => new Set(group[i]));
		const commonItem = [...group[firstIndex]].find(char => second.has(char) && third.has(char));
		return sum + calculateValue(commonItem);
	}, 0)
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
