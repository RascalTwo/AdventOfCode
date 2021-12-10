import os
import collections

from typing import DefaultDict, Dict, List, Tuple

Invalid = Tuple[str, int]
Incomplete = List[str]



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def parse_chunks(data: str, get_invalid: bool = False, get_incomplete: bool = False, pairs: Dict[str, str] = {'(': ')', '[': ']', '{': '}', '<': '>'}) -> Tuple[List[Invalid], List[Incomplete]]:
	invalid: List[Invalid] = []
	incomplete: List[Incomplete] = []

	if not get_invalid and not get_incomplete:
		return invalid, incomplete


	for line in data.strip().split('\n'):
		opens: List[str] = []
		for i, chunk in enumerate(line):
			if chunk in pairs:
				opens.append(chunk)
			elif chunk in pairs.values():
				if pairs[opens.pop()] == chunk:
					continue
				if get_invalid:
					invalid.append((line, i))
				break
		else:
			if opens and get_incomplete:
				incomplete.append([pairs[chunk] for chunk in opens[::-1]])

	return invalid, incomplete


def solve_one(data: str):
	points = {
		')': 3,
		']': 57,
		'}': 1197,
		'>': 25137
	}

	invalid_chars: DefaultDict[str, int] = collections.defaultdict(int)
	for line, i in parse_chunks(data, get_invalid=True)[0]:
		invalid_chars[line[i]] += 1

	return sum(count * points[char] for char, count in invalid_chars.items())


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]''') == 26397
	print(solve_one(data))


def solve_two(data: str):
	points = {
		')': 1,
		']': 2,
		'}': 3,
		'>': 4
	}

	results: List[int] = []
	for missing in parse_chunks(data, get_incomplete=True)[1]:
		result = 0
		for chunk in missing:
			result *= 5
			result += points[chunk]
		results.append(result)


	return sorted(results)[len(results) // 2]


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]''') == 288957
	print(solve_two(data))
