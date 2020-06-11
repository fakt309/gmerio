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
  var button = document.getElementById('buttonCreateGame');
  var buttonCancel = document.getElementById('buttonCancelCreateGame');
  if (input.getAttribute('active') == '0') {
    input.style.display = 'flex';
    buttonCancel.style.display = 'flex';
    setTimeout(function() {
      input.setAttribute('active', '1');
      button.setAttribute('disabled', '1');
      buttonCancel.setAttribute('active', '1');
      button.innerHTML = 'create';
    }, 10);
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
