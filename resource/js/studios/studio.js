function getScrollTop() {
    if (typeof pageYOffset != 'undefined'){
        return pageYOffset;
    } else {
        var B = document.body;
        var D = document.documentElement;
        D = (D.clientHeight)? D: B;
        return D.scrollTop;
    }
}
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

window.addEventListener("mousedown", function(e) {
  var intoDir = false;
  var dirs = document.querySelectorAll('.oneFolder');
  for (var i = 0; i < dirs.length; i++) {
    if (dirs[i] == e.target || isChild(dirs[i], e.target)) {
      intoDir = true;
      break;
    }
  }
  if (document.getElementById('infoChoosenFolder') == e.target || isChild(document.getElementById('infoChoosenFolder'), e.target)) {
    intoDir = true;
  }
  if (!e.shiftKey && !e.ctrlKey && document.getElementById('infoChoosenFolder') != e.target && !isChild(document.getElementById('infoChoosenFolder'), e.target)) {
    var folders = document.querySelectorAll('.oneFolder');
    for (var i = 0; i < folders.length; i++) {
      if (folders[i] != e.target && !isChild(folders[i], e.target)) {
        folders[i].setAttribute("focus", "0");
      }
    }
  }
  if (!intoDir) {
    refreshChoosenFolder(e);

    var renamings = document.querySelectorAll('.blockInputChangeNameFolder[active="1"]');
    for (var i = 0; i < renamings.length; i++) {
      hideRenameFolder(renamings[i].parentElement);
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

function showBigSizeUploadWindow() {
  document.getElementById('backBigSizeUpload').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('backBigSizeUpload').style.opacity = '1';
    document.getElementById('blockBigSizeUpload').style.transform = 'translateY(0px)';
  }, 10);
}
function hideBigSizeUploadWindow() {
  document.getElementById('backBigSizeUpload').style.opacity = '0';
  document.getElementById('blockBigSizeUpload').style.transform = 'translateY(-40px)';
  setTimeout(function() {
    document.getElementById('backBigSizeUpload').style.display = 'none';
  }, 200);
}
var downPressBigSizeUpload = false;
window.addEventListener("mousedown", function(e) {
  if (document.getElementById('blockBigSizeUpload') != e.target && !isChild(document.getElementById('blockBigSizeUpload'), e.target) && document.getElementById('backBigSizeUpload').style.display == 'flex') {
    downPressBigSizeUpload = true;
  } else {
    downPressBigSizeUpload = false;
  }
});
window.addEventListener("mouseup", function(e) {
  if (document.getElementById('blockBigSizeUpload') != e.target && !isChild(document.getElementById('blockBigSizeUpload'), e.target) && downPressBigSizeUpload) {
    hideBigSizeUploadWindow();
  } else {
    downPressBigSizeUpload = false;
  }
});

function showConfirmOverwriteUploadWindow() {
  document.getElementById('backConfirmOverwriteUpload').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('backConfirmOverwriteUpload').style.opacity = '1';
    document.getElementById('blockConfirmOverwriteUpload').style.transform = 'translateY(0px)';
    document.getElementById('strokeConfirmOverwriteUpload').style.transform = 'translateY(0px)';
  }, 10);
}
function hideConfirmOverwriteUploadWindow() {
  document.getElementById('backConfirmOverwriteUpload').style.opacity = '0';
  document.getElementById('blockConfirmOverwriteUpload').style.transform = 'translateY(-40px)';
  document.getElementById('strokeConfirmOverwriteUpload').style.transform = 'translateY(80px)';
  setTimeout(function() {
    document.getElementById('backConfirmOverwriteUpload').style.display = 'none';
  }, 200);
}
var downPressConfirmOverwriteUpload = false;
window.addEventListener("mousedown", function(e) {
  if (document.getElementById('blockConfirmOverwriteUpload') != e.target && !isChild(document.getElementById('blockConfirmOverwriteUpload'), e.target) && document.getElementById('backConfirmOverwriteUpload').style.display == 'flex') {
    downPressConfirmOverwriteUpload = true;
  } else {
    downPressConfirmOverwriteUpload = false;
  }
});
window.addEventListener("mouseup", function(e) {
  if (document.getElementById('blockConfirmOverwriteUpload') != e.target && !isChild(document.getElementById('blockConfirmOverwriteUpload'), e.target) && downPressConfirmOverwriteUpload) {
    hideConfirmOverwriteUploadWindow();
  } else {
    downPressConfirmOverwriteUpload = false;
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
  //oneFolder.setAttribute('onclick', 'chooseFolder(event, this)');
  oneFolder.setAttribute('onmousedown', 'dragFolderOn(event, this)');
  oneFolder.setAttribute('onmouseup', 'dragFolderOff()');
  oneFolder.style.paddingLeft = paddingLeft+'px';
  if (path.split('/').length == 3) {
    oneFolder.innerHTML = "<div class='imgFolder'></div><div class='titleFolder'>"+name+"</div>";
  } else if (path.split('/').length > 3) {
    oneFolder.innerHTML = "<div class='netFolders'><div class='netFolders1'></div><div class='netFolders2'></div></div><div class='imgFolder'></div><div class='titleFolder'>"+name+"</div><div class='blockInputChangeNameFolder' active='0'><div class='titleInputChangeNameFolder'>name</div><input class='inputInputChangeNameFolder' value='"+name+"' oninput='validChangeNameFolder(this)' onfocusin='this.parentElement.setAttribute(\'focuse\', \'1\')' onfocusout='this.parentElement.setAttribute(\'focuse\', \'0\')' type='text' /></div><div disabled='1' onclick='renameFolder(this.parentElement)' class='buttonChangeNameFolder'>save</div><div class='buttonChangeNameFolder' onclick='hideRenameFolder(this.parentElement)' >cancel</div>";
  }

  document.querySelectorAll('.wrapFolder[path="'+pathPreWrap+'"]')[0].appendChild(oneFolder);
}

function chooseFolder(event, element) {
  if (event.ctrlKey) {
    if (element.getAttribute("focus") == "0") {
      element.setAttribute("focus", "1");
    } else if (element.getAttribute("focus") == "1") {
      element.setAttribute("focus", "0");
    }
  } else {
    element.setAttribute("focus", "1");
  }
  refreshChoosenFolder(event);
}

function refreshChoosenFolder(e) {
  if (e.shiftKey) {
    var allFolder = document.querySelectorAll('.oneFolder');
    var selectedFolders = document.querySelectorAll('.oneFolder[focus="1"]');
    var upperSelectedFolder = selectedFolders[0];
    var lowerSelectedFolder = selectedFolders[selectedFolders.length-1];
    var indexUpper = Array.prototype.indexOf.call(allFolder, upperSelectedFolder);
    var indexLower = Array.prototype.indexOf.call(allFolder, lowerSelectedFolder);
    for (var i = indexUpper; i < indexLower; i++) {
      allFolder[i].setAttribute("focus", "1");
    }
    window.getSelection().removeAllRanges();
  }

  var choosenFolder = document.querySelectorAll('.oneFolder[focus="1"]');

  if (choosenFolder.length == 1) {
    document.getElementById('pathWayChoosenFolder').innerHTML = choosenFolder[0].getAttribute('path');
  } else {
    document.getElementById('pathWayChoosenFolder').innerHTML = '';
  }


  // if (choosenFolder.length == 1 && choosenFolder[0].getAttribute('typefolder') == 'folder') {
  //   document.getElementById('titleDeleteFolderButton').innerHTML = 'delete folder';
  //   document.getElementById('titleRenameFolderButton').innerHTML = 'rename folder';
  // } else if (choosenFolder.length == 1 && choosenFolder[0].getAttribute('typefolder') == 'game') {
  //   document.getElementById('titleDeleteFolderButton').innerHTML = 'delete game';
  // } else if (choosenFolder.length == 1 && choosenFolder[0].getAttribute('typefolder') != 'game' && choosenFolder[0].getAttribute('typefolder') != 'folder') {
  //   document.getElementById('titleDeleteFolderButton').innerHTML = 'delete file';
  //   document.getElementById('titleRenameFolderButton').innerHTML = 'rename file';
  // } else if (choosenFolder.length > 1) {
  //   document.getElementById('titleDeleteFolderButton').innerHTML = 'delete choosen';
  // }

  if (choosenFolder.length == 1 && choosenFolder[0].getAttribute('typefolder') != 'game') {
    document.getElementById('renameFolderButton').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('renameFolderButton').style.transform = 'scale(1)';
    }, 10);
  } else {
    document.getElementById('renameFolderButton').style.transform = 'scale(0)';
    setTimeout(function() {
      document.getElementById('renameFolderButton').style.display = 'none';
    }, 200);
  }

  if (choosenFolder.length == 1 && (choosenFolder[0].getAttribute('typefolder') == 'game' || choosenFolder[0].getAttribute('typefolder') == 'folder')) {
    document.getElementById('addFolderButton').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('addFolderButton').style.transform = 'scale(1)';
    }, 10);
  } else {
    document.getElementById('addFolderButton').style.transform = 'scale(0)';
    setTimeout(function() {
      document.getElementById('addFolderButton').style.display = 'none';
    }, 200);
  }

  if (choosenFolder.length == 0) {
    document.getElementById('deleteFolderButton').style.transform = 'scale(0)';
    setTimeout(function() {
      document.getElementById('deleteFolderButton').style.display = 'none';
    }, 200);
  } else {
    document.getElementById('deleteFolderButton').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('deleteFolderButton').style.transform = 'scale(1)';
    }, 10);
  }
}

