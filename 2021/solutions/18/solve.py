import os
import copy
import math

from typing import Iterable, List, TypedDict

SnailValue = TypedDict('SnailValue', { 'value': int, 'depth': int})
Snailfish = List[SnailValue]


DIRPATH = os.path.dirname(os.path.abspath(__file__))

def explode(fish: Snailfish):
	for l, left in enumerate(fish[:-1]):
		r = l + 1
		right = fish[r]
		if left['depth'] == right['depth'] and left['depth'] > 4 and r - l == 1:
			l_reg = l - 1
			if l_reg >= 0:
				fish[l_reg]['value'] += left['value']
			r_reg = r + 1
			if r_reg < len(fish):
				fish[r_reg]['value'] += right['value']

			del fish[r]
			del fish[l]
			fish.insert(l, SnailValue(value=0, depth=left['depth'] - 1))
			return True
	return False


def split(fish: Snailfish):
	for i, splitting in enumerate(fish):
		if splitting['value'] >= 10:
			half = splitting['value'] / 2
			left = math.floor(half)
			right = math.ceil(half)
			del fish[i]
			fish.insert(i, SnailValue(value=left, depth=splitting['depth'] + 1))
			fish.insert(i + 1, SnailValue(value=right, depth=splitting['depth'] + 1))
			return True
	return False


def parse_snailfish(line: str) -> Iterable[SnailValue]:
	depth = 0
	digits = ''
	for char in line:
		if char == '[':
			depth += 1
		elif char in ',]':
			if digits:
				yield SnailValue(value=int(digits), depth=depth)
				digits = ''
			if char == ']':
				depth -= 1
		else:
			digits += char
	if digits:
		yield SnailValue(value=int(digits), depth=depth)


def add(*adding: SnailValue) -> Snailfish:
	added = list(adding)
	for value in added:
		value['depth'] += 1

	while True:
		if explode(added):
			continue
		if split(added):
			continue
		return added


def calculate_magnitude(fish: Snailfish) -> int:
	while len(fish) != 1:
		for l, left in enumerate(fish[:-1]):
			r = l + 1
			right = fish[r]
			if left['depth'] == right['depth'] and r - l == 1:
				pair_magnitude = (left['value'] * 3) + (right['value'] * 2)
				del fish[r]
				del fish[l]
				fish.insert(l, SnailValue(value=pair_magnitude, depth=left['depth'] - 1))
				break
	return fish[0]['value']

def solve_one(data: str):
	snailfish = [list(parse_snailfish(line)) for line in data.strip().split('\n')][::-1]

	while len(snailfish) != 1:
		snailfish.append(add(*snailfish.pop(), *snailfish.pop()))
	return calculate_magnitude(snailfish[0])

def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()

	assert solve_one('[[1,2],[[3,4],5]]') == 143
	assert solve_one('[[[0,7],4],[[7,8],[6,0]]],[8,1]') == 1384
	assert solve_one('[[[1,1],[2,2]],[3,3]],[4,4]') == 445
	assert solve_one('[[[3,0],[5,3]],[4,4]],[5,5]') == 791
	assert solve_one('[[[5,0],[7,4]],[5,5]],[6,6]') == 1137
	assert solve_one('[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]') == 3488
	assert solve_one('[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]') == 4140
	assert solve_one('''[1,1]
[2,2]
[3,3]
[4,4]''')
	assert solve_one('''[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]''') == 3488
	assert solve_one('''[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]''') == 4140
	print(solve_one(data))


def solve_two(data: str):
	snailfish = [list(parse_snailfish(line)) for line in data.strip().split('\n')][::-1]

	best = 0
	for l, left in enumerate(snailfish):
		for r, right in enumerate(snailfish):
			if r == l:
				continue
			best = max(best, calculate_magnitude(add(*copy.deepcopy(left), *copy.deepcopy(right))))
	return best


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]''') == 3993
	print(solve_two(data))
