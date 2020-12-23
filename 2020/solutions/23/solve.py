import os
import re
import math
import itertools
import collections

from typing import Dict, List, Optional, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))

class Node:
	def __init__(self, value: int):
		self.value: int = value
		self.next: 'Node' = None

	def __repr__(self):
		return f'({self.value}->{self.next.value})'

	def __eq__(self, other):
		return self.value == other

def play_game(values: List[int], steps: int):
	least_value = min(values)
	most_value = max(values)

	cups = [Node(v) for v in values]
	for i in range(len(cups) - 1):
		cups[i].next = cups[i + 1]
	cups[-1].next = cups[0]

	lookup = {node.value: node for node in cups}
	current = cups[0]
	for _ in range(steps):
		picked = [current.next, current.next.next, current.next.next.next]
		current.next = picked[-1].next
		dest = current.value - 1
		if dest < least_value:
			dest = most_value
		while dest in picked:
			dest -= 1
			if dest < least_value:
				dest = most_value

		nxt = lookup[dest]
		picked[-1].next = nxt.next
		nxt.next = picked[0]

		current = current.next

	return lookup

def solve_one(data: str):
	cups = list(map(int, list(data.strip())))
	current = cups[0]
	for m in range(100):
		picked = cups[cups.index(current)+1:cups.index(current)+4]
		pi = 0
		while len(picked) != 3:
			picked.append(cups[pi])
			pi += 1
		target = current -1
		while True:
			dest = next((cup for cup in cups if cup == target), None)
			if dest is None or dest in picked:
				target -= 1
				if target < min(cups):
					target = max(cups)
			else:
				break
		
		for v in picked:
			cups.remove(v)
		
		dest_idx = cups.index(dest)
		for i in range(len(picked)):
			cups.insert(dest_idx + i + 1, picked[i])
		current = cups[(cups.index(current) + 1) % len(cups)]
	
	lst = []
	i = cups.index(1)
	while cups[i] not in lst:
		lst.append(cups[i])
		i = (i + 1) % len(cups)
	return int(''.join(map(str, lst[1:])))



def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''389125467''') == 67384529
	print(solve_one(data))

def solve_two(data: str):
	lookup = play_game([int(v) for v in data.strip()] + [v for v in range(len(data.strip())+1, 1000001)], 10000000)
	return lookup[1].next.value * lookup[1].next.next.value


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''389125467''') == 149245887792
	print(solve_two(data))
