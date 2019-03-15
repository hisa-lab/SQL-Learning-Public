'use strict';

module.exports = function(Validuser) {
    Validuser.validatesUniquenessOf('email');
};
