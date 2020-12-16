#include <assert.h>

#include <iostream>
#include <fstream>
#include <sstream>
#include <numeric>
#include <iterator>
#include <algorithm>
#include <set>



std::set<int> parseInput(const std::string input){
	std::stringstream is(input);

	std::set<int> values;

	std::string line;
	while(getline(is, line)){
		std::string binary;
		for (char c : line) binary += std::to_string(c == 'B' || c == 'R');
		values.insert(std::stoi(binary, nullptr, 2));
	}

	return values;
}


int solve_one(const std::string input){
	int highest = 0;
	for (int seatID : parseInput(input)) highest = seatID > highest ? seatID : highest;
	return highest;
}


int solve_two(const std::string input){
	std::set<int> seatIDs = parseInput(input);

	for (int i = *seatIDs.begin() + 1; i < *seatIDs.end() - 1; i++){
		if (!seatIDs.count(i) && seatIDs.count(i - 1) && seatIDs.count(i + 1)) return i;
	}

	return -1;
}


std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one("FBFBBFFRLR") == 357);
	std::cout << solve_one(input) << std::endl;

	std::cout << solve_two(input) << std::endl;
	return 0;
}
