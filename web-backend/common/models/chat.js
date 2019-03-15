'use strict';

module.exports = function (Chat) {

    // 制約
    Chat.validatesPresenceOf('accountId');
    Chat.validatesPresenceOf('practiceId');

    // エラー作成
    let makeErr = (str, code) => {
        let err = new Error(str);
        err.status = code;
        return err;
    };

    // アカウントを上書き
    Chat.observe('before save', (ctx, next) => {
        const token = ctx.options && ctx.options.accessToken;
        if (!token) return next(makeErr("再ログインしてください", 401));
        if (ctx.instance) {
            ctx.instance.accountId = token.userId;
            return next();
        } else {
            return next(makeErr("送信内容に不備があります", 400));
        }
    });


    Chat.observe('after save', (ctx, next) => {
        console.log(ctx.instance);
        if (ctx.isNewInstance) {
            console.log(ctx.instance.practiceId);
            Chat.app.io.to(`chat_${ctx.instance.practiceId}`).emit('chatUpdate', ctx.instance);
        }
        next();
    });
};