function insertFolder(pathFolder, insideFiles) {
  var pathFolderParts = pathFolder.split('/');
  var typeFolder = 'folder';
  if (pathFolderParts.length == 3) {
    typeFolder = 'game';
  }

  addFolderString(typeFolder, pathFolderParts[pathFolderParts.length-1], pathFolder);
  //document.querySelectorAll('.oneFolder[path="'+pathFolder+'"]')[0].setAttribute('ondblclick', 'switchOpenFolder("'+pathFolder+'", event)');

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
    var regexp = new RegExp("^"+pathFolder);
    if (regexp.test(pathNewFolder) && partsNewFolder.length > pathFolderParts.length+1 && !document.querySelectorAll('.oneFolder[path="'+pathNewFolder+'"]')[0]) {
      insideFiles = insertFolder(pathNewFolder, insideFiles);
    }
  }

  for (var i = 0; i < insideFiles.length; i++) {
    var partsNewFolder = insideFiles[i].split('/');
    var pathNewFolder = '';
    for (var j = 1; j < pathFolderParts.length+1; j++) {
      pathNewFolder += '/'+partsNewFolder[j];
    }
    var regexp = new RegExp("^"+pathFolder);
    if (regexp.test(pathNewFolder) && partsNewFolder.length == pathFolderParts.length+1 && !document.querySelectorAll('.oneFolder[path="'+pathNewFolder+'"]')[0]) {
      var type = 'none';
      var getExtension = partsNewFolder[partsNewFolder.length-1].split('.');
      if (getExtension = getExtension[1]) {
        if (getExtension == 'png' || getExtension == 'jpg' || getExtension == 'jpeg' || getExtension == 'gif' || getExtension == 'svg' || getExtension == 'mp4' || getExtension == 'glb') {
          type = 'img';
        } else if (getExtension == 'txt' || getExtension == 'html' || getExtension == 'css' || getExtension == 'js' || getExtension == 'xml' || getExtension == 'json') {
          type = 'txt';
        }
      }
      addFolderString(type, partsNewFolder[partsNewFolder.length-1], pathNewFolder);
      insideFiles.splice(i, 1);
      i--;
    }
  }

  return insideFiles;
}

