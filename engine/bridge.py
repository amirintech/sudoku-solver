import json
import os
import pandas as pd
from typing import Dict, List
from board_generator import BoardGenerator
from genetic_algo import GeneticSolver
from backtracking_algo import BacktrackingSolver
    

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
            case "RUN_TESTS": handle_run_tests()
            
  
def write_json(action: str, data: object, flush=False): 
    """
    Writes JSON to STDIN
    """

    res = json.dumps({
        "action": action,
        "data": data,
    })
    
    print(res, flush=flush)


def handle_run_tests():
    """
    Tests solving algorithms on sample dataset
    """

    def solve(row, algo, index):
        board, solution = row['puzzle'], row['solution']
        constructed_board = construct_board(board, 9)
        solved = None
        if algo == "Backtracking":
            solved = solve_backtracking(constructed_board, 9)["solvedBoard"]
        else:
            solved = solve_genetic(board, solution, 500)["solvedBoard"]
        
        write_json(f"RUN_TESTS", {
            "algorithm": algo,
            "success": solved == solution,
            "testCaseNumber": index,
            "done": index == 499
        }, True)
            
    dataset = pd.read_csv("../engine/test_dataset.csv").sample(n=500).reset_index()
    dataset["puzzle"] = dataset["puzzle"].astype(str)
    dataset["solution"] = dataset["solution"].astype(str)
    
    dataset.apply(lambda row: solve(row, "Backtracking", row.name), axis=1)
    dataset.apply(lambda row: solve(row, "Genetic", row.name), axis=1)
    
    
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
    match algorithm:
        case "Backtracking": 
            write_json("SOLVE_BOARD", solve_backtracking(constructed_board, size))

        case "Genetic": 
            back_solver = BacktrackingSolver()
            solved_board = back_solver.backtracking_algorithm(constructed_board, size)
            write_json("SOLVE_BOARD", solve_genetic(constructed_board, solved_board, population_size))

        

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
        "solvedBoard": flatten_board(solved_board),
        "iterations": population[0].iterations,
        "time": population[0].elapsed_time,
        "memory":  population[0].memory_used,
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
