import math


def malthus(args, previousPopulations, initialPopulations, dt, t):
    r = args['r']
    previous = previousPopulations[0]
    dP = previous * r
    return {
        'actual': [previous + dP * dt],
        'derivative': [dP]
    }


def malthusContinu(args, previousPopulations, initialPopulations, dt, t):
    r = args['r']
    initial = initialPopulations[0]
    actual = initial * math.exp(r * t)
    return {'actual': [actual]}


generate(malthus, [1], 1, 0.001, {'r': 2})
# generate(malthusContinu, [1], 1, 0.001, {r: 2})