var countConfirmDelete = {mouse: 1, keyboard: 1}
document.addEventListener('mousemove', function(e) {
  document.getElementById('labelNearMouse').style.left = e.pageX+15+'px';
  document.getElementById('labelNearMouse').style.top = e.pageY+15+'px';
});
var timeoutConfirmDeleteFolder = setTimeout(function() {}, 1);
function confirmMouseDeleteFolders() {
  var choosenFoldres = document.querySelectorAll('.oneFolder[focus="1"]');
  if (choosenFoldres.length > 0 && countConfirmDelete.mouse == 1) {
    countConfirmDelete.mouse = 2;
    document.getElementById('labelNearMouse').innerHTML = 'click one yet to confirm';
    document.getElementById('labelNearMouse').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('labelNearMouse').style.transform = 'scale(1)';
    }, 10);
    clearTimeout(timeoutConfirmDeleteFolder);
    timeoutConfirmDeleteFolder = setTimeout(function() {
      countConfirmDelete.mouse = 1;
      countConfirmDelete.keyboard = 1;
      document.getElementById('labelNearMouse').style.transform = 'scale(0)';
      setTimeout(function() {
        document.getElementById('labelNearMouse').innerHTML = '';
        document.getElementById('labelNearMouse').style.display = 'none';
      }, 200);
    }, 2000);
  } else if (choosenFoldres.length > 0 && countConfirmDelete.mouse == 2) {
    deleteFolders();
    countConfirmDelete.mouse = 1;
    countConfirmDelete.keyboard = 1;
    document.getElementById('labelNearMouse').style.transform = 'scale(0)';
    setTimeout(function() {
      document.getElementById('labelNearMouse').innerHTML = '';
      document.getElementById('labelNearMouse').style.display = 'none';
    }, 200);
  }
}
document.addEventListener('keydown', function(e) {
  var activeInput = document.querySelectorAll(".blockInputChangeNameFolder[active='1']");
  if (e.code == 'Delete' && !activeInput[0]) {
    var choosenFoldres = document.querySelectorAll('.oneFolder[focus="1"]');
    if (choosenFoldres.length > 0 && countConfirmDelete.keyboard == 1) {
      countConfirmDelete.keyboard = 2;
      document.getElementById('labelNearMouse').innerHTML = 'press one yet delete to confirm';
      document.getElementById('labelNearMouse').style.display = 'flex';
      setTimeout(function() {
        document.getElementById('labelNearMouse').style.transform = 'scale(1)';
      }, 10);
      clearTimeout(timeoutConfirmDeleteFolder);
      timeoutConfirmDeleteFolder = setTimeout(function() {
        countConfirmDelete.mouse = 1;
        countConfirmDelete.keyboard = 1;
        document.getElementById('labelNearMouse').style.transform = 'scale(0)';
        setTimeout(function() {
          document.getElementById('labelNearMouse').innerHTML = '';
          document.getElementById('labelNearMouse').style.display = 'none';
        }, 200);
      }, 2000);
    } else if (choosenFoldres.length > 0 && countConfirmDelete.keyboard == 2) {
      deleteFolders();
      countConfirmDelete.mouse = 1;
      countConfirmDelete.keyboard = 1;
      document.getElementById('labelNearMouse').style.transform = 'scale(0)';
      setTimeout(function() {
        document.getElementById('labelNearMouse').innerHTML = '';
        document.getElementById('labelNearMouse').style.display = 'none';
      }, 200);
    }
  }
});

