import os

from typing import Callable, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


REQUIRED_FIELDS = set(['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid',])


def solve_one(data: str):
	return sum(all(field in passport for field in REQUIRED_FIELDS) for passport in data.split('\n\n'))


def test_one():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_one('''ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in''') == 2
	print(solve_one(data))


def is_int_in_range(
	value: str,
	precheck: Callable[[str], bool],
	get_range: Callable[[str], Tuple[int, int]],
	parse_int: Callable[[str], int] = int,
) -> bool:
	try:
		num = parse_int(value)
		if not precheck(value):
			return False

		low, high = get_range(value)
		return low <= num <= high
	except:
		return False


YEAR_RANGES = {
	'byr': (1920, 2002),
	'iyr': (2010, 2020),
	'eyr': (2020, 2030)
}


def is_valid(field: str, value: str):
	if not value:
		return False

	if field in YEAR_RANGES:
		return is_int_in_range(
			value,
			lambda value: len(value) == 4,
			lambda _: YEAR_RANGES[field]
		)
	elif field == 'hgt':
		return is_int_in_range(
			value,
			lambda value: any(value.endswith(suffix) for suffix in ('in', 'cm')),
			lambda value: (150, 193) if value.endswith('cm') else (59, 76),
			lambda value: int(value[:-2])
		)
	elif field == 'hcl':
		if value[0] != '#':
			return False
		if any(char.isupper() for char in value):
			return False
		try:
			int(value[1:], 16)
			return True
		except:
			return False
	elif field == 'ecl':
		return value in ('amb', 'blu', "brn", 'gry', 'grn', 'hzl', 'oth')
	elif field == 'pid':
		if len(value) != 9:
			return False
		try:
			int(value)
			return True
		except:
			return False


def test_is_valid():
	assert is_valid('byr', '2002')
	assert not is_valid('byr', '2003')

	assert is_valid('hgt', '60in')
	assert is_valid('hgt', '190cm')
	assert not is_valid('hgt', '190in')
	assert not is_valid('hgt', '190')

	assert is_valid('hcl', '#123abc')
	assert not is_valid('hcl', '#123abC')
	assert not is_valid('hcl', '#123abz')
	assert not is_valid('hcl', '123abc')

	assert is_valid('ecl', 'brn')
	assert not is_valid('ecl', 'wat')

	assert is_valid('pid', '000000001')
	assert not is_valid('pid', '0123456789')


def solve_two(data: str):
	return sum(
		all(
			field in passport
			and is_valid(field, passport.split(field + ':')[1].split(' ')[0].split()[0].strip())
			for field in REQUIRED_FIELDS
		)
		for passport in data.split('\n\n')
	)


def test_two():
	with open(os.path.join(DIRPATH, 'input.in')) as input_file:
		data = input_file.read()
	assert solve_two('''eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007''') == 0
	assert solve_two('''pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719''') == 4
	print(solve_two(data))
