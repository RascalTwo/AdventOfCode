import os
import re
import math
import itertools

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


dirs = {
	'N': (0, 1),
	'E': (1, 0),
	'W': (-1, 0),
	'S': (0, -1),
}

leftlst = ['N', 'E', 'S', 'W']
righlst = ['N', 'W', 'S', 'E']

def solve_one(data: str):
	directions = list(map(lambda line: (line[0], int(line[1:])), data.split('\n')))
	x = 0
	y = 0
	dir = 'E'
	for cmd, num in directions:
		if cmd == 'F':
			xo, yo = dirs[dir]
			x += xo * num
			y += yo * num
		elif cmd in dirs:
			xo, yo = dirs[cmd]
			x += xo * num
			y += yo * num
		elif cmd in 'LR':
			change = num // 90
			if cmd == 'L':
				ci = righlst.index(dir)
				ci += change
				ci %= len(righlst)
				dir = righlst[ci]
			elif cmd == 'R':
				ci = leftlst.index(dir)
				ci += change
				ci %= len(leftlst)
				dir = leftlst[ci]
	return (abs(x - 0) + abs(y - 0))

def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''F10
N3
F7
R90
F11''') == 25
	print(solve_one(data))

def solve_two(data: str):
	directions = list(map(lambda line: (line[0], int(line[1:])), data.split('\n')))
	x = 0
	y = 0
	wx = 10
	wy = 1
	for cmd, num in directions:
		if cmd == 'F':
			x += wx * num
			y += wy * num
		elif cmd in dirs:
			xo, yo = dirs[cmd]
			wx += xo * num
			wy += yo * num
		elif cmd in 'LR':
			if cmd == 'L':
				while num:
					wx, wy = -wy, wx
					num -= 90
			else:
				while num:
					wx, wy = wy, -wx
					num -= 90
	return abs(x) + abs(y)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''F10
N3
F7
R90
F11''') == 286
	print(solve_two(data))
