const crypto = require('crypto');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (app) {
  let Account = app.models.Account;
  let ValidUser = app.models.ValidUser;

  //Set Google Auth
  let googleConfig = app.settings['google-login'];

  // ランダムなパスワードを生成
  function generateKey(hmacKey, algorithm, encoding) {
    algorithm = algorithm || 'sha1';
    encoding = encoding || 'hex';
    var hmac = crypto.createHmac(algorithm, hmacKey);
    var buf = crypto.randomBytes(32);
    hmac.update(buf);
    var key = hmac.digest(encoding);
    return key;
  }

  // GoogleのプロファイルからAccountモデルへの変換
  function profileToUser(provider, profile) {
    let email = profile.emails && profile.emails[0] && profile.emails[0].value;
    let username = provider + '.' + (profile.username || profile.id);
    let password = generateKey('password');
    return {
      email: email,
      username: username,
      password: password
    };
  }

  // passportの初期化
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  // Google認証
  passport.use(new GoogleStrategy(googleConfig,
    function (request, accessToken, refreshToken, profile, done) {
      let userObj = profileToUser(googleConfig.provider, profile);

      let query;
      if (userObj.email && userObj.username) {
        query = {
          or: [
            { username: userObj.username },
            { email: userObj.email },
          ]
        };
      } else if (userObj.email) {
        query = { email: userObj.email };
      } else {
        query = { username: userObj.username };
      }

      ValidUser.findOne({
        where: {
          email: userObj.email
        }
      }, (err, role) => {
        if (!role) {
          done(null, false);
        } else {
          Account.findOrCreate({ where: query }, userObj, function (err, user) {
            let ttl = Math.min(user.constructor.settings.ttl, user.constructor.settings.maxTTL);
            user.createAccessToken({
              created: new Date(),
              ttl: ttl
            }, function (err, token) {
              done(err, {
                access_token: token.id,
                userId: user.id.toString(),
                ttl: ttl,
                created: token.created
              });
            });
          });
        }
      });
    }
  ));

  // 認証用ルーティング
  app.get(googleConfig.authPath, passport.authenticate(googleConfig.provider, {
    scope: googleConfig.scope
  }));

  app.get(googleConfig.callbackPath, passport.authenticate(googleConfig.provider, {
    failureRedirect: googleConfig.failureRedirect
  }), (req, res) => {
    res.cookie('authJson', JSON.stringify({
      id: req.user.access_token,
      ttl: req.user.ttl,
      created: req.user.created,
      userId: req.user.userId
    }), {
        signed: req.signedCookies ? true : false,
        maxAge: 1000 * req.user.ttl,
      });
    res.redirect(googleConfig.successRedirect);
  });
};