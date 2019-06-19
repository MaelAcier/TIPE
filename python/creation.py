from mpl_toolkits.mplot3d import Axes3D

import matplotlib.pyplot as plt
from matplotlib import cm
from matplotlib.ticker import LinearLocator, FormatStrFormatter
import numpy as np
from math import *

def fecondite(t):
    return 0.14*exp((-(t - 30)**2) / 40)

def mortalite(t):
    return exp((t - 100) / 20) + exp((-t - 0.2) / 0.1)

def modelePopInitiale(t):
    return 1 - (exp((t - 100) / 20) + exp((-t - 0.2) / 0.1))

# Les fonctions acceptent des tableaux
fecondite = np.vectorize(fecondite)
mortalite = np.vectorize(mortalite)
modelePopInitiale = np.vectorize(modelePopInitiale)

def simulation(dt,duree,populationDesiree) :
    populationTotale = [populationDesiree]
    tranchesAge = np.arange(dt/2,100,dt)
    tableauTemps = np.arange(dt/2,duree,dt)
    nbTranches = range(len(tranchesAge))
    #récupération des données sur les courbes
    f = fecondite(tranchesAge)
    m = mortalite(tranchesAge)
    #Multiplication par un coefficient pour avoir la population souhaitée
    p = modelePopInitiale(tranchesAge)
    total = np.sum(p)
    p *= populationDesiree/total

    population = np.array(p,ndmin=2)
    for i in np.delete(tableauTemps,-1):
        naissances = 0
        population = np.vstack((population,population[-1][:]))
        # Calculs des fécondités et mortalités
        for j in nbTranches:
            naissances += population[-1][j]*f[j]
            population[-1][j] -= m[j]*population[-1][j]
        population[-1] = np.roll(population[-1],1)
        population[-1][0] = naissances
        populationTotale.append(np.sum(population[-1]))
    
    # Données en 3D
    X = tranchesAge[:]
    Y = tableauTemps[:]
    X, Y = np.meshgrid(X, Y)
    Z = population

    # affichage 3D
    fig = plt.figure()
    ax = fig.gca(projection='3d')
    surf = ax.plot_surface(X, Y, Z, cmap=cm.RdYlGn,
                       linewidth=0, antialiased=False)
    ax.zaxis.set_major_locator(LinearLocator(10))
    ax.zaxis.set_major_formatter(FormatStrFormatter('%.02f'))
    fig.colorbar(surf, shrink=0.5, aspect=5)
    ax.set_xlabel("Age des individus")
    ax.set_ylabel("Temps")
    ax.set_zlabel("Individus")
    plt.show()
    
simulation(1,200,1000)