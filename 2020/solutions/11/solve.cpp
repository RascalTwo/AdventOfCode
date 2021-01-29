#include <assert.h>

#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <numeric>
#include <iterator>
#include <algorithm>
#include <map>
#include <set>
#include <functional>



using Matrix = std::vector<std::vector<char>>;


Matrix parseInput(const std::string input){
	std::stringstream is(input);

	Matrix matrix;

	std::string line;
	while (std::getline(is, line)){
		std::vector<char> row;
		for (char cell : line){
			row.push_back(cell);
		}
		matrix.push_back(row);
	}

	return matrix;
}


bool findVisibleTarget(Matrix matrix, int x, int y, int searchDistance, std::function<bool (std::vector<char> visited)> stopper){
	std::vector<char> visible;
	for (int xo = -1; xo <= 1; xo++){
		for (int yo = -1; yo <= 1; yo++){
			if (xo == yo && xo == 0) continue;

			for (int i = 1; i <= searchDistance; i++){
				int nx = x + (i * xo);
				int ny = y + (i * yo);
				if (nx < 0 || nx >= matrix.size() || ny < 0 || ny >= matrix[x].size()) break;

				char cell = matrix[nx][ny];
				if (cell == '.') continue;
				visible.push_back(cell);
				if (stopper(visible)) return true;
				break;
			}
		}
	}

	return false;
}


Matrix processMatrix(Matrix matrix, int searchDistance, int maxOccupiedSearsToEmpty){
	Matrix nextMatrix;
	for (int x = 0; x < matrix.size(); x++){
		std::vector<char> nextRow;

		std::vector<char> row = matrix[x];
		for (int y = 0; y < row.size(); y++){
			char nextCell;

			char cell = row[y];
			if (cell == '.'){
				nextCell = '.';
			}
			else{
				std::function<bool (std::vector<char> visited)> stopper;
				if (cell == 'L') stopper = [](std::vector<char> visible) -> bool{
					for (char cell : visible){
						if (cell == '#') return true;
					}
					return false;
				};
				else stopper = [&](std::vector<char> visible) -> bool{
					int occupied = 0;
					for (char cell : visible){
						occupied += cell == '#';
					}
					return occupied == maxOccupiedSearsToEmpty;
				};
				nextCell = findVisibleTarget(matrix, x, y, searchDistance, stopper) ? 'L' : '#';
			}

			nextRow.push_back(nextCell);
		}

		nextMatrix.push_back(nextRow);
	}

	return nextMatrix;
}


int solve(const std::string input, int searchDistance, int maxOccupiedSeatsToEmpty){
	Matrix matrix = parseInput(input);
	while (true){
		Matrix nextMatrix = processMatrix(matrix, searchDistance, maxOccupiedSeatsToEmpty);
		int equalCount = 0;
		for (int i = 0; i < matrix.size(); i++){
			equalCount += matrix[i] == nextMatrix[i];
		}
		if (equalCount == matrix.size()) break;
		matrix = nextMatrix;
	}

	int occupied = 0;
	for (std::vector<char> row : matrix){
		for (char cell : row){
			occupied += cell == '#';
		}
	}
	return occupied;
}


int solve_one(const std::string input){
	return solve(input, 1, 4);
}


unsigned int solve_two(const std::string input){
	// 99 = max rows/cols
	return solve(input, 99, 5);
}



std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one(R"""(L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL)""") == 37);
	std::cout << solve_one(input) << std::endl;

	assert (solve_two(R"""(L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL)""") == 26);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
