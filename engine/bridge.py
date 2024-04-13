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

        # =================== temporary for devlopment =================== 
        if req.startswith("IGNORE"):
            print("IGNORE", req)
            continue
        # =================== ======================== =================== 
        
        req = json.loads(req)
        match req.type:
            case "generate_board": handle_generate_board(req.size, req.complexity)
            case "solve_board": handle_solve_board(req.board, req.size, req.algorithm, req.population)
            
  
def write_json(action: str, data: object) -> str: 
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
    
    write_json("generate_board", BoardGenerator(size, complexity).generate())
    
    
def handle_solve_board(board: List[List[int]], size: int, algorithm: str, population_size: int=500):
    """
    Solves a Sudoku board given some algorithm
    """
    
    back_solver = BacktrackingSolver()
    solved_board = back_solver.backtracking_algorithm(board, size)
    
    match algorithm:
        case "backtracking": write_json("solve_board", solve_backtracking(board, size))
        case "genetic": write_json("solve_board", solve_genetic(board, solved_board, population_size))
        

def solve_backtracking(board: List[List[int]], size: int) -> Dict:
    """
    Solves board using backtracking algorithm
    """
    
    back_solver = BacktrackingSolver()
    solved_board = back_solver.backtracking_algorithm(board, size)
    
    return {
        "solvedBoard": solved_board,
        "iterations": back_solver.iterations,
        "time" : back_solver.elapsed_time,
        "memory": back_solver.memory_used,
        "snapshots": back_solver.snapshots,
    }  
   
    
def solve_genetic(unsolved_board: List[List[int]], solved_board: List[List[int]], population_size: int) -> Dict:
    """
    Solves board using genetic algorithm
    """

    flattened_board = [item for row in unsolved_board for item in row]
    flattened_board = ''.join(map(str, flattened_board))

    flattened_target = [item for row in solved_board for item in row]
    flattened_target = ''.join(map(str, flattened_target))

    population = []
    for _ in range(population_size):
        population.append(GeneticSolver(flattened_board, flattened_target, None))

    population[0].genetic_algorithm(population,population_size)

    print("\nNumber Of Iterations:", population[0].get_iterations())
    print(f"\nExecution time: {population[0].elapsed_time:.4f} seconds")
    print(f"\nExecution memory: {population[0].get_memory()} MB")
    
    return {
        "solvedBoard": solved_board,
        "iterations": population[0].iterations,
        "time": population[0].elapsed_time,
        "memory":  population[0].memory_used,
        "snapshots":  population[0].snapshots
    }


listen()
