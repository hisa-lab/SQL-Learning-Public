'use strict';
const path = require('path');
const fs = require('fs-extra');
const uuidv1 = require('uuid/v1');

module.exports = function (Practice) {
    // 制約
    Practice.validatesInclusionOf('type', { in: ['sqlexec', 'ormexec', 'justpost'] });
    Practice.validatesInclusionOf('markingType', { in: ['compare', 'postOnly', 'resultCompare'] });

    // エラー作成
    let makeErr = (str, code) => {
        let err = new Error(str);
        err.status = code;
        return err;
    };

    // 受け取ったbase64のファイルを格納する
    Practice.observe('before save', (ctx, next) => {
        const FILEPATH = Practice.app.settings.uploadFilePath;
        if (ctx.instance) {
            // データベースがいる形式の問題で
            if (ctx.instance.type === 'sqlexec' || ctx.instance.type === 'ormexec') {
                if (ctx.instance.file) {
                    // ファイルがあればbase64デコードして保存
                    let decode;
                    try {
                        decode = new Buffer(ctx.instance.file, 'base64');
                    } catch (error) {
                        return next(makeErr("不正なファイルです", 400));
                    }
                    let filename = uuidv1();
                    fs.writeFile(`${FILEPATH}/${filename}`, decode, err => {
                        if (err) return next(makeErr("ファイルの保存に失敗しました", 500));
                        ctx.instance.file = filename;
                        return next();
                    });
                } else {
                    // ファイルがない場合はエラー
                    return next(makeErr("ファイルがありません", 400));
                }
            } else {
                return next();
            }
        } else if (ctx.currentInstance) {
            // データベースがいる形式の問題で
            if ((!ctx.data.type && (ctx.currentInstance.type === 'sqlexec' || ctx.currentInstance.type === 'ormexec')) || (ctx.data.type && (ctx.data.type === 'sqlexec' || ctx.data.type === 'ormexec'))) {
                if (ctx.data.hasOwnProperty('file') && ctx.data.file.length > 0) {
                    // base64デコードして保存
                    let decode;
                    try {
                        decode = new Buffer(ctx.data.file, 'base64');
                    } catch (error) {
                        return next(makeErr("不正なファイルです", 400));
                    }
                    let filename = uuidv1();
                    fs.writeFile(`${FILEPATH}/${filename}`, decode, err => {
                        if (err) return next(makeErr("ファイルの保存に失敗しました", 500));
                        // ファイルがあれば古いファイルを削除して
                        fs.unlink(`${FILEPATH}/${ctx.currentInstance.file}`, err => {
                            ctx.data.file = filename;
                            return next();
                        });
                    });
                } else {
                    // ファイルに変更がない場合は何もしない
                    return next();
                }
            } else {
                // データベースのいらない問題形式の場合、もしくはそうなった場合で
                // 過去の問題形式がデータベースを必要とした場合、不要になったので削除
                if (ctx.currentInstance.type === 'sqlexec' || ctx.currentInstance.type === 'ormexec') {
                    fs.unlink(`${FILEPATH}/${ctx.currentInstance.file}`, () => { });
                }
                return next();
            }
        } else {
            let err = new Error();
            err.status = 400;
            return next(err);
        }
    });

    // 削除するときはファイルも消す
    Practice.observe('before delete', (ctx, next) => {
        const FILEPATH = Practice.app.settings.uploadFilePath;
        if (ctx.instance) {
            fs.unlink(`${FILEPATH}/${ctx.instance.file}`, () => { });
        }
        next();
    });
};
