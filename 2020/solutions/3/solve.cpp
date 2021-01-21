#include <assert.h>

#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <numeric>



using Map = std::vector<std::vector<char>>;


unsigned int solve(const Map map, const int xOffset, const int yOffset){
	unsigned int x = 0;
	unsigned int y = 0;
	unsigned int trees = 0;
	while (y < map.size() - 1){
		x = (x + xOffset) % map[y].size();
		y += yOffset;

		trees += map[y][x] == '#';
	}

	return trees;
}


Map parseInput(const std::string input){
	Map map;

	std::istringstream stream(input);
	std::string line;
	while(std::getline(stream, line)){
		map.push_back(std::vector<char>(line.begin(), line.end()));
	}

	return map;
}


unsigned int solve_one(const std::string input){
	return solve(parseInput(input), 3, 1);
}


unsigned int solve_two(const std::string input){
	Map map = parseInput(input);
	unsigned int values[] = {
		solve(map, 1, 1),
		solve(map, 3, 1),
		solve(map, 5, 1),
		solve(map, 7, 1),
		solve(map, 1, 2)
	};

	return std::accumulate(values, values + 5, 1, std::multiplies<int>());
}


std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(
		std::istreambuf_iterator<char>(file),
		std::istreambuf_iterator<char>()
	);
}


int main(){
	const std::string input = loadInput();

	assert (solve_one(R"""(..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#)""") == 7);
	std::cout << solve_one(input) << std::endl;

	assert (solve_two(R"""(..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#)""") == 336);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
