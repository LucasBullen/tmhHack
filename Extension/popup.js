console.log(chrome.extension.getBackgroundPage().testString);
var emotionInfo;
chrome.runtime.onMessage.addListener(function(message,sender) {
	if (message.source === "background") {
		console.log("Received successfully");
		emotionInfo = message.lastValues;
	}
});

window.onload = function() {
  console.log(localStorage.lastValues);
  if (emotionInfo != null) {
    document.getElementById("anger").innerHTML = emotionInfo.anger;
  }
};
