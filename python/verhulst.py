def verhulst(args, previousPopulations, initialPopulations, dt, t):
    r = args['r']
    K = args['K']
    previous = previousPopulations[0]
    dP = (r * previous * (1 - (previous / K)))
    return {
        'actual': [previous + dP * dt],
        'derivative': [dP]
    }


def verhulstOrdre2(args, previousPopulations, initialPopulations, dt, t):
    r = args['r']
    K = args['K']
    previous = previousPopulations[0]
    dP = (r * previous * (1 - (previous / K)))
    dP2 = (r * dP - (r / K * 2 * previous * dP))
    return {
        'actual': [previous + dP * dt + dP2 * dt * dt / 2],
        'derivative': [dP]
    }


generate(verhulst, [1], 50, 0.001, {'r': 2.1, 'K': 100})
# generate(verhulstOrdre2,[1],50,0.001,{ 'r': 2.1, 'K': 100 })
