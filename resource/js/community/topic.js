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

  var contentPage = document.createElement('div');
  contentPage.setAttribute('class', 'bodyContent');
  contentPage.innerHTML = currPage.content;
  contentHTMLobject.appendChild(contentPage);

  var linksStrokes = document.querySelectorAll('.wrapLinksTop, .contentPage, .wrapLinksBottom');
  for (var i = 0; i < linksStrokes.length; i++) {
    linksStrokes[i].style.opacity = '1';
  }
}
