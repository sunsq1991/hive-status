var _ = require('lodash');
var hmac_sha256 = require("crypto-js/hmac-sha256");
var request = require('request');

const rigs = [
  {Id: 58899, plugId: 1},
  {Id: 58674, plugId: 2}
];

const secret = '5504c6b399264aa848a368183cb507b2aba7f33d3db4e07c5c01c2d5b0184d1e'
const publicKey = '2d1542726f235cd8555e486c460b1072d70993dc6720d64ef91acbd9b700bb1b';
const apiUrl = 'https://api.hiveos.farm/worker/eypiay.php';
const webHookKey = 'bu7xTclMF4AuKvF4T0c3Vu';

function setPlug (action) {
  request.get('https://maker.ifttt.com/trigger/' + action + '/with/key/' + webHookKey);
}

function checkRig(data, rig) {
  const rigStatus =  _.get(data, 'result.rigs.' + rig.Id);
  console.log('rig status:', rigStatus);
  if (rigStatus && !rigStatus.raw_stats && rigStatus.ts_last_update) {
    const offTime = new Date(rigStatus.ts_last_update * 1000);
    const nowDatetimeValue = (new Date()).valueOf();
    console.log(offTime, nowDatetimeValue - offTime);

    if ((nowDatetimeValue - offTime) > (8 * 60000)) {
      console.log('off plug here');
      setPlug('off' + rig.plugId);
      setTimeout(function () {
        console.log('on plug here');
        setPlug('on' + rig.plugId);
      }, 15000);
    }
  }
}

const postData = {method: 'getCurrentStats', public_key: publicKey};
const postDataStr = 'method=getCurrentStats&public_key=' + publicKey;

const hmacDigest = hmac_sha256(postDataStr, secret).toString();

request.post({url: apiUrl, headers: {'HMAC': hmacDigest}, form: postData, json:true}, function (error, response, body) {
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode);

  _.forEach(rigs, function(rig) {
    checkRig(body, rig);
  });
});
