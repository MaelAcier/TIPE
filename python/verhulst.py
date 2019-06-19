def verhulst(args, previousPopulations, initialPopulations, dt, t):
    r = args['r']
    K = args['K']
    previous = previousPopulations[0]
    deriveeP = (r * previous * (1 - (previous / K)))
    return {
        'actual': [previous + deriveeP * dt],
        'derivative': [deriveeP]
    }

def verhulstOrdre2(args, previousPopulations, initialPopulations, dt, t):
    r = args['r']
    K = args['K']
    previous = previousPopulations[0]
    deriveeP = (r * previous * (1 - (previous / K)))
    deriveeP2 = (r * deriveeP - (r / K * 2 * previous * deriveeP))
    return {
        'actual': [previous + deriveeP * dt + deriveeP2 * dt * dt / 2],
        'derivative': [deriveeP]
    }

generate(verhulst, [1], 50, 0.001, {'r': 2.1, 'K': 100})
# generate(verhulstOrdre2,[1],50,0.001,{ 'r': 2.1, 'K': 100 })