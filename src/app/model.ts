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
            "Discret": (args, previousPopulation) => {
                let previous = previousPopulation[0]
                let actual = previous * args.r
                return { actual: [actual] }
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
            }
        }
    },
    "Allee": {},
    "Leslie": {},
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
            populations: number[] = this.values.arguments.populations,
            populationNames: string[] = this.values.arguments.populationNames || [],
            duration: number = this.values.arguments.duration,
            step: number = this.values.arguments.step,
            args: object = this.values.arguments.args

        var populationsCount = populations.length
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
        this.arrayY = Array.from(populations, x => [x])
        this.derivative = Array.from(populations, x => [NaN])
        step = step <= 0 ? 0.001 : step
        for (let i = step; i < duration; i += step) {
            this.arrayX.push(i)
            let previousPopulation = [], initialPopulation = []
            for (let j = 0; j < populationsCount; j++) {
                previousPopulation.push(this.arrayY[j][this.arrayY[0].length - 1])
                initialPopulation.push(this.arrayY[j][0])
            }
            let callback = referenceModels[model].functions[modelisation](
                args,
                previousPopulation,
                initialPopulation,
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

