window.addEventListener('load', function() {
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
});

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
    nextstep1(document.getElementById('buttonSign'));
  }
});
var nextstep1 = function(e) {
  var recaptcha = grecaptcha.getResponse(widgetRecaptcha1);

  if (e.getAttribute('disabled') == '0') {
    var mail = document.getElementById('inputInput').value;
    document.getElementById('formSign').style.transform = 'scale(0)';
    setTimeout(function() {
      document.getElementById('formSign').style.display = 'none';
      document.getElementById('loader').style.display = 'block';
      setTimeout(function() {
        document.getElementById('loader').style.transform = 'scale(1)';
        console.log(widgetRecaptcha1);
        console.log(recaptcha);
        socket.emit('mailSign', mail, recaptcha);
      }, 200);
    }, 200);
  }
};
