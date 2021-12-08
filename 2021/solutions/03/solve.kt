import java.io.File
import kotlin.Int

object solve_2021_03 {
  fun solveOne(data: String): Int {
    val numbers = data.trim().split('\n')

    var gamma = ""
    var epsilon = ""
    for (i in numbers[0].indices) {
      val counts = mutableMapOf('0' to 0, '1' to 0)
      for (number in numbers) {
        counts.merge(number[i], 1, Int::plus)
      }
      if (counts['0']!! > counts['1']!!) {
        gamma += '0'
        epsilon += '1'
      } else {
        gamma += '1'
        epsilon += '0'
      }
    }
    return Integer.parseInt(gamma, 2) * Integer.parseInt(epsilon, 2)
  }

  fun testOne() {
    val data = File("./input.in").readText()
    println(
        "${solveOne("""00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010""")} == 198"
    )
    println(solveOne(data))
  }

  fun solveTwo(data: String): Int {
    val numbers = data.trim().split('\n')

    var oxy = ""
    var co2 = ""
    for (lowest in 0..1) {
      val options = if (lowest == 1) "10" else "01"
      var remaining = numbers.toList()
      for (i in numbers[0].indices) {
        val counts = mapOf('0' to ArrayList<String>(), '1' to ArrayList<String>())
        for (number in remaining) {
          counts[number[i]]!!.add(number)
        }
        remaining = counts[options[(counts['1']!!.size >= counts['0']!!.size).compareTo(false)]]!!
        if (remaining.size == 1) break
      }
      if (lowest == 0) oxy = remaining[0] else co2 = remaining[0]
    }
    return Integer.parseInt(oxy, 2) * Integer.parseInt(co2, 2)
  }

  fun testTwo() {
    val data = File("./input.in").readText()
    println(
        "${solveTwo("""00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010""")} == 230"
    )
    println(solveTwo(data))
  }

  fun main() {
    testOne()
    testTwo()
  }
}

fun main() {
  solve_2021_03.main()
}
