import os

from typing import Set



DIRPATH = os.path.dirname(os.path.abspath(__file__))


DIRECTIONS = {
	'nw':  0 + -1j,
	'ne':  1 + -1j,
	'e':   1 +  0j,
	'se':  0 +  1j,
	'sw': -1 +  1j,
	'w':  -1 +  0j,
}
OFFSETS = DIRECTIONS.values()


def flip_tiles(data: str):
	black_tiles: Set[complex] = set()

	for steps in data.strip().split('\n'):
		loc = 0 + 0j

		while steps:
			dir = steps[0] + (steps[1] if steps[0] in 'sn' else '')
			loc += DIRECTIONS[dir]
			steps = steps[len(dir):]

		getattr(black_tiles, 'remove' if loc in black_tiles else 'add')(loc)

	return black_tiles


def solve_one(data: str):
	return len(flip_tiles(data))


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
	black_tiles = flip_tiles(data)

	for _ in range(100):
		black_tiles = {
			loc
			for loc in {loc for loc in black_tiles}.union(
				black + off
				for black in black_tiles
				for off in OFFSETS
			)
			if (black_neighbors := sum(loc + off in black_tiles for off in OFFSETS))
			and (
				(loc in black_tiles and black_neighbors in (1, 2))
				or (loc not in black_tiles and black_neighbors == 2)
			)
		}
		# For every black tile and neighboring tile
		#   count all the neighboring black tiles
		#   if the current tile is black and there are 1 or 2 neighboring black tiles, keep by adding
		#   else the current file is white and there are two neighboring black tiles, add

	return len(black_tiles)

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
