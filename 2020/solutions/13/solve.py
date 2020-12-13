import os
import re
import math
import itertools

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	num, rest = data.split('\n')
	num = int(num)
	rest = list(filter(lambda b: b != 'x', rest.split(',')))
	rest = list(map(int, rest))
	busses = {}
	for bid in rest:
		c = 0
		dept = bid
		while dept < num:
			dept += bid
			c += 1
		busses[bid] = (c, dept)
	least_bid = -1
	least_diff = 999999
	for bid, (count, dept) in busses.items():
		diff = dept - num
		if diff < least_diff:
			least_diff = diff
			least_bid = bid

	wait = busses[least_bid][1] - num
	return least_bid * wait

def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''939
7,13,x,x,59,x,31,19''') == 295
	print(solve_one(data))

def solve_two(data: str):
	num, rest = data.split('\n')
	num = int(num)
	rest = [int(bid) if bid != 'x' else bid for bid in rest.split(',')]
	busses = {}
	tc = 1
	first_stamp = rest[0] * tc
	while True:
		fail = False
		for i in range(len(rest)):
			cbid = rest[i]
			if cbid == 'x':
				continue
			dept = cbid
			must_be = first_stamp + i
			while dept < must_be:
				dept += cbid
			if dept != must_be:
				tc += 1
				first_stamp = rest[0] * tc
				fail = True
				break
		if not fail:
			return first_stamp

def lcm(a, b):
  return abs(a*b) // math.gcd(a, b)

def solve_two(data: str):
	num, rest = data.split('\n')
	num = int(num)
	rest = [int(bid) if bid != 'x' else bid for bid in rest.split(',')]
	bids = [(i, bid) for i, bid in enumerate(rest) if bid != 'x']
	step = bids[0][1]
	stamp = 0
	correct = []
	while len(correct) != len(bids):
		minutes, bid = bids[len(correct)]
		if (stamp + minutes) % bid != 0:
			stamp += step
		else:
			step = lcm(step, bid)
			correct.append(bid)

	return stamp

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
