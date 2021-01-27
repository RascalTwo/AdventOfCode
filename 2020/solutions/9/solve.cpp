#include <assert.h>

#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <numeric>
#include <iterator>
#include <algorithm>



bool isValid(std::vector<int> numbers, int start, int end, int goal){
	for (int i = start; i < end; i++){
		for (int j = i + 1; j < end; j++){
			if (numbers[i] + numbers[j] == goal) return true;
		}
	}
	return false;
}


int findRuleBreaker(std::vector<int> numbers, int preableLength){
	for (int i = preableLength; i < numbers.size(); i++){
		if (!isValid(numbers, i - preableLength, i, numbers[i])){
			return numbers[i];
		}
	}


	return 0;
}


std::vector<int> parseInput(const std::string input){
	std::stringstream is(input);
	return std::vector<int>(
		std::istream_iterator<int>(is),
		std::istream_iterator<int>()
	);
}


int solve_one(const std::string input, int preambleLength){
	return findRuleBreaker(parseInput(input), preambleLength);
}


int solve_two(const std::string input, int preambleLength){
	std::vector<int> numbers = parseInput(input);
	int found = findRuleBreaker(numbers, preambleLength);

	for (int i = 0; i < numbers.size(); i++){
		for (int j = i + 2; j < numbers.size(); j++){
			std::vector<int> considering;

			int sum = 0;
			for (int n = i; n <= j; n++){
				considering.push_back(numbers[n]);
				sum += numbers[n];
			}
			std::sort(considering.begin(), considering.end());
			if (sum < found) continue;
			else if (sum > found) break;

			return considering[0] + considering[considering.size()-1];
		}
	}

	return 0;
}



std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one(R"""(35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576)""", 5) == 127);
	std::cout << solve_one(input, 25) << std::endl;

	assert (solve_two(R"""(35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576)""", 5) == 62);
	std::cout << solve_two(input, 25) << std::endl;

	return 0;
}
