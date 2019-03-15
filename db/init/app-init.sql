-- APIサーバ用データベース作成

CREATE database api;
-- ユーザ作成
grant all on api.* to 'apiuser'@'%' identified by 'apipasswd';
USE api;
