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
function showBlock(indexLink, e) {
  if (e.getAttribute('active') != '1') {
    var links = document.querySelectorAll('.linkMenu');
    for (var i = 0; i < links.length; i++) {
      if (i == indexLink) {
        links[i].setAttribute('active', '1');
      } else {
        links[i].setAttribute('active', '0');
      }
    }

    var blocks = document.querySelectorAll('.blockContent[active="1"]');
    var showBlock = document.querySelectorAll('.blockContent')[indexLink];
    if (typeof blocks[0] == 'undefined') {
      blocks[0] = document.querySelectorAll('.blockContent')[0];
    }
    for (var i = 0; i < blocks.length; i++) {
      blocks[i].setAttribute('active', '0');
    }
    setTimeout(function() {
      for (var i = 0; i < blocks.length; i++) {
        blocks[i].style.display = 'none';
      }
      showBlock.style.display = 'flex';
      setTimeout(function() {
        showBlock.setAttribute('active', '1');
      }, 10);
    }, 200);
  }
}

function clickCreateGame() {
  var input = document.getElementById('blockInputCreateGame');
  var inputInput = document.getElementById('inputInputCreateGame');
  var button = document.getElementById('buttonCreateGame');
  var buttonCancel = document.getElementById('buttonCancelCreateGame');
  if (input.getAttribute('active') == '0') {
    document.getElementById('errorTextCreateGame').innerHTML = '';
    document.getElementById('errorTextCreateGame').style.display = 'none';
    input.style.display = 'flex';
    buttonCancel.style.display = 'flex';
    setTimeout(function() {
      input.setAttribute('active', '1');
      button.setAttribute('disabled', '1');
      buttonCancel.setAttribute('active', '1');
      button.innerHTML = 'create';
    }, 10);
  } else if (input.getAttribute('active') == '1' && button.getAttribute('disabled') != '1') {
    socket.emit('createGame1', dataUser, dataStudio.id, inputInput.value);
    input.setAttribute('active', '0');
    buttonCancel.setAttribute('active', '0');
    button.innerHTML = '+ create new game';
    setTimeout(function() {
      input.style.display = 'none';
      buttonCancel.style.display = 'none';
    }, 200);
  }
}

function validGameName(e) {
  var button = document.getElementById('buttonCreateGame');
  if (/^\w+$/.test(e.value)) {
    document.getElementById('titleInputCreateGame').innerHTML = 'name game = valid';
    document.getElementById('titleInputCreateGame').style.color = '#1aca00';
    document.getElementById('inputInputCreateGame').style.border = '1px solid #1aca00';
    button.setAttribute('disabled', '0');
  } else {
    document.getElementById('titleInputCreateGame').innerHTML = 'name game = invalid';
    document.getElementById('titleInputCreateGame').style.color = '#f77171';
    document.getElementById('inputInputCreateGame').style.border = '1px solid #f77171';
    button.setAttribute('disabled', '1');
  }
}

function clickCancelCreateGame() {
  var input = document.getElementById('blockInputCreateGame');
  var button = document.getElementById('buttonCreateGame');
  var buttonCancel = document.getElementById('buttonCancelCreateGame');
  input.setAttribute('active', '0');
  button.setAttribute('disabled', '0');
  buttonCancel.setAttribute('active', '0');
  button.innerHTML = '+ create new game';
  setTimeout(function() {
    input.style.display = 'none';
    buttonCancel.style.display = 'none';
  }, 200);
}

function clickInviteUser() {
  var input = document.getElementById('blockInputInviteUser');
  var button = document.getElementById('buttonInviteUser');
  var buttonCancel = document.getElementById('buttonCancelInviteUser');
  if (input.getAttribute('active') == '0') {
    input.style.display = 'flex';
    buttonCancel.style.display = 'flex';
    setTimeout(function() {
      input.setAttribute('active', '1');
      button.setAttribute('disabled', '1');
      buttonCancel.setAttribute('active', '1');
      button.innerHTML = 'invite';
    }, 10);
  }
}

