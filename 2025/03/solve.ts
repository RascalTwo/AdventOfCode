const fs = require('fs');
const assert = require('assert');

function doTheThing(bank: string, goal: number): string {
	if (!goal) return '';
	const possible = bank.slice(0, bank.length - goal+1)
	let best = -1;
	for (let i = 0; i < possible.length; i++){
		if (best === -1 || possible[i] > possible[best]) best = i
	}
	return possible[best] + doTheThing(bank.slice(best + 1), goal - 1);

}

function solve(data: string, goal: number): any {
	const banks = data.trim().split('\n');
	let total = 0
	for (const bank of banks) {
		total += +doTheThing(bank.trim(), goal);
	}
	return total
}

function solveOne(data: string): any {
	return solve(data, 2)
	const banks = data.trim().split('\n');
	let total = 0
	for (const bank of banks) {
		let largest = -Infinity
		for (let right = bank.length - 1; right >= 0; right--) {
			for (let left = right - 1; left >= 0; left--) {
				const atttempt = +(bank[left] + bank[right])
				if (atttempt >= largest) largest = atttempt
			}
		}
		total += largest
		//const digitis = [...bank].sort().reverse();
		//total += +(digitis[0] + digitis[1]);
		//+(digitis[0] + digitis[1]) //?
	}
	return total
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveOne(`818181911112111`), 92);
	assert.deepStrictEqual(solveOne(`811111111111119`), 89);
	assert.deepStrictEqual(solveOne(`987654321111111
811111111111119
234234234234278
818181911112111`), 357);
	console.log(solveOne(data));
})();


function solveTwo(data: string): any {
	return solve(data, 12)
	const banks = data.trim().split('\n');
	let total = 0
	for (const bank of banks) {
		let largest = -Infinity
		for (let one = bank.length - 1; one >= 0; one--) {
			for (let two = one - 1; two >= 0; two--) {
				for (let three = two - 1; three >= 0; three--) {
					for (let four = three - 1; four >= 0; four--) {
						for (let five = four - 1; five >= 0; five--) {
							for (let six = five - 1; six >= 0; six--) {
								for (let seven = six - 1; seven >= 0; seven--) {
									for (let eight = seven - 1; eight >= 0; eight--) {
										for (let nine = eight - 1; nine >= 0; nine--) {
											for (let ten = nine - 1; ten >= 0; ten--) {
												for (let eleven = ten - 1; eleven >= 0; eleven--) {
													for (let twelve = eleven - 1; twelve >= 0; twelve--) {
														const atttempt = +(bank[twelve] + bank[eleven] + bank[ten] + bank[nine] + bank[eight] + bank[seven] + bank[six] + bank[five] + bank[four] + bank[three] + bank[two] + bank[one])
														if (atttempt >= largest) largest = atttempt
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		total += largest
	}
	return total
}


(() => {
	const data = fs.readFileSync(__dirname + '/input.in').toString();
	assert.deepStrictEqual(solveTwo(`987654321111111
811111111111119
234234234234278
818181911112111`), 3121910778619);
//assert.deepStrictEqual(solveTwo(`2411323321122342222312224225222113222113323212322221243612222112223322233231224121422335412222222422`), 5);
	console.log(solveTwo(data));
})();

export { };