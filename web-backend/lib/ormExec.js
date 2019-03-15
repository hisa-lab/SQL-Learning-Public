const fs = require('fs-extra');
const exec = require('child_process').exec;
const uuidv4 = require('uuid/v4');

// コードを実行する一時ディレクトリのパス
const RUNDIR = __dirname + '/../rundir/';

// 実行するコードのファイル名
// 送信されたコードはこの名前で一時ディレクトリに保存される
const EXECJS = 'index.js';

// ORM上で利用するデータベースのファイル名
// ターゲットのDBファイルはこの名前で一時ディレクトリにコピーされる
const EXECDB = 'main.sqlite3';

// callback(標準出力, 表示エラー出力, 内部エラーのメッセージ)
module.exports = (targetDBPath, input, callback) => {

    // 実行用ディレクトリを作成
    let dir = RUNDIR + uuidv4() + "/";
    fs.mkdirs(dir, err => {
        if (err) return callback(null, null, err);

        // 実行用ディレクトリにデータベースをコピー
        fs.copy(targetDBPath, dir + EXECDB, err => {
            if (err) return callback(null, null, err);

            // 入力されたコードの無害化
            //  require をすべて sequelize に書き換える
            //  eval を禁止する
            //  import も禁止する
            let inputCode = '\n' + input.replace(/require.*/g, "require('sequelize');").replace(/eval/g, "").replace(/import/g, "");

            // コードをファイルに書き込む
            fs.writeFile(dir + EXECJS, inputCode, err => {
                if (err) return callback(null, null, err);

                // コードを実行し、返す
                exec(`node ${dir + EXECJS}`, {
                    timeout: 2000
                }, (err, stdout, stderr) => {
                    // 構文エラーによる実行の失敗は扱わない
                    // if (err) return callback(null, null, err);

                    // ディレクトリを削除
                    fs.remove(dir, err => {
                        if (err) return callback(null, null, err);

                        // 標準出力と標準エラー出力を返す
                        callback(stdout, stderr, null);
                    });
                });
            });
        });
    });
};