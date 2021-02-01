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


Segments parseInput(const std::string input){
	std::istringstream stream(input);

	std::regex regex("mem\\[(\\d+)\\] = (\\d+)");


	Segments segments;
	std::vector<std::pair<int, int>> assignments;

	std::string mask;
	std::string line;
	while (std::getline(stream, line)){
		if (line.rfind("mask = ", 0) == 0){
			if (assignments.size()){
				segments.push_back({mask, assignments});
				assignments = std::vector<std::pair<int, int>>();
			}
			mask = line.substr(7);
			continue;
		}
		std::smatch match;
		std::regex_search(line, match, regex);
		assignments.push_back({std::stoi(match[1].str()), std::stoi(match[2].str())});
	}
	if (assignments.size()) segments.push_back({mask, assignments});

	return segments;
}



int long solve_one(const std::string input){
	Segments segments = parseInput(input);
	std::map<int long, int long> registers;
	for (auto &[mask, assignments] : segments){
		for (auto &[key, value] : assignments){
			std::stringstream stream;
			stream << std::setw(36) << std::setfill('0') << value;
			std::string strValue = stream.str();
			strValue = std::bitset<36>(value).to_string();

			std::string newValue;
			for (int i = 0; i < mask.size(); i++){
				char maskBit = mask[i];
				if (maskBit != 'X'){
					newValue += maskBit;
					continue;
				}

				newValue += i >= strValue.size() ? '0' : strValue[i];
			}

			int long intValue = std::stol(newValue, 0, 2);
			registers[key] = intValue;
		}
	}

	int long sum;
	for (auto &[_, value] : registers){
		sum += value;
	}
	return sum;
}


std::vector<std::string> generatePossibleBinaryValues(std::string start){
	std::vector<std::string> keys;
	keys.push_back(start);

	for (int i = 0; i < start.length(); i++){
		char current = start[i];
		if (current != 'X'){
			for (std::string key : keys){
				key[i] = current;
			}
			continue;
		}

		std::vector<std::string> newKeys;
		for (std::string key : keys){
			for (char value : {'1', '0'}){
				std::string newKey(key);
				newKey[i] = value;
				newKeys.push_back(newKey);
			}
		}

		keys = newKeys;
	}

	return keys;
}


int long solve_two(const std::string input){
	Segments segments = parseInput(input);
	std::map<int long, int long> registers;
	for (auto &[mask, assignments] : segments){
		for (auto &[key, value] : assignments){
			std::stringstream stream;
			stream << std::setw(36) << std::setfill('0') << key;
			std::string strKey = stream.str();
			strKey = std::bitset<36>(key).to_string();

			std::string newKey;
			for (int i = 0; i < mask.size(); i++){
				char maskBit = mask[i];
				if (maskBit != '0'){
					newKey += maskBit;
					continue;
				}

				newKey += i >= strKey.size() ? maskBit : strKey[i];
			}

			for (std::string possible : generatePossibleBinaryValues(newKey)){
				registers[std::stol(possible, 0, 2)] = value;
			}
		}
	}

	int long sum = 0;
	for (auto &[_, value] : registers){
		sum += value;
	}
	return sum;
}


std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one(R"""(mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0)""") == 165);
	std::cout << solve_one(input) << std::endl;


	assert (solve_two(R"""(mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1)""") == 208);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
