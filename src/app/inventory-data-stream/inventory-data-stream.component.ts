import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory-data-stream',
  templateUrl: './inventory-data-stream.component.html',
  styleUrls: ['./inventory-data-stream.component.scss']
})
export class InventoryDataStreamComponent implements OnInit {

  active = 1;
  public isCollapsed = true;
  constructor() { }

  ngOnInit(): void {
  }

}
