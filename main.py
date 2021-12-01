import os
import importlib
import time

from typing import Callable, Dict, Tuple



DIRPATH = os.path.dirname(os.path.abspath(__file__))


if __name__ == '__main__':
	years: Dict[int, Dict[int, Tuple[Callable[[], None]]]] = dict(sorted({
		int(year): dict(sorted({
			int(day): tuple(filter(bool, (getattr(module, 'test_' + part, None) for part in ('one', 'two'))))
			for day in
			os.listdir(os.path.join(DIRPATH, year, 'solutions'))
			if day.isdigit() and (module := importlib.import_module(f'{year}.solutions.{day}.solve'))
		}.items()))
		for year in os.listdir(DIRPATH) if year.isdigit()
	}.items()))
	for year, days in years.items():
		year_start = time.perf_counter()
		print(f'\t\t{year}')
		for day, tests in days.items():
			day_start = time.perf_counter()
			print(f'\t{day}')
			for i, test in enumerate(tests):
				start = time.perf_counter()
				test()
				print(f'Part {i + 1} took {time.perf_counter() - start} ms')
			print(f'Day {day} took {time.perf_counter() - day_start} ms')
		print(f'Year {year} took {time.perf_counter() - year_start} ms')

# TODO - use pytest instead of native calls
# TODO - capture stdout/stderr or have all methods return their final result and print it
