#include <assert.h>

#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <numeric>
#include <regex>



std::vector<std::string> separatePassports(const std::string input){
	std::vector<std::string> passports;

	std::regex rgx("([\\s\\S]*?)\\n\\n");
	auto iter_begin = std::sregex_iterator(input.begin(), input.end(), rgx);

	std::string last;
	for (auto iter = iter_begin; iter != std::sregex_iterator(); ++iter){
		std::smatch match = *iter;
		last = match.suffix();
		passports.push_back(match[1].str());
	}
	passports.push_back(last);

	return passports;
}


std::string REQUIRED_FIELDS[] = {"byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"};


unsigned int solve_one(const std::string input){
	unsigned int valid = 0;

	for (std::string rawPassport : separatePassports(input)){
		unsigned int found = 0;
		for (std::string key : REQUIRED_FIELDS){
			if (rawPassport.find(key) == std::string::npos) break;
			found++;
		}
		valid += found == 7;
	}

	return valid;
}

using Passport = std::map<std::string, std::string>;

Passport parsePassport(std::string rawPassport){
	Passport passport;

	std::regex rgx("(\\S+\\s*):(\\s*\\S+)");
	auto iter_begin = std::sregex_iterator(rawPassport.begin(), rawPassport.end(), rgx);

	for (auto iter = iter_begin; iter != std::sregex_iterator(); ++iter){
		std::smatch match = *iter;
		passport[match[1].str()] = match[2].str();
	}

	return passport;
}


bool isNumber(std::string value){
	try{
		std::stoi(value);
		return true;
	} catch(std::exception e){
		return false;
	}
}


bool inRange(int value, std::tuple<int, int> range){
	return value >= std::get<0>(range) && value <= std::get<1>(range);
}


bool isFieldValid(std::string key, std::string value){
	if (value.size() == 0) return false;
	else if (key == "byr" || key == "iyr" || key == "eyr"){
		if (value.length() != 4) return false;
		if (!isNumber(value)) return false;
		std::tuple<int, int> range;
		if (key == "byr"){
			range = {1920, 2002};
		}
		else if (key == "iyr"){
			range = {2010, 2020};
		}
		else if (key == "eyr"){
			range = {2020, 2030};
		}
		return inRange(std::stoi(value), range);
	}
	else if (key == "hgt"){
		if (value.length() < 2) return false;

		bool inch = value.compare(value.length() - 2, 2, "in") == 0;
		bool centimeter = value.compare(value.length() - 2, 2, "cm") == 0;
		if (!inch && !centimeter) return false;

		std::string onlyNumbers = value.substr(0, value.length() - 2);
		if (!isNumber(onlyNumbers)) return false;

		std::tuple<int, int> range;
		if (centimeter){
			range = {150, 193};
		}
		else {
			range = {59, 76};
		}

		return inRange(std::stoi(onlyNumbers), range);
	}
	else if (key == "pid"){
		if (value.size() != 9) return false;
		return isNumber(value);
	}
	else if (key == "ecl"){
		std::string allowed[] = {"amb", "blu", "brn", "gry", "grn", "hzl", "oth"};
		return std::find(std::begin(allowed), std::end(allowed), value) != std::end(allowed);
	}
	else if (key == "hcl"){
		if (value[0] != '#') return false;
		if (std::find_if(std::begin(value), std::end(value), [](const char c){
			return std::isupper(c);
		}) != std::end(value)) return false;
		return std::find_if(std::begin(value), std::end(value), [](const char c){
			return !std::isxdigit(c);
		}) != std::end(value);
	}
	else if (key == "cid"){
		return true;
	}
	else {
		throw "Unexpected key: " + key;
	}
	return false;
}


bool isPassportValid(Passport passport){
	for (const auto& [key, value] : passport){
		if (!isFieldValid(key, value)) return false;
	}
	return true;
}


unsigned int solve_two(const std::string input){
	unsigned int valid = 0;
	for (std::string rawPassport : separatePassports(input)){
		Passport passport = parsePassport(rawPassport);

		unsigned int found = 0;
		for (std::string key : REQUIRED_FIELDS){
			found += passport.count(key);
		}
		if (found != 7) continue;

		valid += isPassportValid(passport);
	}
	return valid;
}


std::string loadInput(){
	std::ifstream file("./input.in");
	return std::string(
		std::istreambuf_iterator<char>(file),
		std::istreambuf_iterator<char>()
	);
}


int main(){
	const std::string input = loadInput();

	assert (solve_one(R"""(ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in)""") == 2);
	std::cout << solve_one(input) << std::endl;

	assert (solve_two(R"""(eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007)""") == 0);
	assert (solve_two(R"""(pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719)""") == 4);
	std::cout << solve_two(input) << std::endl;

	return 0;
}
