exports.listen = app => {
  const UserLog = app.models.UserLog;

  console.info('WebSocket server started...');
  app.io = require('socket.io')(app.start(), { path: '/ws' });
  app.io.on('connection', socket => {
    console.log('a user connected');

    socket.once('chatSubscribe', data => {
      console.log('chatSubscribe', data);
      // トークンが正しいか確認する
      // 問題ページに入った
      UserLog.create({
        event: "enterPractice",
        target: data.practiceId,
        accountId: data.token ? data.token.userId : 0
      }, () => {
        socket.join(`chat_${data.practiceId}`);
      });
    });

    socket.once('chatUnSubscribe', data => {
      console.log('chatUnSubscribe', data);
      // トークンが正しいか確認する
      // 問題ページから出た
      UserLog.create({
        event: "leavePractice",
        target: data.practiceId,
        accountId: data.token ? data.token.userId : 0
      }, () => {
        socket.disconnect();
      });
    });

    socket.once('disconnect', () => {
      console.log('user disconnected');
    });
  });
};