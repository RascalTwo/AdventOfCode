import java.io.File

object solve_2021_02 {
  fun solveOne(data: String): Int {
    var horizontal = 0
    var depth = 0
    for ((command, rawUnits) in data.trim().split('\n').map { it.split(' ') }) {
      val units = rawUnits.toInt()
      if (command == "forward") horizontal += units
      else depth += if (command == "down") units else -units
    }
    return horizontal * depth
  }

  fun testOne() {
    val data = File("./input.in").readText()
    println("${solveOne("""forward 5
down 5
forward 8
up 3
down 8
forward 2""")} == 150")
    println(solveOne(data))
  }

  fun solveTwo(data: String): Int {
    var horizontal = 0
    var depth = 0
    var aim = 0
    for ((command, rawUnits) in data.trim().split('\n').map { it.split(' ') }) {
      val units = rawUnits.toInt()
      if (command == "forward") {
        horizontal += units
        depth += aim * units
      } else aim += if (command == "down") units else -units
    }
    return horizontal * depth
  }

  fun testTwo() {
    val data = File("./input.in").readText()
    println("${solveTwo("""forward 5
down 5
forward 8
up 3
down 8
forward 2""")} == 900")
    println(solveTwo(data))
  }

  fun main() {
    testOne()
    testTwo()
  }
}

fun main() {
  solve_2021_02.main()
}
