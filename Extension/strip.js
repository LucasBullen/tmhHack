function limitSentences(string) {
  var MAX_CHARS = 130000; // Rough estimate from API restrictions
  var MAX_SENTENCES = 1000; // Exact maximum from API restrictions
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
      arrayOfSentences = arrayOfSentences.slice(0, index);
      break;
    }
    index += 1;
  }
  return arrayOfSentences;
}

// Returns a list of sentences that are at least 3 words long
function regexStrip(string) {
  var re = /[^\s\.\?!]+\s[^\.\?!]+\s[^\.\?!]+([\.\?!]|$)/g;
  var array = string.match(re);
  return array;
}
