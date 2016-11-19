//init localStorage objects
if (!localStorage.text)
	localStorage.text = "";
if (!localStorage.charCount)
	localStorage.charCount = 0;
if (!localStorage.sentenceCount)
	localStorage.sentenceCount = 0;

function textToToneAnalyzerResults(text){
  while(text.length != 0){
    text = textToStorage(text);
    if(text.length != 0){
      //send request
      //clear storage
      console.log(callToneAnalyzer(text));
      localStorage.text = "";
      localStorage.charCount = 0;
      localStorage.sentenceCount = 0;
    }
  }
}

function callToneAnalyzer(text){
  var username = "165c1666-05bd-42d0-a94c-36ca87315c19";
  var password = "4sHSG7B16zn4";

  var authorizationBasic = window.btoa(username + ':' + password);

  $.ajax({
    type: "POST",
    url: "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19",
    data: { body: text },
    dataType: "json",
    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    xhrFields: {
      withCredentials: true
    },
    // crossDomain: true,
    headers: {
    'Content-Type':'text/plain',
    'Authorization': 'Basic ' + authorizationBasic
    },
    //beforeSend: function (xhr) {
    //},
    success: function (result) {
      console.log(result);
      return result;
    },
    //complete: function (jqXHR, textStatus) {
    //},
    error: function (req, status, error) {
      console.log("error: "+ error);
      return {};
    }
  });
}

// saves the pages text
// if hits max, then returns text that did not fit in file.
function textToStorage(newText){
	var text = localStorage.text;
	var charCount = localStorage.charCount;
	var sentenceCount = localStorage.sentenceCount;
	var returnObject = limitSentences(newText, charCount, sentenceCount);
	var arrayOfSentences = returnObject["arrayOfSentences"];
	arrayOfSentences.map(function (sentence) {
		text += sentence;
	});
	localStorage.text = text;
  localStorage.charCount = returnObject["charCount"];
  localStorage.sentenceCount = returnObject["sentenceCount"];
	return returnObject["execessText"];
}

function printStorage(){
  console.log("charCount: " + localStorage.charCount);
  console.log("sentenceCount: " + localStorage.sentenceCount);
  console.log("text: " + localStorage.text);
}

function limitSentences(string, chars, sentenceCount) {
  var MAX_CHARS = 130000 - chars; // Rough estimate from API restrictions
  var MAX_SENTENCES = 1000 - sentenceCount; // Exact maximum from API restrictions
  var arrayOfSentences = regexStrip(string);
  if (arrayOfSentences.length > MAX_SENTENCES) { // Limit number of sentences
    arrayOfSentences = arrayOfSentences.slice(0, MAX_SENTENCES);
  }
  // Limit number of chars
  var charCount = 0;
  var index = 0;
  while (charCount <= MAX_CHARS && index < arrayOfSentences.length) {
    charCount += arrayOfSentences[index].length;
    if (charCount > MAX_CHARS) {
    	charCount -= arrayOfSentences[index].length;
      arrayOfSentences = arrayOfSentences.slice(0, index);
      break;
    }
    index += 1;
  }
  return {
    "arrayOfSentences":arrayOfSentences,
    "execessText":string.slice(0,charCount),
    "charCount":chars + charCount,
    "sentenceCount":sentenceCount + arrayOfSentences.length
  };
}

// Listener for contentScript.js's message.
var parsedPageText;
chrome.runtime.onMessage.addListener(function(message,sender) {
	console.log("Received successfully!");
	parsedPageText = message.text;
});

// Returns a list of sentences that are at least 3 words long
function regexStrip(string) {
  var re = /[^\s\.\?!]+\s[^\.\?!]+\s[^\.\?!]+([\.\?!]|$)/g;
  var array = string.match(re);
  return array;
}

var testString = "Hello there Mr. Popup";
