import os
import re
import math
import itertools
import collections

from typing import DefaultDict, Dict, List, Optional, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))

dirs = ['se', 'sw', 'nw', 'ne', 'w', 'e']

offsets = {
	'se': (0, -1, 1),
	'sw': (-1, 0, 1),
	'nw': (0, 1, -1),
	'ne': (1, 0, -1),
	'w': (-1, 1, 0),
	'e': (1, -1, 0)
}

def solve_one(data: str):
	lines = data.strip().split('\n')
	tiles: DefaultDict[Tuple[int, int, int], bool] = collections.defaultdict(lambda: False)
	for line in lines:
		x = 0
		y = 0
		z = 0

		c = 0
		while c < len(line):
			nxt_dir = line[c]
			if nxt_dir in 'sn':
				nxt_dir += line[c + 1]
			xo, yo, zo = offsets[nxt_dir]
			x += xo
			y += yo
			z += zo
			c += len(nxt_dir)
		loc = (x, y, z)

		tiles[loc] = not tiles[loc]

	return sum(black for black in tiles.values())



def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('esenee') == 1
	assert solve_one('''ew
we''') == 0
	assert solve_one('''nwse
senw''') == 0
	assert solve_one('''sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew''') == 10
	print(solve_one(data))


def solve_two(data: str):
	lines = data.strip().split('\n')
	tiles: DefaultDict[Tuple[int, int, int], bool] = collections.defaultdict(lambda: False)
	for line in lines:
		x = 0
		y = 0
		z = 0

		c = 0
		while c < len(line):
			nxt_dir = line[c]
			if nxt_dir in 'sn':
				nxt_dir += line[c + 1]
			xo, yo, zo = offsets[nxt_dir]
			x += xo
			y += yo
			z += zo
			c += len(nxt_dir)
		loc = (x, y, z)

		tiles[loc] = not tiles[loc]

	for _ in range(100):
		new_tiles = tiles.copy()
		targets = []
		for (x, y, z), black in tiles.items():
			targets.append((x, y, z))
			for xo, yo, zo in offsets.values():
				targets.append((x + xo, y + yo, z + zo))

		for x, y, z in targets:
			black_neighbors = 0
			for xo, yo, zo in offsets.values():
				black_neighbors += tiles[(x + xo, y + yo, z + zo)]
			if tiles[(x, y, z)]:
				if black_neighbors == 0 or black_neighbors > 2:
					new_tiles[(x, y, z)] = False
			else:
				if black_neighbors == 2:
					new_tiles[(x, y, z)] = True

		tiles = new_tiles

	return sum(black for black in tiles.values())

def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew''') == 2208
	print(solve_two(data))
