# SQL-Learning-Mk2
SQL-Learning のリメイク版

## 目的
* 現在の SQL-Learning は問題が多い
    * Angular1 の開発は続いているものの、古い
    * 素の Express は独自の構成になっており、引継ぎが難しい
    * APIが行き当たりばったりで増改築されている
        * そもそも授業で実用できるシステムを想定していなかった
        * アカウンティング機能も後付け
* 学生向けフロントエンドを Angular5 で更新
* 管理画面を AngularAdmin で作り直し
* APIサーバをLoopback 3.0 に変更
* DBサーバを MongoDB から Mysql に変更 

# 利用方法

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

# 注意点
* Docker on Windows でも動く書き方にすること
* `./web-backend/server/config.*.json` 内に、GoolgeAPIのキーを設定すること