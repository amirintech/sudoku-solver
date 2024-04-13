import random
import time
import psutil
import json

class GeneticSolver:
    def __init__(self, board=None, target=None, chromosome=None):
        self.perpare_board(board, target)
        
        self.board = board
        self.target = target
        if chromosome == None:
            self.chromosome = self.create_gnome()
        else:   
            self.chromosome = chromosome
        self.fitness = self.fitness()
        self.iterations = 0
        self.elapsed_time = 0
        self.memory_used = 0
        self.snapshots = []
        


    def mutated_board(self):
        return random.choice(self.target)

    def create_gnome(self):

        # Create chromosome
        gnome_len = len(self.target)
        return [self.mutated_board() for _ in range(gnome_len)]

    def mate(self, parent2):

        # chromosome for offspring

        child = []
        for (p1, p2) in zip(self.chromosome, parent2.chromosome):

        # random probability
            prob = random.random()

            if prob < 0.48:
                child.append(p1)
            elif prob < 0.96:
                child.append(p2)
            else:
                child.append(self.mutated_board())

        return GeneticSolver(parent2.board,parent2.target, child)

    def fitness(self):

        fitness = 0
        for (p1, p2) in zip(self.chromosome, self.target):
            if p1 != p2:
                fitness += 1
        return fitness      

    def genetic_algorithm(self, population_list, population_size):
        genetic_start = time.time()
        start_mem = psutil.Process().memory_info().rss

        generation = 1
        found = False
        population = population_list
        while not found:
            # sort the population in increasing order of fitness score
            population = sorted(population, key=lambda x: x.fitness)
            if population[0].fitness <= 0:
                found = True
                self.iterations = generation
                break
            # Generate new offsprings for new generation
            new_generation = []
            # Perform Elitism
            s = int(10 * population_size / 100)
            new_generation.extend(population[:s])
            s = int(90 * population_size / 100)
            for _ in range(s):
                parent1 = random.choice(population[:50])
                parent2 = random.choice(population[:50])
                child = parent1.mate(parent2)
                new_generation.append(child)
            population = new_generation
            
            chro = [item for item in population[0].chromosome]
            self.add_snapshot(generation,''.join(population[0].chromosome),population[0].fitness)
            
            generation += 1

        genetic_end = time.time()
        end_mem = psutil.Process().memory_info().rss
        self.memory_used = round((end_mem - start_mem) / (1024**2), 3)
        self.elapsed_time = genetic_end - genetic_start
        self.add_snapshot(generation,''.join(population[0].chromosome),population[0].fitness)


    def get_iterations(self):
        return self.iterations 

    def get_elapsed(self):
        return self.elapsed_time

    def get_memory(self):
        return self.memory_used
    
    def add_snapshot(self, generation, board, fitness):
        stats = {
            "generation": generation,
            "sudoku": board,
            "fitness": fitness
        }
        
        self.snapshots.append(json.dumps(stats))
        
    def perpare_board(self,unsolved_board,solved_board): 
        flattened_board = [item for row in unsolved_board for item in row]
        flattened_board = ''.join(map(str, flattened_board))

        flattened_target = [item for row in solved_board for item in row]
        flattened_target = ''.join(map(str, flattened_target))
        
        self.board = flattened_board
        self.target = flattened_target