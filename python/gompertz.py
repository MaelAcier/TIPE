from math import *

def gompertz(args, previousPopulations, initialPopulations, dt, t):
    a = args['a']
    K = args['K']
    previous = previousPopulations[0]
    deriveeP = a * previous * log(K / previous)
    return {
        'actual': [previous + deriveeP * dt],
        'derivative': [deriveeP]
    }
    
def gompertzContinu(args, previousPopulations, initialPopulations, dt, t):
    a = args['a']
    K = args['K']
    initial = initialPopulations[0]
    actual = K * exp( log(initial / K) * exp(-a * t))
    return {
        'actual': [actual],
        'derivative': []
    }

generate(gompertz, [1], 50, 0.001, {'a': 0.5, 'K': 100})
#generate(gompertzContinu, [1], 50, 0.001, {'a': 0.5, 'K': 100})