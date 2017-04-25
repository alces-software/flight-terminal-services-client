/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

//
// == Cluster spec loading =================================
//

// Map from cluster spec key to cluster spec name.
var ClusterSpecKeyToNameMap = {};

// Load cluster specs and populate ClusterSpecKeyToNameMap and the cluster
// specs selection checkboxes.
(function () {
  var httpRequest;
  const clusterSpecsUrl = 'https://s3-eu-west-1.amazonaws.com/alces-flight/FlightLaunch/ClusterSpecs/test.json';
  makeRequest(clusterSpecsUrl);

  function makeRequest(url) {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      writeError("Unable to load cluster specs");
      return false;
    }
    httpRequest.onreadystatechange = generateClusterSelectionList;
    httpRequest.open('GET', url);
    httpRequest.send();
  }

  function generateClusterSelectionList() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        clusterSpecs = JSON.parse(httpRequest.responseText).clusterSpecs;
        for (var i=0; i < clusterSpecs.length; i++) {
          spec = clusterSpecs[i];

          var div = document.createElement("div");
          var input = document.createElement("input");
          input.type = 'checkbox';
          input.value = spec.key;
          input.disabled = true;
          var label = document.createElement("label");
          label.append(input, spec.ui.title);
          div.append(label);
          document.getElementById('clustersList').append(div);

          ClusterSpecKeyToNameMap[spec.key] = spec.ui.title;

        }
      } else {
        writeError("There was a problem loading the cluster specs");
      }
    }
  }
})();

//
// == Utils ================================================
//

function getRadioValue(radioName) {
  var radios = document.getElementsByName(radioName);
  for (var i=0; i<radios.length; i++) {
    var radio = radios[i];
    if (radio.checked) {
      return radio.value;
    }
  }
}

// Return a random integer in the range [0,max).
function rand(max) {
  return Math.floor(Math.random() * max);
}

// Return a random element from collection.
function randomChoice(collection) {
  const index = rand(collection.length);
  return collection[index];
}

function writeInfo(msg, append) {
  if (append) {
    document.getElementById('infoMessages').innerHTML += msg;
  } else {
    document.getElementById('infoMessages').innerHTML = msg;
  }
}

function writeError(err) {
  document.getElementById('errorMessages').innerHTML += err + "\n";
}

function clearErrorMessages() {
  document.getElementById('errorMessages').innerHTML = "";
}

window.onerror = writeError;

//
// == Token generation configuration =======================
//

function getTokenTag() {
  return document.getElementById('tokenTag').value;
}

// Return the type of token to be generated. Either 'meaningless' or 'absurd'.
function getTokenType() {
  return getRadioValue('tokenType');
}

// Return if the tokens should be restricted to certain clusters.
//
// This is used when creating new tokens. It does not query an already created
// token.
function areTokensRestricted() {
  return getRadioValue('tokenRestriction') === 'restricted';
}

// Return list of cluster restriction checkboxes
function clusterSelectionCheckboxes() {
  return document.getElementById("clustersList").getElementsByTagName('input');
}

// Return list of cluster spec keys that the tokens should be able to launch.
//
// This list is used when creating new tokens.  It does not query an already
// created token for the clusters it can launch.
function permittedClusterKeys() {
  var keys = [];
  var checkboxes = clusterSelectionCheckboxes();
  for (var i=0; i < checkboxes.length; i++) {
    var checkbox = checkboxes[i];
    if (checkbox.checked) {
      var key = checkbox.value;
      keys.push(key);
    }
  }
  return keys;
}

// Toggle the disabled status of the cluster list checkboxes, dependant on
// whether clusters are restricted.
function toggleClusterRestriction() {
  var disable = !areTokensRestricted();

  var checkboxes = clusterSelectionCheckboxes();
  for (var i=0; i < checkboxes.length; i++) {
    checkboxes[i].disabled = disable;
  }
}


//
// == General token generation functions ===================
//

function randomToken() {
  var tokenType = getTokenType();
  if (tokenType === 'meaningless') {
    return generateMeaninglessTriple();
  } else if (tokenType === 'absurd') {
    return generateSemiMeaningfulToken();
  } else {
    writeError("Unable to generate tokens. Unknown token type " + tokenType);
  }
}


