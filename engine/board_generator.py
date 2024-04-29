import random
from typing import List, Tuple

class BoardGenerator:
    """
    A class to generate random unsolved Sudoku boards.
    """

    BOARD_SIZE = {
        4: 2,
        6: 2,
        9: 3,
    }

    DIFFICULTY = {
        'Easy': 0.3,
        'Medium': 0.5,
        'Hard': 0.7,
        'Very Hard': 0.9,
    }

    def __init__(self, size=9, complexity='easy'):
        self.size = size
        self.complexity = complexity
        self.board = [[0 for _ in range(self.size)] for _ in range(self.size)] # generate an empty board
        
    def generate(self) -> List[List[int]]:
        self.__solve()

        # Remove clues based on the difficulty level
        clues_to_remove = int(self.size ** 2 * self.DIFFICULTY[self.complexity])
        clues_removed = 0

        while clues_removed < clues_to_remove:
            row = random.randint(0, self.size - 1)
            col = random.randint(0, self.size - 1)

            if self.board[row][col] != 0:
                clues_removed += 1
                self.board[row][col] = 0

        return self.board   


    def __find_empty_cell(self) -> Tuple[int, int]:
        """
        Find the next empty cell in the board.
        """
        
        for i in range(self.size):
            for j in range(self.size):
                if self.board[i][j] == 0:
                    return i, j
                
        return None, None


    def __is_valid(self, num: int, pos: Tuple[int, int]) -> bool:
        """
        Checks the validity of placing a number in some position
        """

        # check row
        if num in self.board[pos[0]]:
            return False

        # check column
        if num in [row[pos[1]] for row in self.board]:
            return False

        # check box
        box_x = pos[1] // self.BOARD_SIZE[self.size]
        box_y = pos[0] // self.BOARD_SIZE[self.size]
        if num in [self.board[i][j] for i in range(box_y * self.BOARD_SIZE[self.size], (box_y + 1) * self.BOARD_SIZE[self.size])
                   for j in range(box_x * self.BOARD_SIZE[self.size], (box_x + 1) * self.BOARD_SIZE[self.size])
                   if self.board[i][j] != 0]:
            return False

        return True

    def __solve(self) -> bool:
        pos = self.__find_empty_cell()
        if pos[0] is None:
            return True

        row, col = pos

        for num in random.sample(range(1, self.size + 1), self.size):
            if self.__is_valid(num, (row, col)):
                self.board[row][col] = num

                if self.__solve():
                    return True

                self.board[row][col] = 0

        return False