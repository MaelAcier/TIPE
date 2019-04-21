import { Component, OnInit } from '@angular/core';
import { Graph } from '../graph';
import { Model, models, traces, referenceModels , globalsModelID, globalsIDs} from '../model';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  models = models
  globalsModelID = globalsModelID
  referenceModels = referenceModels
  globalsIDs = globalsIDs
  modelNumber = Object.keys(models).length

  constructor() { }

  ngOnInit() {
    new Model("Courbe n°1")
    this.modelNumber = Object.keys(models).length
  }

  changeModel (name,id: number) {
    models[id].values = {...referenceModels[name].default}
    models[id].generate()
  }

  update (value, id:number) {
    models[id].generate()
  }

  addModel () {
    new Model(`Courbe n°${globalsModelID+1}`)
    this.modelNumber = Object.keys(models).length
  }

  delModel (id: number) {
    models[id].delete()
    this.modelNumber = Object.keys(models).length
  }

  transition = {
    duration: 1000,
    easing: 'cubic-in-out'
  }

  graphs : Graph[] = [
    {
      data: traces.evolution || [{ x: [], y: []}],
      layout: {
        title: 'Evolution',
        height: 800,
        uirevision: 'true',
        transition: this.transition,
      },
    },
    {
      data: traces.derivative || [{ x: [], y: []}],
      layout: {
        title: 'Portrait de phase',
        height: 800,
        uirevision: 'true',
        transition: this.transition,
      }
    }
  ]

}
