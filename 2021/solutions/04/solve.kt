import java.io.File

object solve_2021_04 {
  data class Cell(val number: Int, var marked: Boolean)

  class Board(raw: String) {
    val rows: MutableList<MutableList<Cell>> = emptyArray<MutableList<Cell>>().toMutableList()
    init {
      for (row in raw.split('\n')) {
        rows.add(
            row.split(' ')
                .filter { !it.matches("^\\s*$".toRegex()) }
                .map { it.toInt() }
                .map { Cell(it, false) }
                .toMutableList()
        )
      }
    }

    fun mark(marking: Int): Boolean {
      for (row in rows) {
        for (cell in row) {
          if (cell.number == marking) cell.marked = true
        }
      }

      return won
    }

    val won: Boolean
      get() {
        if (rows.any { it.all { cell -> cell.marked == true } }) return true
        for (c in rows[0].indices) {
          var markedCount = 0
          for (r in rows.indices) {
            if (rows[r][c].marked) markedCount++
          }
          if (markedCount == rows.size) return true
        }
        return false
      }

    val score: Int
      get() {
        return rows.flatMap { it.filter { cell -> !cell.marked } }.map { it.number }.sum()
      }
  }
  fun solveOne(data: String): Int? {
    var boards = data.trim().split("\n\n").drop(1).map { Board(it) }
    for (number in data.trim().split('\n')[0].split(',').map { it.toInt() }) {
      for (board in boards) {
        if (board.mark(number)) return board.score * number
      }
    }
    return null
  }

  fun testOne() {
    val data = File("./input.in").readText()
    println(
        "${solveOne("""7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7""")} == 4512"
    )
    println(solveOne(data))
  }

  fun solveTwo(data: String): Int? {
    var boards = data.trim().split("\n\n").drop(1).map { Board(it) }.toMutableList()
    for (number in data.trim().split('\n')[0].split(',').map { it.toInt() }) {
      for (b in boards.lastIndex downTo 0) {
        var board = boards[b]
        if (!board.mark(number)) continue
        boards.removeAt(b)
        if (boards.isEmpty()) return board.score * number
      }
    }
    return null
  }

  fun testTwo() {
    val data = File("./input.in").readText()
    println(
        "${solveTwo("""7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
""")} == 1924"
    )
    println(solveTwo(data))
  }

  fun main() {
    testOne()
    testTwo()
  }
}

fun main() {
  solve_2021_04.main()
}
