import * as mathjs from 'mathjs/dist/math.js';

export var globalsIDs: number[] = []
export var globalsModelID: number = 0
export var models = {}
export var traces = {
    evolution: [],
    derivative: []
}

export var referenceModels = {
    "Malthus": {
        default: {
            model: "Malthus",
            modelisation: "Discret",
            arguments: {
                populations: [1],
                duration: 1,
                step: 0.001,
                args: { r: 2 }
            },
        },
        basicSettings: {
            duration: { min: 1, max: 100, step: 1 },
            step: { min: 0, max: 1, step: 0.0001 },
        },
        populationsSettings: [
            { min: 1, max: 200, step: 1, name: "Population initiale" }
        ],
        advancedSettings: {
            r: { min: 0, max: 3, step: 0.01, name: "Taux de croissance" }
        },
        functions: {
            "Discret": (args, previousPopulation, _initialPopulation, dt) => {
                let previous = previousPopulation[0]
                let dP = previous * args.r
                return {
                    actual: [previous + dP * dt],
                    derivative: [dP]
                }
            },
            "Continu": (args, _previousPopulation, initialPopulation, _dt, t) => {
                let initial = initialPopulation[0]
                let actual = initial * Math.exp(args.r * t)
                return { actual: [actual] }
            }
        }
    },
    "Verhulst": {
        default: {
            model: "Verhulst",
            modelisation: "Discret",
            arguments: {
                populations: [1],
                duration: 50,
                step: 0.001,
                args: { r: 2.1, K: 100 }
            }
        },
        basicSettings: {
            duration: { min: 1, max: 100, step: 1 },
            step: { min: 0, max: 1, step: 0.0001 },
        },
        populationsSettings: [
            { min: 1, max: 200, step: 1 }
        ],
        advancedSettings: {
            r: { min: 0, max: 3, step: 0.01, name: "Taux de croissance" },
            K: { min: 0, max: 200, step: 0.01, name: "Capacité d’accueil du milieu" }
        },
        functions: {
            "Discret": (args, previousPopulation, _initialPopulation, dt) => {
                let previous = previousPopulation[0]
                let dP = (args.r * previous * (1 - (previous / args.K)))
                return {
                    actual: [previous + dP * dt],
                    derivative: [dP]
                }
            },
            "Auto-catalytique": (args, previousPopulation, _initialPopulation, dt) => {
                let previous = previousPopulation[0]
                let dP = (args.r * previous * (args.K - previous))
                return {
                    actual: [previous + dP * dt],
                    derivative: [dP]
                }
            },
            "Discret ordre 2": (args, previousPopulation, _initialPopulation, dt) => {
                let previous = previousPopulation[0]
                let dP = (args.r * previous * (1 - (previous / args.K)))
                let dP2 = (args.r * dP - (args.r / args.K * 2 * previous * dP))
                return {
                    actual: [previous + dP * dt + dP2 * dt * dt / 2],
                    derivative: [dP]
                }
            }
        }
    },
    "Gompertz": {
        default: {
            model: "Gompertz",
            modelisation: "Discret",
            arguments: {
                populations: [1],
                duration: 50,
                step: 0.001,
                args: { a: 2.1, K: 100 }
            }
        },
        basicSettings: {
            duration: { min: 1, max: 100, step: 1 },
            step: { min: 0, max: 1, step: 0.0001 },
        },
        populationsSettings: [
            { min: 1, max: 200, step: 1 }
        ],
        advancedSettings: {
            a: { min: 0, max: 3, step: 0.01, name: "Constante" },
            K: { min: 0, max: 200, step: 0.01, name: "Capacité d’accueil du milieu" }
        },
        functions: {
            "Discret": (args, previousPopulation, _initialPopulation, dt) => {
                let previous = previousPopulation[0]
                let dP = args.a * previous * Math.log(args.K / previous)
                return {
                    actual: [previous + dP * dt],
                    derivative: [dP]
                }
            }
        }
    },
    "Allee": {
        default: {
            model: "Allee",
            modelisation: "Discret",
            arguments: {
                populations: [50],
                duration: 50,
                step: 0.001,
                args: { r: 2.1, K: 100, A: 20 }
            }
        },
        basicSettings: {
            duration: { min: 1, max: 100, step: 1 },
            step: { min: 0, max: 1, step: 0.0001 },
        },
        populationsSettings: [
            { min: 1, max: 200, step: 1 }
        ],
        advancedSettings: {
            r: { min: 0, max: 3, step: 0.01, name: "Taux de croissance" },
            K: { min: 0, max: 200, step: 0.01, name: "Capacité d’accueil du milieu" },
            A: { min: 0, max: 200, step: 0.01, name: "Densité critique" }
        },
        functions: {
            "Discret": (args, previousPopulation, _initialPopulation, dt) => {
                let previous = previousPopulation[0]
                let dP = args.r * previous * ((previous / args.A) - 1) * (1 - (previous / args.K))
                return {
                    actual: [previous + dP * dt],
                    derivative: [dP]
                }
            }
        }
    },
    "Leslie": {
        default: {
            model: "Leslie",
            modelisation: "Discret",
            arguments: {
                populations: [10, 7, 6, 5],
                populationNames: ["Age 1", "Age 2", "Age 3", "Age 4"],
                duration: 10,
                step: 1,
                args: { L: mathjs.matrix([[0.5, 0.5, 0.5, 1], [0.5, 0, 0, 0], [0, 0.5, 0, 0], [0, 0, 0.5, 0]]) }
            }
        },
        basicSettings: {
            duration: { min: 1, max: 100, step: 1 },
            step: { min: 0, max: 1, step: 0.0001 },
        },
        populationsSettings: [
            { min: 1, max: 200, step: 1 }
        ],
        advancedSettings: {},
        functions: {
            "Discret": (args, previousPopulation, _initialPopulation, _dt) => {
                let previous = mathjs.matrix(Array.from(previousPopulation, x => [x]))
                let population = mathjs.multiply(args.L,previous) 
                return {
                    actual: Array.from(population._data, x => x[0])
                }
            }
        }
    },
    "Lotka-Volterra": {
        default: {
            model: "Lotka-Volterra",
            modelisation: "Discret",
            arguments: {
                populations: [1, 1],
                populationNames: ["Proies", "Prédateurs"],
                duration: 20,
                step: 0.001,
                args: {
                    r: 2 / 3,
                    alpha: 4 / 3,
                    beta: 1,
                    q: 1,
                }
            }
        },
        basicSettings: {
            duration: { min: 1, max: 100, step: 1 },
            step: { min: 0, max: 1, step: 0.0001 },
        },
        populationsSettings: [
            { min: 1, max: 200, step: 1 },
            { min: 1, max: 200, step: 1 }
        ],
        advancedSettings: {
            r: { min: 0, max: 3, step: 0.01, name: "Taux de croissance des proies" },
            alpha: { min: 0, max: 3, step: 0.01, name: "Taux de rencontres des prédateurs avec les proies" },
            beta: { min: 0, max: 3, step: 0.01, name: "Efficacité de la conversion des proies en nouveaux prédateurs" },
            q: { min: 0, max: 3, step: 0.01, name: "Capacité d’accueil du milieu" }
        },
        functions: {
            "Discret": (args, previousPopulation, _initialPopulation, dt) => {
                let previousV = previousPopulation[0]
                let previousP = previousPopulation[1]
                let dV = (args.r * previousV - args.alpha * previousV * previousP)
                let dP = (args.beta * previousV * previousP - args.q * previousP)
                return {
                    actual: [previousV + dV * dt, previousP + dP * dt],
                    derivative: [dV, dP]
                }
            }
        }
    }
}

