function datetimeFromMysqlToPST(datetime) {
  var date = datetime.split('.')[0].split('T');
  var time = date[1];
  date = date[0];
  date = date.split('-');
  date = date[1]+"/"+date[2]+"/"+date[0];

  time = time.split(':');
  if (parseInt(time[0]) > 12) {
    time = (time[0]-12)+':'+time[1]+':'+time[2]+' PM';
  } else if (parseInt(time[0]) == 0) {
    time = '12:'+time[1]+':'+time[2]+' AM';
  } else if (parseInt(time[0]) == 12) {
    time = '12:'+time[1]+':'+time[2]+' PM';
  } else {
    time = time[0]+':'+time[1]+':'+time[2]+' AM';
  }

  return date+' '+time;
}

var currPage, currAuthor;
socket.emit('getDataArticleCommunity1', window.location.pathname.split('/')[3]);
socket.on('getDataArticleCommunity2', function(dataPage, author) {
  currPage = dataPage;
  currAuthor = author;
  if (currPage != 'none') {
    fillTopicPage();
  } else if (currPage == 'none') {
    window.location.href = '/c';
  }
});

function fillTopicPage() {
  document.title = currPage.title;
  document.querySelector('meta[name="Keywords"]').setAttribute('content', currPage.keywords);
  document.querySelector('meta[name="Description"]').setAttribute('content', currPage.description);

  var contentHTMLobject = document.getElementById('IDcontentPage');

  var topStroke = document.createElement('div');
  topStroke.setAttribute('class', 'topStroke');
  contentHTMLobject.appendChild(topStroke);

  var titlePage = document.createElement('h1');
  titlePage.setAttribute('class', 'titlePage');
  titlePage.innerHTML = currPage.title;
  topStroke.appendChild(titlePage);

  var rightTopStroke = document.createElement('div');
  rightTopStroke.setAttribute('class', 'rightTopStroke');
  topStroke.appendChild(rightTopStroke);

  if (currAuthor != 'none') {
    var authorStroke = document.createElement('h4');
    authorStroke.setAttribute('id', 'IDauthorStroke');
    authorStroke.innerHTML = 'author: <a href="/u/'+currAuthor.id+'">'+currAuthor.name+' (id: '+currAuthor.id+')</a>';
    rightTopStroke.appendChild(authorStroke);
  }

  var updateStroke = document.createElement('h4');
  updateStroke.setAttribute('id', 'IDupdateStroke');
  updateStroke.innerHTML = 'last update: '+datetimeFromMysqlToPST(currPage.dateUpdate);
  rightTopStroke.appendChild(updateStroke);

  if (currPage.type == 'article') {
    var contentPage = document.createElement('div');
    contentPage.setAttribute('class', 'bodyContent');
    //contentPage.setAttribute('class', 'bodyContent blockShowContent');
    //contentPage.innerHTML = currPage.content;
    contentPage.innerHTML = compileMetacode(currPage.content);
    contentHTMLobject.appendChild(contentPage);
  } else if (currPage.type == 'release') {
    var currentData = currPage.content.split("~~");
    var currentImage = '';
    var annonRelease = {};
    var linkGameVal = '';
    for (var i = 0; i < currentData.length; i++) {
      if (currentData[i].split("$$")[0] == 'image') {
        currentImage = currentData[i].split("$$")[1];
      } else if (currentData[i].split("$$")[0] == 'announcement') {
        annonRelease.value = currentData[i].split("$$")[0];
        annonRelease.date = currentData[i].split("$$")[1];
      } else if (currentData[i].split("$$")[0] == 'release') {
        annonRelease.value = currentData[i].split("$$")[0];
        annonRelease.date = 'Available now';
      } else if (currentData[i].split("$$")[0] == 'link') {
        linkGameVal = currentData[i].split("$$")[1];
      }
    }

    var contentPage = document.createElement('div');
    contentPage.setAttribute('class', 'bodyContent');
    //contentPage.setAttribute('class', 'bodyContent blockShowContent');

    var imageGame = document.createElement('img');
    imageGame.setAttribute('class', 'imageGame');
    imageGame.setAttribute('src', currentImage);
    imageGame.setAttribute('alt', currPage.title);
    contentPage.appendChild(imageGame);

    var announceRelDate = document.createElement('p');
    if (annonRelease.value == 'announcement') {
      announceRelDate.innerHTML = 'Date reveal: '+annonRelease.date;
    } else if (annonRelease.value == 'release') {
      announceRelDate.innerHTML = 'Available now';
    }
    announceRelDate.setAttribute('id', 'announceRelDate');
    contentPage.appendChild(announceRelDate);

    var descrGame = document.createElement('p');
    descrGame.setAttribute('class', 'descriptionGame');
    //descrGame.innerHTML = currPage.description;
    descrGame.innerHTML = compileMetacode(currPage.description);
    contentPage.appendChild(descrGame);

    if (linkGameVal != '' && linkGameVal) {
    var linkGame = document.createElement('div');
      linkGame.setAttribute('class', 'buttonArticle');
      linkGame.setAttribute('onclick', 'window.location.href = "'+linkGameVal+'"');
      linkGame.style.alignSelf = 'center';
      linkGame.style.marginBottom = '5px';
      if (annonRelease.value == 'announcement') {
        linkGame.innerHTML = 'Demo';
      } else if (annonRelease.value == 'release') {
        linkGame.innerHTML = 'Play now';
      }
      contentPage.appendChild(linkGame);

      var textLinkGame = document.createElement('a');
      textLinkGame.setAttribute('href', linkGameVal);
      textLinkGame.setAttribute('id', 'textLinkGame');
      textLinkGame.innerHTML = linkGameVal;
      contentPage.appendChild(textLinkGame);
    }

    contentHTMLobject.appendChild(contentPage);
  } else if (currPage.type == 'question') {
    var currentData = currPage.content.split("~~");
    var resolved = '';
    var bodyQuestion = '';
    for (var i = 0; i < currentData.length; i++) {
      if (currentData[i].split("$$")[0] == 'resolved') {
        resolved = currentData[i].split("$$")[1];
      } else if (currentData[i].split("$$")[0] == 'html') {
        bodyQuestion = currentData[i].split("$$")[1];
      }
    }
    //resolved$$not~~html$$
    var contentPage = document.createElement('div');
    contentPage.setAttribute('class', 'bodyContent');
    //contentPage.setAttribute('class', 'bodyContent blockShowContent');

    var blockResolved = document.createElement('div');
    blockResolved.setAttribute('class', 'blockResolved');
    blockResolved.setAttribute('resolved', resolved);
    if (resolved == 'not') {
      blockResolved.innerHTML = 'not resolved';
    } else if (resolved == 'yes') {
      blockResolved.innerHTML = 'resolved';
    }
    contentPage.appendChild(blockResolved);

    var blockBodyQuestion = document.createElement('p');
    //blockBodyQuestion.innerHTML = bodyQuestion;
    blockBodyQuestion.innerHTML = compileMetacode(bodyQuestion);
    contentPage.appendChild(blockBodyQuestion);


    contentHTMLobject.appendChild(contentPage);
  }

  var linksStrokes = document.querySelectorAll('.wrapLinksTop, .contentPage, .wrapLinksBottom');
  for (var i = 0; i < linksStrokes.length; i++) {
    linksStrokes[i].style.opacity = '1';
  }
}

