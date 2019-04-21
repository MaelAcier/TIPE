import { Component, OnInit, Input } from '@angular/core';
import { Graph } from '../graph';
import UIkit from 'uikit';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  @Input() graphs: Graph[];

  constructor() { 
    window.onresize = this.resize
  }

  config = { 
    responsive: true,
    toImageButtonOptions: {
      format: 'png', // one of png, svg, jpeg, webp
      height: 500,
      width: 700,
      scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
    },
    displaylogo: false
  }

  ngOnInit() {
    UIkit.notification({message: `<strong>Information:</strong> Le graphe n'est pas adapté à la fenêtre. 
    Pour y remédier, réduire <span class="uk-margin-small-right" uk-icon="icon: shrink"></span>
    puis agrandir <span class="uk-margin-small-right" uk-icon="icon: expand"></span> la fenêtre. </p>`,
     status: 'danger', pos: 'top-left', timeout:0})
  }

  resize() {
    UIkit.notification.closeAll()
  }

}
