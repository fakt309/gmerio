// window.addEventListener('load', function() {
//
// });

var startAnimationFormSign = function() {
  document.getElementById('formSign').style.transform = 'scale(1)';
  setTimeout(function() {
    document.getElementById('labelSign').style.opacity = '1';
  }, 400);
  setTimeout(function() {
    document.getElementById('blockInput').style.opacity = '1';
  }, 500);
  setTimeout(function() {
    document.getElementById('recaptcha1').style.opacity = '1';
  }, 600);
  setTimeout(function() {
    document.getElementById('buttonSign').style.transform = 'translateY(0px)';
    document.getElementById('buttonSign').style.opacity = '1';
  }, 700);
};

var validMail = function(e) {
  var valid = true;
  if (e.value.length == 0 || !/^.+@.+\..+$/.test(e.value)) {
    valid = false;
  }

  if (valid) {
    document.getElementById('titleInput').innerHTML = 'email = valid';
    document.getElementById('titleInput').style.color = '#1aca00';
    document.getElementById('inputInput').style.border = '1px solid #1aca00';
    document.getElementById('buttonSign').setAttribute('disabled', '0');
  } else if (!valid) {
    document.getElementById('titleInput').innerHTML = 'email = invalid';
    document.getElementById('titleInput').style.color = '#f77171';
    document.getElementById('inputInput').style.border = '1px solid #f77171';
    document.getElementById('buttonSign').setAttribute('disabled', '1');
  }
};

window.addEventListener('keydown', function(e) {
  if (e.code == 'Enter') {
    if (stageForm == 1) {
      nextstep1(document.getElementById('buttonSign'));
    } else if (stageForm == 2) {
      nextstep2(document.getElementById('buttonAnswer'));
    }
  }
});
var nextstep1 = function(e) {
  var recaptcha = grecaptcha.getResponse(widgetRecaptcha1);

  if (e.getAttribute('disabled') == '0') {
    var mail = document.getElementById('inputInput').value;
    document.getElementById('formSign').style.transform = 'scale(0)';
    document.getElementById('wrapLinkHome').style.opacity = '0';
    setTimeout(function() {
      document.getElementById('formSign').style.display = 'none';
      document.getElementById('loader').style.display = 'block';
      setTimeout(function() {
        document.getElementById('loader').style.transform = 'scale(1)';
        socket.emit('mailSign', mail, recaptcha);
        stageForm = 0;
      }, 200);
    }, 200);
  }
};

var goBackSendForm = function(label) {
  document.getElementById('loader').style.transform = 'scale(40)';
  setTimeout(function() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('labelSign').innerHTML = label;
    document.getElementById('labelSign').style.color = '#f77171';
    document.getElementById('formSign').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('formSign').style.transform = 'scale(1)';
      document.getElementById('wrapLinkHome').style.opacity = '1';
    }, 1);
  }, 200);
};

var goForwardAnswerForm1 = function(type) {
  var mail = document.getElementById('inputInput').value;
  document.getElementById('loader').style.transform = 'scale(0)';
  if (type =='signin') {
    document.getElementById('labelAnswer').innerHTML = 'the account <b>'+mail+'</b> was found';
    document.getElementById('buttonAnswer').innerHTML = 'send mail to sign in';
    document.getElementById('buttonAnswer').setAttribute('condition', 'signin');
    document.getElementById('buttonAnswer').setAttribute('disabled', '0');
    document.getElementById('agreementStroke').style.display = 'none';
  } else if (type =='signup') {
    document.getElementById('labelAnswer').innerHTML = 'the account <b>'+mail+'</b> wasn\'t found';
    document.getElementById('buttonAnswer').innerHTML = 'send mail to sign up';
    document.getElementById('buttonAnswer').setAttribute('condition', 'signup');
    document.getElementById('buttonAnswer').setAttribute('disabled', '1');
    document.getElementById('agreementStroke').style.display = 'flex';
  }
  setTimeout(function() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('formAnswer1').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('formAnswer1').style.transform = 'scale(1)';
      document.getElementById('wrapLinkHome').style.opacity = '1';
      setTimeout(function() {
        document.getElementById('labelAnswer').style.opacity = '1';
      }, 200);
      setTimeout(function() {
        document.getElementById('agreementStroke').style.opacity = '1';
      }, 300);
      setTimeout(function() {
        document.getElementById('buttonAnswer').style.transform = 'translateY(0px)';
        document.getElementById('buttonAnswer').style.opacity = '1';
      }, 400);
    }, 10);
  }, 200);
};

