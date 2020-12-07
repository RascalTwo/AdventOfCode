import os
from typing import Dict, List, Tuple


DIRPATH = os.path.dirname(os.path.abspath(__file__))


def can_hold(bags: Dict[str, List[str]], bag: str, child: str) -> bool:
	if child in bags[bag]:
		return True
	for sub_bag in bags[bag]:
		if can_hold(bags, sub_bag, child):
			return True
	return False

def solve_one(data: str):
	bags = {}
	for raw_bag in data.split('\n'):
		bag = ' '.join(raw_bag.split(' ')[:2])
		if 'no other bag' in raw_bag:
			bags[bag] = []
			continue
		contains = [
			' '.join(other.replace('bags', '').replace('bag', '').replace('.', '').strip().split(' ')[1:])
			for other in raw_bag.split('contain ')[1].split(', ')
		]
		bags[bag] = contains
	count = 0
	for bag in bags:
		if can_hold(bags, bag, 'shiny gold'):
			count += 1
	return count


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.''') == 4
	print(solve_one(data))



def can_hold_two(bags: Dict[str, List[str]], bag: str, child: str) -> bool:
	if child in bags[bag]:
		return True
	for sub_bag in bags[bag]:
		if can_hold(bags, sub_bag, child):
			return True
	return False

def get_bag_count(bags: Dict[str, List[Tuple[str, int]]], bag: str, depth: int) -> int:
	if bag not in bags:
		return 0
	count = 1
	for sub_bag in bags[bag]:
		count += sub_bag[1] * get_bag_count(bags, sub_bag[0], depth * 2)
	return count

def solve_two(data: str):
	bags = {}
	for raw_bag in data.split('\n'):
		bag = ' '.join(raw_bag.split(' ')[:2])
		if 'no other bag' in raw_bag:
			bags[bag] = []
			continue
		contains = [
			other.replace('bags', '').replace('bag', '').replace('.', '').strip().split(' ')
			for other in raw_bag.split('contain ')[1].split(', ')
		]
		contains = [(' '.join(other[1:]), int(other[0])) for other in contains]
		bags[bag] = contains
	return get_bag_count(bags, 'shiny gold', 1) - 1


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.''') == 32
	assert solve_two('''shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.''') == 126
	print(solve_two(data))
test_two()