var timeoutCompile = setTimeout(function () {}, 1);
function inputContent(e, el) {
  var leftBlockBounding = document.getElementById('blockEnterContent').getBoundingClientRect();
  var rightBlockBounding = document.getElementById('blockShowContent').getBoundingClientRect();
  var textareaBounding = el.getBoundingClientRect();

  var lengthContent = el.value.length;
  var minLength = 10;
  var maxLength = 1000;

  document.getElementById('countWords').style.display = 'flex';
  if (lengthContent < minLength) {
    document.getElementById('countWords').innerHTML = '-'+(minLength-lengthContent)+' symbols';
    document.getElementById('countWords').setAttribute('valid', '0');
    document.getElementById('sendComment').setAttribute('active', '0');
  } else if (lengthContent >= minLength && lengthContent <= maxLength) {
    document.getElementById('countWords').innerHTML = lengthContent+'/'+maxLength+' symbols';
    document.getElementById('countWords').setAttribute('valid', '1');
    document.getElementById('sendComment').setAttribute('active', '1');
  } else if (lengthContent > maxLength) {
    document.getElementById('countWords').innerHTML = lengthContent+'/'+maxLength+' symbols';
    document.getElementById('countWords').setAttribute('valid', '0');
    document.getElementById('sendComment').setAttribute('active', '0');
  }

  var strokeBreakes = el.value.split('\n');
  var countStrings = 0;
  for (var i = 0; i < strokeBreakes.length; i++) {
    countStrings += Math.floor(strokeBreakes[i].length/(textareaBounding.width/8));
    countStrings++;
  }
  if (countStrings >= 6) {
    document.getElementById('textareaContent').style.height = (17*countStrings)+'px'
  } else if (countStrings < 6) {
    document.getElementById('textareaContent').style.height = '104px'
  }
  // if (leftBlockBounding.height > rightBlockBounding.height) {
  //   setTimeout(function() {
  //     window.scroll({
  //       top: document.body.scrollHeight || document.documentElement.scrollHeight,
  //       behavior: 'smooth'
  //     });
  //   }, 10);
  // }

  clearTimeout(timeoutCompile);
  timeoutCompile = setTimeout(function() {
    document.getElementById('blockShowContent').innerHTML = compileMetacode(el.value);
  }, 500);
}

