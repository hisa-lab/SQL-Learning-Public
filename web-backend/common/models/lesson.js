'use strict';
const ormExec = require("../../lib/ormExec");

module.exports = function (Lesson) {

    // Practiceにおいて、生徒には模範解答を返さないように
    Lesson.afterRemote('prototype.*', function (ctx, modelInstance, next) {
        const token = ctx.req && ctx.req.accessToken;

        // エラー作成
        let makeErr = (str, code) => {
            let err = new Error(str);
            err.status = code;
            return err;
        };

        let removeSampleAnswer = () => {
            if (ctx.result) {
                if (Array.isArray(modelInstance)) {
                    for (let item in ctx.result) {
                        ctx.result[item].sampleAnswer = null;
                    }
                } else {
                    ctx.result.sampleAnswer = null;
                }
            }
        };

        // 未ログインユーザには模範解答を出さない
        if (!token) {
            removeSampleAnswer();
            return next();
        }

        const Account = Lesson.app.models.Account;
        const ValidUser = Lesson.app.models.ValidUser;
        Account.findOne({
            where: {
                id: token.userId
            }
        }, (err, account) => {
            if (err) return next(makeErr("不正なログイン情報です", 401));
            ValidUser.findOne({
                where: {
                    email: account.email
                }
            }, (err, validuser) => {
                if (err) return next(makeErr("不正なログイン情報です", 401));

                // 生徒ロールには模範解答を送信しない
                if (validuser.role === 'student') {
                    removeSampleAnswer();
                }
                next();
            });
        });
    });

    // PostされたコードでORMを実行する
    Lesson.ormExec = (lessonId, practiceId, code, callback) => {
        const FILEPATH = Lesson.app.settings.uploadFilePath;
        let Practice = Lesson.app.models.Practice;

        // 対象の課題を探す
        Practice.findOne({
            where: {
                id: practiceId,
                lessonId: lessonId
            }
        }, (err, practice) => {
            if (err) {
                var error = new Error("対象の課題が見つかりません");
                error.status = 403;
                return callback(error);
            }

            ormExec(`${FILEPATH}/${practice.file}`, code, (stdout, stderr, err) => {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return callback(error);
                }

                return callback(null, stdout, stderr);
            });
        });
    };

    Lesson.remoteMethod('ormExec', {
        accepts: [
            {
                arg: 'lessonId',
                type: 'number',
                required: true
            },
            {
                arg: 'practiceId',
                type: 'number',
                required: true
            },
            {
                arg: 'code',
                type: 'string',
                required: true
            }
        ],
        description: 'Execute osted Code',
        http: {
            verb: 'post',
            path: "/:lessonId/practice/:practiceId/ormExec"
        },
        returns: [
            { arg: 'stdout', type: 'string' },
            { arg: 'stderr', type: 'string' }
        ]
    });


    // 投稿された回答を集計する
    Lesson.answerAggregate = (lessonId, practiceId, callback) => {
        const Practice = Lesson.app.models.Practice;
        const Answer = Lesson.app.models.Answer;
        const ds = Answer.dataSource;
        const sql = "SELECT DISTINCT accountId, COUNT(*) AS 'count', SUM(mark) AS 'point', Account.email FROM`Answer` AS answer INNER JOIN Account ON Account.id = answer.accountId WHERE practiceId = ? GROUP BY accountId";
        ds.connector.query(sql, [practiceId], function (err, answers) {
            if (err) console.error(err);
            callback(err, answers);
        });

    };

    Lesson.remoteMethod('answerAggregate', {
        accepts: [
            {
                arg: 'lessonId',
                type: 'number',
                required: true
            },
            {
                arg: 'practiceId',
                type: 'number',
                required: true
            }
        ],
        description: 'Aggregate posted answer.',
        http: {
            verb: 'get',
            path: "/:lessonId/practice/:practiceId/answerAggregate"
        },
        returns: { arg: 'answer', type: 'any', root: true }
    });

    
    // 投稿された回答を集計する
    Lesson.answerAggregateLesson = (lessonId, callback) => {
        const Answer = Lesson.app.models.Answer;
        const ds = Answer.dataSource;
        const sql = "SELECT * from Practice LEFT OUTER JOIN (SELECT aa.practiceId, SUM(aa.tt) as correctAnswer,SUM(aa.1) as answerCount from (SELECT practiceId, case WHEN SUM(mark) > 0 THEN 1 ELSE 0 end as tt,1 FROM `Answer` GROUP BY accountId,practiceId)as aa GROUP BY aa.practiceId) as bb on bb.practiceId = Practice.id WHERE lessonId = ?";
        ds.connector.query(sql, [lessonId], function (err, answers) {
            if (err) console.error(err);
            callback(err, answers);
        });
    };

    Lesson.remoteMethod('answerAggregateLesson', {
        accepts: [
            {
                arg: 'lessonId',
                type: 'number',
                required: true
            }
        ],
        description: 'Aggregate posted answer.',
        http: {
            verb: 'get',
            path: "/:lessonId/answerAggregate"
        },
        returns: { arg: 'answer', type: 'any', root: true }
    });
};
