const path = require('path');
const fs = require('fs-extra');
const uuidv1 = require('uuid/v1');
const sqlite3 = require('sqlite3');

function removeas(inputSql) {
    // カンマを[ , ]に置換
    // 連続する空白を一つに
    // 大文字小文字区別しないで [as ]から次の[ ]を削除
    return inputSql;
    // return inputSql.replace(/,/g, ' , ').replace(/\s+/g, ' ').replace(/as\s.*?\s/ig, '');
}

// callback(正誤判定, SQLエラーのメッセージ, 内部エラーのメッセージ)
module.exports = (targetDBPath, sampleAnswer, input, callback) => {
    if (!targetDBPath || !sampleAnswer || !input) return callback(false, null, "input error");
    let tempDBFilename = targetDBPath + uuidv1();

    fs.copy(targetDBPath, tempDBFilename, (err) => {
        if (err) return error(err);

        // DBを開く
        let db = new sqlite3.Database(tempDBFilename);

        // DBを閉じでDBのファイルを削除
        let cleanUp = cb => {
            db.close(() => {
                fs.unlink(tempDBFilename, cb);
            });
        };

        // エラーを投げる
        let error = err => {
            cleanUp(() => {
                callback(false, null, err);
            });
        };

        // 対象のDBに模範解答を実行し、JSONにする
        db.all(removeas(sampleAnswer), (err, tables) => {
            if (err) return error(err);
            let ansJson = JSON.stringify(tables);
            // データベースを初期化し、開きなおす
            cleanUp(() => {
                fs.copy(targetDBPath, tempDBFilename, (err) => {
                    db = new sqlite3.Database(tempDBFilename);
                    // 送信された解答を実行し、JSONにする
                    db.all(removeas(input), (err, tables) => {
                        // SQLの構文エラーはエラーとして扱わない
                        // if (err) return error(err);
                        let inputJson = JSON.stringify(tables);
                        cleanUp(() => {
                            callback(ansJson === inputJson, err, false);
                        });
                    });
                });
            });
        });
    });
};