function validUserName(e) {
  var button = document.getElementById('buttonInviteUser');
  if (/^[0-9]+$/.test(e.value)) {
    document.getElementById('titleInputInviteUser').innerHTML = 'name game = valid';
    document.getElementById('titleInputInviteUser').style.color = '#1aca00';
    document.getElementById('inputInputInviteUser').style.border = '1px solid #1aca00';
    button.setAttribute('disabled', '0');
  } else {
    document.getElementById('titleInputInviteUser').innerHTML = 'name game = invalid';
    document.getElementById('titleInputInviteUser').style.color = '#f77171';
    document.getElementById('inputInputInviteUser').style.border = '1px solid #f77171';
    button.setAttribute('disabled', '1');
  }
}

function clickCancelInviteUser() {
  var input = document.getElementById('blockInputInviteUser');
  var button = document.getElementById('buttonInviteUser');
  var buttonCancel = document.getElementById('buttonCancelInviteUser');
  input.setAttribute('active', '0');
  button.setAttribute('disabled', '0');
  buttonCancel.setAttribute('active', '0');
  button.innerHTML = '+ invite user';
  setTimeout(function() {
    input.style.display = 'none';
    buttonCancel.style.display = 'none';
  }, 200);
}

var downPressConfirmDelete = false;
window.addEventListener("mousedown", function(e) {
  var folders = document.querySelectorAll('.oneFolder');
  for (var i = 0; i < folders.length; i++) {
    if (folders[i] != e.target && !isChild(folders[i], e.target)) {
      folders[i].setAttribute("focus", "0");
    }
  }
});

function showConfirmDeleteStudioWindow() {
  document.getElementById('backConfirmDeleteStudio').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('backConfirmDeleteStudio').style.opacity = '1';
    document.getElementById('blockConfirmDeleteStudio').style.transform = 'translateY(0px)';
    document.getElementById('buttonConfirmDeleteStudio').style.transform = 'translateY(0px)';
  }, 10);
}
function hideConfirmDeleteStudioWindow() {
  document.getElementById('backConfirmDeleteStudio').style.opacity = '0';
  document.getElementById('blockConfirmDeleteStudio').style.transform = 'translateY(-40px)';
  document.getElementById('buttonConfirmDeleteStudio').style.transform = 'translateY(80px)';
  setTimeout(function() {
    document.getElementById('backConfirmDeleteStudio').style.display = 'none';
  }, 200);
}
var downPressConfirmDeleteStudio = false;
window.addEventListener("mousedown", function(e) {
  if (document.getElementById('blockConfirmDeleteStudio') != e.target && !isChild(document.getElementById('blockConfirmDeleteStudio'), e.target) && document.getElementById('backConfirmDeleteStudio').style.display == 'flex') {
    downPressConfirmDeleteStudio = true;
  } else {
    downPressConfirmDeleteStudio = false;
  }
});
window.addEventListener("mouseup", function(e) {
  if (document.getElementById('blockConfirmDeleteStudio') != e.target && !isChild(document.getElementById('blockConfirmDeleteStudio'), e.target) && downPressConfirmDeleteStudio) {
    hideConfirmDeleteStudioWindow();
  } else {
    downPressConfirmDeleteStudio = false;
  }
});

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