var pathsGamesToDelete = [];
var pathsFoldersToDelete = [];
var pathsFilesToDelete = [];
function deleteFolders() {
  var choosenFoldres = document.querySelectorAll('.oneFolder[focus="1"]');
  var pathsGames = [];
  var pathsFolders = [];
  var pathsFiles = [];
  for (var i = 0; i < choosenFoldres.length; i++) {
    var type = choosenFoldres[i].getAttribute('typefolder');
    if (type == 'game') {
      pathsGames.push(choosenFoldres[i].getAttribute('path'));
    } else if (type == 'folder') {
      pathsFolders.push(choosenFoldres[i].getAttribute('path'));
    } else {
      pathsFiles.push(choosenFoldres[i].getAttribute('path'));
    }
  }
  //cleaning folders and files inside game
  for (var i = 0; i < pathsGames.length; i++) {
    var regexp = new RegExp('^'+pathsGames[i]);
    for (var j = 0; j < pathsFolders.length; j++) {
      if (regexp.test(pathsFolders[j]) ) {
        pathsFolders.splice(j, 1);
        j--;
      }
    }
    for (var j = 0; j < pathsFiles.length; j++) {
      if (regexp.test(pathsFiles[j])) {
        pathsFiles.splice(j, 1);
        j--;
      }
    }
  }
  //cleaning folders and files inside folders
  for (var i = 0; i < pathsFolders.length; i++) {
    var regexp = new RegExp('^'+pathsFolders[i]);
    for (var j = 0; j < pathsFolders.length; j++) {
      if (pathsFolders[j] != pathsFolders[i] && regexp.test(pathsFolders[j]) ) {
        pathsFolders.splice(j, 1);
        j--;
      }
    }
    for (var j = 0; j < pathsFiles.length; j++) {
      if (regexp.test(pathsFiles[j])) {
        pathsFiles.splice(j, 1);
        j--;
      }
    }
  }

  pathsGamesToDelete = pathsGames;
  pathsFoldersToDelete = pathsFolders;
  pathsFilesToDelete = pathsFiles;

  if (pathsGames.length > 0) {
    showConfirmDeleteGameWindow();
  } else {
    deleteFoldersConfirmed();
  }
}

function showConfirmDeleteGameWindow() {
  document.getElementById('backConfirmDeleteGame').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('backConfirmDeleteGame').style.opacity = '1';
    document.getElementById('blockConfirmDeleteGame').style.transform = 'translateY(0px)';
    document.getElementById('buttonConfirmDeleteGame').style.transform = 'translateY(0px)';
  }, 10);
}
function hideConfirmDeleteGameWindow() {
  document.getElementById('backConfirmDeleteGame').style.opacity = '0';
  document.getElementById('blockConfirmDeleteGame').style.transform = 'translateY(-40px)';
  document.getElementById('buttonConfirmDeleteGame').style.transform = 'translateY(80px)';
  setTimeout(function() {
    document.getElementById('backConfirmDeleteGame').style.display = 'none';
  }, 200);
}
var downPressConfirmDeleteGame = false;
window.addEventListener("mousedown", function(e) {
  if (document.getElementById('blockConfirmDeleteGame') != e.target && !isChild(document.getElementById('blockConfirmDeleteGame'), e.target) && document.getElementById('backConfirmDeleteGame').style.display == 'flex') {
    downPressConfirmDeleteGame = true;
  } else {
    downPressConfirmDeleteGame = false;
  }
});
window.addEventListener("mouseup", function(e) {
  if (document.getElementById('blockConfirmDeleteGame') != e.target && !isChild(document.getElementById('blockConfirmDeleteGame'), e.target) && downPressConfirmDeleteGame) {
    hideConfirmDeleteGameWindow();
  } else {
    downPressConfirmDeleteGame = false;
  }
});

function deleteFoldersConfirmed() {
  for (var i = 0; i < pathsGamesToDelete.length; i++) {
    console.log(pathsGamesToDelete[i].split('/')[2]);
  }

  socket.emit('deleteFolders1', dataUser, dataStudio.id, pathsGamesToDelete, pathsFoldersToDelete, pathsFilesToDelete);
  hideConfirmDeleteGameWindow();
}

document.addEventListener('keydown', function(e) {
  var activeInput = document.querySelectorAll(".blockInputChangeNameFolder[active='1']");
  if (e.code == 'KeyN' && !activeInput[0]) {
    var choosenFoldres = document.querySelectorAll('.oneFolder[focus="1"]');
    if (choosenFoldres.length == 1 && choosenFoldres[0].getAttribute('typefolder') != 'game') {
      showRenameFolder(choosenFoldres[0]);
    }
  } else if (e.code == 'KeyA' && !activeInput[0]) {
    var choosenFoldres = document.querySelectorAll('.oneFolder[focus="1"]');
    if (choosenFoldres.length == 1 && (choosenFoldres[0].getAttribute('typefolder') == 'game' || choosenFoldres[0].getAttribute('typefolder') == 'folder')) {
      addNewFolder();
    }
  }
});

function showRenameFolder(el) {
  var blockInput = el.querySelectorAll('.blockInputChangeNameFolder')[0];
  var buttonOk = el.querySelectorAll('.buttonChangeNameFolder')[0];
  var buttonCancel = el.querySelectorAll('.buttonChangeNameFolder')[1];
  var text = el.querySelectorAll('.titleFolder')[0];

  buttonOk.setAttribute('disabled', '1');
  blockInput.style.display = 'flex';
  buttonOk.style.display = 'flex';
  buttonCancel.style.display = 'flex';
  text.style.transform = 'scale(0)';
  text.style.marginLeft = '0px';
  setTimeout(function() {
    text.style.display = 'none';
    blockInput.setAttribute('active', '1');
    buttonOk.style.transform = 'scale(1)';
    buttonCancel.style.transform = 'scale(1)';
  }, 200);
}

