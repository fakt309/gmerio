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
function showConfirm() {
  document.getElementById('backConfirmDelete').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('backConfirmDelete').style.opacity = '1';
    document.getElementById('blockConfirmDelete').style.transform = 'translateY(0px)';
    document.getElementById('buttonConfirmDelete').style.transform = 'translateY(0px)';
  }, 10);
}
function hideConfirm() {
  document.getElementById('backConfirmDelete').style.opacity = '0';
  document.getElementById('blockConfirmDelete').style.transform = 'translateY(-40px)';
  document.getElementById('buttonConfirmDelete').style.transform = 'translateY(80px)';
  setTimeout(function() {
    document.getElementById('backConfirmDelete').style.display = 'none';
  }, 200);
}
var downPressConfirmDelete = false;
window.addEventListener("mousedown", function(e) {
  if (document.getElementById('blockConfirmDelete') != e.target && !isChild(document.getElementById('blockConfirmDelete'), e.target) && document.getElementById('backConfirmDelete').style.display == 'flex') {
    downPressConfirmDelete = true;
  } else {
    downPressConfirmDelete = false;
  }
});
window.addEventListener("mouseup", function(e) {
  if (document.getElementById('blockConfirmDelete') != e.target && !isChild(document.getElementById('blockConfirmDelete'), e.target) && downPressConfirmDelete) {
    hideConfirm();
  } else {
    downPressConfirmDelete = false;
  }
});
function deleteDevice(idUser, indexDevice) {
  socket.emit('deleteDevice', idUser, indexDevice);
}
function deleteAccount(idUser) {
  if (document.getElementById('buttonConfirmDelete').getAttribute('confirmEmail') == document.getElementById('inputConfirmDelete').value) {
    if (fullUserData.studios == '' || !fullUserData.studios || fullUserData.studios == null) {
      socket.emit('deleteAccount', dataUser, idUser);
    } else {
      document.getElementById('errorConfirmDelete').style.display = 'flex';
    }

  }
}
function showConfirmSignout() {
  document.getElementById('backConfirmSignout').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('backConfirmSignout').style.opacity = '1';
    document.getElementById('blockConfirmSignout').style.transform = 'translateY(0px)';
    document.getElementById('strokeButtonsConfirmSignout').style.transform = 'translateY(0px)';
  }, 10);
}
function hideConfirmSignout() {
  document.getElementById('backConfirmSignout').style.opacity = '0';
  document.getElementById('blockConfirmSignout').style.transform = 'translateY(-40px)';
  document.getElementById('strokeButtonsConfirmSignout').style.transform = 'translateY(80px)';
  setTimeout(function() {
    document.getElementById('backConfirmSignout').style.display = 'none';
  }, 200);
}
var downPressConfirmSignout = false;
window.addEventListener("mousedown", function(e) {
  if (document.getElementById('blockConfirmSignout') != e.target && !isChild(document.getElementById('blockConfirmSignout'), e.target) && document.getElementById('backConfirmSignout').style.display == 'flex') {
    downPressConfirmSignout = true;
  } else {
    downPressConfirmSignout = false;
  }
});
window.addEventListener("mouseup", function(e) {
  if (document.getElementById('blockConfirmSignout') != e.target && !isChild(document.getElementById('blockConfirmSignout'), e.target) && downPressConfirmSignout) {
    hideConfirmSignout();
  } else {
    downPressConfirmSignout = false;
  }
});
function signout() {
  removeCookie('signinMail');
  location.reload();
}
function removeCookie(name) {
  document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function showEditName() {
  document.getElementById('icoEditName').setAttribute('active', '0');
  document.getElementById('textNameStrokeInfo').setAttribute('active', '0');
  document.getElementById('blockInputEditName').style.display = 'flex';
  document.getElementById('saveButtonEditName').style.display = 'flex';
  document.getElementById('cancelButtonEditName').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('blockInputEditName').setAttribute('active', '1');
    document.getElementById('saveButtonEditName').setAttribute('active', '1');
    document.getElementById('cancelButtonEditName').setAttribute('active', '1');
  }, 10);
  setTimeout(function() {
    document.getElementById('icoEditName').style.display = 'none';
    document.getElementById('textNameStrokeInfo').style.display = 'none';
  }, 200);
}
function hideEditName() {
  document.getElementById('icoEditName').style.display = 'flex';
  document.getElementById('textNameStrokeInfo').style.display = 'flex';
  document.getElementById('blockInputEditName').setAttribute('active', '0');
  document.getElementById('saveButtonEditName').setAttribute('active', '0');
  document.getElementById('cancelButtonEditName').setAttribute('active', '0');
  setTimeout(function() {
    document.getElementById('icoEditName').setAttribute('active', '1');
    document.getElementById('textNameStrokeInfo').setAttribute('active', '1');
  }, 10);
  setTimeout(function() {
    document.getElementById('blockInputEditName').style.display = 'none';
    document.getElementById('saveButtonEditName').style.display = 'none';
    document.getElementById('cancelButtonEditName').style.display = 'none';
  }, 200);
}
function saveFullName() {
  socket.emit('saveFullName1', dataUser, document.getElementById('inputInputEditName').value);
}

function fillBlockCommunityData() {
  document.getElementById('authorityBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.authority.value;
  document.getElementById('releaseBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.release.value;
  document.getElementById('articleBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.article.value;
  document.getElementById('questionBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.question.value;
  document.getElementById('likeBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.like.value;
  document.getElementById('commentBlockDataCommunityData').querySelector('.valueBlockDataCommunityData').innerHTML = dataUserCommunity.comment.value;
}
