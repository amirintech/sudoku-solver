import time
import psutil
import copy

class BacktrackingSolver:
    def __init__(self):
        self.iterations = 0
        self.elapsed_time = 0
        self.memory_used = 0
        self.snapshots = []
        
        
    def is_valid(self,board, row, col, num, size):
        # Check if number exists in same row
        if num in board[row]:
            return False

        # Check if number exists in same column
        for r in range(size):
            if board[r][col] == num:
                return False

        ## by taking the power of the size we get the size of individual box in the puzzle
        ## so in case of the puzzle size is 9*9 the size of single box is integer of 9 power 0.5.

        box_size = int(size ** 0.5)
        start_row = row - row % box_size
        start_col = col - col % box_size

        # Check if the number is already in the box
        for r in range(box_size):
            for c in range(box_size):
                if board[r + start_row][c + start_col] == num:
                    return False

        return True
    
                
    def backtracking_algorithm(self,board, size):
        backtracking_start = time.time()
        start_mem = psutil.Process().memory_info().rss

        for row in range(size):
            for col in range(size):  ## iterate over each cell.
                if board[row][col] == 0: ## if the current cell empty

                    for num in range(1, size + 1):  ## So we can add a number with value from 1 to size(9 in the standard form)
                        self.iterations += 1
                        self.snapshots.append(copy.deepcopy(board))
                        if self.is_valid(board, row, col, num, size): ## check the validity of num
                            board[row][col] = num
                            if self.backtracking_algorithm(board, size):
                                backtracking_end = time.time()
                                self.elapsed_time = backtracking_end - backtracking_start
                                return board ## The functino will return true when the entire Sudoku puzzle
                                            ## is filled with valid numbers.


                            board[row][col] = 0
                                            ## this to reset the current cell to 0 because
                                            ## num in this case will not lead to the solution
                                            ## So we need to backtrack and try another value.

                    return None ## the solv function will return false when all numbers from 1 to size
                                    ## not valid solution.
                                    
        backtracking_end = time.time()
        end_mem = psutil.Process().memory_info().rss
        self.memory_used = round((end_mem - start_mem) / (1024**2),3)
        self.elapsed_time = backtracking_end - backtracking_start
        
        return board
