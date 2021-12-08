import os


DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	lines = [line.replace(' | ', ' ').split(' ') for line in data.strip().split('\n')]
	count = 0
	output = [line[-4:] for line in lines]
	for line in output:
		for pattern in line:
			if len(pattern) in [2, 4, 3, 7]:
				count += 1
	return count




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
	lines = [line.replace(' | ', ' ').split(' ') for line in data.strip().split('\n')]
	count = 0
	result = 0
	for line in lines:
		one = None
		four = None
		seven = None
		eight = None
		identified = {}
		for pattern in line[:-4]:
			if len(pattern) in [2, 4, 3, 7]:
				if len(pattern) == 2:
					one = pattern
					identified[1] = pattern
				if len(pattern) == 7:
					eight = pattern
					identified[8] = pattern
				if len(pattern) == 3:
					identified[7] = pattern
					seven = pattern
				if len(pattern) == 4:
					four = pattern
					identified[4] = pattern
				count += 1
		top = set(seven) - set(four)
		rights = set(four) & set(one)
		three = None
		for pattern in line[:-4]:
			if len(pattern) == 5 and all(right in pattern for right in rights):
				three = pattern
		identified[3] = three
		topleft = set(four) - set(three)
		middle = set(four) - rights & set(three)
		bottom = set(three) - rights - middle - topleft- top
		zero = None
		for pattern in line[:-4]:
			if len(pattern) == 6 and list(middle)[0] not in pattern:
				zero = pattern
		identified[0] = zero
		bottomleft = set(zero) - top - bottom - rights - topleft
		five = None
		for pattern in line[:-4]:
			if len(pattern) == 5 and list(top)[0] in pattern and list(topleft)[0] in pattern and list(middle)[0] in pattern and list(bottom)[0] in pattern:
				five = pattern
		identified[5] = five
		print(five)
		two = None
		for pattern in line[:-4]:
			if len(pattern) == 5 and pattern != three and pattern != five:
				two = pattern
		identified[2] = two
		topright = set(eight) - top - topleft - middle - bottomleft - bottom
		topright = set(two) - top - middle - bottomleft - bottom
		bottomright = rights - topright
		topright = topright - bottomright
		identified[9] = ''.join(set(eight) - bottomleft)
		identified[6] = ''.join(set(eight) - topright)
		output_patterns = line[-4:]
		digits = []
		for pattern in output_patterns:
			for key, value in identified.items():
				if set(value) == set(pattern):
					digits.append(int(key))
					break
		result += int(''.join(map(str, digits)))
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
