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



using Segments = std::vector<std::pair<std::string, std::vector<std::pair<int, int>>>>;


std::vector<int long> parseInput(const std::string input){
	std::istringstream stream(input);

	std::vector<int long> starting;

	while (stream.good()){
		std::string string;
		std::getline(stream, string, ',');
		starting.push_back(std::stol(string));
	}

	return starting;
}


int long solve(const std::string input, int long target){
	std::vector<int long> starting = parseInput(input);
	starting.insert(starting.begin(), -1);

	std::map<int long, std::deque<int long>> numbersToTurns;
	for (int long turn = 1; turn < starting.size(); turn++){
		numbersToTurns[starting[turn]] = std::deque<int long>(1, turn);
	}

	int long spoken = starting.back();
	for (int long turn = starting.size(); turn <= target; turn++){
		if (!numbersToTurns.count(spoken)){
			numbersToTurns[spoken] = std::deque<int long>(1, turn);
		}

		if (numbersToTurns[spoken].size() == 1){
			spoken = 0;
		}
		else{
			std::deque<int long> deque = numbersToTurns[spoken];
			spoken = deque.back() - deque[0];
		}
		numbersToTurns[spoken].push_back(turn);
		if (numbersToTurns[spoken].size() == 3){
			numbersToTurns[spoken].pop_front();
		}
	}

	return spoken;
}


int long solve_one(const std::string input){
	return solve(input, 2020);
}


int long solve_two(const std::string input){
	return solve(input, 30000000);
}


std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one("0,3,6") == 436);
	std::cout << solve_one(input) << std::endl;


	assert (solve_two("0,3,6") == 175594);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
