function setMenu(user, studio) {
  var leftMainMenu = document.createElement("div");
  leftMainMenu.setAttribute("id", "leftMainMenu");
  document.getElementById("mainMenu").appendChild(leftMainMenu);

  var mainLogo = document.createElement("div");
  mainLogo.setAttribute("id", "mainLogo");
  mainLogo.setAttribute("onclick", "window.location.href='/';");
  mainLogo.innerHTML = "<div id='imgMainLogo'></div> <div id='textMainLogo'>gmer</div>"
  leftMainMenu.appendChild(mainLogo);

  var rightMainMenu = document.createElement("div");
  rightMainMenu.setAttribute("id", "rightMainMenu");
  document.getElementById("mainMenu").appendChild(rightMainMenu);

  if (window.location.pathname.split("/")[1] != "c") {
    var communityLink = document.createElement("a");
    communityLink.setAttribute("id", "communityLink");
    communityLink.setAttribute("href", "/c");
    communityLink.innerHTML = "community";
    rightMainMenu.appendChild(communityLink);
  }

  var studioString = document.createElement("div");
  studioString.setAttribute("id", "studioString");
  if (studioData == null) {
    studioString.innerHTML = "<a id='buttonBecomedeveloper' href='/s'>become developer</a>"
  } else {
    studioString.innerHTML = "<a id='buttonStudio' href='/s/"+studioData.name+"'>"+studioData.name+" (id: "+studioData.id+")</a>"
  }
  rightMainMenu.appendChild(studioString);

  var profileString = document.createElement("div");
  profileString.setAttribute("id", "profileString");
  if (userData == null || !userData) {
    profileString.innerHTML = "<a id='buttonSignupin' href='/u'>Sign in/up</a>"
  } else {
    profileString.innerHTML = "<a id='buttonProfile' href='/u/"+userData.id+"'>"+userData.name+" (id: "+userData.id+")</a>"
  }
  rightMainMenu.appendChild(profileString);

  document.getElementById("mainMenu").style.transform = "scale(1)";
}
