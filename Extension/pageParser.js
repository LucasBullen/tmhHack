window.onload = function(){
    console.log("Test logging from pageParser");
   	var txt = htmlToText(document.body.innerHTML);
    chrome.runtime.sendMessage({text: txt, source:"pageParser"});
}


function htmlToText(html){
   	var removeScripts = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var htmlTagRegex = /(<([^>]+)>)/ig;
    var newLineToPer = /\n/igm;
    var extraSpaceRegex = /\s\s+/g;
    return html.replace(removeScripts , "\n").replace(htmlTagRegex , "\n").replace(newLineToPer, '.').replace(extraSpaceRegex, ' ');
}
