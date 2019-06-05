# This import registers the 3D projection, but is otherwise unused.
from mpl_toolkits.mplot3d import Axes3D  # noqa: F401 unused import

import matplotlib.pyplot as plt
from matplotlib import cm
from matplotlib.ticker import LinearLocator, FormatStrFormatter
import numpy as np
import math


fig = plt.figure()
ax = fig.gca(projection='3d')


def fecondite(t):
    return 0.14*math.exp((-(t - 30)**2) / 40)

def mortalite(t):
    return math.exp((t - 100) / 20) + math.exp((-t - 0.2) / 0.1)

def modelePopInitiale(t):
    return 1 - (math.exp((t - 100) / 20) + math.exp((-t - 0.2) / 0.1))

fecondite = np.vectorize(fecondite)
mortalite = np.vectorize(mortalite)
modelePopInitiale = np.vectorize(modelePopInitiale)

def simulation(dt,duree,populationDesiree) :
    populationTotale = [populationDesiree]
    tranchesAge = np.arange(dt/2,100,dt)
    tableauTemps = np.arange(dt/2,duree,dt)
    nbTranches = range(len(tranchesAge))
    
    """f = [0.5, 0.5, 0.5, 1]
    m = [0.5,0.5,0.5,0]
    p = [10, 7, 6, 5]
    """
    f = fecondite(tranchesAge)
    m = mortalite(tranchesAge)
    
    p = modelePopInitiale(tranchesAge)
    total = np.sum(p)
    p *= populationDesiree/total

    population = np.array(p,ndmin=2)
    
    for i in np.delete(tableauTemps,-1):
        naissances = 0
        population = np.vstack((population,population[-1][:]))
        for j in nbTranches:
            naissances += population[-1][j]*f[j]
            population[-1][j] -= m[j]*population[-1][j]
        population[-1] = np.roll(population[-1],1)
        population[-1][0] = naissances
        populationTotale.append(np.sum(population[-1]))
    
    # Make data.
    X = tranchesAge[:]
    Y = tableauTemps[:]
    X, Y = np.meshgrid(X, Y)
    Z = population /10
    #Z = X + Y
    print(X)
    print(Y)
    print(Z)

    # Plot the surface.
    surf = ax.plot_surface(X, Y, Z, cmap=cm.coolwarm,
                       linewidth=0, antialiased=False)

    # Customize the z axis.
    ax.set_zlim(-1.01, 1.01)
    ax.zaxis.set_major_locator(LinearLocator(10))
    ax.zaxis.set_major_formatter(FormatStrFormatter('%.02f'))

    # Add a color bar which maps values to colors.
    fig.colorbar(surf, shrink=0.5, aspect=5)
    plt.show()
    """
    print(populationTotale)
    plt.plot(tableauTemps,populationTotale)
    plt.show()
    """

