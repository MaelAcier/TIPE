import matplotlib.pyplot as plt
import numpy as np

def generate(fonction,initialPopulations,duration,step,args) :
        populationsCount = len(initialPopulations) # Nombre de populations
        arrayX = [0] # Tableau des temps
        arrayY = [ [x] for x in initialPopulations ] # Initialisation des populations
        derivative = [ ['nan'] for x in initialPopulations ] # Initialisation de la dérivée
        if step <= 0: step = 0.001 # Sécurité si le pas est plus petit que 0
        for i in np.arange(step,duration,step): # De 0 à <duration>, avec un pas de <step>
            arrayX.append(i) # ajout du temps passé
            # populations précédentes
            previousPopulations = [ population[-1] for population in arrayY ]
            # réponse du modèle
            callback = fonction(args,previousPopulations, initialPopulations,step,i) 
            actualPopulation = callback['actual']
            actualDerivative = callback['derivative']
            for j in range(0,populationsCount,1):
                # enregistrement des données pour chaque population
                arrayY[j].append(actualPopulation[j]) 
            if actualDerivative: # si la dérivée existe
                for j in range(0,populationsCount,1):
                    derivative[j].append(actualDerivative[j]) # enregistrement des dérivées
        fig, ax = plt.subplots()
        for i in range(0,populationsCount,1):
            ax.plot(arrayX, arrayY[i], label='population '+str(i)) # affichage des graphes
        ax.legend()
        plt.show()
        
        # Si on veut afficher la dérivée à la place:
        """if len(derivative) > 0:
            for i in range(0,populationsCount,1):
                plt.plot(arrayX, derivative[i], label='population '+str(i))
            plt.show()"""