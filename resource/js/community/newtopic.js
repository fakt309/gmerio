function showFirstStage() {
  document.getElementById('topTtitleStroke').style.transform = 'translateY(0px)';
  setTimeout(function() {
    document.getElementById('chooseType').style.transform = 'scale(1)';
  }, 500);
}
window.addEventListener('load', showFirstStage);

var timeoutCompile = setTimeout(function() {}, 1);
function insertMetachars(sStartTag, sEndTag) {
  var bDouble = arguments.length > 1;
  var oMsgInput = document.getElementById('textareaContent');
  var nSelStart = oMsgInput.selectionStart;
  var nSelEnd = oMsgInput.selectionEnd;
  var sOldText = oMsgInput.value;

  oMsgInput.value = sOldText.substring(0, nSelStart) + (bDouble?sStartTag+sOldText.substring(nSelStart, nSelEnd)+sEndTag:sStartTag)+sOldText.substring(nSelEnd);
  oMsgInput.setSelectionRange(bDouble||nSelStart===nSelEnd?nSelStart+sStartTag.length:nSelStart,(bDouble?nSelEnd:nSelStart)+sStartTag.length);
  oMsgInput.focus();

  clearTimeout(timeoutCompile);
  timeoutCompile = setTimeout(function() {
    document.getElementById('blockShowContent').innerHTML = compileMetacode(oMsgInput.value);
  }, 500);
}

var typeArticle = null;
function chooseType(el) {
  var types = document.querySelectorAll('.oneType');
  for (var i = 0; i < types.length; i++) {
    types[i].setAttribute('active', '0');
  }
  el.setAttribute('active', '1');

  if (el.getAttribute('id') == 'blockTypeArticle' && typeArticle != 'article') {
    typeArticle = 'article';
    hideDateRelease();
    hideInputDateRelease();
    hideUrlRelease();
    hideUploadImg();
    hideEnterContent();
    hideTagsSection();
    hideCaptchaSection();
    document.getElementById('countWords').style.display = 'none';
  } else if (el.getAttribute('id') == 'blockTypeGame' && typeArticle != 'release') {
    typeArticle = 'release';
    hideDateRelease();
    hideInputDateRelease();
    hideUrlRelease();
    hideUploadImg();
    hideEnterContent();
    hideTagsSection();
    hideCaptchaSection();
    document.getElementById('countWords').style.display = 'none';
  } else if (el.getAttribute('id') == 'blockTypeQuestion' && typeArticle != 'question') {
    typeArticle = 'question';
    hideDateRelease();
    hideInputDateRelease();
    hideUrlRelease();
    hideUploadImg();
    hideEnterContent();
    hideTagsSection();
    hideCaptchaSection();
    document.getElementById('countWords').style.display = 'none';
  }

  showSecondStage();
}

