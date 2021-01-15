
const request = require('request');
const xFstrzTags = require('../data/x-fstrz-tags');
const cloudfrontEdgeLocations = require('../data/cloudfront-edge-locations.json');

const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

module.exports = function(req, res, next) {
    var regex = new RegExp(urlPattern);
    console.log("req.body", req.body)
    if (!req.body.url.match(regex)) {
      
      var validationError = {
        message: "L'URL indiquée est invalide.",
      };
  
      res.status(400).json(validationError);
  
    } else {
  
      request(req.body.url, function (error, response, body) {
        if(error){
          if(error.code === 'ENOTFOUND'){
            res.status(404).json({
              message: "L'URL que vous avez indiqué est injoignable."
            });
          }else{
            res.status(error.statusCode).json(error);
          }
        }
  
        if (!error && response.statusCode === 200) {
  
          var headers = {
  
            plugged: response.headers['server'] == 'fasterize',
  
            statusCode: response.statusCode,
  
            fstrzFlags: response.headers['x-fstrz'] ? response.headers['x-fstrz'].split(',').map(function(flag){
                return xFstrzTags[flag].trim();
            }) : [],
  
            cloudFrontStatus: response.headers['x-cache'] ? (function(xCacheHeader){
              if(xCacheHeader == 'Hit from couldfront'){
                return 'HIT';
              }
              
              if(xCacheHeader == 'Miss from cloudfront'){
                return 'MISS';
              }
            })(response.headers['x-cache']) : '',
  
            cloudFrontPOP: response.headers['x-amz-cf-pop'] ? cloudfrontEdgeLocations.nodes[response.headers['x-amz-cf-pop'].slice(0, 3)].city : ''
  
          };
          
          res.status(200).json(headers);
        }
      });
    }
}