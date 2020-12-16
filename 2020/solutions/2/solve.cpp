#include <assert.h>

#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <numeric>
#include <iterator>
#include <tuple>


using PasswordInfo = std::tuple<std::tuple<int, int>, char, std::string>;


std::vector<PasswordInfo> parseInput(const std::string input){
	std::stringstream is(input);

	std::vector<PasswordInfo> results;

	int first = 0;
	while (is >> first){
		int second = 0;
		char character = ' ';
		std::string password;
		is.ignore(1, '-');
		is >> second >> character;
		is.ignore(1, ':');
		is >> password;
		results.push_back({{first, second}, character, password});
	}
	return results;
}


template<typename F>
int solve(const std::string input, F isValid){
	std::vector<PasswordInfo> passwords = parseInput(input);
	unsigned int count = 0;
	for (PasswordInfo password : passwords){
		count += isValid(std::get<0>(password), std::get<1>(password), std::get<2>(password));
	}
	return count;
}


int solve_one(const std::string input){
	return solve(input, [](const std::tuple<int, int> minmax, char letter, std::string password){
		unsigned int count = 0;
		for (char c : password) count += c == letter;
		return std::get<0>(minmax) <= count && count <= std::get<1>(minmax);
	});
}


int solve_two(const std::string input){
	return solve(input, [](const std::tuple<int, int> positions, char letter, std::string password){
		unsigned int count = 0;
		count += password[std::get<0>(positions)-1] == letter;
		count += password[std::get<1>(positions)-1] == letter;
		return count == 1;
	});
}



std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(
		std::istreambuf_iterator<char>(file),
		std::istreambuf_iterator<char>()
	);
}


int main(){
	std::string input = loadInput();

	assert (solve_one("1-3 a: abcde\n1-3 b: cdefg\n2-9 c: ccccccccc") == 2);
	std::cout << solve_one(input) << std::endl;

	assert (solve_two("1-3 a: abcde\n1-3 b: cdefg\n2-9 c: ccccccccc") == 1);
	std::cout << solve_two(input) << std::endl;
	return 0;
}
