import os
from typing import Dict, List, Tuple


DIRPATH = os.path.dirname(os.path.abspath(__file__))


PileOfBags = Dict[str, List[Tuple[str, int]]]


def can_hold(bags: PileOfBags, bag: str, target: str) -> bool:
	return target in map(lambda sub: sub[0], bags[bag]) or any(can_hold(bags, sub[0], target) for sub in bags[bag])


def parse_pile_of_bags(data: str) -> PileOfBags:
	bags: PileOfBags = {}
	for raw_bag in data.split('\n'):
		bag = ' '.join(raw_bag.split(' ')[:2])
		if 'no other bag' in raw_bag:
			bags[bag] = []
			continue

		bags[bag] = [
			(' '.join(sub[1:]), int(sub[0]))
			for sub in [
				sub.replace('bags', '').replace('bag', '').replace('.', '').strip().split(' ')
				for sub in raw_bag.split('contain ')[1].split(', ')
			]
		]
	return bags


def solve_one(data: str):
	bags = parse_pile_of_bags(data)
	return sum(can_hold(bags, bag, 'shiny gold') for bag in bags)


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


def get_bag_count(bags: Dict[str, List[Tuple[str, int]]], bag: str) -> int:
	return sum(sub[1] * get_bag_count(bags, sub[0]) for sub in bags.get(bag, [])) + 1


def solve_two(data: str):
	return get_bag_count(parse_pile_of_bags(data), 'shiny gold') - 1


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
