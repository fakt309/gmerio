function doFunction(name, attrs) {
  switch (name) {
    case 'link':
      if (!attrs[1]) {
        attrs[1] = attrs[0];
      }
      attrs[1] = attrs[1].replace(/ /g, '&nbsp;');
      attrs[1] = attrs[1].replace(/</g, "&lt;");
      attrs[1] = attrs[1].replace(/>/g, "&gt;");
      return '<a href="'+attrs[0]+'" class="linkContent">'+attrs[1]+'</a>';
    case 'img':
      if (!attrs[1]) {
        attrs[1] = '';
      }
      return '<img alt="'+attrs[1]+'" src="'+attrs[0]+'" class="imageContent" />';
    case 'title':
      return '<h2 class="titleContent">'+attrs[0]+'</h2>';
    case 'code':
      if (!attrs[1]) {
        attrs[1] = 'html';
      }
      return '<div class="codeStringContent">'+Prism.highlight(attrs[0].replace(/\n/g, ''), Prism.languages[attrs[1]], attrs[1])+'</div>';
    case 'blockcode':
      if (!attrs[1]) {
        attrs[1] = 'html';
      }
      return '<div class="codeContent"><div class="titleCodeContent">'+attrs[1]+'</div><div class="textCodeContent">'+Prism.highlight(attrs[0], Prism.languages[attrs[1]], attrs[1])+'</div></div>';
    case 'b':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<b>'+attrs[0]+'</b>';
    case 'i':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<i>'+attrs[0]+'</i>';
    case 'd':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<del>'+attrs[0]+'</del>';
    case 'bi':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<b><i>'+attrs[0]+'</i></b>';
    case 'ib':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<i><b>'+attrs[0]+'</b></i>';
    case 'bd':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<b><del>'+attrs[0]+'</del></b>';
    case 'db':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<b><del>'+attrs[0]+'</del></b>';
    case 'id':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<i><del>'+attrs[0]+'</del></i>';
    case 'di':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<del><i>'+attrs[0]+'</i></del>';
    case 'bid':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<b><i><del>'+attrs[0]+'</del></i></b>';
    case 'bdi':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<b><del><i>'+attrs[0]+'</i></del></b>';
    case 'dbi':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<del><b><i>'+attrs[0]+'</i></b></del>';
    case 'ibd':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<i><b><del>'+attrs[0]+'</del></b></i>';
    case 'idb':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<i><del><b>'+attrs[0]+'</b></del></i>';
    case 'dib':
      attrs[0] = attrs[0].replace(/ /g, '&nbsp;');
      attrs[0] = attrs[0].replace(/</g, "&lt;");
      attrs[0] = attrs[0].replace(/>/g, "&gt;");
      return '<del><i><b>'+attrs[0]+'</b></i></del>';
    default:
      return '';
  }
}

function compileMetacode(op) {
  var output = op;

  //output = output.replace(/\\replace(\[[0-9]*\])*/g, '');

  //var functions = output.match(/\\[a-z]+(\[[^\[\]]*\])+/g);
  //var functions = output.match(/\\[a-z]+(\[\~\[(?!.*ahah)\]\~\])+/g);
  output = output.replace(/\\title?\[~(.*?)~\]\n/sg, function(match, p1) {
    return '\\title[~'+p1+'~]';
  });
  output = output.replace(/\\img?\[~(.*?)~\]\n/sg, function(match, p1) {
    return "\\img[~"+p1+"~]";
  });
  // output = output.replace(/\\code?\[~(.*?)~\]\n/sg, function(match, p1) {
  //   return "\\code[~"+p1+"~]";
  // });
  output = output.replace(/^\\code?\[~(.*?)~\]/sg, function(match, p1) {
    return "\\blockcode[~"+p1+"~]";
  });
  output = output.replace(/\n\\code?\[~(.*?)~\]/sg, function(match, p1) {
    return "\n\\blockcode[~"+p1+"~]";
  });

  var functions = output.match(/\\[a-z]+?\[~.*?~\]/sg);

  for (var i = 0; functions != null && i < functions.length; i++) {
    output = output.replace(functions[i], '\\replace[~'+i+'~]');
  }

  output = output.replace(/</g, "&lt;");
  output = output.replace(/>/g, "&gt;");
  //output = output.replace(/ /g, '&nbsp;');

  for (var i = 0; functions != null && i < functions.length; i++) {
    if (functions[i].match(/\\[a-z]*\[/g) != null) {
      //var name = functions[i].match(/\\[a-z]*\[~/g)[0].slice(1, -1);
      var name = functions[i].match(/\\[a-z]+\[/g)[0].slice(1, -1);
      //var attrs = functions[i].match(/\[[^\[\]]*\]/g);
      var attrs = functions[i].match(/\[~.*~\]/sg)[0].slice(2, -2).split('~|~');
      // for (var j = 0; j < attrs.length; j++) {
      //   attrs[j] = attrs[j].slice(1, -1);
      // }
      output = output.replace('\\replace[~'+i+'~]', doFunction(name, attrs));
    } else {
      output = output.replace('\\replace[~'+i+'~]', '');
    }
  }

  output = output.replace(/\n/g, "<br>");
  if (output == '' || !output) {
    return '<div class="blockTextNoContent"><div class="textNoContent">There will be a preview here</div></div>';
    //document.getElementById('blockShowContent').innerHTML = '<div class="blockTextNoContent"><div class="textNoContent">There will be a preview here</div></div>';
  } else {
    //document.getElementById('blockShowContent').innerHTML = '<div class="previewBlock">'+output+'</div>';
    return '<div class="previewBlock">'+output+'</div>';
  }
}