//
// == Generation of absurd tokens =================
//
// E.g., reassuringly-penitent-plastic-fork
//
// Requires that the HTML page including this JS has set global +combinations+
// and +lists+ variables correctly.

function generateSemiMeaningfulToken() {
  var combination = randomChoice(combinations);
  var parts = [];
  for (var i=0; i<combination.length; i++) {
    parts.push(randomChoice(lists[combination[i]]));
  }
  return parts.join("-");
}

//
// == Generation of meaningless tokens =====================
//
// E.g., butarofe-dogre-lomenykebru
//
var SYLLABLES_2CH = "ba be bi bo bu by da de di do du dy fe fi fo fu fy ga \
      ge gi go gu gy ha he hi ho hu hy ja je ji jo ju jy ka ke ko ku ky la le \
      li lo lu ly ma me mi mo mu my na ne ni no nu ny pa pe pi po pu py ra re \
      ri ro ru ry sa se si so su sy ta te ti to tu ty va ve vi vo vu vy er ed \
      in ex al en an ad or at ca ap el ci an et it ob of af au cy im op co up".split(/ +/)

var SYLLABLES_3CH = "bra bre bri bro bru bry dra dre dri dro dru dry fra fre \
      fri fro fru fry gra gre gri gro gru gry pra pre pri pro pru pry sta ste \
      sti sto stu sty tra tre ing con ter com per ble der cal man est for mer \
      col ful get low son tle day pen pre ten tor ver ber can ple fer gen den \
      mag sub sur men min out tal but cit cle cov dif ern eve hap ket nal sup \
      ted tem tin tro tro".split(/ +/)

var SYLLABLES = SYLLABLES_2CH.concat(SYLLABLES_3CH);
var VOWELS = "a e i o u y".split(/ +/);

function generateMeaninglessTriple() {
  return generateMeaninglessToken(rand(3)+4, rand(3)+3, rand(3)+4)
}

function generateMeaninglessToken() {
  var lengths = Array.prototype.slice.call(arguments);
  var parts = [];
  lengths.forEach(function(l) {
    parts.push(generateMeaninglessPart(l));
  });
  return parts.join('-');
}

function generateMeaninglessPart(length) {
  var s = "";
  while ((remainder = length - s.length) > 0) {
    switch (remainder) {
      case 1:
        s = s.concat(randomChoice(VOWELS));
      case 2:
        s = s.concat(randomChoice(SYLLABLES_2CH));
      default:
        s = s.concat(randomChoice(SYLLABLES));
    }
  }
  return s;
}

//
// == Clipboard interaction ================================
//

function selectTextarea(element) {
  element.select();
  element.setSelectionRange(0, element.value.length);
  return element.value;
}

function selectTable(el) {
  var body = document.body, range, sel;
  if (document.createRange && window.getSelection) {
    range = document.createRange();
    sel = window.getSelection();
    sel.removeAllRanges();
    try {
      range.selectNodeContents(el);
      sel.addRange(range);
    } catch (e) {
      range.selectNode(el);
      sel.addRange(range);
    }
  } else if (body.createTextRange) {
    range = body.createTextRange();
    range.moveToElementText(el);
    range.select();
  }
}

function copyToClipboard() {
  var succeeded;

  var element = document.getElementById("tokenTable");
  selectTable(element);

  try {
    succeeded = document.execCommand('copy');
  } catch (err) {
    succeeded = false;
  }
  if (succeeded) {
    writeInfo("Copied!");
  } else {
    writeError("Unable to copy. Press Ctrl-C.");
  }
}

//
// == Dynamodb interaction =================================
//