function fillStudioPage(data) {
  document.getElementById('titleStudio').innerHTML = data.name;
  document.getElementById('strokeDescriptionStudio').innerHTML = data.description;
  document.getElementById('inputInputEditDescription').innerHTML = data.description;
  document.getElementById('labelConfirmDeleteStudio').innerHTML = "enter name studio <b>"+data.name+"</b> to confirm it";

  var countGames = 0;
  if (data.games != '') {
    countGames = data.games.split(',').length;
  }
  var countStaff = data.staff.split(',').length;
  document.getElementById('valueStatsStudioGames').innerHTML = countGames;
  document.getElementById('valueStatsStudioStaff').innerHTML = countStaff;

  socket.emit('getNameHolder1', data.keyHolder);
  document.getElementById('linkIdHolder').innerHTML = data.keyHolder;
  document.getElementById('linkHolderUser').setAttribute('href', '/u/'+data.keyHolder);

  var partsDate = splitDate(data.dateCreate);
  var dateFound = new Date(data.dateCreate).getTime();
  var dateNow = new Date().getTime();
  var daysFound = Math.floor((dateNow-dateFound)/(24*60*60*1000));
  if (daysFound >= 365) {
    var labelYear = 'year';
    if (Math.floor(daysFound/365) > 1) {
      labelYear = 'years';
    }
    var labelDay = 'days';
    if (daysFound%365 == 1) {
      labelDay = 'day';
    }
    document.getElementById('dateFoundStudioValue').innerHTML = partsDate.day+'.'+partsDate.mounth+'.'+partsDate.year+' ('+Math.floor(daysFound/365)+' '+labelYear+' '+(daysFound%365)+' '+labelDay+')';
  } else {
    document.getElementById('dateFoundStudioValue').innerHTML = partsDate.day+'.'+partsDate.mounth+'.'+partsDate.year+' ('+daysFound+' days)';
  }

  if (countGames == 0) {
    document.getElementById('nogameText').setAttribute('active', '1');
    document.getElementById('nogameText').style.display = 'flex';
  } else if (countGames > 0) {
    document.getElementById('nogameText').setAttribute('active', '0');
    document.getElementById('nogameText').style.display = 'none';

    if (dataIsMy) {
      socket.emit('getFoldersGames1', dataUser, data.id);
      document.getElementById('gamesFolders').style.display = 'flex';
    } else if (!dataIsMy) {
      socket.emit('getGames1', data.games.replace(/\,/g, "|"));
      document.getElementById('listGames').style.display = 'flex';
    }
  }

}

function animationMainBlock() {
  document.getElementById('mainBlock').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('mainBlock').style.opacity = '1';
  }, 200);
}

function animationNoMainBlock() {
  document.getElementById('mainNoBlock').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('mainNoBlock').style.opacity = '1';
  }, 200);
}

function showEditDescInput(e) {
  if (e.getAttribute('condition') == 'edit') {
    document.getElementById('strokeDescriptionStudio').style.transform = 'scale(0)';
    document.getElementById('blockInputEditDescription').style.display = 'flex';
    document.getElementById('editDescriptionStudio').setAttribute('condition', 'send');
    setTimeout(function() {
      document.getElementById('strokeDescriptionStudio').style.display = 'none';
      document.getElementById('blockInputEditDescription').style.transform = 'scale(1)';
      document.getElementById('blockInputEditDescription').style.opacity = '1';
      document.getElementById('blockInputEditDescription').style.width = '80%';
    }, 200);
  } else if (e.getAttribute('condition') == 'send') {
    socket.emit('editDescription1', dataUser, dataStudio.id, document.getElementById('inputInputEditDescription').value);
    document.getElementById('blockInputEditDescription').style.transform = 'scale(0)';
    document.getElementById('blockInputEditDescription').style.opacity = '0';
    document.getElementById('blockInputEditDescription').style.width = '0px';
    document.getElementById('blockInputEditDescription').style.display = 'none';
    document.getElementById('editDescriptionStudio').setAttribute('condition', 'edit');
    document.getElementById('strokeDescriptionStudio').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('strokeDescriptionStudio').style.transform = 'scale(1)';
    }, 200);
  }
}

function deleteStudio() {
  var value = document.getElementById('inputConfirmDeleteStudio').value;
  if (dataStudio.name.toLowerCase() == value.toLowerCase()) {
    socket.emit('deleteStudio', dataUser, dataStudio.id);
  }
}
function switchOpenFolder(path, e) {
  window.getSelection().removeAllRanges();
  var wrap = document.querySelectorAll('.wrapFolder[path="'+path+'"]')[0];
  if (wrap.getAttribute('openDir') == '2') {
    hideWrapDir(path);
  } else if (wrap.getAttribute('openDir') == '1') {
    showWrapDir(path);
  }
  window.getSelection().removeAllRanges();
}
function hideWrapDir(path) {
  var wrap = document.querySelectorAll('.wrapFolder[path="'+path+'"]')[0];
  wrap.setAttribute('openDir', '1');
  wrap.style.transform = 'scale(0)';
  setTimeout(function() {
    wrap.style.display = 'none';
  }, 200);
}
function showWrapDir(path) {
  var wrap = document.querySelectorAll('.wrapFolder[path="'+path+'"]')[0];
  wrap.setAttribute('openDir', '2');
  wrap.style.display = 'flex';
  setTimeout(function() {
    wrap.style.transform = 'scale(1)';
  }, 10);
}

