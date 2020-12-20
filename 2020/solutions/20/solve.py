import os
import re
import math
import itertools
import collections

from typing import DefaultDict, Dict, List, Optional, Set, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


Matrix = List[List[str]]

def rotate_matrix_right(m: Matrix) -> Matrix:
	"""
	>>> rotate_matrix_right([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']])
	[['G', 'D', 'A'], ['H', 'E', 'B'], ['I', 'F', 'C']]
	>>> rotate_matrix_right([['A', 'B'], ['D', 'E']])
	[['D', 'A'], ['E', 'B']]
	"""
	return [list(row) for row in zip(*m[::-1])]

def rotate_matrix_left(m: Matrix) -> Matrix:
	"""
	>>> rotate_matrix_left([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']])
	[['C', 'F', 'I'], ['B', 'E', 'H'], ['A', 'D', 'G']]
	>>> rotate_matrix_left([['A', 'B'], ['D', 'E']])
	[['B', 'E'], ['A', 'D']]
	"""
	return [list(row)[::-1] for row in zip(*m[::-1])][::-1]

def flip_matrix_vertically(m: Matrix) -> Matrix:
	"""
	>>> flip_matrix_vertically([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']])
	[['G', 'H', 'I'], ['D', 'E', 'F'], ['A', 'B', 'C']]
	>>> flip_matrix_vertically([['A', 'B'], ['D', 'E']])
	[['D', 'E'], ['A', 'B']]
	"""
	return m[::-1]

def flip_matrix_horizontally(m: Matrix) -> Matrix:
	"""
	>>> flip_matrix_horizontally([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']])
	[['C', 'B', 'A'], ['F', 'E', 'D'], ['I', 'H', 'G']]
	>>> flip_matrix_horizontally([['A', 'B'], ['D', 'E']])
	[['B', 'A'], ['E', 'D']]
	"""
	return [list(reversed(row)) for row in m]


def generate_matrix_variations(m: Matrix) -> List[Matrix]:
	variations = []
	for combo in itertools.permutations((rotate_matrix_left, rotate_matrix_right, flip_matrix_vertically, flip_matrix_horizontally)):
		new_m = m
		for method in combo:
			new_m = method(new_m)
			if new_m not in variations:
				variations.append(new_m)
		if new_m not in variations:
			variations.append(new_m)
	return variations

def get_matrix_column(m: Matrix, c: int):
	return [row[c] for row in m]

def is_valid(image: List[List[Optional[Matrix]]]):
	for i in range(len(image)):
		for j in range(len(image[i])):
			current = image[i][j]
			if current is None:
				continue

			if i:
				if (other := image[i - 1][j]) and current[0] != other[-1]:
					return False
			if i != len(image)-1:
				if (other := image[i + 1][j]) and current[-1] != other[0]:
					return False
			if j:
				if (other := image[i][j - 1]) and get_matrix_column(current, 0) != get_matrix_column(other, -1):
					return False
			if j != len(image[i]) - 1:
				if (other := image[i][j + 1]) and get_matrix_column(current, -1) != get_matrix_column(other, 0):
					return False

	return True

def solve_one(data: str):
	tiles: Dict[int, Matrix] = {
		int(full_tile.split('Tile ')[1].split(':')[0]): list(map(list, full_tile.split(':\n')[1].strip().split('\n')))
		for full_tile in data.split('\n\n')
	}
	tile_edges: DefaultDict[int, Set[Tuple[str]]] = collections.defaultdict(lambda: set())
	for tile, m in tiles.items():
		rotated = rotate_matrix_right(m)
		tile_edges[tile].update(tuple(edge) for edge in (
			m[0], m[0][::-1],
			m[-1], m[-1][::-1],
			rotated[0], rotated[0][::-1],
			rotated[-1], rotated[-1][::-1],
		))

	corners: List[int] = []
	edges: List[int] = []
	rest: List[int] = []
	for tile, t_edges in tile_edges.items():
		shared = set()
		for other_t, other_edges in tile_edges.items():
			if tile == other_t:
				continue
			shared.update(t_edges.intersection(other_edges))
		(corners, edges, rest)[int(((len(shared)-2)/2)-1)].append(tile)

	size = int(math.sqrt(len(tiles)))

	corner_locs = set([(0,0), (size - 1, size - 1), (0, size - 1), (size - 1, 0)])
	edge_locs = set([
		*((0, i) for i in range(size)),
		*((i, 0) for i in range(size)),
		*((size - 1, i) for i in range(size)),
		*((i, size - 1) for i in range(size))
	])
	edge_locs = list(filter(lambda edge_loc: edge_loc not in corner_locs, edge_locs))
	image: List[List[Optional[Matrix]]] = []
	for _ in range(size):
		image.append([None] * size)

	orig_corners = corners[:]
	corner_tile = tiles[corners.pop(0)]
	for c_variation in generate_matrix_variations(corner_tile):
		corner_edges = edges[:]
		image[0][0] = c_variation
		for ni, nj in ((1, 0), (0, 1)):
			done = False
			for pid in corner_edges:
				for n_variation in generate_matrix_variations(tiles[pid]):
					image[ni][nj] = n_variation
					if is_valid(image):
						corner_edges.remove(pid)
						done = True
						break
					image[ni][nj] = None
				if done:
					break
				if all(image[ni][nj] for ni, nj in ((0, 1), (1, 0))):
					break
			if all(image[ni][nj] for ni, nj in ((0, 1), (1, 0))):
				break
		if all(image[ni][nj] for ni, nj in ((0, 1), (1, 0))):
			break

	assert all(image[ni][nj] for ni, nj in ((0, 1), (1, 0))), 'Corner not filled'

	edges = corner_edges

	for i in range(size):
		for j in range(size):
			if image[i][j]:
				continue
			loc = (i, j)
			possible = (corners, edges, rest)[0 if loc in corner_locs else 1 if loc in edge_locs else 2]
			done = False
			for pid in possible:
				for variation in generate_matrix_variations(tiles[pid]):
					image[i][j] = variation
					if is_valid(image):
						possible.remove(pid)
						done = True
						break
					image[i][j] = None
				if done:
					break
	assert is_valid(image)
	return math.prod(orig_corners)



