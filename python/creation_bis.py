import matplotlib.pyplot as plt
import numpy as np

def fecondite(t):
    return 0.14*math.exp((-(t - 30)**2) / 40)

def mortalite(t):
    return math.exp((t - 100) / 20) + math.exp((-t - 0.2) / 0.1)

def modelePopInitiale(t):
    return 1 - (math.exp((t - 100) / 20) + math.exp((-t - 0.2) / 0.1))

fecondite = np.vectorize(fecondite)
mortalite = np.vectorize(mortalite)
modelePopInitiale = np.vectorize(modelePopInitiale)

tableauTemps = np.arange(0,100,0.01)

plt.plot(tableauTemps,mortalite(tableauTemps))
plt.show()