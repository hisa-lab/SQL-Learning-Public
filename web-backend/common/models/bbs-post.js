'use strict';

module.exports = function(BBSPost) {
    // 制約
    BBSPost.validatesPresenceOf('accountId');

    // エラー作成
    let makeErr = (str, code) => {
        let err = new Error(str);
        err.status = code;
        return err;
    };

    // アカウントを上書き
    BBSPost.beforeRemote('create', (ctx, post, next) => {
        const token = ctx.req && ctx.req.accessToken;

        if (!token) return next(makeErr("再ログインしてください", 401));
        if (ctx.req) {
            ctx.req.body.accountId = token.userId;
            return next();
        } else {
            return next(makeErr("送信内容に不備があります", 400));
        }
    });

};