function hideRenameFolder(el) {
  var blockInput = el.querySelectorAll('.blockInputChangeNameFolder')[0];
  var buttonOk = el.querySelectorAll('.buttonChangeNameFolder')[0];
  var buttonCancel = el.querySelectorAll('.buttonChangeNameFolder')[1];
  var text = el.querySelectorAll('.titleFolder')[0];

  blockInput.setAttribute('active', '0');
  buttonOk.setAttribute('disabled', '1');
  buttonOk.style.transform = 'scale(0)';
  buttonCancel.style.transform = 'scale(0)';
  text.style.display = 'flex';
  setTimeout(function() {
    blockInput.style.display = 'none';
    buttonOk.style.display = 'none';
    buttonCancel.style.display = 'none';
    text.style.transform = 'scale(1)';
    text.style.marginLeft = '10px';
  }, 200);
}

function validChangeNameFolder(el) {
  var button = el.parentElement.parentElement.querySelectorAll('.buttonChangeNameFolder')[0];
  var title = el.parentElement.querySelectorAll('.titleInputChangeNameFolder')[0];
  var input = el.parentElement.querySelectorAll('.inputInputChangeNameFolder')[0];
  if (/^[\.\w]+$/.test(el.value)) {
    title.innerHTML = 'name = valid';
    title.style.color = '#1aca00';
    input.style.border = '1px solid #1aca00';
    button.setAttribute('disabled', '0');
  } else {
    title.innerHTML = 'name = invalid';
    title.style.color = '#f77171';
    input.style.border = '1px solid #f77171';
    button.setAttribute('disabled', '1');
  }
}

function renameFolder(el) {
  var button = el.querySelectorAll('.buttonChangeNameFolder')[0];
  if (button.getAttribute('disabled') != '1') {
    var value = el.querySelectorAll('.inputInputChangeNameFolder')[0].value;
    var oldPath = el.getAttribute('path');
    var newPath = oldPath.split('/');
    newPath[newPath.length-1] = value;
    newPath = newPath.join('/');
    socket.emit('renameFolder1', dataUser, dataStudio.id, oldPath, newPath);
  }
}
function addNewFolder() {
  var choosenFoldres = document.querySelectorAll('.oneFolder[focus="1"]')[0];
  socket.emit('addFolder1', dataUser, dataStudio.id, choosenFoldres.getAttribute('path'));
}

var flagDragFolder = false;
var mouse = {x: 0, y: 0};
var deltaDragFolder = {x: 0, y: 0};
var whereMoveFolder = {flag: '', path: ''};
document.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;

  if (flagDragFolder) {
    if (document.getElementById('dragFolder').style.display == 'none') {
      document.getElementById('dragFolder').style.display = 'flex';
    }
    if (document.getElementById('whiteCoverDragFolder').style.display == 'none') {
      document.getElementById('whiteCoverDragFolder').style.display = 'flex';
    }


    document.getElementById('dragFolder').style.left = mouse.x+'px';
    document.getElementById('dragFolder').style.top = mouse.y+'px';

    whereMoveFolder = {flag: '', path: ''};

    var movingFolder = document.getElementById('dragFolder').querySelectorAll('.oneFolder')[0];

    var folders = document.querySelectorAll('.oneFolder');
    for (var i = 0; i < folders.length; i++) {
      if (folders[i].getAttribute('path') != movingFolder.getAttribute('path')) {
      var coords = folders[i].getBoundingClientRect();
      if (mouse.x > coords.x && mouse.x < coords.x+coords.width) {
      if (mouse.y > (getScrollTop()+coords.y) && mouse.y < (getScrollTop()+coords.y)+coords.height) {
        var flagWhere = 'near';
        if (folders[i].getAttribute('typefolder') == 'game' || folders[i].getAttribute('typefolder') == 'folder') {
          if (mouse.y < (getScrollTop()+coords.y)+coords.height*0.3) {
            folders[i].setAttribute('focus', '2');
          } else if (mouse.y > (getScrollTop()+coords.y)+coords.height*0.7) {
            folders[i].setAttribute('focus', '3');
          } else if (mouse.y >= (getScrollTop()+coords.y)+coords.height*0.3 && mouse.y <= (getScrollTop()+coords.y)+coords.height*0.7) {
            folders[i].setAttribute('focus', '1');
            flagWhere = 'inside';
          }
        } else {
          if (mouse.y < (getScrollTop()+coords.y)+coords.height*0.5) {
            folders[i].setAttribute('focus', '2');
          } else if (mouse.y >= (getScrollTop()+coords.y)+coords.height*0.5) {
            folders[i].setAttribute('focus', '3');
          }
        }
        whereMoveFolder.flag = flagWhere;
        whereMoveFolder.path = folders[i].getAttribute('path');
      } else {
        folders[i].setAttribute('focus', '0');
      }
      } else {
        folders[i].setAttribute('focus', '0');
      }
    }
    }
  } else {
    document.getElementById('dragFolder').style.display = 'none';
    document.getElementById('whiteCoverDragFolder').style.display = 'none';
  }
});

