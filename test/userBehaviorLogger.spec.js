/* global describe, it, before */

import chai from 'chai';
import UserBehaviorLogger from '../lib/UserBehaviorLogger.js';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of my library',  () => {
    before(() => {
        lib = UserBehaviorLogger;
    });
    describe('', () => {
        it('should be an object', () => {
            expect(lib).to.be.an('object');
        });
        it('should have the init method', () => {
            expect(lib).to.be.an('object');
            expect(lib).to.be.an('object').that.has.property('init');
        });
    });
});
