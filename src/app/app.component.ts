import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ControlPanelComponent } from "./control-panel/control-panel.component";
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { Graph } from './graph';

UIkit.use(Icons);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Dynamique des populations';

  @ViewChild(ControlPanelComponent) controlPanel: { graphs: Graph[]; };

  message: string
  graphs: Graph[]

  ngAfterViewInit() {
    this.graphs = this.controlPanel.graphs
  }

}
