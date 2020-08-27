function splitDate(date) {
  var partsDate = date.split('.')[0].split('T');
  var daysPart = partsDate[0].split('-');
  var timesPart = partsDate[1].split(':');

  var answer = {
    year: daysPart[0],
    mounth: daysPart[1],
    day: daysPart[2],
    hour: timesPart[0],
    minute: timesPart[1],
    second: timesPart[2],
  };

  return answer;
}

function getHtmlTags(tags) {
  var arrTags = tags.split(',');

  var answer = '';
  for (var i = 0; i < arrTags.length; i++) {
    answer += '<div class="oneTag">'+arrTags[i]+'</div>'
  }

  return answer;
}

function getUpdateTime(time) {
  var dateFound = new Date(time).getTime();
  var dateNow = new Date().getTime();
  var daysFound = Math.floor((dateNow-dateFound)/(24*60*60*1000));
  if (Math.floor(daysFound/365) == 0 && Math.floor(daysFound/30) == 0) {
    return (daysFound%365)+'d';
  } else if (Math.floor(daysFound/365) == 0 && (daysFound%365) == 0) {
    return Math.floor(daysFound/30)+'m ';
  } else if (Math.floor(daysFound/30) == 0 && (daysFound%365) == 0) {
    return Math.floor(daysFound/365)+'y ';
  } else if (Math.floor(daysFound/365) == 0) {
    return Math.floor(daysFound/30)+'m '+(daysFound%365)+'d';
  } else if (Math.floor(daysFound/30) == 0) {
    return Math.floor(daysFound/365)+'y '+(daysFound%365)+'d';
  } else if ((daysFound%365) == 0) {
    return Math.floor(daysFound/365)+'y '+Math.floor(daysFound/30)+'m';
  } else if (Math.floor(daysFound/365) == 0 && Math.floor(daysFound/30) == 0 && (daysFound%365) == 0) {
    return '0d';
  } else {
    return Math.floor(daysFound/365)+'y '+Math.floor(daysFound/30)+'m '+(daysFound%365)+'d';
  }
}