var timeoutDblclikcFolder = setTimeout(function() {}, 1);
var dblclickFolder = 0;
function dragFolderOn(e, el) {
  var intoDir = false;
  var dirs = document.querySelectorAll('.oneFolder');
  for (var i = 0; i < dirs.length; i++) {
    if (dirs[i] == e.target || isChild(dirs[i], e.target)) {
      intoDir = true;
      break;
    }
  }
  if (document.getElementById('infoChoosenFolder') == e.target || isChild(document.getElementById('infoChoosenFolder'), e.target)) {
    intoDir = true;
  }
  if (!e.shiftKey && !e.ctrlKey && document.getElementById('infoChoosenFolder') != e.target && !isChild(document.getElementById('infoChoosenFolder'), e.target)) {
    var folders = document.querySelectorAll('.oneFolder');
    for (var i = 0; i < folders.length; i++) {
      if (folders[i] != e.target && !isChild(folders[i], e.target)) {
        folders[i].setAttribute("focus", "0");
      }
    }
  }
  if (!intoDir) {
    refreshChoosenFolder(e);

    var renamings = document.querySelectorAll('.blockInputChangeNameFolder[active="1"]');
    for (var i = 0; i < renamings.length; i++) {
      hideRenameFolder(renamings[i].parentElement);
    }
  }

  //---------------

  dblclickFolder++;

  clearTimeout(timeoutDblclikcFolder);
  timeoutDblclikcFolder = setTimeout(function() {
    dblclickFolder = 0;
  }, 300);

  if (dblclickFolder == 1) {
    chooseFolder(e, el);
  } else if (dblclickFolder == 2) {
    switchOpenFolder(el.getAttribute('path'));
  }

  var activeInput = document.querySelectorAll(".blockInputChangeNameFolder[active='1']");
  if (!activeInput[0] && el.getAttribute('typefolder') != 'game') {
    flagDragFolder = true;
    var coords = el.getBoundingClientRect();

    //document.getElementById('dragFolder').style.display = 'flex';
    document.getElementById('dragFolder').innerHTML = el.outerHTML;
    document.getElementById('dragFolder').style.left = mouse.x+'px';
    document.getElementById('dragFolder').style.top = mouse.y+'px';
    document.getElementById('dragFolder').style.width = el.offsetWidth+'px';
    document.getElementById('dragFolder').style.height = el.offsetHeight+'px';
    document.getElementById('dragFolder').style.backgroundColor = '#999999';
    document.getElementById('dragFolder').style.marginLeft = -(mouse.x-+coords.x)+'px';
    document.getElementById('dragFolder').style.marginTop = -(mouse.y-(getScrollTop()+coords.y))+'px';
    document.getElementById('dragFolder').querySelectorAll('.netFolders')[0].style.opacity = '0';

    //document.getElementById('whiteCoverDragFolder').style.display = 'flex';
    document.getElementById('whiteCoverDragFolder').style.left = mouse.x+'px';
    document.getElementById('whiteCoverDragFolder').style.top = mouse.y+'px';
    document.getElementById('whiteCoverDragFolder').style.width = el.offsetWidth+'px';
    document.getElementById('whiteCoverDragFolder').style.height = el.offsetHeight+'px';
    document.getElementById('whiteCoverDragFolder').style.marginLeft = -(mouse.x-coords.x)+'px';
    document.getElementById('whiteCoverDragFolder').style.marginTop = -(mouse.y-(getScrollTop()+coords.y))+'px';
  }
}
function dragFolderOff() {
  flagDragFolder = false;

  var oldPath = '';
  if (document.getElementById('dragFolder').querySelectorAll('.oneFolder')[0]) {
    oldPath = document.getElementById('dragFolder').querySelectorAll('.oneFolder')[0].getAttribute('path');
  }

  document.getElementById('dragFolder').style.display = 'none';
  document.getElementById('dragFolder').innerHTML = '';

  document.getElementById('whiteCoverDragFolder').style.display = 'none';
  document.getElementById('whiteCoverDragFolder').style.left = '0px';
  document.getElementById('whiteCoverDragFolder').style.top = '0px';
  document.getElementById('whiteCoverDragFolder').style.width = '0px';
  document.getElementById('whiteCoverDragFolder').style.height = '0px';
  document.getElementById('whiteCoverDragFolder').style.marginLeft = '0px';
  document.getElementById('whiteCoverDragFolder').style.marginTop = '0px';

  if (whereMoveFolder.flag != '' && whereMoveFolder.path != '') {
    var typefolderWhere = document.querySelectorAll('.oneFolder[path="'+whereMoveFolder.path+'"]')[0].getAttribute('typefolder');

    var folders = document.querySelectorAll('.oneFolder');
    for (var i = 0; i < folders.length; i++) {
      folders[i].setAttribute('focus', '0');
    }

    document.getElementById('renameFolderButton').style.transform = 'scale(0)';
    document.getElementById('addFolderButton').style.transform = 'scale(0)';
    document.getElementById('deleteFolderButton').style.transform = 'scale(0)';
    setTimeout(function() {
      document.getElementById('renameFolderButton').style.display = 'none';
      document.getElementById('addFolderButton').style.display = 'none';
      document.getElementById('deleteFolderButton').style.display = 'none';
    }, 200);

    var newPath = '';
    var partsNewPath = whereMoveFolder.path.split('/');
    var partsOldPath = oldPath.split('/');
    var maxI = partsNewPath.length;
    var nameMoving = partsOldPath[partsOldPath.length-1];
    if (whereMoveFolder.flag == 'near' && typefolderWhere != 'game') {
      maxI = maxI-1;
    }
    for (var i = 1; i < maxI; i++) {
      newPath += '/'+partsNewPath[i];
    }
    newPath = newPath+'/'+nameMoving;
    if (oldPath != newPath) {
      console.log(oldPath);
      console.log(newPath);
      socket.emit('renameFolder1', dataUser, dataStudio.id, oldPath, newPath);
    }
    whereMoveFolder = {flag: '', path: ''};
  }
}

