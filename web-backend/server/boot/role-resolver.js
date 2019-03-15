module.exports = app => {
    let Role = app.models.Role;
    let Account = app.models.Account;
    let ValidUser = app.models.ValidUser;

    // 生徒
    Role.registerResolver('student', async (role, context, callback) => {
        let reject = () => process.nextTick(() => callback(null, false));

        // 非ログインユーザーは拒否
        let userId = context.accessToken.userId;
        if (!userId) return reject();

        // 対象のユーザーデータを取得
        Account.findOne({
            where: {
                id: userId
            }
        }, (err, user) => {
            if (!user) return reject();

            // 対象のロールを取得
            ValidUser.findOne({
                where: {
                    email: user.email
                }
            }, (err, role) => {
                // ロールが存在しなければ拒否
                if (!role) return reject();

                // studentなら許可
                return callback(null, role.role === "student");
            });
        });
    });

    // 管理者
    Role.registerResolver('admin', (role, context, callback) => {
        let reject = () => process.nextTick(() => callback(null, false));

        // 非ログインユーザーは拒否
        let userId = context.accessToken.userId;
        if (!userId) return reject();

        // 対象のユーザーデータを取得
        Account.findOne({
            where: {
                id: userId
            }
        }, (err, user) => {
            if (!user) return reject();

            // 対象のロールを取得
            ValidUser.findOne({
                where: {
                    email: user.email
                }
            }, (err, role) => {
                // ロールが存在しなければ拒否
                if (!role) return reject();

                // adminなら許可
                return callback(null, role.role === "admin");
            });
        });

    });
};