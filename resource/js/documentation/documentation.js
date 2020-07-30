function isChild(parent, child) {
  var node = child.parentNode;
  while (node != null) {
     if (node == parent) {
         return true;
     }
     node = node.parentNode;
  }
  return false;
}
var currentPage = window.location.pathname.split('/')[2];
var currentAchive = '0';
window.addEventListener("load", function() {
  socket.emit('getListNotArchivedArticles1');
  if (currentPage) {
    getCurrentAchive();
    socket.emit('getDataArticle1', currentPage, currentAchive);
    socket.emit('clearBanListDocs', currentPage, currentAchive);

    document.getElementById('IDnavigationButton').setAttribute('condition', '1');
    var width = document.getElementById('IDnavigation').offsetWidth;
    document.getElementById('IDnavigation').style.left = -width+'px';
  }
});
function getCurrentAchive() {
  var getStroke = window.location.href.split('?')[1];
  if (getStroke) {
    getStroke = getStroke.split('&');
    for (var i = 0; i < getStroke.length; i++) {
      var getCurr = getStroke[i].split('=');
      if (getCurr[0] == 'archive') {
        currentAchive = getCurr[1];
        break;
      }
    }
  }
}
function switchMenu(el) {
  var condition = document.getElementById('IDnavigationButton').getAttribute('condition');
  if (condition == '1') {
    el.setAttribute('condition', '2');
    document.getElementById('IDnavigation').style.left = '0px';
  } else if (condition == '2') {
    el.setAttribute('condition', '1');
    var width = document.getElementById('IDnavigation').offsetWidth;
    document.getElementById('IDnavigation').style.left = -width+'px';
  }
}
window.addEventListener('resize', function() {
  var condition = document.getElementById('IDnavigationButton').getAttribute('condition');
  if (condition == '1') {
    var width = document.getElementById('IDnavigation').offsetWidth;
    document.getElementById('IDnavigation').style.left = -width+'px';
  }
});

socket.on('getListNotArchivedArticles2', function(data) {
  for (var i = 0; i < data.length; i++) {
    var linkNavigation = document.createElement('a');
    linkNavigation.setAttribute('class', 'linkNavigation');
    linkNavigation.setAttribute('href', '/d/'+data[i].url);
    if (currentPage && currentPage == data[i].url) {
      linkNavigation.setAttribute('active', '1');
    }
    linkNavigation.innerHTML = data[i].title;
    document.getElementById('IDlistLinksNavigation').appendChild(linkNavigation);
  }
});

var currPage, currArchive, currHelped;
socket.on('getDataArticle2', function(dataPage, dataArchive, helped) {
  currPage = dataPage;
  currArchive = dataArchive;
  currHelped = helped;
  if (currentPage) {
    fillPage();
  }
});

function datetimeFromMysqlToPST(datetime) {
  var date = datetime.split('.')[0];
  date = date.split('T');
  var time = date[1];
  date = date[0];
  date = date.split('-');
  date = date[1]+"/"+date[2]+"/"+date[0];
  return date+' '+time;
}

function fillPage() {
  var contentHTMLobject = document.getElementById('IDcontentPage');

  var topStroke = document.createElement('div');
  topStroke.setAttribute('class', 'topStroke');
  contentHTMLobject.appendChild(topStroke);

  var titlePage = document.createElement('h1');
  titlePage.setAttribute('class', 'h1Page');
  titlePage.innerHTML = currPage.title;
  topStroke.appendChild(titlePage);

  var rightTopStroke = document.createElement('div');
  rightTopStroke.setAttribute('class', 'rightTopStroke');
  topStroke.appendChild(rightTopStroke);

  var updateStroke = document.createElement('h4');
  updateStroke.setAttribute('id', 'IDupdateStroke');
  updateStroke.setAttribute('class', 'h4Page');
  updateStroke.innerHTML = 'last update: '+datetimeFromMysqlToPST(currPage.dateUpdate);
  rightTopStroke.appendChild(updateStroke);

  if (currArchive[0]) {
    var archiveStroke = document.createElement('h4');
    archiveStroke.setAttribute('class', 'archiveStroke');
    archiveStroke.setAttribute('onclick', 'showArchiveBlock()');
    archiveStroke.innerHTML = 'archive <div class="arrowDownArchive"></div>';
    rightTopStroke.appendChild(archiveStroke);

    var archiveBlock = document.createElement('div');
    archiveBlock.setAttribute('class', 'archiveBlock');
    archiveBlock.setAttribute('id', 'IDarchiveBlock');
    for (var i = 0; i < currArchive.length; i++) {
      var oneStrokeAchive = document.createElement('a');
      oneStrokeAchive.setAttribute('class', 'oneStrokeAchive');
      oneStrokeAchive.setAttribute('href', currArchive[i].url+'?archive='+currArchive[i].id);
      oneStrokeAchive.innerHTML = currArchive[i].title+' ('+datetimeFromMysqlToPST(currArchive[i].dateUpdate)+')';
      archiveBlock.appendChild(oneStrokeAchive);
    }
    rightTopStroke.appendChild(archiveBlock);
  }

  if (currentAchive != '0') {
    var pasedArticle = document.createElement('div');
    pasedArticle.setAttribute('class', 'pasedArticle');
    pasedArticle.innerHTML = 'This article is outdated. The information in this article is not current.';
    contentHTMLobject.appendChild(pasedArticle);
  }

  var contentPage = document.createElement('div');
  contentPage.setAttribute('class', 'bodyContent');
  contentPage.innerHTML = currPage.content;
  contentHTMLobject.appendChild(contentPage);

  if (!currHelped) {
    var buttonHelp = document.createElement('div');
    buttonHelp.setAttribute('id', 'buttonHelp');
    buttonHelp.setAttribute('onclick', 'addHelped()');
    buttonHelp.innerHTML = 'It helped me';
    contentHTMLobject.appendChild(buttonHelp);
  }

  contentHTMLobject.style.opacity = '1';
  document.getElementById('IDwrapLinksBottom').style.opacity = '1';
}

function addHelped() {
  socket.emit('addHelpedDocs', currPage.id);
  document.getElementById('buttonHelp').style.transform = 'scale(0)';
  setTimeout(function() {
    document.getElementById('buttonHelp').style.display = 'none';
    document.getElementById('buttonHelp').remove();
  }, 200);
}

function showArchiveBlock() {
  document.getElementById('IDarchiveBlock').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('IDarchiveBlock').style.transform = 'scale(1)';
  }, 10);
}
function hideArchiveBlock() {
  document.getElementById('IDarchiveBlock').style.transform = 'scale(0)';
  setTimeout(function() {
    document.getElementById('IDarchiveBlock').style.display = 'none';
  }, 200);
}
var downPressArchiveBlock = false;
window.addEventListener("mousedown", function(e) {
  if (document.getElementById('IDarchiveBlock') && document.getElementById('IDarchiveBlock') != e.target && !isChild(document.getElementById('IDarchiveBlock'), e.target) && document.getElementById('IDarchiveBlock').style.display == 'flex') {
    downPressArchiveBlock = true;
  } else {
    downPressArchiveBlock = false;
  }
});
window.addEventListener("mouseup", function(e) {
  if (document.getElementById('IDarchiveBlock') != e.target && !isChild(document.getElementById('IDarchiveBlock'), e.target) && downPressArchiveBlock) {
    hideArchiveBlock();
  } else {
    downPressArchiveBlock = false;
  }
});
socket.on('redirect', function(link) {
  window.location.href = link;
});