export class Model {
    name: string
    modelID: number
    ids: number[]
    arrayX: number[]
    arrayY: number[][]
    derivative: number[][]
    values: {
        model: string,
        modelisation: string,
        arguments: {
            populations: number[],
            populationNames: string[],
            duration: number,
            step: number,
            args: object
        }

    }
    constructor(name) {
        this.name = name
        this.modelID = globalsModelID++
        models[this.modelID] = this
        this.ids = []
        // this.values = { ...referenceModels["Verhulst"].default}
        this.values = JSON.parse(JSON.stringify(referenceModels["Lotka-Volterra"].default))
        this.generate()
    }
    generate() {
        this.values.arguments.populationNames = this.values.arguments.populationNames || []
        let model: string = this.values.model,
            modelisation: string = this.values.modelisation,
            initialPopulations: number[] = this.values.arguments.populations,
            populationNames: string[] = this.values.arguments.populationNames || [],
            duration: number = this.values.arguments.duration,
            step: number = this.values.arguments.step,
            args: object = this.values.arguments.args

        var populationsCount = initialPopulations.length
        if (this.ids.length !== populationsCount) {
            for (let i = 0, length = globalsIDs.length; i < length; i++) {
                if (globalsIDs[i] === this.modelID) {
                    globalsIDs[i] = null
                    traces.evolution[i] = {}
                    traces.derivative[i] = {}
                }
            }

            this.ids = []
            let k = 0
            while (this.ids.length !== populationsCount) {
                if (globalsIDs[k] == null) {
                    this.ids.push(k)
                    globalsIDs[k] = this.modelID
                }
                k++
            }
        }
        this.arrayX = [0]
        this.arrayY = Array.from(initialPopulations, x => [x])
        this.derivative = Array.from(initialPopulations, x => [NaN])
        step = step <= 0 ? 0.001 : step
        for (let i = step; i < duration; i += step) {
            this.arrayX.push(i)
            let previousPopulations = Array.from(this.arrayY, population => population[population.length - 1])
            let callback = referenceModels[model].functions[modelisation](
                args,
                previousPopulations,
                initialPopulations,
                step,
                i
            )
            let actualPopulation = callback.actual
            let actualDerivative = callback.derivative
            for (let j = 0; j < populationsCount; j++) {
                this.arrayY[j].push(actualPopulation[j])
            }
            if (actualDerivative) {
                for (let j = 0; j < populationsCount; j++) {
                    this.derivative[j].push(actualDerivative[j])
                }
            }
        }
        for (let i = 0; i < populationsCount; i++) {
            traces.evolution[this.ids[i]] = {
                x: this.arrayX,
                y: this.arrayY[i],
                fill: 'tozeroy',
                name: this.values.arguments.populationNames[i] ? this.name + ": " + this.values.arguments.populationNames[i] : this.name
            }
        }
        if (this.derivative.length > 0) {
            for (let i = 0; i < populationsCount; i++) {
                traces.derivative[this.ids[i]] = {
                    x: this.arrayY[i],
                    y: this.derivative[i],
                    name: this.values.arguments.populationNames[i] ? this.name + ": " + this.values.arguments.populationNames[i] : this.name
                }
            }
        }
    }
    delete() {
        for (let i = 0, length = globalsIDs.length; i < length; i++) {
            if (globalsIDs[i] === this.modelID) {
                globalsIDs[i] = null
                traces.evolution[i] = {}
                traces.derivative[i] = {}
            }
        }
        delete models[this.modelID]
    }
}

