console.log(chrome.extension.getBackgroundPage().testString);
var emotionInfo;
chrome.runtime.onMessage.addListener(function(message,sender) {
	if (message.source === "background") {
		console.log("Received successfully");
		emotionInfo = message.lastValues;
	}
});

window.onload = function() {
  if (localStorage.lastValues != null) {
  	var jsoned = JSON.parse(localStorage.lastValues);
    document.getElementById("anger").innerHTML = "Anger:"+jsoned.anger;
    document.getElementById("disgust").innerHTML = "Disgust:"+jsoned.disgust;
    document.getElementById("fear").innerHTML = "Fear:"+jsoned.fear;
    document.getElementById("joy").innerHTML = "Joy:"+jsoned.joy;
    document.getElementById("sadness").innerHTML = "Sadness:"+jsoned.sadness;
  }
  document.getElementById("loading").innerHTML = "Sentences till next load: "+(1000 - parseInt(localStorage.sentenceCount));
};
