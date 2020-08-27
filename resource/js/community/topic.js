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

  socket.emit('getListComments1', currPage.id, 0);
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
    document.getElementById('sendComment').setAttribute('active', '0');
  }
  document.getElementById('listCommentsSection').innerHTML = '';
  socket.emit('getListComments1', currPage.id, 0);
});

socket.on('getListComments2', function(list, authors) {
  if (list == 'none') {
    document.getElementById('listCommentsSection').innerHTML = '<div id="blockNoComments">No comments</div>';
  } else if (list) {

    for (var i = 0; i < list.length; i++) {
      var wrapComment = document.createElement('div');
      wrapComment.setAttribute('class', 'wrapComment');
      wrapComment.setAttribute('idComment', list[i].id);

      var lakes = list[i].likes.split(',');
      var valueLikes = '0';
      if (dataUser && dataUser.id) {
        for (var j = 0; j < lakes.length; j++) {
          if (lakes[j] == dataUser.id) {
            valueLikes = '1';
          }
        }
      }
      var countLikes = 0;
      if (lakes[0]) {
        countLikes = lakes.length;
      } else {
        countLikes = 0;
      }

      var blockComment = document.createElement('div');
      blockComment.setAttribute('class', 'blockComment');
      var authorComment = document.createElement('div');
      authorComment.setAttribute('class', 'authorComment');
      if (list[i].author == 0) {
        authorComment.innerHTML = '<div class="textAuthor">anonymous</div><div class="dateUpdateComment">'+datetimeFromMysqlToPST(list[i].dateUpdate)+'</div>';
      } else {
        for (var j = 0; j < authors.length; j++) {
          if (authors[j].id == list[i].author) {
            var name = authors[j].name;
            authorComment.innerHTML = '<a class="linkAuthor" href="/u/'+authors[j].id+'">'+authors[j].name+' (id: '+authors[j].id +')</a><div class="dateUpdateComment">'+datetimeFromMysqlToPST(list[i].dateUpdate)+'</div>';
            break;
          }
        }
      }
      blockComment.appendChild(authorComment);
      var contentComment = document.createElement('div');
      contentComment.setAttribute('class', 'contentComment');
      contentComment.innerHTML = compileMetacode(list[i].content);
      blockComment.appendChild(contentComment);
      var bottomComments = document.createElement('div');
      bottomComments.setAttribute('class', 'bottomComments');
      bottomComments.innerHTML = '<div value="'+valueLikes+'" onclick="clickLike(this, '+list[i].id+')" class="buttonLikeComment"></div><div class="countLikesComment">'+countLikes+'</div><div onclick="clickReply(this)" class="buttonReplyComment">reply</div>';
      blockComment.appendChild(bottomComments);
      wrapComment.appendChild(blockComment);

      var blockReply = document.createElement('div');
      blockReply.setAttribute('class', 'blockReply');
      wrapComment.appendChild(blockReply);

      document.getElementById('listCommentsSection').appendChild(wrapComment);

      socket.emit('getListReplies1', list[i].id, 0);
    }
    
    var lengthComments = document.getElementById('listCommentsSection').querySelectorAll('.wrapComment').length;
    if (list.length >= 20) {
      var addNextReply = document.createElement('div');
      addNextReply.setAttribute('class', 'addNextReply');
      addNextReply.setAttribute('onclick', 'nextComment(this, '+currPage.id+', '+lengthComments+')');
      addNextReply.innerHTML = 'view more';
      document.getElementById('listCommentsSection').appendChild(addNextReply);
    }
  }
});