function addFolderString(type, name, path) {
  var pathPreWrap = '';
  var partsPath = path.split('/');
  for (var i = 1; i < partsPath.length-1; i++) {
    pathPreWrap += '/'+partsPath[i]
  }

  var oneFolder = document.createElement('div');
  var paddingLeft = (path.split('/').length-3)*20;
  if (path.split('/').length == 3) {
    paddingLeft = 20;
  }
  oneFolder.setAttribute('class', 'oneFolder');
  oneFolder.setAttribute('path', path);
  oneFolder.setAttribute('typefolder', type);
  oneFolder.setAttribute('onclick', 'this.setAttribute("focus", "1")');
  oneFolder.style.paddingLeft = paddingLeft+'px';
  if (path.split('/').length == 3) {
    oneFolder.innerHTML = "<div class='imgFolder'></div><div class='titleFolder'>"+name+"</div>";
  } else if (path.split('/').length > 3) {
    oneFolder.innerHTML = "<div class='netFolders'><div class='netFolders1'></div><div class='netFolders2'></div></div><div class='imgFolder'></div><div class='titleFolder'>"+name+"</div>";
  }

  document.querySelectorAll('.wrapFolder[path="'+pathPreWrap+'"]')[0].appendChild(oneFolder);
}

function insertFolder(pathFolder, insideFiles) {
  var pathFolderParts = pathFolder.split('/');
  var typeFolder = 'folder';
  if (pathFolderParts.length == 3) {
    typeFolder = 'game';
  }

  addFolderString(typeFolder, pathFolderParts[pathFolderParts.length-1], pathFolder);
  document.querySelectorAll('.oneFolder[path="'+pathFolder+'"]')[0].setAttribute('ondblclick', 'switchOpenFolder("'+pathFolder+'", event)');

  var pathPreWrap = '';
  for (var i = 1; i < pathFolderParts.length-1; i++) {
    pathPreWrap += '/'+pathFolderParts[i]
  }
  var wrapFolder = document.createElement('div');
  wrapFolder.setAttribute('class', 'wrapFolder');
  wrapFolder.setAttribute('path', pathFolder);
  if (pathFolderParts.length > 3) {
    //wrapFolder.style.height = '0px';
    wrapFolder.style.display = 'none';
    wrapFolder.style.transform = 'scale(0)';
    wrapFolder.setAttribute('openDir', '1');
  } else {
    wrapFolder.style.display = 'flex';
    wrapFolder.style.transform = 'scale(1)';
    wrapFolder.setAttribute('openDir', '2');
  }
  document.querySelectorAll('.wrapFolder[path="'+pathPreWrap+'"]')[0].appendChild(wrapFolder);

  for (var i = 0; i < insideFiles.length; i++) {
    var partsNewFolder = insideFiles[i].split('/');
    var pathNewFolder = '';
    for (var j = 1; j < pathFolderParts.length+1; j++) {
      pathNewFolder += '/'+partsNewFolder[j];
    }
    if (partsNewFolder.length > pathFolderParts.length+1 && !document.querySelectorAll('.oneFolder[path="'+pathNewFolder+'"]')[0]) {
      insideFiles = insertFolder(pathNewFolder, insideFiles);
    }
  }

  for (var i = 0; i < insideFiles.length; i++) {
    var partsNewFolder = insideFiles[i].split('/');
    var pathNewFolder = '';
    for (var j = 1; j < pathFolderParts.length+1; j++) {
      pathNewFolder += '/'+partsNewFolder[j];
    }
    var regexp = new RegExp("^"+pathFolder, "g");
    if (regexp.test(pathNewFolder) && partsNewFolder.length == pathFolderParts.length+1 && !document.querySelectorAll('.oneFolder[path="'+pathNewFolder+'"]')[0]) {
      addFolderString('none', partsNewFolder[partsNewFolder.length-1], pathNewFolder);
      insideFiles.splice(i, 1);
      i--;
    }
  }

  return insideFiles;
}
