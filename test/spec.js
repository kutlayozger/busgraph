/*global describe, it, before, after */
/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
(function () {
    'use strict';

    var assert = require('assert'),
        lib = require('../src'),
        moment = require("moment"),
        exam = {},
        crudlist,
        globalfail;

    globalfail = function (rj) {
        console.log('***** TEST FAILED ******', rj);
    };

    var wait = (num) => {
        return new Promise((resolve) => {
            setTimeout(resolve, num);
        });
    };


    before(function (done) {
        console.log('BEFORE');
        this.timeout(20000);
        lib.initialize().then(function () {

                done();

        }, globalfail);
    });
    after((done) => {
        console.log('AFTER');
        setTimeout(() => {
            lib.finalize();
            done();
        }, 500);
    });

    describe('Basic Test', function () {
        it('T010', function (done) {
            lib.test1().then(function (resp) {
                console.log('TEST', resp);
                done();
                //assert.equal(answer,'YO!');
            }, globalfail);
        });
        it('T020', function (done) {
            var gc = lib.GraphContainer();
            console.log(gc);
            done();
        });

    });
}());