function clickReply(el) {
  var wrapsComment = document.querySelectorAll('.wrapComment');
  var thisWrap = el.parentNode.parentNode.parentNode;
  for (var i = 0; i < wrapsComment.length; i++) {
    var currReply = wrapsComment[i].querySelector(".blockReply");
    if (currReply.querySelector("#blockAddReplay") && wrapsComment[i] != thisWrap) {
      currReply.querySelector("#blockAddReplay").remove();
      if (currReply.innerHTML == '' || !currReply.innerHTML) {
        currReply.style.display = 'none';
      }
    }
  }

  if (!thisWrap.querySelector('.blockReply #blockAddReplay')) {
    var thisReply = thisWrap.querySelector('.blockReply');
    if (thisReply.innerHTML == '' || !thisReply.innerHTML) {
      thisReply.style.display = 'flex';
      setTimeout(function () {
        thisReply.style.transform = 'scale(1)';
      }, 10);
    }
    var blockAddReplay = document.createElement('div');
    blockAddReplay.setAttribute('id', 'blockAddReplay');
    blockAddReplay.innerHTML = '<input oninput="validReply(this)" maxlength="100" type="text" class="inputReplay" /><div id="recaptcha2"></div><div class="sendReplayButton" active="0" onclick="sendReply(this)">send</div>';
    if (thisWrap.querySelector('.blockReply .blockOneReply:nth-child(1)')) {
      thisWrap.querySelector('.blockReply').insertBefore(blockAddReplay, thisWrap.querySelector(".blockReply .blockOneReply:nth-child(1)"));
    } else {
      thisWrap.querySelector('.blockReply').appendChild(blockAddReplay);
    }
    if (dataUser != null) {
      document.getElementById('recaptcha2').style.display = 'none';
    } else {
      document.getElementById('recaptcha2').style.display = 'flex';
    }
    blockAddReplay.style.display = 'flex';
    setTimeout(function() {
      blockAddReplay.style.transform = 'scale(1)';
    }, 10);
    widgetRecaptcha2 = grecaptcha.render('recaptcha2', { 'sitekey': '6Ld-_NEUAAAAAIcro-nuBeDeMigbdDBoxVt6jw9h' });
  }

}

function validReply(el) {
  if (el.value.length > 3) {
    el.parentNode.querySelector('.sendReplayButton').setAttribute('active', '1');
  } else {
    el.parentNode.querySelector('.sendReplayButton').setAttribute('active', '0');
  }
}


function sendReply(el) {
  if (el.getAttribute('active') == '1') {
    var recaptcha = grecaptcha.getResponse(widgetRecaptcha2);

    var author = 0;
    if (dataUser && dataUser.id) {
      author = dataUser.id;
    }
    var dataReply = {
      content: document.querySelector('#blockAddReplay .inputReplay').value,
      type: 'reply',
      toAttach: el.parentNode.parentNode.parentNode.getAttribute('idcomment'),
      author: author
    };
    socket.emit('addNewReply1', dataReply, recaptcha);
  }
}

socket.on('addNewReply2', function(answer) {
  answer = answer.split(':');
  if (answer[0] == 'err' && answer[1] == 'recaptcha') {
    grecaptcha.reset(widgetRecaptcha2);
  } else if (answer[0] == 'ok') {
    console.log(answer[1]);
    document.getElementById('blockAddReplay').remove();
    var wrapComment = document.querySelector('.wrapComment[idcomment="'+answer[1]+'"]');
    wrapComment.querySelector('.blockReply').innerHTML = '';
    socket.emit('getListReplies1', parseInt(answer[1]), 0);
  }
});

