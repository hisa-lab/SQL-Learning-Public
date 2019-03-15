import { Injectable } from '@angular/core';
import { NgForageConfig, NgForageModule, NgForageOptions } from '@ngforage/ngforage-ng5';

@Injectable()
export class ForgeConfService {

  constructor(
    private conf: NgForageConfig
  ) {
    conf.configure({
      version: 3.0,
      driver: NgForageConfig.DRIVER_INDEXEDDB,
      storeName: 'my_store',
      name: 'newDB'
    });
  }
}
