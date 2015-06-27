#!/usr/bin/env node
'use strict';
var meow = require('meow');

var cli = meow({
  help: [
    'Usage',
    '  ocws-quill --source=<source> <id>',
    '',
    'Example',
    '  ocws-quill --source=mit comedy_errors'
  ].join('\n')
});
if(cli.flags.source != null){
  try{
    var source = require("./sources/" + cli.flags.source);
    if(typeof source == "function"){
      source(cli);
    }
    else{
      console.log("Incomplete source");
    }
  }
  catch(e){
    console.log("Source not found");
  }
}
else{
  cli.showHelp();
}
