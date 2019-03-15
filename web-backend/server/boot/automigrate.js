const fs = require('fs-extra');

module.exports = async app => {
    let ds = app.dataSources.mdb;

    let Account = app.models.Account;
    let ValidUser = app.models.ValidUser;
    let Lesson = app.models.Lesson;
    let Practice = app.models.Practice;
    let BBSPost = app.models.BBSPost;
    let UserLog = app.models.UserLog;

    let Tables = [
        'Account',
        'accessToken',
        'ACL',
        'RoleMapping',
        'Role',
        'Answer',
        'Lesson',
        'Practice',
        'ValidUser',
        'Chat',
        'BBSPost',
        'UserLog'
    ];

    try {
        if (process.env.NODE_ENV === 'production') {
            await ds.autoupdate(Tables);
            // 管理アカウントを追加
            await ValidUser.upsert({
                    email: 'kunimotorimpei@gmail.com',
                    role: 'admin'
                });
        } else {
            await ds.automigrate(Tables);
            // アップロードされているファイルを削除
            const FILEPATH = Practice.app.settings.uploadFilePath;
            let targetRemoveFiles = await fs.readdir(FILEPATH);
            for (let file of targetRemoveFiles) {
                if (file === '.gitkeep') continue;
                await fs.unlink(FILEPATH + '/' + file);
            }

            // ID/PWでログインできる管理アカウントを追加
            let created_user_admin = await Account.create([
                {
                    password: 'admin',
                    username: 'admin',
                    email: 'admin@local'
                }, {
                    password: 'student',
                    username: 'student',
                    email: 'student@local'
                }
            ]);

            // 許可ユーザー追加
            let users = await ValidUser.create([
                {
                    email: 'admin@local',
                    role: 'admin'
                },
                {
                    email: 'student@local',
                    role: 'student'
                },
                {
                    email: 'kunimotorimpei@gmail.com',
                    role: 'admin'
                },
                {
                    email: 'ht14a022@oecu.jp',
                    role: 'student'
                },
                {
                    email: 'ht14a034@oecu.jp',
                    role: 'admin'
                }
            ]);

            // 授業を追加
            let lessonOne = await Lesson.create([{
                title: 'SELECT文',
                number: 1,
                date: Date.now()
            }]);

            // DBファイルを読み込み
            let dbfile = await fs.readFile('./sampledatabase/database1.sqlite3', 'base64');

            // 課題を追加
            let practiceOne = await Practice.create([{
                title: 'SELECT文の実行テスト',
                number: 1,
                body: 'customersテーブルの内容をすべて表示せよ',
                sampleAnswer: "SELECT * from customers;",
                type: "sqlexec",
                markingType: "resultCompare",
                file: dbfile,
                lessonId: lessonOne[0].id
            }]);

            // 課題を追加
            let practiceTwo = await Practice.create([{
                title: 'ORMの実行テスト',
                number: 2,
                body: 'ORMを用いてcustomersテーブルの内容をすべて表示せよ',
                type: "ormexec",
                markingType: "postOnly",
                file: dbfile,
                lessonId: lessonOne[0].id
            }]);
            
            // 掲示板に投稿
            let BBSPostOne = await BBSPost.create([{
                title: 'hogefugapiyo',
                body: 'ほげふがぴよ',
                accountId: created_user_admin[0].id
            }]);
        }
        console.log('Success!');
    } catch (error) {
        console.log('Error: ' + error);
    }
};