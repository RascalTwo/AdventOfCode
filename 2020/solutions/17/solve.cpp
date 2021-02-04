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
#include <math.h>
#include <numeric>
#include <cstdlib>
#include <climits>
#include <stdlib.h>
#include <regex>
#include <sstream>
#include <iomanip>
#include <stdint.h>



using Input = std::map<std::vector<int>, char>;


Input parseInput(const std::string input, const int dimensions){
	std::istringstream stream(input);

	Input world;

	int row = 0;
	std::string line;
	while (std::getline(stream, line)){
		for (int col = 0; col < line.size(); col++){
			std::vector<int> point(dimensions);
			point[dimensions-2] = row;
			point[dimensions-1] = col;
			world[point] = line[col];
		}
		row++;
	}

	return world;
}


std::vector<std::vector<int>> cartesianProduct(std::vector<std::vector<int>> &values){
	auto product = [](long long a, std::vector<int>& b) {
		return a * b.size();
	};
  const long long N = std::accumulate(values.begin(), values.end(), 1LL, product);
  std::vector<int> result(values.size());

	std::vector<std::vector<int>> results;
  for(long long n = 0; n < N; ++n){
    lldiv_t q { n, 0 };
    for(long long i = values.size() - 1; 0 <= i; --i){
      q = div(q.quot, values[i].size());
      result[i] = values[i][q.rem];
    }
		results.push_back(result);
  }

	return results;
}


std::vector<std::vector<int>> getNeighborPoints(std::vector<int> point){
	std::vector<std::vector<int>> dimensionOffsets;
	for (int i = 0; i < point.size(); i++){
		dimensionOffsets.push_back({-1, 0, 1});
	}

	std::vector<std::vector<int>> offsets = cartesianProduct(dimensionOffsets);

	std::vector<std::vector<int>> points;
	for (std::vector<int> offset : offsets){
		std::vector<int> newPoint;
		for (int i = 0; i < point.size(); i++){
			newPoint.push_back(point[i] + offset[i]);
		}
		points.push_back(newPoint);
	}
	points.erase(std::find(points.begin(), points.end(), point));
	return points;
}


int long solve(const std::string input, const int dimensions){
	Input world = parseInput(input, dimensions);

	for (int _ = 0; _ < 6; _++){
		Input nextWorld = world;

		std::vector<std::vector<int>> values;
		for (int i = 0; i < dimensions; i++){
			std::vector<int> currentValues;
			for (auto &[point, _] : world){
				currentValues.push_back(point[i]);
			}
			values.push_back(currentValues);
		}

		std::vector<std::vector<int>> dimensionsPossibles;
		for (int i = 0; i < dimensions; i++){
			std::vector<int> dimensionValues = values[i];
			int least = (*std::min_element(dimensionValues.begin(), dimensionValues.end())) - 2;
			int most = (*std::max_element(dimensionValues.begin(), dimensionValues.end())) + 2;

			std::vector<int> possible;
			for (int i = least; i <= most; i++){
				possible.push_back(i);
			}
			dimensionsPossibles.push_back(possible);
		}

		std::vector<std::vector<int>> points = cartesianProduct(dimensionsPossibles);
		for (std::vector<int> point : points){
			std::vector<std::vector<int>> neighborPoints = getNeighborPoints(point);
			int active = 0;
			for (std::vector<int> neighbor : neighborPoints){
				active += world.count(neighbor) && world[neighbor] == '#';
			}

			char current = world.count(point) ? world[point] : '.';
			if (current == '#' && (active < 2 || active > 3)){
				nextWorld[point] = '.';
			}
			else if (current == '.' && active == 3){
				nextWorld[point] = '#';
			}
		}

		world = nextWorld;
	}

	int active = 0;
	for (auto &[_, value] : world){
		active += value == '#';
	}
	return active;
}

int long solve_one(const std::string input){
	return solve(input, 3);
}


int long solve_two(const std::string input){
	return solve(input, 4);
}


std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one(R"""(.#.
..#
###)""") == 112);
	std::cout << solve_one(input) << std::endl;


	assert (solve_two(R"""(.#.
..#
###)""") == 848);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
