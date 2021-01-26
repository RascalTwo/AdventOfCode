#include <assert.h>

#include <iostream>
#include <fstream>
#include <sstream>
#include <set>
#include <vector>



using Instructions = std::vector<std::pair<std::string, int>>;


Instructions parseInput(const std::string input){
	std::istringstream stream(input);

	Instructions instructions;

	std::string line;
	while (std::getline(stream, line)){
		int space = line.find(' ');
		instructions.push_back({line.substr(0, space), std::stoi(line.substr(space + 1))});
	}

	return instructions;
}


std::pair<int, bool> executeProgram(Instructions instructions){
	int acc = 0;
	unsigned int i = 0;
	std::set<unsigned int> executed;
	while(true){
		if (i >= instructions.size()) return {acc, false};
		if (executed.count(i)) return {acc, true};

		executed.insert(i);
		std::string op = instructions[i].first;
		int argument = instructions[i].second;
		if (op == "jmp"){
			i += argument;
			continue;
		}

		if (op == "acc"){
			acc += argument;
		}
		i++;
	}
}


int solve_one(const std::string input){
	return executeProgram(parseInput(input)).first;
}


int solve_two(const std::string input){
	Instructions instructions = parseInput(input);
	for (auto i = instructions.begin(); i != instructions.end(); ++i){
		std::string op = (*i).first;

		if (op != "jmp" && op != "nop") continue;

		int argument = (*i).second;
		*i = {op == "jmp" ? "nop" : "jmp", argument};

		std::pair<int, bool> result = executeProgram(instructions);
		if (!result.second) return result.first;

		*i = {op, argument};
	}

	return 0;
}


std::string loadInput(){
	std::ifstream file("./input.in");
	bool open = file.is_open();
	return std::string(
		std::istreambuf_iterator<char>(file),
		std::istreambuf_iterator<char>()
	);
}


int main(int argc, char *argv[]){
	std::string input = loadInput();

	assert (solve_one(R"""(nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6)""") == 5);
	std::cout << solve_one(input) << std::endl;


	assert (solve_two(R"""(nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6)""") == 8);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
