import matplotlib.pyplot as plt
import numpy as np

def generate(fonction,initialPopulations,duration,step,args) :
        populationsCount = len(initialPopulations)
        arrayX = [0]
        arrayY = [ [x] for x in initialPopulations ]
        derivative = [ ['nan'] for x in initialPopulations ]
        if step <= 0: step = 0.001
        for i in np.arange(step,duration,step):
            arrayX.append(i)
            previousPopulations = [ population[-1] for population in arrayY ]
            callback = fonction(args,previousPopulations, initialPopulations,step,i)
            actualPopulation = callback['actual']
            actualDerivative = callback['derivative']
            for j in range(0,populationsCount,1):
                arrayY[j].append(actualPopulation[j])
            if actualDerivative:
                for j in range(0,populationsCount,1):
                    derivative[j].append(actualDerivative[j])
        fig, ax = plt.subplots()
        for i in range(0,populationsCount,1):
            ax.plot(arrayX, arrayY[i], label='population '+str(i))
        ax.legend()
        plt.show()

"""         if len(derivative) > 0:
            for i in range(populationsCount,1):
                plt.plot(arrayX, derivative[i], label='population '+str(i)) """
