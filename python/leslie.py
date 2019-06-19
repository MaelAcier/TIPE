def leslie(args, previousPopulations, initialPopulations, dt, i):
    L = args['L']
    previous = np.matrix([ [x] for x in previousPopulations ])
    population = np.multiply(L,previous) 
    return {
        'actual': [ x[0] for x in population.getA() ],
        'derivative': []
    }

generate(leslie, [10, 7, 6, 5], 10, 1, { 'L': np.matrix([[0.5, 0.5, 0.5, 1],
                                                         [0.5, 0,   0,   0],
                                                         [0,   0.5, 0,   0],
                                                         [0,   0,   0.5, 0]]) })