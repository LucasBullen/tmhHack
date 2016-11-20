var MAX_CHARS = 130000; // Rough estimate from API restrictions
var MAX_SENTENCES = 1000; // Exact maximum from API restrictions
var parsedPageText;

class dataPoint {
	constructor (anger, disgust, fear, joy, sadness) {
		this.anger = Math.round(anger * 100) / 100;
		this.disgust = Math.round(disgust * 100) / 100;
		this.joy = Math.round(joy * 100) / 100;
		this.fear = Math.round(fear * 100) / 100;
		this.sadness = Math.round(sadness * 100) / 100;		
		var d = new Date();
		this.hours = d.getHours();
		this.minutes = d.getMinutes();
		this.seconds = d.getSeconds();
	}
}

//init localStorage objects
if (!localStorage.text)
	localStorage.text = "";
if (!localStorage.charCount)
	localStorage.charCount = 0;
if (!localStorage.sentenceCount)
	localStorage.sentenceCount = 0;
if (!localStorage.dataList) 
	localStorage.dataList = JSON.stringify([]);

function addNewDataPoint (anger,disgust,joy,fear,sadness) {
	var newPoint = new dataPoint (anger,disgust,joy,fear,sadness);
	var tempArray = JSON.parse ( localStorage.dataList );
	tempArray.push(newPoint);
	localStorage.dataList = JSON.stringify (tempArray);
}

function textToToneAnalyzerResults(text){
  while(text.length != 0){
    text = textToStorage(text);
    if(text.length != 0){
      //send request
      //clear storage
      callToneAnalyzer(localStorage.text);
      console.log("sending");
      //logAnalysis()
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
  text = "this is a sentence."

  var fd = new FormData();
  fd.append( 'text', text );


  $.ajax({
    type: "POST",
    url: "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19",
    data: fd,
    processData: false,
    contentType: false,
   // dataType: "json",
   // contentType: '',
    // xhrFields: {
    //   withCredentials: true
    // },
    // crossDomain: true,
    headers: {
    'Content-Type':'text/plain',
    'Authorization': 'Basic ' + authorizationBasic
    },
    //beforeSend: function (xhr) {
    //},
    success: function (result) {
      var hold = result.document_tone.tone_categories[0].tones;
      addNewDataPoint (hold[0].score,hold[1].score,hold[2].score,hold[3].score,hold[4].score);
      localStorage.lastValues = JSON.stringify({
        'anger':hold[0].score,
        'disgust':hold[1].score,
        'fear':hold[2].score,
        'joy':hold[3].score,
        'sadness':hold[4].score
      });
      console.log(result);
      chrome.runtime.sendMessage({
        lastValues: {
          'anger':hold[0].score,
          'disgust':hold[1].score,
          'fear':hold[2].score,
          'joy':hold[3].score,
          'sadness':hold[4].score
        },
        source:"background"
      });
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
	var charCount = parseInt(localStorage.charCount);
	var sentenceCount = parseInt(localStorage.sentenceCount);
	var returnObject = limitSentences(newText, charCount, sentenceCount);
	var arrayOfSentences = returnObject["arrayOfSentences"];
	arrayOfSentences.map(function (sentence) {
		text += " " +sentence;
	});
	localStorage.text = text;
  localStorage.charCount = returnObject["charCount"];
  localStorage.sentenceCount = returnObject["sentenceCount"];
	return returnObject["execessText"];
}

function printStorage(text, char, sent, other){
  if (text !== false) console.log("charCount: " + localStorage.charCount);
  if (char !== false) console.log("sentenceCount: " + localStorage.sentenceCount);
  if (sent !== false) console.log("text: " + localStorage.text);
  if (sent !== false){
    console.log("text:");
    console.log(localStorage.lastValues);
  }
}

function resetStorage(){
  localStorage.text = "";
  localStorage.charCount = 0;
  localStorage.sentenceCount = 0;
  localStorage.dataList = JSON.stringify([]);
  printStorage();
}

function limitSentences(theString, chars, sentenceCount) {
  var allowedChars = MAX_CHARS - chars; // Rough estimate from API restrictions
  var allowedSentences = MAX_SENTENCES - sentenceCount; // Exact maximum from API restrictions
  var arrayOfSentences = regexStrip(theString);
  var execessSentences = arrayOfSentences;
  if (arrayOfSentences == null){ // no sentences found, return and remove the string
    return {
      "arrayOfSentences":[],
      "execessText":"",
      "charCount":chars,
      "sentenceCount":sentenceCount
    };
  }
  if (arrayOfSentences.length > allowedSentences) { // Limit number of sentences
    arrayOfSentences = arrayOfSentences.slice(0, allowedSentences);
  }
  // Limit number of chars
  var charCount = 0;
  var index = 0;
  while (charCount <= allowedChars && index < arrayOfSentences.length) {
    charCount += arrayOfSentences[index].length;
    if (charCount > allowedChars) {
    	charCount -= arrayOfSentences[index].length;
      arrayOfSentences = arrayOfSentences.slice(0, index);
      break;
    }
    index += 1;
  }
  // convert execess to string
  execessSentences = execessSentences.slice(arrayOfSentences.length,execessSentences.length);
  var execessText = "";
  execessSentences.map(function (sentence) {
    execessText += sentence;
  });

  return {
    "arrayOfSentences":arrayOfSentences,
    "execessText":execessText,
    "charCount":chars + charCount,
    "sentenceCount":sentenceCount + arrayOfSentences.length
  };
}

// Listener for contentScript.js's message.
var parsedPageText;
chrome.runtime.onMessage.addListener(function(message,sender) {
	if (message.source === "pageParser") {
		console.log("Received successfully");
		parsedPageText = message.text;
    textToToneAnalyzerResults(parsedPageText);
	}
});

// Returns a list of sentences that are at least 3 words long
function regexStrip(string) {
  var re = /[^\.\?!]+\s[^\.\?!]+\s[^\.\?!]+([\.\?!]|$)/g;
  var array = string.match(re);
  return array;
}

var testString = "Hello there Mr. Popup";