def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...''') == 20899048083289
	print(solve_one(data))



def shrink_matrix(m: Matrix):
	del m[0]
	del m[-1]
	for row in m:
		del row[0]
		del row[-1]

def solve_two(data: str):
	tiles: Dict[int, Matrix] = {
		int(full_tile.split('Tile ')[1].split(':')[0]): list(map(list, full_tile.split(':\n')[1].strip().split('\n')))
		for full_tile in data.split('\n\n')
	}
	tile_edges: DefaultDict[int, Set[Tuple[str]]] = collections.defaultdict(lambda: set())
	for tile, m in tiles.items():
		rotated = rotate_matrix_right(m)
		tile_edges[tile].update(tuple(edge) for edge in (
			m[0], m[0][::-1],
			m[-1], m[-1][::-1],
			rotated[0], rotated[0][::-1],
			rotated[-1], rotated[-1][::-1],
		))

	corners: List[int] = []
	edges: List[int] = []
	rest: List[int] = []
	for tile, t_edges in tile_edges.items():
		shared = set()
		for other_t, other_edges in tile_edges.items():
			if tile == other_t:
				continue
			shared.update(t_edges.intersection(other_edges))
		(corners, edges, rest)[int(((len(shared)-2)/2)-1)].append(tile)

	size = int(math.sqrt(len(tiles)))

	corner_locs = set([(0,0), (size - 1, size - 1), (0, size - 1), (size - 1, 0)])
	edge_locs = set([
		*((0, i) for i in range(size)),
		*((i, 0) for i in range(size)),
		*((size - 1, i) for i in range(size)),
		*((i, size - 1) for i in range(size))
	])
	edge_locs = list(filter(lambda edge_loc: edge_loc not in corner_locs, edge_locs))
	image: List[List[Optional[Matrix]]] = []
	for _ in range(size):
		image.append([None] * size)

	corner_tile = tiles[corners.pop(0)]
	for c_variation in generate_matrix_variations(corner_tile):
		corner_edges = edges[:]
		image[0][0] = c_variation
		for ni, nj in ((1, 0), (0, 1)):
			done = False
			for pid in corner_edges:
				for n_variation in generate_matrix_variations(tiles[pid]):
					image[ni][nj] = n_variation
					if is_valid(image):
						corner_edges.remove(pid)
						done = True
						break
					image[ni][nj] = None
				if done:
					break
				if all(image[ni][nj] for ni, nj in ((0, 1), (1, 0))):
					break
			if all(image[ni][nj] for ni, nj in ((0, 1), (1, 0))):
				break
		if all(image[ni][nj] for ni, nj in ((0, 1), (1, 0))):
			break

	assert all(image[ni][nj] for ni, nj in ((0, 1), (1, 0))), 'Corner not filled'

	edges = corner_edges

	for i in range(size):
		for j in range(size):
			if image[i][j]:
				continue
			loc = (i, j)
			possible = (corners, edges, rest)[0 if loc in corner_locs else 1 if loc in edge_locs else 2]
			done = False
			for pid in possible:
				for variation in generate_matrix_variations(tiles[pid]):
					image[i][j] = variation
					if is_valid(image):
						possible.remove(pid)
						done = True
						break
					image[i][j] = None
				if done:
					break

	for row in image:
		for matrix in row:
			assert matrix

	for row in image:
		for matrix in row:
			shrink_matrix(matrix)

	full_image = []
	char_size = len(image[0][0]) * size
	for _ in range(char_size):
		full_image.append([] * char_size)

	for i, tile_row in enumerate(image):
		for _, matrix in enumerate(tile_row):
			for j, mrow in enumerate(matrix):
				full_image[(i * len(image[0][0])) + j] += mrow

	regexes = [
		'.{18}#.',
		'#.{4}##.{4}##.{4}###',
		'.#.{2}#.{2}#.{2}#.{2}#.{2}#...'
	]
	roughest = 0
	most_monsters = []
	monsters = []
	for variation in generate_matrix_variations(full_image):
		for i in range(len(variation) - 2):
			for j in range(len(variation[i]) - 20):
				if not (start := re.search(regexes[0], ''.join(variation[i][j:j+20]))):
					continue
				if not (middle := re.search(regexes[1], ''.join(variation[i + 1][j:j+20]))) or middle.start() != start.start():
					continue
				if not (end := re.search(regexes[2], ''.join(variation[i + 2][j:j+20]))) or end.start() != start.start():
					continue
				monsters.append((i, j))
		if len(monsters) > len(most_monsters):
			most_monsters = monsters
			roughest = -15 * len(monsters)
			for row in variation:
				roughest += row.count('#')

	return roughest


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...''') == 273
	print(solve_two(data))