var docClient = undefined;
function updateAWSConfig() {
  var accessKeyId = document.getElementById('awsAccessKeyId').value;
  var secretAccessKey = document.getElementById('awsSecrectAccessKey').value;

  AWS.config.update({
    region: "eu-west-1",
    // The endpoint should point to the local or remote computer where DynamoDB (downloadable) is running.
    endpoint: 'dynamodb.eu-west-1.amazonaws.com',
    /*
           accessKeyId and secretAccessKey defaults can be used while using the downloadable version of DynamoDB. 
           For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
           */
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  });

  /* 
       Uncomment the following code to configure Amazon Cognito and make sure to 
       remove the endpoint, accessKeyId and secretAccessKey specified in the code above. 
       Make sure Cognito is available in the DynamoDB web service region (specified above).
       Finally, modify the IdentityPoolId and the RoleArn with your own.
       */
  /*
       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
       IdentityPoolId: "us-west-2:12345678-1ab2-123a-1234-a12345ab12",
       RoleArn: "arn:aws:iam::123456789012:role/dynamocognito"
       });
       */

  var dynamodb = new AWS.DynamoDB();
  docClient = new AWS.DynamoDB.DocumentClient();

  document.getElementById("credentials").style.display = 'none';
  document.getElementById("generator").style.display = 'block';
}

function createToken() {
  var token = randomToken();
  if (token == null) { return; }
  var tag = getTokenTag();
  var params = {
    TableName: "FlightLaunchTokens",
    Item: {
      "Token": token,
      "Status": "AVAILABLE",
      "CreatedAt": new Date().toISOString(),
      "Tag": tag,
    },
    ConditionExpression: "attribute_not_exists(#token)",
    ExpressionAttributeNames: {
      "#token": "Token",
    },
  };
  if (areTokensRestricted()) {
    params.Item.ClusterSpecKeys = permittedClusterKeys();
  }

  docClient.put(params, function(err, data) {
    if (err) {
      writeError("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2));
    } else {
      var getParams = {
        Key: { Token: token },
        TableName: "FlightLaunchTokens",
      };
      docClient.get(getParams, function(err, data) {
        if (err) {
          writeError("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
          writeTokens([ data.Item ]);
        }
      });
    }
  });
}

function createTokens() {
  clearErrorMessages();
  var numTokens = parseInt(document.getElementById('numTokens').value, 10) || 1;
  writeInfo("Creating " + numTokens + " tokens...");
  if (areTokensRestricted() && permittedClusterKeys().length < 1) {
    writeError("When creating restricted tokens at least one cluster must be selected");
  } else {
    for (var i=0; i<numTokens; i++) {
      createToken();
    }
  }
}

function scanData() {
  clearErrorMessages();
  writeInfo("Loading tokens...");
  clearTable();

  var params = {
    TableName: "FlightLaunchTokens",
    FilterExpression: "#status = :available",
    ExpressionAttributeNames: {
      "#status": "Status",
    },
    ExpressionAttributeValues: {
      ":available": "AVAILABLE",
    },
  };

  docClient.scan(params, onScan);

  function onScan(err, data) {
    if (err) {
      writeError("Unable to scan the table: " + "\n" + JSON.stringify(err, undefined, 2));
    } else {
      writeTokens(data.Items);

      // Continue scanning if we have more tokens (per scan 1MB limitation)
      if (data.LastEvaluatedKey) {
        writeInfo("Loading more...", true);
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);            
      }
    }
    writeInfo("Done", true);
  }
}


//
// == Presentation of tokens ===============================
//

function clearTable() {
  document.getElementById('tokenTableBody').innerHTML = "";
}

function writeTokens(tokens) {
  var table = document.getElementById('tokenTableBody');
  tokens
    .sort(function(a, b) { return a.Token < b.Token ? -1 : 1 })
    .forEach(function(token) {
      var tokenCell = document.createElement("td");
      tokenCell.append(token.Token);

      var permittedClustersCell = document.createElement("td");
      if (token.ClusterSpecKeys == null || token.ClusterSpecKeys.length < 0) {
        var em = document.createElement('em');
        em.append('Unrestricted');
        permittedClustersCell.append(em);
      } else {
        var clusterNames = [];
        for (var i=0; i < token.ClusterSpecKeys.length; i++) {
          var key = token.ClusterSpecKeys[i];
          clusterNames.push(ClusterSpecKeyToNameMap[key]);
        }
        permittedClustersCell.append(clusterNames.join(", "));
      }

      var tagCell = document.createElement("td");
      tagCell.append(token.Tag || '');

      var tr = document.createElement("tr");
      tr.append(tokenCell);
      tr.append(permittedClustersCell);
      tr.append(tagCell);
      table.append(tr);
    });
}

