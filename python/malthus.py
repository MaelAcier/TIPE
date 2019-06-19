import math

def malthus(args, previousPopulations, initialPopulations, dt, t):
    r = args['r']
    previous = previousPopulations[0]
    deriveeP = previous * r
    return {
        'actual': [previous + deriveeP * dt],
        'derivative': [deriveeP]
    }

def malthusContinu(args, previousPopulations, initialPopulations, dt, t):
    r = args['r']
    initial = initialPopulations[0]
    actual = initial * math.exp(r * t)
    return {
        'actual': [actual],
        'derivative': []
    }

generate(malthus, [1], 1, 0.001, {'r': 2})
# generate(malthusContinu, [1], 1, 0.001, {r: 2})