var switchAgreement = function(e) {
  if (e.checked) {
    document.getElementById('buttonAnswer').setAttribute('disabled', '0');
  } else if (!e.checked) {
    document.getElementById('buttonAnswer').setAttribute('disabled', '1');
  }
};

var nextstep2 = function(e) {
  if (stageForm == 2 && e.getAttribute('disabled') != '1') {
    var mail = document.getElementById('inputInput').value;
    socket.emit('mailSign3', mail, e.getAttribute('condition'), getDeviceData());
    stageForm = 0;
    document.getElementById('formAnswer1').style.transform = 'scale(0)';
    document.getElementById('wrapLinkHome').style.opacity = '0';
    setTimeout(function() {
      document.getElementById('formAnswer1').style.display = 'none';
      document.getElementById('loader2').style.display = 'block';
      setTimeout(function() {
        document.getElementById('loader2').style.transform = 'scale(1)';
      }, 10);
    }, 200);
  }
};

var goBackAnswerForm1 = function(label) {
  document.getElementById('loader2').style.transform = 'scale(40)';
  setTimeout(function() {
    document.getElementById('loader2').style.display = 'none';
    document.getElementById('labelAnswer').innerHTML = label;
    document.getElementById('labelAnswer').style.color = '#f77171';
    document.getElementById('buttonAnswer').innerHTML = 'Try again';
    document.getElementById('formAnswer1').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('formAnswer1').style.transform = 'scale(1)';
      document.getElementById('wrapLinkHome').style.opacity = '1';
    }, 1);
  }, 200);
};

var goForwardAnswerForm2 = function(label) {
  document.getElementById('loader2').style.transform = 'scale(0)';
  document.getElementById('labelAnswer2').innerHTML = label;
  setTimeout(function() {
    document.getElementById('loader2').style.display = 'none';
    document.getElementById('formAnswer2').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('formAnswer2').style.transform = 'scale(1)';
      document.getElementById('wrapLinkHome').style.opacity = '1';
      setTimeout(function() {
        document.getElementById('labelAnswer2').style.opacity = '1';
      }, 200);
    }, 10);
  }, 200);
};

var getDeviceData = function() {
    var unknown = 'n/a';

    // browser
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // Opera
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Opera Next
    if ((verOffset = nAgt.indexOf('OPR')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 4);
    }
    // Edge
    else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
        browser = 'Microsoft Edge';
        version = nAgt.substring(verOffset + 5);
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
        browser = 'Chrome';
        version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
        browser = 'Safari';
        version = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
        browser = 'Firefox';
        version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    // Other browsers
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browser = nAgt.substring(nameOffset, verOffset);
        version = nAgt.substring(verOffset + 1);
        if (browser.toLowerCase() == browser.toUpperCase()) {
            browser = navigator.appName;
        }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
        version = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    // mobile version
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

    // system
    var os = unknown;
    var clientStrings = [
        {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
        {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
        {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
        {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
        {s:'Windows Vista', r:/Windows NT 6.0/},
        {s:'Windows Server 2003', r:/Windows NT 5.2/},
        {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
        {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
        {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
        {s:'Windows 98', r:/(Windows 98|Win98)/},
        {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
        {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s:'Windows CE', r:/Windows CE/},
        {s:'Windows 3.11', r:/Win16/},
        {s:'Android', r:/Android/},
        {s:'Open BSD', r:/OpenBSD/},
        {s:'Sun OS', r:/SunOS/},
        {s:'Chrome OS', r:/CrOS/},
        {s:'Linux', r:/(Linux|X11(?!.*CrOS))/},
        {s:'iOS', r:/(iPhone|iPad|iPod)/},
        {s:'Mac OS X', r:/Mac OS X/},
        {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s:'QNX', r:/QNX/},
        {s:'UNIX', r:/UNIX/},
        {s:'BeOS', r:/BeOS/},
        {s:'OS/2', r:/OS\/2/},
        {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
    ];
    for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
        }
    }

    var osVersion = unknown;
    if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
    }
    switch (os) {
      case 'Mac OS X':
          osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
          break;
      case 'Android':
          osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
          break;
      case 'iOS':
          osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
          osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
          break;
    }

    var jscd = {
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion
    };
    return jscd;
};
