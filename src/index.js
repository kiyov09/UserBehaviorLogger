import UserBehaviorLogger from './userBehaviorLogger.js';

const UBL = new UserBehaviorLogger()

module.exports = {
    init: UBL.init.bind(UBL)
};
