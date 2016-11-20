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
	  
    //Data Table 
    var entries = JSON.parse ( localStorage.dataList );
    var table = document.getElementById("dataTable");
    if (entries.length != 0)
    	document.getElementById("emptyTable").style = "display:none";
    for (i = 0; i < entries.length; i++) {
     	var row = table.insertRow(0);
	row.insertCell(0).innerHTML = entries[i].hours + ":" + entries[i].minutes + ":" + entries[i].seconds ;
	row.insertCell(1).innerHTML = "<font color='red'>" + entries[i].anger + "</font>";
	row.insertCell(2).innerHTML = "<font color='green'>" + entries[i].disgust + "</font>";
	row.insertCell(3).innerHTML = "<font color='purple'>" + entries[i].fear + "</font>";
	row.insertCell(4).innerHTML = "<font color='orange'>" + entries[i].joy + "</font>";
	row.insertCell(5).innerHTML = "<font color='blue'>" + entries[i].sadness + "</font>";
    }
  }
  document.getElementById("loading").innerHTML = "Sentences till next load: "+(1000 - parseInt(localStorage.sentenceCount));
};

//Button clicking listener opens table
document.addEventListener ('DOMContentLoaded', function() {
	document.getElementById ("databutton").addEventListener("click", function () {
	if (document.getElementById ("data").style = "display:none") { 
		document.getElementById ("data").style = "overflow-y:scroll;height:100px;";
		document.getElementById ("databutton").style = "display:none";
	} else {
		document.getElementById ("data").style = "display:none";
	}
	});
});
