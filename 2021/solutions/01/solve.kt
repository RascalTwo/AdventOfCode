import java.io.File

object solve_2021_01 {
  fun solveOne(data: String): Int {
    val measurements = data.trim().split('\n').map { it.toInt() }
    return measurements.slice(1..measurements.lastIndex).indices.fold(0) { count, i ->
      count + (measurements[i + 1] > measurements[i]).compareTo(false)
    }
  }

  fun testOne() {
    val data = File("./input.in").readText()
    println("${solveOne("""199
200
208
210
200
207
240
269
260
263""")} == 7")
    println(solveOne(data))
  }

  fun solveTwo(data: String): Int {
    val measurements = data.trim().split('\n').map { it.toInt() }

    var count = 0
    var current = measurements.slice(1..3).sum()
    for (i in measurements.slice(2..measurements.lastIndex - 1).indices) {
      val last = current
      current = current - measurements[i] + measurements[i + 3]
      if (current > last) count++
    }

    return count
  }

  fun testTwo() {
    val data = File("./input.in").readText()
    println("${solveTwo("""199
200
208
210
200
207
240
269
260
263""")} == 5")
    println(solveTwo(data))
  }

  fun main() {
    testOne()
    testTwo()
  }
}

fun main() {
  solve_2021_01.main()
}
