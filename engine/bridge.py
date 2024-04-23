from typing import Dict, List
from board_generator import BoardGenerator
from genetic_algo import GeneticSolver
from backtracking_algo import BacktrackingSolver
import json
    
def listen():
    """
    Listen for client requests and maps to handlers
    """
    while True:
        req = input()
        
        # ================== FOR DEVELOPMENT ================== 
        if req.startswith("DEBUG"):
            continue
        # ==================  ==================  =============
        
        req = json.loads(req)
        data = req["data"]
        match req["action"]:
            case "GENERATE_BOARD": handle_generate_board(data["size"], data["complexity"])
            case "SOLVE_BOARD": handle_solve_board(data["board"], data["size"], data["algorithm"], data["population"])
            
  
def write_json(action: str, data: object): 
    """
    Writes JSON to STDIN
    """

    res = json.dumps({
        "action": action,
        "data": data,
    })
    
    print(res)
    

def handle_generate_board(size: int, complexity: str):
    """
    Generates a random Sudoku board
    """

    board = flatten_board(BoardGenerator(size, complexity).generate())
    data = {
        "size":  size,
        "board": board,
    }
    write_json("GENERATE_BOARD", data)
    
    
def handle_solve_board(board: List[List[int]], size: int, algorithm: str, population_size: int=500):
    """
    Solves a Sudoku board given some algorithm
    """ 
    
    constructed_board = construct_board(board, size)
    back_solver = BacktrackingSolver()
    solved_board = back_solver.backtracking_algorithm(constructed_board, size)

    match algorithm:
        case "BACKTRACKING": write_json("SOLVE_BOARD", solve_backtracking(constructed_board, size))
        case "GENETIC": write_json("SOLVE_BOARD", solve_genetic(constructed_board, solved_board, population_size))

        

def solve_backtracking(board: List[List[int]], size: int) -> Dict:
    """
    Solves board using backtracking algorithm
    """
    
    back_solver = BacktrackingSolver()
    solved_board = back_solver.backtracking_algorithm(board, size)
    
    return {
        "solvedBoard": flatten_board(solved_board),
        "iterations": back_solver.iterations,
        "time" : back_solver.elapsed_time,
        "memory": back_solver.memory_used,
        "snapshots": back_solver.snapshots,
    }  
   
    
def solve_genetic(unsolved_board: List[List[int]], solved_board: List[List[int]], population_size: int) -> Dict:
    """
    Solves board using genetic algorithm
    """
    
    flattened_board = flatten_board(unsolved_board)
    flattened_target = flatten_board(solved_board)
    population = []
    for _ in range(population_size):
        population.append(GeneticSolver(flattened_board, flattened_target, None))

    population[0].genetic_algorithm(population,population_size)

    return {
        "solvedBoard": flattened_board,
        "iterations": population[0].iterations,
        "time": population[0].elapsed_time,
        "memory":  population[0].memory_used,
        # "snapshots":  population[0].snapshots
    }


def flatten_board(board: List[List[int]]) -> str:
    """
    Flats a 2D board
    """
    
    flattened_board = [item for row in board for item in row]
    return ''.join(map(str, flattened_board))


def construct_board(board: str, size: int) -> List[List[int]]:
    """
    Converts a string stream of Sudoku board to a 2D array
    """
    
    res = []
    rows = [board[i : i + size] for i in range(0, len(board), size)] # split the string into rows of length 9
    for row in rows:
        numbers = [int(char) for char in row]
        res.append(numbers)

    return res

    

listen()
