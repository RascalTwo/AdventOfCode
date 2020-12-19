import os
import re
import functools

from typing import Dict, List, Union



DIRPATH = os.path.dirname(os.path.abspath(__file__))


RuleValue = Union[str, List[List[int]]]
RuleMap = Dict[int, RuleValue]


def build_regex(rules: RuleMap, value: RuleValue, max_depth: int, depth: int) -> str:
		if isinstance(value, str):
			return value

		if depth == max_depth:
			return ''

		return (
			'(' +
			'|'.join(
				''.join(
					build_regex(rules, rules[num], max_depth, depth + 1) for num in part
				)
				for part in value
			) +
			')'
		)


def parse_rules(data: str, max_depth: int = -1) -> str:
	rules = {
		int(halves[0]): (
			halves[1].split('"')[1].split('"')[0]
			if '"' in halves[1] else
			[list(map(int, part.split(' '))) for part in halves[1].split(' | ')]
		)
		for line in data.split('\n')
		if (halves := line.split(': '))
	}

	return build_regex(rules, rules[0], max_depth, 0)


def solve_one(data: str):
	rules, messages = data.split('\n\n')
	regex = parse_rules(rules)
	return sum(bool(re.fullmatch(regex, message)) for message in messages.split('\n'))


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
	rules, messages = data.split('\n\n')
	longest_rule: int = functools.reduce(lambda a, b: a if a > b else b, map(len, messages.split('\n')), 0)
	regex = parse_rules(rules.replace('8: 42', '8: 42 | 42 8').replace('11: 42 31', '11: 42 31 | 42 11 31'), longest_rule)
	return sum(bool(re.match('^' + regex + '$', message)) for message in messages.split('\n'))


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
