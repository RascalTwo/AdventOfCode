import os
from typing import Dict, Set


DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	known = set((2, 4, 3, 7))
	return sum(
		len(pattern) in known
		for line in (
			line.replace(' | ', ' ').split()
			for line in data.strip().split('\n')
		)
		for pattern in line[-4:]
	)


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce''') == 26
	print(solve_one(data))


def solve_two(data: str):
	result = 0
	for line in (line.replace(' | ', ' ').split() for line in data.strip().split('\n')):
		inputs = line[:-4]
		outputs = line[-4:]

		found: Dict[int, Set[str]] = {}
		for pattern in inputs:
			if len(pattern) == 2:
				found[1] = set(pattern)
			elif len(pattern) == 3:
				found[7] = set(pattern)
			elif len(pattern) == 4:
				found[4] = set(pattern)
			elif len(pattern) == 7:
				found[8] = set(pattern)

		segments: Dict[str, Set[str]] = {
			'top': found[7] - found[4]
		}
		rights = found[4] & found[1]
		for pattern in inputs:
			if len(pattern) == 5 and all(right in pattern for right in rights):
				found[3] = set(pattern)
				break

		segments['top_left'] = found[4] - found[3]
		segments['middle'] = found[4] - rights & found[3]
		segments['bottom'] = found[3] - rights - segments['middle'] - segments['top_left'] - segments['top']
		found[0] = found[8] - segments['middle']

		segments['bottom_left'] = found[0] - segments['top'] - segments['bottom'] - rights - segments['top_left']
		for pattern in inputs:
			if len(pattern) == 5 and all(list(segments[key])[0] in pattern for key in ('top', 'top_left', 'middle', 'bottom')):
				found[5] = set(pattern)
				break

		for pattern in inputs:
			if len(pattern) == 5 and all(found[key] != set(pattern) for key in (3, 5)):
				found[2] = set(pattern)
				break

		segments['top_right'] = found[2] - segments['top'] - segments['middle'] - segments['bottom_left'] - segments['bottom']
		segments['bottom_right'] = rights - segments['top_right']
		found[6] = found[8] - segments['top_right']
		found[9] = found[8] - segments['bottom_left']

		result += int(''.join(map(str, [
			next(
				int(key)
				for key, value in found.items()
				if value == set(pattern)
			)
			for pattern in outputs
		])))

	return result


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce''') == 61229
	print(solve_two(data))
