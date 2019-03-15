import { Component, OnInit, Input } from '@angular/core';
import { SqliteService, SqliteOutputInterface } from '../sqlite.service';


interface TableColumn {
  name: string;
  type: string;
}

interface TableDetail {
  name: string;
  column: [TableColumn];
}


@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  public fileName: string;
  public tableList: [TableDetail] = <[TableDetail]>[];

  // file=hogeを読む
  @Input('file') set file(file: string) {
    this.fileName = file;
    this.createTableList();
  }

  constructor(
    private Sqlite: SqliteService
  ) {
  }

  ngOnInit() {
  }

  // テーブルのカラム一覧を生成する
  createTableList() {
    if (!this.fileName) {
      return;
    }
    // tslint:disable-next-line:quotemark
    this.Sqlite.execSql(this.fileName, "SELECT name, sql FROM sqlite_master WHERE type='table';")
      .then(res => {
        for (const v of res.values) {
          const cols: [TableColumn] = <[TableColumn]>[];
          const csql = v[1].substring(v[1].indexOf('(') + 1, v[1].indexOf(')')).replace(/`/g, '').split(',');
          for (const iterator of csql) {
            const col = iterator.split(/\s/).filter((str => str.length > 0));
            cols.push({
              name: col[0],
              type: col[1]
            });
          }
          this.tableList.push({
            name: v[0],
            column: cols
          });
        }
      });
  }
}
