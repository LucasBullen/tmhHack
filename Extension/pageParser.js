window.onload = function(){
   	var txt = document.body.innerHTML;
   	var removeScripts = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var htmlTagRegex = /(<([^>]+)>)/ig;
    var extraSpaceRegex = /\s\s+/g;
    console.log(txt.replace(removeScripts , "\n").replace(htmlTagRegex , "\n").replace(extraSpaceRegex, ' '));
}