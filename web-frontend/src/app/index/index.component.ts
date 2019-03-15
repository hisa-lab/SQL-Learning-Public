import { Component, OnInit } from '@angular/core';
import { AuthdataService } from '../authdata.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    public AuthdataService: AuthdataService
  ) { }

  ngOnInit() {
  }

}