var timeoutCompile2 = setTimeout(function() {}, 1);
function insertMetachars(sStartTag, sEndTag) {
  var bDouble = arguments.length > 1;
  var oMsgInput = document.getElementById('textareaContent');
  var nSelStart = oMsgInput.selectionStart;
  var nSelEnd = oMsgInput.selectionEnd;
  var sOldText = oMsgInput.value;

  oMsgInput.value = sOldText.substring(0, nSelStart) + (bDouble?sStartTag+sOldText.substring(nSelStart, nSelEnd)+sEndTag:sStartTag)+sOldText.substring(nSelEnd);
  oMsgInput.setSelectionRange(bDouble||nSelStart===nSelEnd?nSelStart+sStartTag.length:nSelStart,(bDouble?nSelEnd:nSelStart)+sStartTag.length);
  oMsgInput.focus();

  clearTimeout(timeoutCompile2);
  timeoutCompile2 = setTimeout(function() {
    document.getElementById('blockShowContent').innerHTML = compileMetacode(oMsgInput.value);
  }, 500);
}

function sendComment(el) {
  if (el.getAttribute('active') == '1') {
    var recaptcha = grecaptcha.getResponse(widgetRecaptcha1);

    var author = 0;
    if (dataUser != null && dataUser) {
      author = dataUser.id;
    }
    var dataNewComment = {
      content: document.getElementById('textareaContent').value,
      type: 'comment',
      toAttach: currPage.id,
      author: author
    };

    console.log(dataNewComment);

    socket.emit('addNewComment1', dataNewComment, recaptcha);
  }
}

socket.on('addNewComment2', function(answer) {
  if (answer == 'err:recaptcha') {
    grecaptcha.reset(widgetRecaptcha1);
  } else if (answer == 'ok') {
    document.getElementById('textareaContent').value = '';
    document.getElementById('countWords').style.display = 'none';
    document.getElementById('blockShowContent').innerHTML = '<div class="blockTextNoContent"><div class="textNoContent">There will be a preview here</div></div>';
  }
});
