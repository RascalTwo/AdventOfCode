const fs = require('fs');
const assert = require('assert');



function solve(data: string, days: number): number{
	let counts = data.trim().split(',').map(Number).reduce((counts, age) => {
		counts.set(age, (counts.get(age) ?? 0) + 1);
		return counts;
	}, new Map<number, number>());
	for (let _ = 0; _ < days; _++){
		const newCounts = new Map<number, number>();
		for (const [age, count] of counts.entries()){
			if (age){
				newCounts.set(age - 1, (newCounts.get(age - 1) ?? 0) + count)
			} else {
				newCounts.set(6, (newCounts.get(6) ?? 0) + count)
				newCounts.set(8, (newCounts.get(8) ?? 0) + count)
			}
		}
		counts = newCounts;

	}
	return Array.from(counts.values()).reduce((sum, count) => sum + count);
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solve(`3,4,3,1,2`, 80), 5934);
	console.log(solve(data, 80));
})();


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solve(`3,4,3,1,2`, 256), 26984457539);
	console.log(solve(data, 256));
})();