document.addEventListener('dragenter', dragFileTurn);
function dragFileTurn(event) {
  var boundingBody = document.getElementById('wrapAll').getBoundingClientRect();
  document.removeEventListener('dragenter', dragFileTurn);
  document.getElementById('dragFile').style.display = 'flex';
  document.getElementById('dragFile').style.height = boundingBody.height+'px';
}
document.getElementById('dragFile').addEventListener('dragenter', function(e) {
  e.preventDefault();
});
document.getElementById('dragFile').addEventListener('dragleave', function() {
  document.addEventListener('dragenter', dragFileTurn);
  document.getElementById('dragFile').style.display = 'none';
  closeShowingDragFile();
});
document.getElementById('dragFile').addEventListener('dragover', function(e) {
  e.preventDefault();
  mouse.x = e.pageX;
  mouse.y = e.pageY;
  updateShowingDragFile();
});
var uploadItems = [];
function traverseFileTree(item, path, allItems) {
  path = path || '';
  allItems = allItems || [];

  if (item.isFile) {
    item.file(function(file) {
      uploadItems.push({
        type: 'file',
        path: path+file.name,
        value: file
      });
      // allItems[allItems.length] = {
      //   type: 'file',
      //   path: path+file.name,
      //   value: file
      // };
    });
  } else if (item.isDirectory) {
    // allItems[allItems.length] = {
    //   type: 'folder',
    //   path: path+item.name,
    //   value: null
    // };
    uploadItems.push({
      type: 'folder',
      path: path+item.name,
      value: null
    });
    var dirReader = item.createReader();
    dirReader.readEntries(function(entries) {
      for (var i = 0; i < entries.length; i++) {
        //allItems = traverseFileTree(entries[i], path+item.name+"/", allItems);
        traverseFileTree(entries[i], path+item.name+"/");
      }
    });
  }
  //return allItems;
}
document.getElementById('dragFile').addEventListener('drop', function(e) {
  e.preventDefault();
  document.addEventListener('dragenter', dragFileTurn);
  document.getElementById('dragFile').style.display = 'none';

    var path = '';
    if (flagsDrag.path.split('/').length > 3) {
      if (flagsDrag.where == 'near') {
        var partsPathWhere = flagsDrag.path.split('/');
        for (var i = 1; i < partsPathWhere.length-1; i++) {
          path += '/'+partsPathWhere[i];
        }
      } else {
        path = flagsDrag.path;
      }
    } else {
      path = flagsDrag.path;
    }

  if (document.getElementById('coverListFoldersOutDrag').style.display == 'none' && path.split('/').length > 2) {

    uploadItems = [];
    var items = e.dataTransfer.items;
    for (var i = 0; i < items.length; i++) {
      var item = items[i].webkitGetAsEntry();
      if (item) {
        //var insideItems = traverseFileTree(item);
        traverseFileTree(item);
      }
    }
    setTimeout(function() {
      var totalSizeUpload = 0;
      for (var i = 0; i < uploadItems.length; i++) {
        if (uploadItems[i].type == 'file') {
          totalSizeUpload += uploadItems[i].value.size;
        }
      }
      totalSizeUpload = Math.round((totalSizeUpload/Math.pow(1024, 2))*100)/100;
      if (currentTotalSizeFiles+totalSizeUpload > 200) {
        showBigSizeUploadWindow();
      } else if (currentTotalSizeFiles+totalSizeUpload <= 200) {
        var flagOverwrite = false;
        var wrapFoldersWhereInsert = document.querySelectorAll('.wrapFolder[path="'+path+'"]')[0];
        if (wrapFoldersWhereInsert) {
          var foldersWhereInsert = wrapFoldersWhereInsert.querySelectorAll('.oneFolder');
          for (var i = 0; i < uploadItems.length; i++) {
            for (var j = 0; j < foldersWhereInsert.length; j++) {
              if (foldersWhereInsert[j].getAttribute('path') == path+'/'+uploadItems[i].path) {
                flagOverwrite = true;
                break;
              }
            }
          }
        }
        if (flagOverwrite) {
          document.getElementById('buttonAgreeOverwriteUpload').setAttribute('onclick', 'agreeUploadFiles("'+path+'")');
          showConfirmOverwriteUploadWindow();
        } else {
          agreeUploadFiles(path);
        }
      }
    }, 1000);
  }

  closeShowingDragFile();
});
function agreeUploadFiles(path) {
  showLoading();

  socket.emit('uploadFiles', dataUser, dataStudio.id, path, uploadItems);

  hideConfirmOverwriteUploadWindow();
  document.getElementById('buttonAgreeOverwriteUpload').setAttribute('onclick', '');
  uploadItems = [];
}
var flagsDrag = {inout: '', updateScroll: false, path: '', where: ''}
function updateShowingDragFile() {
  var coordsListFolders = document.getElementById('listFolders').getBoundingClientRect();
  // console.log(coordsListFolders.y+getScrollTop()+coordsListFolders.height);
  // console.log(mouse.y);
  if ( (mouse.x >= coordsListFolders.x && mouse.x <= coordsListFolders.x+coordsListFolders.width) && (mouse.y >= (coordsListFolders.y+getScrollTop()) && mouse.y <= (coordsListFolders.y+getScrollTop())+coordsListFolders.height) ) {
    indicateFoldersDrag();
    if (flagsDrag.inout != 'in') {
      document.getElementById('coverListFoldersOutDrag').style.transform = 'scale(0)';
      setTimeout(function() {
        document.getElementById('coverListFoldersOutDrag').style.display = 'none';
      }, 200);
      flagsDrag.inout = 'in';
    }
  } else {
    if (flagsDrag.inout != 'out' || flagsDrag.updateScroll) {
      var folders = document.querySelectorAll('.oneFolder');
      for (var i = 0; i < folders.length; i++) {
        folders[i].setAttribute('focus', '0');
      }

      document.getElementById('coverListFoldersOutDrag').style.left = coordsListFolders.x+'px';
      // document.getElementById('coverListFoldersOutDrag').style.top = coordsListFolders.y+'px';
      document.getElementById('coverListFoldersOutDrag').style.width = coordsListFolders.width+'px';
      if (coordsListFolders.y > 0) {
        document.getElementById('coverListFoldersOutDrag').style.top = coordsListFolders.y+'px';
      } else if (coordsListFolders.y <= 0) {
        document.getElementById('coverListFoldersOutDrag').style.top = '0px';
      }
      if (coordsListFolders.y+getScrollTop()+coordsListFolders.height > getScrollTop()+window.innerHeight) {
        document.getElementById('coverListFoldersOutDrag').style.height = '100vh';
      } else if (coordsListFolders.y <= 0 && coordsListFolders.y+getScrollTop()+coordsListFolders.height <= getScrollTop()+window.innerHeight) {
        document.getElementById('coverListFoldersOutDrag').style.height = coordsListFolders.y+coordsListFolders.height+'px';
      } else if (coordsListFolders.y > 0 && coordsListFolders.y+getScrollTop()+coordsListFolders.height <= getScrollTop()+window.innerHeight) {
        document.getElementById('coverListFoldersOutDrag').style.height = coordsListFolders.height+'px';
      }
      document.getElementById('coverListFoldersOutDrag').style.display = 'flex';
      setTimeout(function() {
        document.getElementById('coverListFoldersOutDrag').style.transform = 'scale(1)';
      }, 10);
      flagsDrag.inout = 'out';
      flagsDrag.updateScroll = false;
    }
  }

}
function closeShowingDragFile() {
  flagsDrag = {inout: '', updateScroll: false, path: '', where: ''};
  document.getElementById('coverListFoldersOutDrag').style.transform = 'scale(0)';
  setTimeout(function() {
    document.getElementById('coverListFoldersOutDrag').style.display = 'none';
  }, 200);

  var folders = document.querySelectorAll('.oneFolder');
  for (var i = 0; i < folders.length; i++) {
    folders[i].setAttribute('focus', '0');
  }
}
window.addEventListener('scroll', function() {
  if (flagsDrag.inout != '') {
    flagsDrag.updateScroll = true;
    //updateShowingDragFile();
  }
});

