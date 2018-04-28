var _ = require('lodash');
var hmac_sha256 = require("crypto-js/hmac-sha256");
var request = require('request');

const secret = '5504c6b399264aa848a368183cb507b2aba7f33d3db4e07c5c01c2d5b0184d1e'
const publicKey = '2d1542726f235cd8555e486c460b1072d70993dc6720d64ef91acbd9b700bb1b';
const apiUrl = 'https://api.hiveos.farm/worker/eypiay.php';
const webHookKey = 'bu7xTclMF4AuKvF4T0c3Vu';

function setPlug (action) {
  request.get('https://maker.ifttt.com/trigger/' + action + '/with/key/' + webHookKey);
}

const postData = {method: 'getCurrentStats', public_key: publicKey};
const postDataStr = 'method=getCurrentStats&public_key=' + publicKey;

const hmacDigest = hmac_sha256(postDataStr, secret).toString();

request.post({url: apiUrl, headers: {'HMAC': hmacDigest}, form: postData, json:true}, function (error, response, body) {
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode);
  console.log('body:', body);
  view =body;
  const rig1 =  _.get(body, 'result.rigs.58899')
  if (rig1 && !rig1.raw_stats && rig1.ts_last_update) {
    const offTime = new Date(rig1.ts_last_update * 1000);
    const nowDatetimeValue = (new Date()).valueOf();
    console.log(offTime, nowDatetimeValue - offTime);

    if ((nowDatetimeValue - offTime) > (10 * 60000)) {
      console.log('off plug 1 here');
      setPlug('off1');
      setTimeout(function () {
        console.log('on plug 1 here');
        setPlug('on1');
      }, 20000);
    }
  }
});
