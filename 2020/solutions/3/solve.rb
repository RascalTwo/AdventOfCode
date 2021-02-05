def solve(matrix, xo, yo)
  x = 0
  y = 0
  trees = 0
  while y < matrix.length - 1 do
    x = (x + xo) % matrix[y].length
    y += yo
    trees += matrix[y][x] == '#' ? 1 : 0
  end
  trees
end

def parse_data(data)
  lines = data.split("\n")
  lines.each_with_index do |line, index|
    lines[index] = line.split('')
  end
end

def solve_one(data)
  solve(parse_data(data), 3, 1)
end

def solve_two(data)
  matrix = parse_data(data)
  [
    solve(matrix, 1, 1),
    solve(matrix, 3, 1),
    solve(matrix, 5, 1),
    solve(matrix, 7, 1),
    solve(matrix, 1, 2),
  ].inject(:*)
end

data = nil
File.open('input.in') do |input|
  data = input.read
end

test_data = """..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#"""

result = solve_one(test_data)
raise "Expected 7, got #{result}" unless result == 7
puts solve_one(data)

result = solve_two(test_data)
raise "Expected 336, got #{result}" unless result == 336
puts solve_two(data)