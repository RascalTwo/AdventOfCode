import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple, Set, Any



DIRPATH = os.path.dirname(os.path.abspath(__file__))

def build_regex(chars: dict, rules: dict, num: int, depth: int = 0):
		if num in chars:
			return chars[num]

		if depth == 100:
			return ''

		parts = []
		for part in rules[num]:
			parts.append(''.join(build_regex(chars, rules, n, depth + 1) for n in part))
		return '(' + '|'.join(parts) + ')'

def parse_rules(data: str, two = False):
	ref_rules = {}
	char_map = {}

	for line in data.split('\n'):
		num, rest = line.split(': ')
		num = int(num)
		if two:
			if num == 8:
				rest = '42 | 42 8'
			elif num == 11:
				rest = '42 31 | 42 11 31'
		if '"' in rest:
			char_map[num] = rest.split('"')[1].split('"')[0]
			continue
		ref_rules[num] = [list(map(int, part.strip().split(' '))) for part in rest.split('|')]

	return build_regex(char_map, ref_rules, 0)

def solve_one(data: str):
	zero = parse_rules(data.split('\n\n')[0])
	good = 0
	for line in data.split('\n\n')[1].split('\n'):
		if re.match('^' + zero + '$', line):
			good += 1
	return good


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb''') == 2
	print(solve_one(data))


def solve_two(data: str):
	zero = parse_rules(data.split('\n\n')[0], True)
	good = 0
	for line in data.split('\n\n')[1].split('\n'):
		if re.match('^' + zero + '$', line):
			good += 1
	return good


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba''') == 12
	print(solve_two(data))
