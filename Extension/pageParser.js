window.onload = function(){
   	var txt = htmlToText(document.body.innerHTML);
}


function htmlToText(html){
   	var removeScripts = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var htmlTagRegex = /(<([^>]+)>)/ig;
    var extraSpaceRegex = /\s\s+/g;
    return html.replace(removeScripts , "\n").replace(htmlTagRegex , "\n").replace(extraSpaceRegex, ' ');
}