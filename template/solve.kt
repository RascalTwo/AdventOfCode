import java.io.File

object solve_year_day {
  fun solveOne(data: String): Boolean {
    return true
  }

  fun testOne() {
    val data = File("./input.in").readText()
    println("${solveOne("""
""")} == true")
    println(solveOne(data))
  }

  fun solveTwo(data: String): Boolean {
    return false
  }

  fun testTwo() {
    val data = File("./input.in").readText()
    println("${solveTwo("""
""")} == false")
    println(solveTwo(data))
  }

  fun main() {
    testOne()
    testTwo()
  }
}

fun main() {
  solve_year_day.main()
}