socket.on('getListReplies2', function(idAttach, replies, authors) {
  // console.log(idAttach);
  // console.log(replies);
  // console.log(authors);
  var blockReply = document.querySelector('.wrapComment[idcomment="'+idAttach+'"] .blockReply');
  if (replies == 'none' && blockReply.innerHTML == '') {
    blockReply.style.transform = 'scale(0)';
    setTimeout(function() {
      blockReply.style.display = 'none';
    }, 200);
  } else {
    blockReply.style.display = 'flex';
    setTimeout(function() {
      blockReply.style.transform = 'scale(1)';
    }, 10);

    for (var i = 0; i < replies.length; i++) {
      var currAuthor = 'anonymous';
      for (var j = 0; j < authors.length; j++) {
        if (authors[j].id == replies[i].author) {
          currAuthor = authors[j];
          break;
        }
      }

      var lakes = replies[i].likes.split(',');
      var valueLikes = '0';
      if (dataUser && dataUser.id) {
        for (var j = 0; j < lakes.length; j++) {
          if (lakes[j] == dataUser.id) {
            valueLikes = '1';
            break;
          }
        }
      }
      var countLikes = 0;
      if (lakes[0]) {
        countLikes = lakes.length;
      } else {
        countLikes = 0;
      }

      var blockOneReply = document.createElement('div');
      blockOneReply.setAttribute('class', 'blockOneReply');

      var topOneReply = document.createElement('div');
      topOneReply.setAttribute('class', 'topOneReply');
      var authorOneReply = document.createElement('div');
      authorOneReply.setAttribute('class', 'authorOneReply');
      if (currAuthor == 'anonymous') {
        authorOneReply.innerHTML = '<div class="textAuthorOneReply">anonymous</div>';
      } else {
        authorOneReply.innerHTML = '<a class="linkAuthorOneReply" href="/u/'+currAuthor.id+'">'+currAuthor.name+' (id: '+currAuthor.id+')</a>';
      }
      topOneReply.appendChild(authorOneReply);
      var updateOneReply = document.createElement('div');
      updateOneReply.setAttribute('class', 'updateOneReply');
      updateOneReply.innerHTML = datetimeFromMysqlToPST(replies[i].dateUpdate);
      topOneReply.appendChild(updateOneReply);
      blockOneReply.appendChild(topOneReply);

      var contentOneReply = document.createElement('div');
      contentOneReply.setAttribute('class', 'contentOneReply');
      contentOneReply.innerHTML = compileMetacode(replies[i].content);
      blockOneReply.appendChild(contentOneReply);

      var bottomOneReply = document.createElement('div');
      bottomOneReply.setAttribute('class', 'bottomOneReply');
      bottomOneReply.innerHTML = '<div value="'+valueLikes+'" onclick="clickLike(this, '+replies[i].id+')" class="buttonLikeComment"></div><div class="countLikesComment">'+countLikes+'</div>';
      // var likeOneReply = document.createElement('div');
      // likeOneReply.setAttribute('class', 'likeOneReply');
      // likeOneReply.innerHTML = '<div class="buttonLikeComment"></div><div class="countLikesComment">'+countLikes+'</div>';
      // bottomOneReply.appendChild(likeOneReply);
      blockOneReply.appendChild(bottomOneReply);

      blockReply.appendChild(blockOneReply);
    }

    var lengthReply = blockReply.querySelectorAll('.blockOneReply').length;
    if (replies.length >= 5) {
      var addNextReply = document.createElement('div');
      addNextReply.setAttribute('class', 'addNextReply');
      addNextReply.setAttribute('onclick', 'nextReply(this, '+idAttach+', '+lengthReply+')');
      addNextReply.innerHTML = 'view more';
      blockReply.appendChild(addNextReply);
    }
  }
});

function clickLike(el, id) {
  if (dataUser && dataUser.id) {
    var val = 1;
    if (el.getAttribute('value') == '0') {
      val = 1;
    } else if (el.getAttribute('value') == '1') {
      val = 0;
    }
    var dataLike = {
      idUser: dataUser.id,
      idComment: id,
      value: val
    };
    el.setAttribute('value', val);
    if (val == 1) {
      el.parentNode.querySelector('.countLikesComment').innerHTML = parseInt(el.parentNode.querySelector('.countLikesComment').innerHTML)+1;
    } else if (val == 0) {
      el.parentNode.querySelector('.countLikesComment').innerHTML = parseInt(el.parentNode.querySelector('.countLikesComment').innerHTML)-1;
    }

    socket.emit('switchLike', dataLike);
  }
}

function nextReply(el, idAttach, nowLength) {
  el.remove();
  var package = parseInt(parseInt(nowLength)/5);
  socket.emit('getListReplies1', parseInt(idAttach), package);
}

function nextComment(el, idAttach, nowLength) {
  el.remove();
  var package = parseInt(parseInt(nowLength)/20);
  socket.emit('getListComments1', parseInt(idAttach), package);
}
