import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';
import { NgForage } from '@ngforage/ngforage-ng5';
import * as SQL from 'sql.js';

@Injectable()
export class SqliteService {

  constructor(
    private http: HttpClient,
    private readonly ngf: NgForage
  ) { }

  async resetDB(dbFilename: string) {
    return await this.saveFile2DB(dbFilename);
  }

  async execSql(dbFilename: string, sql: string) {
    const db = new SQL.Database(await this.loadPromise(dbFilename));
    const contents = db.exec(sql);
    this.ngf.setItem(dbFilename, db.export());
    contents[0] ? contents[0].sql = sql : contents[0] = { sql: sql, columns: null, values: [['戻り値が空です']] };
    return contents[0];
  }

  private async saveFile2DB(dbFilename: string) {
    const remoteFile = new Uint8Array(await this.http.get(`/static/db/${dbFilename}`, { responseType: 'arraybuffer' }).toPromise());
    this.ngf.setItem(dbFilename, remoteFile);
    return remoteFile;
  }

  private async loadPromise(dbFilename: string) {
    const localFile: Uint8Array = await this.ngf.getItem<Uint8Array>(dbFilename);
    if (localFile) {
      return localFile;
    }
    return await this.saveFile2DB(dbFilename);
  }

}

export interface SqliteOutputInterface {
  sql: string;
  columns: [string];
  values: [any];
}
