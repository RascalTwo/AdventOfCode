import os
import math

from typing import List, Tuple, Union



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def parse_input(data: str) -> Tuple[int, List[Union[int, str]]]:
	earliest, buss_ids = data.split('\n')
	return int(earliest), [bid if bid == 'x' else int(bid) for bid in buss_ids.split(',')]


def solve_one(data: str):
	earliest, buss_ids = parse_input(data)
	active_buss_ids: List[int] = list(filter(lambda bid: isinstance(bid, int), buss_ids))

	least = (float('inf'), (0, 0))
	for bid in active_buss_ids:
		count = earliest / bid
		if int(count) != count:
			count = int(count) + 1

		bus_earliest = count * bid
		minutes = bus_earliest - earliest
		if minutes > least[0]:
			continue

		least = (minutes, (bid, minutes))

	return math.prod(least[1])

def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''939
7,13,x,x,59,x,31,19''') == 295
	print(solve_one(data))


def lcm(a: int, b: int):
  return abs(a*b) // math.gcd(a, b)


def solve_two(data: str):
	buss_id_offsets: List[Tuple[int, int]] = [
		(i, bid)
		for i, bid in enumerate(parse_input(data)[1])
		if bid != 'x'
	]

	timestamp = 0
	step = buss_id_offsets[0][1]
	remaining = len(buss_id_offsets)
	while remaining:
		minutes, bid = buss_id_offsets[remaining - len(buss_id_offsets)]
		if (timestamp + minutes) % bid == 0:
			step = lcm(step, bid)
			remaining -= 1
		else:
			timestamp += step

	return timestamp

def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''0
17,x,13,19''') == 3417
	assert solve_two('''0
67,7,59,61''') == 754018
	assert solve_two('''939
7,13,x,x,59,x,31,19''') == 1068781
	assert solve_two('''0
1789,37,47,1889''') == 1202161486
	print(solve_two(data))
