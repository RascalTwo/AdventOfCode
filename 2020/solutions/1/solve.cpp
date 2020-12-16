#include <assert.h>

#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <numeric>
#include <iterator>



std::vector<int> findSum(const std::vector<int> &numbers, const int start, const int depth, const int sum){
	for (int i = start; i < numbers.size(); i++){
		if (depth == 1){
				if (numbers[i] == sum) return { sum };
				continue;
		}

		int nextSum = sum - numbers[i];
		if (nextSum <= 0) continue;

		std::vector<int> found = findSum(numbers, i + 1, depth - 1, nextSum);
		if (found.empty()) continue;

		found.push_back(numbers[i]);
		return found;
	}

	return {};
}


std::vector<int> parseInput(const std::string input){
	std::stringstream is(input);
	return std::vector<int>(
		std::istream_iterator<int>(is),
		std::istream_iterator<int>()
	);
}


int solve(const std::string input, const int count){
	auto found = findSum(parseInput(input), 0, count, 2020);
	return accumulate(found.begin(), found.end(), 1, std::multiplies<int>());
}


int solve_one(const std::string input){
	return solve(input, 2);
}


int solve_two(const std::string input){
	return solve(input, 3);
}



std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one("1721\n979\n366\n299\n675\n1456") == 514579);
	std::cout << solve_one(input) << std::endl;

	assert (solve_two("1721\n979\n366\n299\n675\n1456") == 241861950);
	std::cout << solve_two(input) << std::endl;
	return 0;
}
