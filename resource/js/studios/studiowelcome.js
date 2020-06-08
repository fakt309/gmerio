function showAnimationNouser() {
  document.getElementById('nouserBlock').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('nouserBlock').style.transform = 'scale(1)';
    setTimeout(function() {
      document.getElementById('labelNouserBlock').style.opacity = '1';
      document.getElementById('wrapLinkHome').style.opacity = '1';
    }, 200);
    setTimeout(function() {
      document.getElementById('buttonNouserBlock').style.opacity = '1';
      document.getElementById('buttonNouserBlock').style.transform = 'translateY(0px)';
    }, 400);
    setTimeout(function() {
      document.getElementById('mainTitle').style.opacity = '1';
      showBackgroundImgs();
    }, 600);
  }, 10);
}
function showAnimationNostudio() {
  document.getElementById('nostudioBlock').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('nostudioBlock').style.transform = 'scale(1)';
    setTimeout(function() {
      document.getElementById('labelNostudioBlock').style.opacity = '1';
      document.getElementById('wrapLinkHome').style.opacity = '1';
    }, 200);
    setTimeout(function() {
      document.getElementById('buttonNostudioBlock').style.opacity = '1';
      document.getElementById('buttonNostudioBlock').style.transform = 'translateY(0px)';
    }, 400);
    setTimeout(function() {
      document.getElementById('mainTitle').style.opacity = '1';
      showBackgroundImgs();
    }, 600);
  }, 10);
}
function showAnimationYesstudio() {
  document.getElementById('yesstudioBlock').style.display = 'flex';
  setTimeout(function() {
    document.getElementById('yesstudioBlock').style.transform = 'scale(1)';
    setTimeout(function() {
      document.getElementById('labelYesstudioBlock').style.opacity = '1';
      document.getElementById('wrapLinkHome').style.opacity = '1';
    }, 200);
    setTimeout(function() {
      document.getElementById('buttonYesstudioBlock').style.opacity = '1';
      document.getElementById('buttonYesstudioBlock').style.transform = 'translateY(0px)';
    }, 400);
    setTimeout(function() {
      document.getElementById('mainTitle').style.opacity = '1';
      showBackgroundImgs();
    }, 600);
  }, 10);
}
function showBackgroundImgs() {
  animateArrowDown();
  document.getElementById('backgroundImg1').style.top = '0vh';
  document.getElementById('backgroundImg2').style.top = '70vh';
  document.getElementById('backgroundImg3').style.top = '170vh';
  document.getElementById('backgroundImg4').style.top = '270vh';
  document.getElementById('backgroundImg5').style.top = '370vh';
  document.getElementById('backgroundImg6').style.top = '470vh';
  document.getElementById('backgroundImg7').style.top = '570vh';
  document.getElementById('backgroundImg8').style.top = '670vh';
}
function animateArrowDown() {
  document.getElementById('arrowDown').style.transition = 'none';
  document.getElementById('arrowDown').style.transform = 'translateY(-30px)';
  document.getElementById('arrowDown').style.opacity = '0';
  setTimeout(function() {
    document.getElementById('arrowDown').style.transition = 'all ease 1s';
    document.getElementById('arrowDown').style.transform = 'translateY(0px)';
    document.getElementById('arrowDown').style.opacity = '1';
    setTimeout(function() {
      animateArrowDown();
    }, 4000);
  }, 10);
}
function scroll100vh() {
  window.scrollTo({
    top: window.innerHeight,
    left: 0,
    behavior: 'smooth'
  });
}
function scroll0vh() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

window.addEventListener('scroll', isShowArrowUp);
function isShowArrowUp(e) {
  if (window.scrollY > 1 && (document.getElementById('arrowUp').style.display == 'none' || document.getElementById('arrowUp').style.display == '')) {
    document.getElementById('arrowUp').style.display = 'flex';
    setTimeout(function() {
      document.getElementById('arrowUp').style.opacity = '1';
    }, 10);
  } else if (window.scrollY < 1 && document.getElementById('arrowUp').style.display == 'flex') {
    document.getElementById('arrowUp').style.opacity = '0';
    setTimeout(function() {
      document.getElementById('arrowUp').style.display = 'none';
    }, 200);
  }
}

window.addEventListener('resize', setPositionFooter);
function setPositionFooter() {
  var height = document.getElementById('backgroundImg9').getBoundingClientRect();
  var height = height.height;
  document.getElementById('backgroundImg9').style.top = (document.body.offsetHeight-height)+'px';
}

// window.addEventListener('scroll', translateBenefits);
// function translateBenefits() {
//   // var benefits = document.querySelectorAll('.blockBenefits');
//   // for (var i = 0; i < benefits.length; i++) {
//   //   benefits[i].style.transform = 'translateY('+(-window.scrollY+benefits[i].offsetTop)+'px)';
//   //   if (i == benefits.length-1) {
//   //     benefits[i].style.transform = 'translateY('+(-window.scrollY+benefits[i].offsetTop-219)+'px)';
//   //   }
//   // }
//   var wrapBenefits = document.querySelectorAll('.wrapBlockBenefits');
//   for (var i = 0; i < wrapBenefits.length; i++) {
//     if (window.scrollY+window.innerHeight/8 < wrapBenefits[i].offsetTop) {
//       //wrapBenefits[i].style.transform = 'translateY(100vh)';
//       //wrapBenefits[i].style.opacity = '0.3';
//     } else if (window.scrollY+window.innerHeight/8 >= wrapBenefits[i].offsetTop) {
//       wrapBenefits[i].style.transform = 'translateY(0vh)';
//       //wrapBenefits[i].style.opacity = '1';
//     }
//   }
//   var appelDeveloper = document.getElementById('sectionAppealToDeveloper');
//   if (window.scrollY+window.innerHeight/8 >= appelDeveloper.offsetTop) {
//     appelDeveloper.style.transform = 'translateY(0vh)';
//     //wrapBenefits[i].style.opacity = '1';
//   }
// }
