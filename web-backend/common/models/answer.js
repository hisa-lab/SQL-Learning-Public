'use strict';
const resultCompare = require('../../lib/resultCompare');

module.exports = function (Answer) {

    // 制約
    Answer.validatesPresenceOf('accountId');
    Answer.validatesPresenceOf('practiceId');

    // エラー作成
    let makeErr = (str, code) => {
        let err = new Error(str);
        err.status = code;
        return err;
    };
    // イベント記録
    Answer.observe('after save', (ctx, next) => {
        const token = ctx.options && ctx.options.accessToken;
        const UserLog = Answer.app.models.UserLog;
        UserLog.create({
            event: "postAnswer",
            target: ctx.instance.practiceId,
            item: ctx.instance.id,
            accountId: token ? token.userId : 0
        }, () => {
            return next();
        });
    });

    // 正誤判定
    Answer.observe('before save', (ctx, next) => {
        const token = ctx.options && ctx.options.accessToken;
        const FILEPATH = Answer.app.settings.uploadFilePath;
        let Practice = Answer.app.models.Practice;
        if (!token) return next(makeErr("再ログインしてください", 401));
        if (ctx.instance) {
            ctx.instance.accountId = token.userId;
            Practice.findOne({
                where: {
                    id: ctx.instance.practiceId,
                }
            }, (err, p) => {
                if (err) return next(makeErr("DBエラー", 500));
                if (!p) return next(makeErr("不正な課題です", 500));
                switch (p.type) {
                    case 'sqlexec':
                        // SQLの実行結果比較
                        switch (p.markingType) {
                            case 'compare':
                                // 単純比較
                                ctx.instance.mark = p.sampleAnswer === ctx.instance.answer;
                                return next();
                            case 'postOnly':
                                // 一応正解を返す
                                ctx.instance.mark = true;
                                return next();
                            case 'resultCompare':
                                resultCompare(`${FILEPATH}/${p.file}`, p.sampleAnswer, ctx.instance.answer, (mark, sqlErrMsg, err) => {
                                    if (err) return next(makeErr(JSON.stringify(err), 500));
                                    if (sqlErrMsg) ctx.instance.message = sqlErrMsg.toString();
                                    ctx.instance.mark = mark;
                                    return next();
                                });
                        }
                        break;
                    case 'ormexec':
                        // ORMの実行結果比較
                        switch (p.markingType) {
                            case 'compare':
                                // 単純比較
                                ctx.instance.mark = p.sampleAnswer === ctx.instance.answer;
                                return next();
                            case 'postOnly':
                                // 一応正解を返す
                                ctx.instance.mark = true;
                                return next();
                            case 'resultCompare':
                                // 非対応なので正解を返す
                                ctx.instance.mark = true;
                                return next();
                        }
                        break;
                    case 'justpost':
                        // 提出のみ
                        ctx.instance.mark = true;
                        return next();
                    default:
                        return next(makeErr("不正な課題です", 500));
                }
            });
        } else {
            return next(makeErr("送信内容に不備があります", 400));
        }
    });
};
