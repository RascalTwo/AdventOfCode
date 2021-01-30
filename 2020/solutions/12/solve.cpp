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



std::vector<std::pair<char, int>> parseInput(const std::string input){
	std::stringstream is(input);

	std::vector<std::pair<char, int>> commands;

	std::string line;
	while (std::getline(is, line)){
		commands.push_back({line[0], std::stoi(line.substr(1))});
	}

	return commands;
}


void addSequences(int target[2], std::vector<int> adding, int multiple){
	target[0] += adding[0] * multiple;
	target[1] += adding[1] * multiple;
}

void addSequences(int target[2], int adding[2], int multiple){
	target[0] += adding[0] * multiple;
	target[1] += adding[1] * multiple;
}


std::map<char, std::vector<int>> DIRECTIONS = {
	{'N', {0, 1}},
	{'E', {1, 0}},
	{'S', {0, -1}},
	{'W', {-1, 0}}
};
std::vector<char> ROTATIONS = {'N', 'E', 'S', 'W'};


int solve_one(const std::string input){
	int ship[] = {0, 0};
	char direction = 'E';

	for (auto &[command, argument] : parseInput(input)){
		if (command == 'F' || DIRECTIONS.count(command)){
			addSequences(ship, DIRECTIONS[command == 'F' ? direction : command], argument);
		}
		else if (command == 'L' || command == 'R'){
			std::vector<char>::iterator iter = std::find(ROTATIONS.begin(), ROTATIONS.end(), direction);
			int index = iter - ROTATIONS.begin();
			direction = ROTATIONS[
				(index + (argument / 90) * (command == 'L' ? -1 : 1)) % ROTATIONS.size()
			];
		}
	}

	return abs(ship[0]) + abs(ship[1]);
}


unsigned int solve_two(const std::string input){
	int ship[] = {0, 0};
	int waypoint[] = {10, 1};

	for (auto &[command, argument] : parseInput(input)){
		if (command == 'F'){
			addSequences(ship, waypoint, argument);
		}
		else if (DIRECTIONS.count(command)){
			addSequences(waypoint, DIRECTIONS[command], argument);
		}
		else if (command == 'L' || command == 'R'){
			int invertingIndex = command == 'R';
			for (int i = 0; i < argument; i += 90){
				int temp = waypoint[0];
				waypoint[0] = waypoint[1];
				waypoint[1] = temp;

				waypoint[invertingIndex] *= -1;
			}
		}
	}

	return abs(ship[0]) + abs(ship[1]);
}



std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}


int main(){
	std::string input = loadInput();

	assert (solve_one(R"""(F10
N3
F7
R90
F11)""") == 25);
	std::cout << solve_one(input) << std::endl;

	assert (solve_two(R"""(F10
N3
F7
R90
F11)""") == 286);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
