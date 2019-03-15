# SQL-Learning-Public
データベース演習支援システムの公開版

https://www.ieice.org/ken/paper/20190315V1KC/

# 利用方法
## 事前準備
* `./web-backend/server/config.*.json` 内に、GoolgeAPIのキーを設定すること

## 開発時
* 以下のコマンドを実行後`http://localhost:4200`にアクセス
```
$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```
* バックエンドのAPIサーバは `http://localhost:3000`で稼働している
    * WebpackDevServerによりリバースプロクシされているため必要ない
        * `http://localhost:3000/api` → `http://localhost:4200/api`
* HMRが有効になっているため、フロントエンドの開発の場合、リロードは不要
* Nodemonで起動しているため、バックエンドの開発の場合も、リロードは不要

## デプロイ
* 以下のコマンドを実行後、`3005`ポートで起動している
* Webpack がminify等を行うため、１分程度かかる
```
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

