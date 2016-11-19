// Returns a list of sentences that are at least 3 words long
function regexStrip(string) {
  var re = /[^\s\.\?!]+\s[^\.\?!]+\s[^\.\?!]+([\.\?!]|$)/g;
  var array = string.match(re);
  return array;
}
