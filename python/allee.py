def allee(args, previousPopulations, initialPopulations, dt, i):
    A = args['A']
    r = args['r']
    K = args['K']
    previous = previousPopulations[0]
    deriveeP = r * previous * ((previous / A) - 1) * (1 - (previous / K))
    return {
        'actual': [previous + deriveeP * dt],
        'derivative': [deriveeP]
    }

generate(allee, [50], 50, 0.001, {'r': 2.1, 'K': 100, 'A': 20})
