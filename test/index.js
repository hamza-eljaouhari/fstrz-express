var expect = require('chai').expect;
var request = require('request');

var indexMainFunction = require('../routes/index.service');


describe('Main route', function() {
  describe('Requests and responses should be correctly set', function() {
    it('should return data when a valid url is passed', function(done) {
        request.post(
            'http://localhost:3000/',
            {
              json: {
                url: 'https://www.fasterize.com'
              },
            }, function(error, res, body) {
            expect(res.body).to.deep.equal({
                plugged: true,
                statusCode: 200,
                fstrzFlags: [
                  'optimisée',
                  'cachée',
                  "Cache CallBack, l'objet est servi par le proxy depuis le cache (cas d'un objet qui n'a pas encore été inclus dans un test A/B)"
                ],
                cloudFrontStatus: 'MISS',
                cloudFrontPOP: 'Madrid'
              });
            done();
        });
    });

    it('should return a validation error', function(done) {
        request.post(
            'http://localhost:3000/',
            {
              json: {
                url: 'wrong url'
              },
            }, function(error, res, body) {
            expect(res.body).to.deep.equal({
                message: "L'URL indiquée est invalide.",
              });
            done();
        });
    });

  });
});