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
    contentPage.innerHTML = currPage.content;
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
    descrGame.innerHTML = currPage.description;
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

    var contentPage = document.createElement('div');
    contentPage.setAttribute('class', 'bodyContent');

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
    blockBodyQuestion.innerHTML = bodyQuestion;
    contentPage.appendChild(blockBodyQuestion);


    contentHTMLobject.appendChild(contentPage);
  }

  var linksStrokes = document.querySelectorAll('.wrapLinksTop, .contentPage, .wrapLinksBottom');
  for (var i = 0; i < linksStrokes.length; i++) {
    linksStrokes[i].style.opacity = '1';
  }
}
