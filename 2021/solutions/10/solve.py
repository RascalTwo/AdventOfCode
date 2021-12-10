import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	matches = {
		'(': ')',
		'[': ']',
		'{': '}',
		'<': '>'
	}
	points = {
		')': 3,
		']': 57,
		'}': 1197,
		'>': 25137
	}

	invalids = collections.defaultdict(int)

	for line in data.strip().split('\n'):
		stack = []
		for char in line:
			if char in matches:
				stack.append(char)
			elif char in matches.values():
				key = stack.pop()
				if matches[key] != char:
					invalids[char] += 1
	result = 0
	for char, count in invalids.items():
		result += count * points[char]

	return result


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
	matches = {
		'(': ')',
		'[': ']',
		'{': '}',
		'<': '>'
	}
	points = {
		'(': 1,
		'[': 2,
		'{': 3,
		'<': 4
	}

	invalids = collections.defaultdict(int)

	incomplete = []
	for line in data.strip().split('\n'):
		stack = []
		for char in line:
			if char in matches:
				stack.append(char)
			elif char in matches.values():
				key = stack.pop()
				if matches[key] != char:
					break
		else:
			if stack:
				incomplete.append(stack)
	
	results = []
	for stack in incomplete:
		result = 0
		for char in stack[::-1]:
			result *= 5
			result += points[char]
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
