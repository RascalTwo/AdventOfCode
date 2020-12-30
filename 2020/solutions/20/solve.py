import os
import re
import math
import itertools

from typing import Dict, List, MutableSequence, Optional, Tuple, TypeVar



DIRPATH = os.path.dirname(os.path.abspath(__file__))


T = TypeVar('T')
Matrix = List[List[T]]


def rotate_matrix_right(m: Matrix[T]) -> Matrix[T]:
	"""
	>>> rotate_matrix_right([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']])
	[['G', 'D', 'A'], ['H', 'E', 'B'], ['I', 'F', 'C']]
	>>> rotate_matrix_right([['A', 'B'], ['D', 'E']])
	[['D', 'A'], ['E', 'B']]
	"""
	return [list(row) for row in zip(*m[::-1])]


def rotate_matrix_left(m: Matrix[T]) -> Matrix[T]:
	"""
	>>> rotate_matrix_left([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']])
	[['C', 'F', 'I'], ['B', 'E', 'H'], ['A', 'D', 'G']]
	>>> rotate_matrix_left([['A', 'B'], ['D', 'E']])
	[['B', 'E'], ['A', 'D']]
	"""
	return [list(row)[::-1] for row in zip(*m[::-1])][::-1]


def flip_matrix_vertically(m: Matrix[T]) -> Matrix[T]:
	"""
	>>> flip_matrix_vertically([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']])
	[['G', 'H', 'I'], ['D', 'E', 'F'], ['A', 'B', 'C']]
	>>> flip_matrix_vertically([['A', 'B'], ['D', 'E']])
	[['D', 'E'], ['A', 'B']]
	"""
	return m[::-1]


def flip_matrix_horizontally(m: Matrix[T]) -> Matrix[T]:
	"""
	>>> flip_matrix_horizontally([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']])
	[['C', 'B', 'A'], ['F', 'E', 'D'], ['I', 'H', 'G']]
	>>> flip_matrix_horizontally([['A', 'B'], ['D', 'E']])
	[['B', 'A'], ['E', 'D']]
	"""
	return [list(reversed(row)) for row in m]


def generate_matrix_variations(m: Matrix[T]) -> List[Matrix[T]]:
	left = rotate_matrix_left(m)
	right = rotate_matrix_right(m)
	return [
		m,
		left,
		right,
		rotate_matrix_right(right),
		flip_matrix_horizontally(m),
		flip_matrix_vertically(m),
		flip_matrix_horizontally(left),
		flip_matrix_horizontally(right)
	]


def get_matrix_column(m: Matrix[T], i: int) -> List[T]:
	return [row[i] for row in m]


def is_valid(image: List[List[Optional[Matrix[T]]]], size: int):
	for i, j in itertools.product(range(size), range(size)):
		current = image[i][j]
		if current is None:
			continue

		if i and (other := image[i - 1][j]) and current[0] != other[-1]:
			return False
		elif i != size - 1 and (other := image[i + 1][j]) and current[-1] != other[0]:
			return False
		elif j and (other := image[i][j - 1]) and get_matrix_column(current, 0) != get_matrix_column(other, -1):
			return False
		elif j != size - 1 and (other := image[i][j + 1]) and get_matrix_column(current, -1) != get_matrix_column(other, 0):
			return False

	return True


def parse_input(data: str) -> Dict[int, Matrix[str]]:
	return {
		int(full_tile.split('Tile ')[1].split(':')[0]): list(map(list, full_tile.split(':\n')[1].strip().split('\n')))  # type: ignore
		for full_tile in data.split('\n\n')
	}


def get_tile_types(tiles: Dict[int, Matrix[T]]) -> Tuple[List[int], List[int], List[int]]:
	tile_edges = {
		tile: set(tuple(edge) for edge in (
			m[0], m[0][::-1],
			m[-1], m[-1][::-1],
			rotated[0], rotated[0][::-1],
			rotated[-1], rotated[-1][::-1],
		))
		for tile, m in tiles.items()
		if (rotated := rotate_matrix_right(m))
	}

	corners = []
	edges = []
	middles = []
	for tile, t_edges in tile_edges.items():
		(corners, edges, middles)[
			int(((len(set().union(*(
					t_edges.intersection(o_edges)
					for other, o_edges in tile_edges.items()
					if tile != other
			))) - 2) / 2) - 1)
		].append(tile)

	return corners, edges, middles


def solve_one(data: str):
	return math.prod(get_tile_types(parse_input(data))[0])


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


def try_tiles_in_image(image: List[List[Optional[Matrix[str]]]], size: int, i: int, j: int, tile_ids: MutableSequence[int], tiles: Dict[int, Matrix[str]]):
	for eid in tile_ids:
		for e_variation in generate_matrix_variations(tiles[eid]):
			image[i][j] = e_variation
			if not is_valid(image, size):
				image[i][j] = None
				continue
			tile_ids.remove(eid)
			return True
	return False


def solve_two(data: str):
	tiles = parse_input(data)
	corners, edges, middles = get_tile_types(tiles)

	size = int(math.sqrt(len(tiles)))
	corner_locs = set([(0,0), (size - 1, size - 1), (0, size - 1), (size - 1, 0)])
	edge_locs = set(edge_loc for edge_loc in (
		*((0, i) for i in range(size)),
		*((i, 0) for i in range(size)),
		*((size - 1, i) for i in range(size)),
		*((i, size - 1) for i in range(size))
	) if edge_loc not in corner_locs)

	image: Matrix[Optional[Matrix[str]]] = [[None] * size for _ in range(size)]

	corner_tile = tiles[corners.pop(0)]
	corner_edges = edges[:]
	for c_variation in generate_matrix_variations(corner_tile):
		image[0][0] = c_variation
		if all(try_tiles_in_image(image, size, i, j, corner_edges, tiles) for i, j in ((1, 0), (0, 1))):
			break

		corner_edges = edges[:]
	edges = corner_edges


	for i, j in itertools.product(range(size), repeat=2):
		if image[i][j]:
			continue

		loc = (i, j)
		possible = (corners, edges, middles)[
			0 if loc in corner_locs else 1 if loc in edge_locs else 2
		]

		try_tiles_in_image(image, size, i, j, possible, tiles)


	for img_row in image:
		for matrix in img_row:
			del matrix[0]
			del matrix[-1]
			for row in matrix:
				del row[0]
				del row[-1]

	full_size = len(image[0][0]) * size
	full_image = [[] * full_size for _ in range(full_size)]

	tile_size = len(image[0][0])
	for i, tile_row in enumerate(image):
		for matrix in tile_row:
			for j, row in enumerate(matrix):
				full_image[(i * tile_size) + j] += row


	regexes = [
		'..................#.',
		'#....##....##....###',
		'.#..#..#..#..#..#...'
	]
	regexes_width = len(regexes[0])
	rows = full_size - len(regexes) - 1
	columns = full_size - regexes_width

	roughest = 0
	most_monsters = 0
	for variation in generate_matrix_variations(full_image):
		monsters = 0
		for i, j in itertools.product(range(rows), range(columns)):
			start = None
			for l, regex in enumerate(regexes):
				match = re.search(regex, ''.join(variation[i + l][j:j + regexes_width]))
				if not match:
					start = None
					break

				if l == 0:
					start = match.start()
					continue

				if match.start() != start:
					start = None
					break

			if start is not None:
				monsters += 1

		if monsters > most_monsters:
			most_monsters = monsters
			roughest = -15 * monsters + sum(row.count('#') for row in variation)

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
