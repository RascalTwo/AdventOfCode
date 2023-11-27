const fs = require('fs');
const colors = require('colors');

const data = fs.readFileSync(__dirname + '/input.in').toString();

const DURATION = 60000;

// TODO - customizable duration
// TODO - customizable input
// TODO - part 2 visualization
// TODO - show part 1 current count

(async () => {
	const delays: number[] = [];
	let firstLength = 0;
	for (const line of data.split('\n')) {
		delays.push(10)
		const middle = line.length / 2;
		const firstHalf = line.slice(0, middle);
		const secondHalf = line.slice(middle);
		let found: [boolean, number, number] = [false, 0, 0];
		for (let leftI = 0; leftI < firstHalf.length && !found[0]; leftI++) {
			for (let rightI = 0; rightI < secondHalf.length && !found[0]; rightI++) {
				delays.push(1);
				if (firstHalf[leftI] === secondHalf[rightI]) {
					delays.push(1)
					found = [true, leftI, rightI];
				}
			}
		}
		delays.push(100)
		if (!firstLength) firstLength = delays.length;
	}
	let multiplier = .1;
	while (true){
		const total = delays.reduce((a, b) => a + (b * multiplier), 0) ;
		if (total >= DURATION) break
		multiplier += .1
	}
	for (let i = 0; i < firstLength; i++) delays[i] = 500;
	for (const line of data.split('\n')) {
		process.stdout.write(' ' + line + '   \r');
		await new Promise(resolve => setTimeout(resolve, delays.shift()! * multiplier));
		const middle = line.length / 2;
		const firstHalf = line.slice(0, middle);
		const secondHalf = line.slice(middle);
		process.stdout.write(` ${firstHalf}${secondHalf}\r`);
		let found: [boolean, number, number] = [false, 0, 0];
		for (let leftI = 0; leftI < firstHalf.length && !found[0]; leftI++) {
			for (let rightI = 0; rightI < secondHalf.length && !found[0]; rightI++) {
				await new Promise(resolve => setTimeout(resolve, delays.shift()! * multiplier));
				if (firstHalf[leftI] === secondHalf[rightI]) {
					const firstString = firstHalf.slice(0, leftI).red + firstHalf[leftI].yellow + firstHalf.slice(leftI + 1);
					const secondString = secondHalf.slice(0, rightI).red + secondHalf[rightI].green + secondHalf.slice(rightI + 1);
					process.stdout.write(` ${firstString}${secondString}\r`);
					await new Promise(resolve => setTimeout(resolve, delays.shift()! * multiplier));
					found = [true, leftI, rightI];
				} else {
					const firstString = firstHalf.slice(0, leftI).red + firstHalf[leftI].yellow + firstHalf.slice(leftI + 1);
					const secondString = secondHalf.slice(0, rightI).red + secondHalf[rightI].yellow + secondHalf.slice(rightI + 1);
					process.stdout.write(` ${firstString}${secondString}\r`);
				}
			}
		}
		const [_, leftI, rightI] = found;
		const firstString = firstHalf.slice(0, leftI) + firstHalf[leftI].green + firstHalf.slice(leftI + 1);
		const secondString = secondHalf.slice(0, rightI) + secondHalf[rightI].green + secondHalf.slice(rightI + 1);
		process.stdout.write(` ${firstString}${secondString}\n`);
		await new Promise(resolve => setTimeout(resolve, delays.shift()! * multiplier));
	}
})();