var numTopicsOnPage = 20;
socket.emit('getListOfCommTopics1');
socket.on('getListOfCommTopics2', function(list) {

  for (var i = 0; i < list.length; i++) {
    switch (list[i].type) {
      case 'article':
        var blockArticle = document.createElement('div');
        blockArticle.setAttribute('class', 'blockArticle');

        var titleBlock = document.createElement('div');
        titleBlock.setAttribute('class', 'titleBlockArticle');

        var stringTitle = document.createElement('a');
        stringTitle.setAttribute('class', 'stringTitleBlockArticle');
        stringTitle.setAttribute('href', '/c/t/'+list[i].url);
        stringTitle.innerHTML = list[i].title;
        titleBlock.appendChild(stringTitle);

        var stringTags = document.createElement('div');
        stringTags.setAttribute('class', 'stringTagsBlockArticle');
        stringTags.innerHTML = getHtmlTags(list[i].keywords);
        titleBlock.appendChild(stringTags);

        blockArticle.appendChild(titleBlock);

        var wraplastBlock = document.createElement('div');
        wraplastBlock.setAttribute('class', 'wraplastBlock');

        // var lastBlock = document.createElement('div');
        // lastBlock.setAttribute('class', 'lastBlockArticle');
        // var numberLastBlock = document.createElement('div');
        // numberLastBlock.setAttribute('class', 'numberLastBlockArticle');
        // numberLastBlock.innerHTML = list[i].comments;
        // lastBlock.appendChild(numberLastBlock);
        // var lablelLastBlock = document.createElement('div');
        // lablelLastBlock.setAttribute('class', 'labelLastBlockArticle');
        // lablelLastBlock.innerHTML = 'comments';
        // lastBlock.appendChild(lablelLastBlock);
        // wraplastBlock.appendChild(lastBlock);

        var lastBlock = document.createElement('div');
        lastBlock.setAttribute('class', 'lastBlockArticle');
        var numberLastBlock = document.createElement('div');
        numberLastBlock.setAttribute('class', 'numberLastBlockArticle');
        numberLastBlock.innerHTML = getUpdateTime(list[i].dateUpdate);
        lastBlock.appendChild(numberLastBlock);
        var lablelLastBlock = document.createElement('div');
        lablelLastBlock.setAttribute('class', 'labelLastBlockArticle');
        lablelLastBlock.innerHTML = 'update';
        lastBlock.appendChild(lablelLastBlock);
        wraplastBlock.appendChild(lastBlock);

        blockArticle.appendChild(wraplastBlock);

        document.getElementById('listArticles').appendChild(blockArticle);

        break;
      case 'release':
        var blockRelease = document.createElement('div');
        blockRelease.setAttribute('class', 'blockRelease');

        blockRelease.style.margin = '25px 0px';
        var sourceResource = list[i].content.split('~~')[1].split('$$');
        var sourceAnnounce = list[i].content.split('~~')[0].split('$$');
        if (sourceResource[0] == 'image') {
          var imageRelease = document.createElement('div');
          imageRelease.setAttribute('class', 'imageRelease');
          imageRelease.style.backgroundImage = 'url("'+sourceResource[1]+'")';
          blockRelease.appendChild(imageRelease);
        }

        var titleBlock = document.createElement('div');
        titleBlock.setAttribute('class', 'titleBlockArticle');

        var stringTitle = document.createElement('a');
        stringTitle.setAttribute('class', 'stringTitleBlockArticle');
        stringTitle.setAttribute('href', '/c/t/'+list[i].url);
        stringTitle.innerHTML = list[i].title;
        titleBlock.appendChild(stringTitle);

        var stringAnnounce = document.createElement('div');
        stringAnnounce.setAttribute('class', 'stringAnnounce');
        if (sourceAnnounce[0] == 'announcement') {
          stringAnnounce.innerHTML = 'date release: '+sourceAnnounce[1];
        } else if (sourceAnnounce[0] == 'release') {
          stringAnnounce.innerHTML = 'available now';
        }
        titleBlock.appendChild(stringAnnounce);

        var stringTags = document.createElement('div');
        stringTags.setAttribute('class', 'stringTagsBlockArticle');
        stringTags.innerHTML = getHtmlTags(list[i].keywords);
        titleBlock.appendChild(stringTags);

        blockRelease.appendChild(titleBlock);

        var wraplastBlock = document.createElement('div');
        wraplastBlock.setAttribute('class', 'wraplastBlock');

        // var lastBlock = document.createElement('div');
        // lastBlock.setAttribute('class', 'lastBlockArticle');
        // var numberLastBlock = document.createElement('div');
        // numberLastBlock.setAttribute('class', 'numberLastBlockArticle');
        // numberLastBlock.innerHTML = list[i].comments;
        // lastBlock.appendChild(numberLastBlock);
        // var lablelLastBlock = document.createElement('div');
        // lablelLastBlock.setAttribute('class', 'labelLastBlockArticle');
        // lablelLastBlock.innerHTML = 'comments';
        // lastBlock.appendChild(lablelLastBlock);
        // wraplastBlock.appendChild(lastBlock);

        var lastBlock = document.createElement('div');
        lastBlock.setAttribute('class', 'lastBlockArticle');
        var numberLastBlock = document.createElement('div');
        numberLastBlock.setAttribute('class', 'numberLastBlockArticle');
        numberLastBlock.innerHTML = getUpdateTime(list[i].dateUpdate);
        lastBlock.appendChild(numberLastBlock);
        var lablelLastBlock = document.createElement('div');
        lablelLastBlock.setAttribute('class', 'labelLastBlockArticle');
        lablelLastBlock.innerHTML = 'update';
        lastBlock.appendChild(lablelLastBlock);
        wraplastBlock.appendChild(lastBlock);

        blockRelease.appendChild(wraplastBlock);

        document.getElementById('listArticles').appendChild(blockRelease);

        break;
      case 'question':
        var blockQuestion = document.createElement('div');
        blockQuestion.setAttribute('class', 'blockQuestion');

        var resolvedQuestion = list[i].content.split('~~')[0].split('$$');

        var blockResolved = document.createElement('div');
        blockResolved.setAttribute('class', 'blockResolved');
        blockResolved.setAttribute('resolved', resolvedQuestion[1]);
        if (resolvedQuestion[1] == 'yes') {
          blockResolved.innerHTML = 'resolved';
        } else if (resolvedQuestion[1] == 'not') {
          blockResolved.innerHTML = 'not resolved';
        }
        blockQuestion.appendChild(blockResolved);

        var titleBlock = document.createElement('div');
        titleBlock.setAttribute('class', 'titleBlockArticle');

        var stringTitle = document.createElement('a');
        stringTitle.setAttribute('class', 'stringTitleBlockArticle');
        stringTitle.setAttribute('href', '/c/t/'+list[i].url);
        stringTitle.innerHTML = list[i].title;
        titleBlock.appendChild(stringTitle);

        var stringTags = document.createElement('div');
        stringTags.setAttribute('class', 'stringTagsBlockArticle');
        stringTags.innerHTML = getHtmlTags(list[i].keywords);
        titleBlock.appendChild(stringTags);

        blockQuestion.appendChild(titleBlock);

        var wraplastBlock = document.createElement('div');
        wraplastBlock.setAttribute('class', 'wraplastBlock');

        var lastBlock = document.createElement('div');
        lastBlock.setAttribute('class', 'lastBlockArticle');
        var numberLastBlock = document.createElement('div');
        numberLastBlock.setAttribute('class', 'numberLastBlockArticle');
        numberLastBlock.innerHTML = list[i].comments;
        lastBlock.appendChild(numberLastBlock);
        var lablelLastBlock = document.createElement('div');
        lablelLastBlock.setAttribute('class', 'labelLastBlockArticle');
        lablelLastBlock.innerHTML = 'replies';
        lastBlock.appendChild(lablelLastBlock);
        wraplastBlock.appendChild(lastBlock);

        var lastBlock = document.createElement('div');
        lastBlock.setAttribute('class', 'lastBlockArticle');
        var numberLastBlock = document.createElement('div');
        numberLastBlock.setAttribute('class', 'numberLastBlockArticle');
        numberLastBlock.innerHTML = getUpdateTime(list[i].dateUpdate);
        lastBlock.appendChild(numberLastBlock);
        var lablelLastBlock = document.createElement('div');
        lablelLastBlock.setAttribute('class', 'labelLastBlockArticle');
        lablelLastBlock.innerHTML = 'update';
        lastBlock.appendChild(lablelLastBlock);
        wraplastBlock.appendChild(lastBlock);

        blockQuestion.appendChild(wraplastBlock);

        document.getElementById('listArticles').appendChild(blockQuestion);
        break;
    }
  }

  var lengthTopics = document.getElementById('listArticles').querySelectorAll('.blockRelease, .blockArticle, .blockQuestion').length;
  if (list != 'none' && list.length >= numTopicsOnPage) {
    var addNextReply = document.createElement('div');
    addNextReply.setAttribute('class', 'addNextReply');
    addNextReply.setAttribute('onclick', 'nextTopic(this, '+lengthTopics+')');
    addNextReply.innerHTML = 'view more';
    document.getElementById('listArticles').appendChild(addNextReply);
  }

  document.getElementById('wrapLinkHome').style.opacity = '1';
  document.getElementById('listArticles').style.opacity = '1';
  document.getElementById('bottomStringStudio').style.opacity = '1';
});

function nextTopic(el, nowLength) {
  el.remove();
  var package = parseInt(parseInt(nowLength)/numTopicsOnPage);
  socket.emit('getListOfCommTopics1', package);
}

function fillBlockCommunityData() {
  document.getElementById('nameCommunityData').innerHTML = dataUser.name+' (id: '+dataUser.id+')';
  document.getElementById('nameCommunityData').setAttribute('href', '/u/'+dataUser.id);

  if (dataUserStudio == null) {
    document.getElementById('nameStudioCommunityData').innerHTML = 'You don\'t have studio';
  } else {
    document.getElementById('nameStudioCommunityData').innerHTML = '<a class="linkNameStudioCommunityData" href="/s/'+dataUserStudio.name.toLowerCase()+'">'+dataUserStudio.name+'</a>';
  }

  document.getElementById('authorityBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.authority.value;
  document.getElementById('releaseBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.release.value;
  document.getElementById('articleBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.article.value;
  document.getElementById('questionBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.question.value;
  document.getElementById('likeBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.like.value;
  document.getElementById('commentBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.comment.value;
}
