def lotkaVolterra(args, previousPopulations, initialPopulations, dt, t):
    alpha = args['alpha']
    beta = args['beta']
    r = args['r']
    q = args['q']
    previousV = previousPopulations[0]
    previousP = previousPopulations[1]
    deriveeV = (r * previousV - alpha * previousV * previousP)
    deriveeP = (beta * previousV * previousP - q * previousP)
    return {
        'actual': [previousV + deriveeV * dt, previousP + deriveeP * dt],
        'derivative': [deriveeV, deriveeP]
    }

generate(lotkaVolterra, [1, 1], 20, 0.001, {
         'r': 2 / 3, 'alpha': 4 / 3, 'beta': 1, 'q': 1, })