function indicateFoldersDrag() {
  flagsDrag.where = '';
  flagsDrag.path = '';
  var folders = document.querySelectorAll('.oneFolder');
  for (var i = 0; i < folders.length; i++) {
    var coords = folders[i].getBoundingClientRect();
    if (mouse.x > coords.x && mouse.x < coords.x+coords.width) {
    if (mouse.y > (getScrollTop()+coords.y) && mouse.y < (getScrollTop()+coords.y)+coords.height) {
      var flagWhere = 'near';
      if (folders[i].getAttribute('typefolder') == 'game' || folders[i].getAttribute('typefolder') == 'folder') {
        if (mouse.y < (getScrollTop()+coords.y)+coords.height*0.3) {
          folders[i].setAttribute('focus', '2');
        } else if (mouse.y > (getScrollTop()+coords.y)+coords.height*0.7) {
          folders[i].setAttribute('focus', '3');
        } else if (mouse.y >= (getScrollTop()+coords.y)+coords.height*0.3 && mouse.y <= (getScrollTop()+coords.y)+coords.height*0.7) {
          folders[i].setAttribute('focus', '1');
          flagWhere = 'inside';
        }
      } else {
        if (mouse.y < (getScrollTop()+coords.y)+coords.height*0.5) {
          folders[i].setAttribute('focus', '2');
        } else if (mouse.y >= (getScrollTop()+coords.y)+coords.height*0.5) {
          folders[i].setAttribute('focus', '3');
        }
      }
      flagsDrag.where = flagWhere;
      flagsDrag.path = folders[i].getAttribute('path');
    } else {
      folders[i].setAttribute('focus', '0');
    }
    } else {
      folders[i].setAttribute('focus', '0');
    }
  }
}
function showLoading() {
  document.getElementById('backLoading').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('backLoading').style.opacity = '1';
    document.getElementById('blockLoading').style.transform = 'translateY(0px)';
  }, 10);
}
function hideLoading() {
  document.getElementById('backLoading').style.opacity = '0';
  document.getElementById('blockLoading').style.transform = 'translateY(-40px)';
  setTimeout(function() {
    document.getElementById('backLoading').style.display = 'none';
  }, 200);
}
