//init localStorage objects
if (!localStorage.text)
	localStorage.text = "";
if (!localStorage.charCount)
	localStorage.charCount = 0;
if (!localStorage.sentenceCount)
	localStorage.sentenceCount = 0;

function textToToneAnalyzerResults(text){

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

// Returns a list of sentences that are at least 3 words long
function regexStrip(string) {
  var re = /[^\s\.\?!]+\s[^\.\?!]+\s[^\.\?!]+([\.\?!]|$)/g;
  var array = string.match(re);
  return array;
}

var views = chrome.extension.getViews({
    type: "popup"
});
console.log(views);
for (var i = 0; i < views.length; i++) {
    views[i].document.getElementById('body-text').innerHTML = "My Custom Value";
}
