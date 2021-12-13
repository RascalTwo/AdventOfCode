import os
import re
import math
import itertools
import collections

from typing import Dict, List, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


def solve_one(data: str):
	rpositions, rfolds = data.strip().split('\n\n')
	flines = rfolds.split('\n')
	dlines = rpositions.split('\n')
	dots = set()
	for dline in dlines:
		x, y = dline.split(',')
		dots.add((int(x), int(y)))
	folds = [fold.split('along ')[1].split('=') for fold in flines]

	for axis, line in folds[:1]:
		newdots = set()
		line = int(line)
		if axis == 'x':
			x = line
			for pos in dots:
				if pos[0] < x:
					newdots.add(pos)
				else:
					newdots.add((2 * x - pos[0], pos[1]))
		else:
			y = line
			for pos in dots:
				if pos[1] < y:
					newdots.add(pos)
				else:
					newdots.add((pos[0], 2 * y - pos[1]))
		dots = newdots

	return len(dots)



def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5''') == 17
	print(solve_one(data))


def solve_two(data: str):
	rpositions, rfolds = data.strip().split('\n\n')
	flines = rfolds.split('\n')
	dlines = rpositions.split('\n')
	dots = set()
	for dline in dlines:
		x, y = dline.split(',')
		dots.add((int(x), int(y)))
	folds = [fold.split('along ')[1].split('=') for fold in flines]

	for axis, line in folds:
		newdots = set()
		line = int(line)
		if axis == 'x':
			x = line
			for pos in dots:
				if pos[0] < x:
					newdots.add(pos)
				else:
					newdots.add((2 * x - pos[0], pos[1]))
		else:
			y = line
			for pos in dots:
				if pos[1] < y:
					newdots.add(pos)
				else:
					newdots.add((pos[0], 2 * y - pos[1]))
		dots = newdots

	width = 0
	height = 0
	for dot in dots:
		width = max(width, dot[0])
		height = max(height, dot[1])
	
	for y in range(height+1):
		for x in range(width+1):
			print('.' if (x, y) not in dots else '#', end='', flush=True)
		print('')



def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	solve_two('''6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5''')
	solve_two(data)