function showSecondStage() {
  if (typeArticle == 'article') {
    document.querySelector('#enterTitleArticle .titleOfInput').innerHTML = 'Enter the title of your article';
  } else if (typeArticle == 'release') {
    document.querySelector('#enterTitleArticle .titleOfInput').innerHTML = 'Enter a title and a very short description';
  } else if (typeArticle == 'question') {
    document.querySelector('#enterTitleArticle .titleOfInput').innerHTML = 'Ask your question';
  }

  document.getElementById('enterTitleArticle').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('enterTitleArticle').style.transform = 'scale(1)';
    window.scroll({
      top: document.body.scrollHeight || document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 10);
}

function validTitle(el) {
  if (el.value.length < 4) {
    el.parentNode.querySelector('.titleOfInput').innerHTML = el.parentNode.querySelector('.titleOfInput').innerHTML.split('=')[0]+' = '+'length must be more than 3 characters';
    el.parentNode.setAttribute('valid', '0');
    el.parentNode.parentNode.querySelector('.buttonElement').setAttribute('active', '0');
    hideUploadImg();
    hideUrlRelease();
    hideDateRelease();
    hideEnterContent();
    hideTagsSection();
    hideCaptchaSection();
  } else if (!/^[a-zA-Z0-9.,!?\(\) ]*$/.test(el.value)) {
    el.parentNode.querySelector('.titleOfInput').innerHTML = el.parentNode.querySelector('.titleOfInput').innerHTML.split('=')[0]+' = '+'the following characters are valid: latin letters, numbers and .,!?()';
    el.parentNode.setAttribute('valid', '0');
    el.parentNode.parentNode.querySelector('.buttonElement').setAttribute('active', '0');
    hideUploadImg();
    hideUrlRelease();
    hideDateRelease();
    hideEnterContent();
    hideTagsSection();
    hideCaptchaSection();
  } else {
    el.parentNode.querySelector('.titleOfInput').innerHTML =  el.parentNode.querySelector('.titleOfInput').innerHTML.split('=')[0];
    el.parentNode.setAttribute('valid', '1');
    el.parentNode.parentNode.querySelector('.buttonElement').setAttribute('active', '1');
  }
}

function goToBelowTitle(el) {
  if (el.getAttribute('active') == '1') {
    el.style.transform = 'scale(0)';
    setTimeout(function functionName() {
      el.style.display = 'none';
    }, 200);

    if (typeArticle == 'article') {
      showEnterContent();
    } else if (typeArticle == 'release') {
      showDateRelease();
    } else if (typeArticle == 'question') {
      showEnterContent();
    }
  }
}

function showEnterContent() {
  if (typeArticle == 'article' || typeArticle == 'question') {
    var buttonsContent = document.querySelectorAll('.stringButtonsContent .buttonContent');
    for (var i = 0; i < buttonsContent.length; i++) {
      buttonsContent[i].style.display = 'flex';
    }
  } else if (typeArticle == 'release') {
    var buttonsContent = document.querySelectorAll('.stringButtonsContent .buttonContent');
    for (var i = 0; i < buttonsContent.length; i++) {
      if (buttonsContent[i].querySelector('.textButtonContent').innerHTML == '\\img' || buttonsContent[i].querySelector('.textButtonContent').innerHTML == '\\title' || buttonsContent[i].querySelector('.textButtonContent').innerHTML == '\\code') {
        buttonsContent[i].style.display = 'none';
      } else {
        buttonsContent[i].style.display = 'flex';
      }
    }
  }

  document.getElementById('enterContentSection').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('enterContentSection').style.transform = 'scale(1)';
    window.scroll({
      top: document.body.scrollHeight || document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 10);
}
function hideEnterContent() {
  document.getElementById('enterContentSection').style.transform = 'scale(0)';
  setTimeout(function() {
    document.getElementById('enterContentSection').style.display = 'none';
  }, 200);
}

function showDateRelease() {
  document.getElementById('dataReleaseSection').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('dataReleaseSection').style.transform = 'scale(1)';
    window.scroll({
      top: document.body.scrollHeight || document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 10);
}
function hideDateRelease() {
  document.getElementById('buttonNextTitle').style.display = 'flex';
  setTimeout(function functionName() {
    document.getElementById('buttonNextTitle').style.transform = 'scale(1)';
  }, 10);
  document.getElementById('dataReleaseSection').style.transform = 'scale(0)';
  setTimeout(function() {
    document.getElementById('dataReleaseSection').style.display = 'none';
  }, 200);
}

function chooseVariantRelease(el) {
  var blocks = document.querySelectorAll('.blockVariantRelease');
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].setAttribute('active', '0');
  }
  el.setAttribute('active', '1');
  if (el.getAttribute('condition') == 'release') {
    document.getElementById('buttonNextRelease').setAttribute('active', '1');
    hideInputDateRelease();
  } else if (el.getAttribute('condition') == 'announcement') {
    //document.getElementById('buttonNextRelease').setAttribute('active', '0');
    validDateRelease(document.getElementById('inputTextDateRelease'));
    showInputDateRelease();
  }
  //hideEnterContent();
}

function showInputDateRelease() {
  document.getElementById('blockInputDateRelease').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('blockInputDateRelease').style.transform = 'scale(1)';
    window.scroll({
      top: document.body.scrollHeight || document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 10);
}
function hideInputDateRelease() {
  document.getElementById('blockInputDateRelease').style.transform = 'scale(0)';
  setTimeout(function() {
    document.getElementById('blockInputDateRelease').style.display = 'none';
  }, 200);
}

function validDateRelease(el) {
  if (el.value == '') {
    el.parentNode.setAttribute('valid', '0');
    el.parentNode.querySelector('.titleOfInput').innerHTML = el.parentNode.querySelector('.titleOfInput').innerHTML.split('=')[0]+' = '+'this field cannot be empty';
    document.getElementById('buttonNextRelease').setAttribute('active', '0');
    hideUrlRelease();
    hideUploadImg();
    hideEnterContent();
    hideTagsSection();
    hideCaptchaSection();
  } else {
    el.parentNode.setAttribute('valid', '1');
    el.parentNode.querySelector('.titleOfInput').innerHTML = el.parentNode.querySelector('.titleOfInput').innerHTML.split('=')[0];
    document.getElementById('buttonNextRelease').setAttribute('active', '1');
  }
}

function goToBelowDateRelease(el) {
  if (el.getAttribute('active') == '1') {
    document.getElementById('buttonNextRelease').style.transform = 'scale(0)';
    setTimeout(function functionName() {
      document.getElementById('buttonNextRelease').style.display = 'none';
    }, 200);
    showUrlRelease();
  }
}

function showUrlRelease() {
  document.getElementById('urlReleaseSection').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('urlReleaseSection').style.transform = 'scale(1)';
    window.scroll({
      top: document.body.scrollHeight || document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 10);
}
function hideUrlRelease() {
  document.getElementById('buttonNextRelease').style.display = 'flex';
  setTimeout(function functionName() {
    document.getElementById('buttonNextRelease').style.transform = 'scale(1)';
  }, 10);
  document.getElementById('urlReleaseSection').style.transform = 'scale(0)';
  setTimeout(function() {
    document.getElementById('urlReleaseSection').style.display = 'none';
  }, 200);
}

function validUrlLink(el) {
   if (el.value == '') {
     el.parentNode.querySelector('.titleOfInput').innerHTML = el.parentNode.querySelector('.titleOfInput').innerHTML.split('=')[0];
     el.parentNode.setAttribute('valid', '-1');
     document.getElementById('buttonNextReleaseUrl').innerHTML = 'i don\'t have';
     document.getElementById('buttonNextReleaseUrl').setAttribute('active', '1');
   } else if (!/^(https:\/\/|http:\/\/).+$/.test(el.value)) {
     el.parentNode.querySelector('.titleOfInput').innerHTML = el.parentNode.querySelector('.titleOfInput').innerHTML.split('=')[0]+' = '+'link must contain the protocol https:// or http://';
     el.parentNode.setAttribute('valid', '0');
     document.getElementById('buttonNextReleaseUrl').innerHTML = 'i don\'t have';
     document.getElementById('buttonNextReleaseUrl').setAttribute('active', '0');
     hideEnterContent();
     hideUploadImg();
     hideTagsSection();
     hideCaptchaSection();
   } else {
     el.parentNode.querySelector('.titleOfInput').innerHTML = el.parentNode.querySelector('.titleOfInput').innerHTML.split('=')[0];
     el.parentNode.setAttribute('valid', '1');
     document.getElementById('buttonNextReleaseUrl').innerHTML = 'next';
     document.getElementById('buttonNextReleaseUrl').setAttribute('active', '1');
   }
}

function goToBelowUrlRelease(el) {
  if (el.getAttribute('active') == '1') {
    document.getElementById('buttonNextReleaseUrl').style.transform = 'scale(0)';
    setTimeout(function functionName() {
      document.getElementById('buttonNextReleaseUrl').style.display = 'none';
    }, 200);
    showUploadImg();
  }
}

function showUploadImg() {
  document.getElementById('uploadImgGameSection').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('uploadImgGameSection').style.transform = 'scale(1)';
    window.scroll({
      top: document.body.scrollHeight || document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 10);
}
function hideUploadImg() {
  document.getElementById('uploadImgGameSection').style.transform = 'scale(0)';
  document.getElementById('buttonNextReleaseUrl').style.display = 'flex';
  document.getElementById('buttonNextUploadImg').style.display = 'flex';
  setTimeout(function functionName() {
    document.getElementById('buttonNextUploadImg').style.transform = 'scale(1)';
    document.getElementById('buttonNextReleaseUrl').style.transform = 'scale(1)';
  }, 10);
  setTimeout(function functionName() {
    document.getElementById('uploadImgGameSection').style.display = 'none';
  }, 200);
}

document.getElementById('uploadImgGame').addEventListener('dragenter', function(e) {
  e.preventDefault();
  document.getElementById('uploadImgGame').setAttribute('uploaded', '1');
});
document.getElementById('uploadImgGame').addEventListener('dragleave', function(e) {
  e.preventDefault();
  document.getElementById('uploadImgGame').setAttribute('uploaded', '0');
});
document.getElementById('uploadImgGame').addEventListener('dragover', function(e) {
  e.preventDefault();
  document.getElementById('uploadImgGame').setAttribute('uploaded', '1');
});
document.getElementById('uploadImgGame').addEventListener('drop', function(e) {
  e.preventDefault();
  var item = e.dataTransfer.items[0].webkitGetAsEntry();
  if (item) {
    item.file(function(file) {
      setImageLabel(file);
    });
  }
});
function changeInputUploadImgGame(e) {
  setImageLabel(e.target.files[0]);
}

var uploadedImg = {size: {w: 0, h: 0}, base64: '', mebibytes: 0};
var fileImg = {name: '', value: null};
function setImageLabel(file) {
  fileImg.name = file.name;
  fileImg.value = file;

  uploadedImg.type = file.type;
  uploadedImg.mebibytes = (Math.round((file.size/(1024*1024))*100))/100;
  var _URL = window.URL || window.webkitURL;
  var img = new Image();
  var objectUrl = _URL.createObjectURL(file);

  if (uploadedImg.type != 'image/png' && uploadedImg.type != 'image/jpeg') {
    document.getElementById('subTextUploadImgGame').style.color = '#ff1818';
  } else {
    img.onload = function () {
      uploadedImg.size.w = this.width;
      uploadedImg.size.h = this.height;
      if (uploadedImg.mebibytes > 5 || uploadedImg.size.w < 250 || uploadedImg.size.h < 150) {
        document.getElementById('subTextUploadImgGame').style.color = '#ff1818';
      } else {
        _URL.revokeObjectURL(objectUrl);var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function() {
          uploadedImg.base64 = btoa(reader.result);
          updateUploadBox();
          document.getElementById('subTextUploadImgGame').style.color = '#999';
          document.getElementById('buttonNextUploadImg').setAttribute('active', '1');
        };
      }
    };
    img.src = objectUrl;
  }
}

function updateUploadBox() {
  if (uploadedImg.size.w > 0 && uploadedImg.size.h > 0 && uploadedImg.base64 != '') {
    document.getElementById('uploadImgGame').style.display = 'none';
    document.getElementById('uploadImgGameDiv').style.display = 'flex';
    document.getElementById('uploadImgGameDiv').style.backgroundImage = 'url('+'data:image/jpeg;base64,'+uploadedImg.base64+')';
    document.getElementById('clipUploadImgGameDiv').style.backgroundImage = 'url('+'data:image/jpeg;base64,'+uploadedImg.base64+')';
    document.getElementById('removeUploadImg').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('removeUploadImg').style.transform = 'scale(1)';
    }, 10);

    var dataUploadSection = document.getElementById('uploadImgGameSection').getBoundingClientRect();
    var uploadBox = document.getElementById('uploadImgGameDiv');
    var darkness = document.getElementById('darknessUploadImgGameDiv');
    var clip = document.getElementById('clipUploadImgGameDiv');
    var aspectClip = 16/9;

    if (uploadedImg.size.w <= dataUploadSection.width && uploadedImg.size.h <= 0.8*window.innerHeight) {
      uploadBox.style.width = uploadedImg.size.w+'px';
      uploadBox.style.minWidth = uploadedImg.size.w+'px';
      uploadBox.style.maxWidth = uploadedImg.size.w+'px';
      uploadBox.style.height = uploadedImg.size.h+'px';
      uploadBox.style.minHeight = uploadedImg.size.h+'px';
      uploadBox.style.maxHeight = uploadedImg.size.h+'px';
    } else if (uploadedImg.size.w <= dataUploadSection.width && uploadedImg.size.h > 0.8*window.innerHeight) {
      uploadBox.style.width = (0.8*window.innerHeight*(uploadedImg.size.w/uploadedImg.size.h))+'px';
      uploadBox.style.minWidth = (0.8*window.innerHeight*(uploadedImg.size.w/uploadedImg.size.h))+'px';
      uploadBox.style.maxWidth = (0.8*window.innerHeight*(uploadedImg.size.w/uploadedImg.size.h))+'px';
      uploadBox.style.height = 0.8*window.innerHeight+'px';
      uploadBox.style.minHeight = 0.8*window.innerHeight+'px';
      uploadBox.style.maxHeight = 0.8*window.innerHeight+'px';
    } else if (uploadedImg.size.w > dataUploadSection.width && uploadedImg.size.h <= 0.8*window.innerHeight) {
      uploadBox.style.width = dataUploadSection.width+'px';
      uploadBox.style.minWidth = dataUploadSection.width+'px';
      uploadBox.style.maxWidth = dataUploadSection.width+'px';
      uploadBox.style.height = (dataUploadSection.width/(uploadedImg.size.w/uploadedImg.size.h))+'px';
      uploadBox.style.minHeight = (dataUploadSection.width/(uploadedImg.size.w/uploadedImg.size.h))+'px';
      uploadBox.style.maxHeight = (dataUploadSection.width/(uploadedImg.size.w/uploadedImg.size.h))+'px';
    } else if (uploadedImg.size.w > dataUploadSection.width && uploadedImg.size.h > 0.8*window.innerHeight) {
      if (uploadedImg.size.w >= uploadedImg.size.h) {
        uploadBox.style.width = dataUploadSection.width+'px';
        uploadBox.style.minWidth = dataUploadSection.width+'px';
        uploadBox.style.maxWidth = dataUploadSection.width+'px';
        uploadBox.style.height = (dataUploadSection.width/(uploadedImg.size.w/uploadedImg.size.h))+'px';
        uploadBox.style.minHeight = (dataUploadSection.width/(uploadedImg.size.w/uploadedImg.size.h))+'px';
        uploadBox.style.maxHeight = (dataUploadSection.width/(uploadedImg.size.w/uploadedImg.size.h))+'px';
      } else if (uploadedImg.size.w < uploadedImg.size.h) {
        uploadBox.style.width = (0.8*window.innerHeight*(uploadedImg.size.w/uploadedImg.size.h))+'px';
        uploadBox.style.minWidth = (0.8*window.innerHeight*(uploadedImg.size.w/uploadedImg.size.h))+'px';
        uploadBox.style.maxWidth = (0.8*window.innerHeight*(uploadedImg.size.w/uploadedImg.size.h))+'px';
        uploadBox.style.height = 0.8*window.innerHeight+'px';
        uploadBox.style.minHeight = 0.8*window.innerHeight+'px';
        uploadBox.style.maxHeight = 0.8*window.innerHeight+'px';
      }
    }

    var dataUploadBox = uploadBox.getBoundingClientRect();
    darkness.style.width = dataUploadBox.width+'px';
    darkness.style.height = dataUploadBox.height+'px';
    var whclip = {w: 0, h: 0};
    if (aspectClip >= dataUploadBox.width/dataUploadBox.height) {
      if (uploadedImg.size.w > 1920) {
        whclip.w = 1920*(dataUploadBox.width/uploadedImg.size.w);
      } else if (uploadedImg.size.w <= 1920) {
        whclip.w = dataUploadBox.width;
      }
      whclip.h = whclip.w/aspectClip;
    } else if (aspectClip < dataUploadBox.width/dataUploadBox.height) {
      if (uploadedImg.size.h > 1080) {
        whclip.h = 1080*(dataUploadBox.height/uploadedImg.size.h);
      } else if (uploadedImg.size.h <= 1080) {
        whclip.h = dataUploadBox.height;
      }
      whclip.w = whclip.h*aspectClip;
    }

    clip.style.width = whclip.w+'px';
    clip.style.height = whclip.h+'px';
    clip.style.marginLeft = (dataUploadBox.width-whclip.w)/2+'px';
    clip.style.marginTop = (dataUploadBox.height-whclip.h)/2+'px';

    document.getElementById('clipUploadImgGameDiv').style.backgroundSize = dataUploadBox.width+'px';

    var marginClip = {x: parseInt(clip.style.marginLeft.slice(0, -2)), y: parseInt(clip.style.marginTop.slice(0, -2))};
    document.getElementById('clipUploadImgGameDiv').style.backgroundPosition = '-'+marginClip.x+'px -'+marginClip.y+'px';
  }
}
window.addEventListener('resize', updateUploadBox);

var deltaClipMouse = {x: 0, y: 0};
function startDragClip(e) {
  var bounding = e.target.getBoundingClientRect();
  deltaClipMouse.x = e.pageX-bounding.left;
  deltaClipMouse.y = e.pageY-bounding.top;
  window.addEventListener('mousemove', moveDragClip);
  window.addEventListener('mouseup', stopDragClip);
}
function stopDragClip() {
  window.removeEventListener('mousemove', moveDragClip);
  window.removeEventListener('mouseup', stopDragClip);
}
function moveDragClip(e) {
  var boundingUploadImgDiv = document.getElementById('uploadImgGameDiv').getBoundingClientRect();
  var clip = document.getElementById('clipUploadImgGameDiv');
  var boundingClip = clip.getBoundingClientRect();
  var coord = {
    x: e.pageX-deltaClipMouse.x-boundingUploadImgDiv.left,
    y: e.pageY-deltaClipMouse.y-boundingUploadImgDiv.top
  };
  if (coord.x+boundingClip.width < boundingUploadImgDiv.width && coord.x > 0) {
    clip.style.marginLeft = coord.x+'px';
  } else if (coord.x+boundingClip.width >= boundingUploadImgDiv.width) {
    clip.style.marginLeft = (boundingUploadImgDiv.width-boundingClip.width)+'px';
  } else if (coord.x <= 0) {
    clip.style.marginLeft = 0+'px';
  }
  if (coord.y+boundingClip.height < boundingUploadImgDiv.height && coord.y > 0) {
    clip.style.marginTop = coord.y+'px';
  } else if (coord.y+boundingClip.height >= boundingUploadImgDiv.height) {
    clip.style.marginTop = (boundingUploadImgDiv.height-boundingClip.height)+'px';
  } else if (coord.y <= 0) {
    clip.style.marginTop = 0+'px';
  }

  var marginClip = {x: parseInt(clip.style.marginLeft.slice(0, -2)), y: parseInt(clip.style.marginTop.slice(0, -2))};
  document.getElementById('clipUploadImgGameDiv').style.backgroundPosition = '-'+marginClip.x+'px -'+marginClip.y+'px';
}
function startResizeClip() {
  stopDragClip();
  window.addEventListener('mousemove', moveResizeClip);
  window.addEventListener('mouseup', stopResizeClip);
}
function stopResizeClip() {
  window.removeEventListener('mousemove', moveResizeClip);
  window.removeEventListener('mouseup', stopResizeClip);
}
function moveResizeClip(e) {
  stopDragClip();
  var dataUploadBox = document.getElementById('uploadImgGameDiv').getBoundingClientRect();
  var boundingUploadImgDiv = document.getElementById('uploadImgGameDiv').getBoundingClientRect();
  var clip = document.getElementById('clipUploadImgGameDiv');
  var boundingClip = clip.getBoundingClientRect();
  var marginClip = {x: parseInt(clip.style.marginLeft.slice(0, -2)), y: parseInt(clip.style.marginTop.slice(0, -2))};
  var aspectClip = 16/9;

  var wh = {w: e.pageX-boundingUploadImgDiv.left-marginClip.x, h: (e.pageX-boundingUploadImgDiv.left-marginClip.x)/aspectClip};

  if (wh.w < 250*(dataUploadBox.width/uploadedImg.size.w)) {
    clip.style.width = 250*(dataUploadBox.width/uploadedImg.size.w)+'px';
    clip.style.height = (250*(dataUploadBox.width/uploadedImg.size.w)/aspectClip)+'px';
  } else if (wh.w > 1920*(dataUploadBox.width/uploadedImg.size.w)) {
    clip.style.width = 1920*(dataUploadBox.width/uploadedImg.size.w)+'px';
    clip.style.height = (1920*(dataUploadBox.width/uploadedImg.size.w)/aspectClip)+'px';
  } else if (wh.w < boundingUploadImgDiv.width-marginClip.x && wh.h < boundingUploadImgDiv.height-marginClip.y) {
    clip.style.width = wh.w+'px';
    clip.style.height = wh.h+'px';
  } else if (wh.w >= boundingUploadImgDiv.width-marginClip.x || wh.h >= boundingUploadImgDiv.height-marginClip.y) {
    if (boundingUploadImgDiv.height-marginClip.y < (boundingUploadImgDiv.width-marginClip.x)/aspectClip) {
      clip.style.width = ((boundingUploadImgDiv.height-marginClip.y)*aspectClip)+'px';
      clip.style.height = (boundingUploadImgDiv.height-marginClip.y)+'px';
    } else {
      clip.style.width = (boundingUploadImgDiv.width-marginClip.x)+'px';
      clip.style.height = ((boundingUploadImgDiv.width-marginClip.x)/aspectClip)+'px';
    }
  }
}
function removeUploadedFile() {
  uploadedImg = {size: {w: 0, h: 0}, base64: '', mebibytes: 0};
  document.getElementById('uploadImgGame').style.display = 'flex';
  document.getElementById('uploadImgGameDiv').style.display = 'none';
  document.getElementById('removeUploadImg').style.transform = 'scale(0)';
  document.getElementById('buttonNextUploadImg').style.display = 'flex';
  document.getElementById('buttonNextUploadImg').setAttribute('active', '0');
  document.getElementById('inputForUploadImgGame').value = '';
  hideEnterContent();
  hideTagsSection();
  hideCaptchaSection();
  setTimeout(function() {
    document.getElementById('removeUploadImg').style.display = 'none';
  }, 200);
  setTimeout(function() {
    document.getElementById('buttonNextUploadImg').style.transform = 'scale(1)';
  }, 10);
}

function goToBelowUploadImg(el) {
  if (el.getAttribute('active') == '1') {
    el.style.transform = 'scale(0)';
    setTimeout(function() {
      el.style.display = 'none';
    }, 200);

    showEnterContent();
  }
}

function inputContent(e, el) {
  var leftBlockBounding = document.getElementById('blockEnterContent').getBoundingClientRect();
  var rightBlockBounding = document.getElementById('blockShowContent').getBoundingClientRect();
  var textareaBounding = el.getBoundingClientRect();

  var lengthContent = el.value.length;
  var minLength = 0;
  var maxLength = 0;
  if (typeArticle == 'article') {
    minLength = 100;
    maxLength = 100000;
  } else if (typeArticle == 'release') {
    minLength = 15;
    maxLength = 2000;
  } else if (typeArticle == 'question') {
    minLength = 15;
    maxLength = 100000;
  }

  document.getElementById('countWords').style.display = 'flex';
  if (lengthContent < minLength) {
    document.getElementById('countWords').innerHTML = '-'+(minLength-lengthContent)+' symbols';
    document.getElementById('countWords').setAttribute('valid', '0');
    document.getElementById('buttonNextEnterContent').setAttribute('active', '0');
    hideTagsSection();
    hideCaptchaSection();
  } else if (lengthContent >= minLength && lengthContent <= maxLength) {
    document.getElementById('countWords').innerHTML = lengthContent+'/'+maxLength+' symbols';
    document.getElementById('countWords').setAttribute('valid', '1');
    document.getElementById('buttonNextEnterContent').setAttribute('active', '1');
  } else if (lengthContent > maxLength) {
    document.getElementById('countWords').innerHTML = lengthContent+'/'+maxLength+' symbols';
    document.getElementById('countWords').setAttribute('valid', '0');
    document.getElementById('buttonNextEnterContent').setAttribute('active', '0');
    hideTagsSection();
    hideCaptchaSection();
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
  if (leftBlockBounding.height > rightBlockBounding.height) {
    setTimeout(function() {
      document.getElementById('uploadImgGameSection').style.transform = 'scale(1)';
      window.scroll({
        top: document.body.scrollHeight || document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 10);
  }

  clearTimeout(timeoutCompile);
  timeoutCompile = setTimeout(function() {
    document.getElementById('blockShowContent').innerHTML = compileMetacode(el.value);
  }, 500);
}

document.getElementById('addTag').addEventListener('keydown', keydownAddTag);
function keydownAddTag(e) {
  if (e.key === 'Enter' && e.target.value && e.target.value != '') {
    var limitLength = 0;
    if (document.querySelectorAll('.blockTag')[0]) {
      limitLength = document.querySelectorAll('.blockTag').length;
    }
    if (limitLength < 5) {
      document.getElementById('addTag').removeEventListener('keydown', keydownAddTag);
      document.getElementById('addTag').remove();

      var tag = document.createElement('div');
      tag.setAttribute('class', 'blockTag');
      var text = document.createElement('div');
      text.setAttribute('class', 'textTag');
      text.innerHTML = e.target.value;
      tag.appendChild(text);
      var cross = document.createElement('div');
      cross.setAttribute('class', 'closeTag');
      cross.setAttribute('onclick', 'deleteTag(this)');
      cross.innerHTML = "<div class='lineCloseTag1'></div><div class='lineCloseTag2'></div>";
      tag.appendChild(cross);
      document.getElementById('stringTags').appendChild(tag);

      e.target.value = '';

      document.getElementById('buttonNextTags').setAttribute('active', '1');

      if (limitLength < 4) {
        var addTag = document.createElement('input');
        addTag.setAttribute('type', 'text');
        addTag.setAttribute('id', 'addTag');
        document.getElementById('stringTags').appendChild(addTag);
        document.getElementById('addTag').addEventListener('keydown', keydownAddTag);

        document.getElementById('addTag').focus();
      }
    }
  } else if (e.key === 'Backspace' && e.target.value == '') {
    var limitLength = 0;
    if (document.querySelectorAll('.blockTag')[0]) {
      limitLength = document.querySelectorAll('.blockTag').length;
    }
    if (limitLength > 0) {
      document.getElementById('addTag').removeEventListener('keydown', keydownAddTag);
      document.getElementById('addTag').remove();
      deleteTag(document.querySelector('#stringTags .blockTag:last-child .closeTag'));
    }
  }
}

function deleteTag(el) {
  el.parentNode.remove();

  var limitLength = 0;
  if (document.querySelectorAll('.blockTag')[0]) {
    limitLength = document.querySelectorAll('.blockTag').length;
  }
  if (limitLength == 0) {
    document.getElementById('buttonNextTags').setAttribute('active', '0');
    hideCaptchaSection();
  }

  if (!document.getElementById('addTag')) {
    var addTag = document.createElement('input');
    addTag.setAttribute('type', 'text');
    addTag.setAttribute('id', 'addTag');
    document.getElementById('stringTags').appendChild(addTag);
    document.getElementById('addTag').addEventListener('keydown', keydownAddTag);
  }
  document.getElementById('addTag').focus();
}

function showTagsSection() {
  document.getElementById('buttonNextTags').style.display = 'flex';
  document.getElementById('tagsSection').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('buttonNextTags').style.transform = 'scale(1)';
    document.getElementById('tagsSection').style.transform = 'scale(1)';
    window.scroll({
      top: document.body.scrollHeight || document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 10);
}
function hideTagsSection() {
  document.getElementById('buttonNextTags').style.display = 'flex';
  document.getElementById('buttonNextEnterContent').style.display = 'flex';
  document.getElementById('tagsSection').style.transform = 'scale(0)';
  setTimeout(function() {
    document.getElementById('tagsSection').style.display = 'none';
  }, 200);
  setTimeout(function() {
    document.getElementById('buttonNextEnterContent').style.transform = 'scale(1)';
    document.getElementById('buttonNextTags').style.transform = 'scale(1)';
  }, 10);
}

function goToBelowEnterContent(el) {
  if (el.getAttribute('active') == '1') {
    el.style.transform = 'scale(0)';
    setTimeout(function() {
      el.style.display = 'none';
    }, 200);

    showTagsSection();
  }
}

function goToBelowTags(el) {
  if (el.getAttribute('active') == '1') {
    el.style.transform = 'scale(0)';
    setTimeout(function() {
      el.style.display = 'none';
    }, 200);

    showCaptchaSection();
  }
}

function showCaptchaSection() {
  document.getElementById('recaptchaSection').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('recaptchaSection').style.transform = 'scale(1)';
    window.scroll({
      top: document.body.scrollHeight || document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 10);
}
function hideCaptchaSection() {
  document.getElementById('buttonNextTags').style.display = 'flex';
  document.getElementById('recaptchaSection').style.transform = 'scale(0)';
  setTimeout(function() {
    document.getElementById('recaptchaSection').style.display = 'none';
  }, 200);
  setTimeout(function() {
    document.getElementById('buttonNextTags').style.transform = 'scale(1)';
  }, 10);
}

document.getElementById('uploadFileComment').addEventListener('dragenter', function(e) {
  e.preventDefault();
  document.getElementById('uploadFileComment').setAttribute('uploaded', '1');
});
document.getElementById('uploadFileComment').addEventListener('dragleave', function(e) {
  e.preventDefault();
  document.getElementById('uploadFileComment').setAttribute('uploaded', '0');
});
document.getElementById('uploadFileComment').addEventListener('dragover', function(e) {
  e.preventDefault();
  document.getElementById('uploadFileComment').setAttribute('uploaded', '1');
});
document.getElementById('uploadFileComment').addEventListener('drop', function(e) {
  e.preventDefault();
  var item = e.dataTransfer.items[0].webkitGetAsEntry();
  if (item) {
    item.file(function(file) {
      uploadFileComment(file);
    });
  }
});
function changeInputUploadFileComment(e) {
  uploadFileComment(e.target.files[0]);
}

function uploadFileComment(file) {
  var mebibytes = (Math.round((file.size/(1024*1024))*100))/100;
  if (mebibytes <= 3) {
    socket.emit('uploadFilesCommunity1', file.name, file);
  } else {
    document.getElementById('subTextUploadFileComment').style.color = '#ff1818';
  }
}

socket.on('uploadFilesCommunity2', function(answer, name) {
  if (answer == 'ok') {
    var divUploadedComment = document.createElement('div');
    divUploadedComment.setAttribute('class', 'divUploadedComment');
    var linkDivUploadedComment = document.createElement('div');
    linkDivUploadedComment.setAttribute('class', 'linkDivUploadedComment');
    linkDivUploadedComment.innerHTML = '/resource/community/'+name;
    divUploadedComment.appendChild(linkDivUploadedComment);
    var deleteDivUploadedComment = document.createElement('div');
    deleteDivUploadedComment.setAttribute('class', 'deleteDivUploadedComment');
    deleteDivUploadedComment.setAttribute('onclick', 'deleteFileComment(this, "'+name+'")');
    deleteDivUploadedComment.innerHTML = 'delete';
    divUploadedComment.appendChild(deleteDivUploadedComment);
    document.getElementById('stringUploadsFiles').appendChild(divUploadedComment);

    var lengthFiles = 0;
    if (document.querySelectorAll('#stringUploadsFiles .divUploadedComment')[0]) {
      lengthFiles = document.querySelectorAll('#stringUploadsFiles .divUploadedComment').length;
    }
    console.log(lengthFiles);
    if (lengthFiles >= 5) {
      document.getElementById('addUploadFiles').style.display = 'none';
    }
  }
});
function deleteFileComment(el, name) {
  el.parentNode.remove();

  if (document.getElementById('addUploadFiles').style.display == 'none') {
    document.getElementById('addUploadFiles').style.display = 'flex';
  }

  socket.emit('deleteFilesCommunity1', name);
}

function sendNewTopic(el) {
  el.setAttribute('active', '0');
  el.style.transform = 'scale(0)';
  setTimeout(function() {
    el.style.display = 'none';
  }, 200);

  publish();
}

function publish() {
  var dataPost = {};

  var recaptcha = grecaptcha.getResponse(widgetRecaptcha1);

  dataPost.type = typeArticle;
  dataPost.title = document.getElementById('inputTitleArticle').value;
  dataPost.content = document.getElementById('textareaContent').value;

  var tagsDom = document.querySelectorAll('#stringTags .blockTag');
  var tags = [];
  for (var i = 0; i < tagsDom.length; i++) {
    tags[i] = tagsDom[i].querySelector('.textTag').innerHTML;
  }
  dataPost.tags = tags;

  dataPost.author = 0;
  if (dataUser != null && dataUser.id) {
    dataPost.author = dataUser.id;
  }

  if (typeArticle == 'release') {
    dataPost.condition = document.querySelector('.blockVariantRelease[active="1"]').getAttribute('condition');
    if (dataPost.condition == 'announcement') {
      dataPost.dateRelease = document.getElementById('inputTextDateRelease').value;
    }
    dataPost.urlGame = document.getElementById('inputLinkUrlGame').value;

    var dataUploadBox = document.getElementById('uploadImgGameDiv').getBoundingClientRect();
    var clip = {
      coord: {
        x: parseInt(document.getElementById('clipUploadImgGameDiv').style.marginLeft.slice(0, -2)),
        y: parseInt(document.getElementById('clipUploadImgGameDiv').style.marginTop.slice(0, -2))
      },
      size: {
        w: parseInt(document.getElementById('clipUploadImgGameDiv').style.width.slice(0, -2)),
        h: parseInt(document.getElementById('clipUploadImgGameDiv').style.height.slice(0, -2))
      }
    }
    clip.coord.x = (clip.coord.x/dataUploadBox.width)*uploadedImg.size.w;
    clip.coord.y = (clip.coord.y/dataUploadBox.height)*uploadedImg.size.h;
    clip.size.w = (clip.size.w/dataUploadBox.width)*uploadedImg.size.w;
    clip.size.h = (clip.size.h/dataUploadBox.height)*uploadedImg.size.h;
    // var clipimage = document.createElement('img');
    // clipimage.setAttribute('id', 'clipimage');
    // clipimage.setAttribute('src', 'data:image/png;base64,'+uploadedImg.base64);
    var clipcanvas = document.createElement('canvas');
    clipcanvas.setAttribute('width', clip.size.w+'px');
    clipcanvas.setAttribute('height', clip.size.h+'px');
    var ctxClipcanvas = clipcanvas.getContext("2d");
    var clipimage = new Image();
    clipimage.src = 'data:image/png;base64,'+uploadedImg.base64;
    clipimage.onload = function () {
      ctxClipcanvas.drawImage(clipimage, clip.coord.x, clip.coord.y, clip.size.w, clip.size.h,
      0, 0, clip.size.w, clip.size.h);

      var outputimg = document.createElement('img');
      outputimg.setAttribute('src', clipcanvas.toDataURL());
      //document.body.appendChild(outputimg);

      fetch(outputimg.src)
        .then(res => res.blob())
        .then(blob => {
          const getfile = new File([blob], 'image.png', blob);
          dataPost.fileImg = {name: 'image.png', value: getfile};
          socket.emit('publishNewTopic1', dataPost, recaptcha);
        })
    }
  } else {
    socket.emit('publishNewTopic1', dataPost, recaptcha);
  }

}

socket.on('redirect', function(link) {
  window.location.href = link;
});

socket.on('publishNewTopic2', function(mess) {
  if (mess == 'errorRecaptcha') {
    setTimeout(function() {
      grecaptcha.reset(widgetRecaptcha1);
      document.getElementById('buttonPublish').style.display = 'flex';
      document.getElementById('buttonPublish').setAttribute('active', '1');
      document.getElementById('buttonPublish').innerHTML = 'accept captcha';
      setTimeout(function() {
        document.getElementById('buttonPublish').style.transform = 'scale(1)';
      }, 10);
    }, 300);
  }
});
