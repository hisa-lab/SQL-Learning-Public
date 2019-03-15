// ネストされたリレーションを設定

module.exports = (app) => {
    console.log('Initializing nestRemoting for models');
    app.models.Lesson.nestRemoting('practice');
};