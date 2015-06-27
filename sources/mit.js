module.exports = function(cli){
  if(cli.input[0] != null) {
    var request = require('request');
    var cheerio = require('cheerio');
    request("http://shakespeare.mit.edu/" + cli.input[0] + "/full.html", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var items = $("a[name],h3,i");
        var play = [];
        for(var i = 0; i < items.length; i++){
          //console.log($(items[i]).html());
          if(items[i].tagName == "h3"){
            if($(items[i]).html().substr(0, 3) == "ACT"){
              play.push([]);
            }
            else{
              play[play.length-1].push([]);
            }
          }
          else if(items[i].tagName == "a"){
            if($(items[i]).attr('name').substr(0, 6) == "speech"){
             play[play.length-1][play[play.length-1].length-1].push({char: $(items[i]).find('b').first().html(), type: "verse", _: ""});
            }
            else{
              play[play.length-1][play[play.length-1].length-1][play[play.length-1][play[play.length-1].length-1].length-1]._ += $(items[i]).html() +  "\n";

            }
          }
          else{
            if(/Enter/.test($(items[i]).html())) {
              play[play.length - 1][play[play.length - 1].length - 1].push({
                _: $(items[i]).html().replace(/Enter/g, ""),
                type: "enter"
              });
            }
            else if(/Exit/.test($(items[i]).html())) {
              play[play.length - 1][play[play.length - 1].length - 1].push({
                _: $(items[i]).html().replace(/Exit/g, ""),
                type: "exit"
              });
            }
            else if(/Exeunt/.test($(items[i]).html())) {
              play[play.length - 1][play[play.length - 1].length - 1].push({
                _: $(items[i]).html().replace(/Exeunt/g, ""),
                type: "exeunt"
              });
            }
            else{
              play[play.length - 1][play[play.length - 1].length - 1].push({
                _: $(items[i]).html(),
                type: "stage"
              });
            }
          }
        }
        console.log('<?xml version="1.0" encoding="UTF-8"?>');
        console.log('<play>');
        console.log('<head>');
        console.log('<title>' + $('.play').first().html() + "</title>");
        console.log('<shortName>' + cli.input[0] + "</shortName>");
        console.log('<image></image>');
        console.log('<note></note>');
        console.log('</head>');
        console.log('<text>');
        for(var actId = 0; actId < play.length; actId++){
          console.log('<act info="">');
          for(var sceneId = 0; sceneId < play[actId].length; sceneId++){
            console.log('<scene info="">');
            for(var speechId = 0; speechId < play[actId][sceneId].length; speechId++){
              console.log('<text char="' + play[actId][sceneId][sceneId].char + '" type="' + play[actId][sceneId][sceneId].type + '">' + decodeURIComponent(play[actId][sceneId][sceneId]._) + "</text>");
            }
            console.log('</scene>');
          }
          console.log('</act>');
        }
        console.log('</text>');
        console.log('</play>');

      }
      else{
        console.log("Bad play id or shakespeare.mit.edu not available");
      }
    });
  }
  else{
    console.log("Specify a play id");
  }
};
