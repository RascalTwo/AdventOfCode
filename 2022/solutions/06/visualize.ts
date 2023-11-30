const colors = require('colors/safe');
const fs = require('fs');

function getStartIndex(signal: string, distinctCount: number){
	for (let i = 0; i <= signal.length - distinctCount; i++) {
		if (new Set(signal.substring(i, i + distinctCount)).size === distinctCount) {
			return i;
		}
	}
}

async function visualize(signal: string, distinctCount: number, duration = 10000) {
	const frameCount = getStartIndex(signal, distinctCount)!;
	const rate = duration / frameCount

	for (let start = 0; start <= frameCount; start++) {
		let colored = [...signal.slice(start, start + distinctCount)]
		const dupes = new Set(colored.filter((c, i) => colored.indexOf(c) !== i));
		for (let i = 0; i < colored.length; i++) {
			if (dupes.has(colored[i])) {
				colored[i] = colors.bgWhite.red(colored[i]);
			} else {
				colored[i] = colors.bgWhite.green(colored[i]);
			}
		}
		const string = signal.slice(0, start) + colored.join('') + signal.slice(start + distinctCount);
		const currentNumber = (start + distinctCount).toString().padStart(signal.length.toString().length, '0')

		// clear terminal
		process.stdout.write('\x1Bc');
		console.log(`${dupes.size ? colors.red(currentNumber) : colors.green(currentNumber)} ${string}`);
		if (rate) await new Promise(resolve => setTimeout(resolve, rate));
		if (!dupes.size) {
			await new Promise(resolve => setTimeout(resolve, 1000));
			return console.log();
		}
	}
	await new Promise(resolve => setTimeout(resolve, 1000));
}

(async() => {
	for (const distinctCount of [4, 14]){
		await visualize('mjqjpqmgbljsphdztnvjfqwrcgsmlb', distinctCount, 2000);
		await visualize('bvwbjplbgvbhsrlpgdmjqwftvncz', distinctCount, 2000);
		await visualize('nppdvjthqldpwncqszvftbrmjlhg', distinctCount, 2000);
		await visualize('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', distinctCount, 2000);
		await visualize('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', distinctCount, 2000);
		await visualize(fs.readFileSync('input.in').toString(), distinctCount, 10000);
	}
})();
