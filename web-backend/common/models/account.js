'use strict';
const fs = require('fs-extra');

module.exports = function (Account) {

    // SQliteの実行をクライアント側に移動したため、フォルダ作成の必要なし
    // Account.observe('after save', (ctx, next) => {
    //     const FILEPATH = Account.app.settings.uploadFilePath;
    //     if (ctx.instance) {
    //         fs.mkdirsSync(`${FILEPATH}/${ctx.instance.email}`);
    //     }
    //     next();
    // });
};
