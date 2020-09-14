socket.on('getTags2', function(tags) {
  var blockFilterTags = document.createElement("div");
  blockFilterTags.setAttribute("id", "blockFilterTags");
  document.getElementById("filterGames").appendChild(blockFilterTags);

  var titleTagsBlock = document.createElement("div");
  titleTagsBlock.setAttribute("id", "titleTagsBlock");
  titleTagsBlock.innerHTML = "Tags";
  blockFilterTags.appendChild(titleTagsBlock);

  var listTagsBlock = document.createElement("div");
  listTagsBlock.setAttribute("id", "listTagsBlock");
  blockFilterTags.appendChild(listTagsBlock);

  for (var i = 0; i < parseInt(tags.length/10)+1; i++) {
    var columnTag = document.createElement("div");
    columnTag.setAttribute("class", "columnTag");
    columnTag.setAttribute("id", "idcolumnTag"+i);
    listTagsBlock.appendChild(columnTag);
  }

  var stringTag = document.createElement("div");
  stringTag.setAttribute("class", "stringTag");
  stringTag.setAttribute("idtag", "all");
  stringTag.setAttribute("onclick", "updateFilter(this)");
  stringTag.setAttribute("active", "1");
  stringTag.innerHTML = "all";
  document.getElementById("idcolumnTag0").appendChild(stringTag);

  for (var i = 0; i < tags.length; i++) {
    var stringTag = document.createElement("div");
    stringTag.setAttribute("class", "stringTag");
    stringTag.setAttribute("idtag", tags[i].id);
    stringTag.setAttribute("onclick", "updateFilter(this)");
    stringTag.innerHTML = tags[i].name;
    document.getElementById("idcolumnTag"+parseInt(i/10)).appendChild(stringTag);
  }

  fillStaticFilter();
});

function fillStaticFilter() {
  var blockFilterSort = document.createElement("div");
  blockFilterSort.setAttribute("id", "blockFilterSort");
  document.getElementById("filterGames").appendChild(blockFilterSort);

  var titleSortBlock = document.createElement("div");
  titleSortBlock.setAttribute("id", "titleSortBlock");
  titleSortBlock.innerHTML = "First";
  blockFilterSort.appendChild(titleSortBlock);

  var listSortBlock = document.createElement("div");
  listSortBlock.setAttribute("id", "listSortBlock");
  blockFilterSort.appendChild(listSortBlock);

  var stringSort = document.createElement("div");
  stringSort.setAttribute("class", "stringSort");
  stringSort.setAttribute("idsort", "new");
  stringSort.setAttribute("onclick", "updateFilter(this)");
  stringSort.setAttribute("active", "1");
  stringSort.innerHTML = "new";
  listSortBlock.appendChild(stringSort);

  var stringSort = document.createElement("div");
  stringSort.setAttribute("class", "stringSort");
  stringSort.setAttribute("idsort", "old");
  stringSort.setAttribute("onclick", "updateFilter(this)");
  stringSort.innerHTML = "old";
  listSortBlock.appendChild(stringSort);

  document.getElementById("filterGames").style.transform = "scale(1)";
}
var dataFilter = {tag: "all", sort: "new"};
var timeoutSendFilterGame = setTimeout(function() {}, 10);
function updateFilter(el) {
  if (el.getAttribute("class") == "stringTag") {
    if (el.getAttribute("idtag") == "all") {
      dataFilter.tag = "all";

      var stringsFilter = document.querySelectorAll("#listTagsBlock .stringTag");
      for (var i = 0; i < stringsFilter.length; i++) {
        stringsFilter[i].setAttribute("active", "0");
      }
      document.querySelector(".stringTag[idtag='all']").setAttribute("active", "1");
    } else {
      document.querySelector(".stringTag[idtag='all']").setAttribute("active", "0");
      if (el.getAttribute("active") != "1") {
        el.setAttribute("active", "1");
      } else if (el.getAttribute("active") == "1") {
        el.setAttribute("active", "0");
      }

      dataFilter.tag = [];
      var stringsFilter = document.querySelectorAll("#listTagsBlock .stringTag");
      for (var i = 0; i < stringsFilter.length; i++) {
        if (stringsFilter[i].getAttribute("active") == "1") {
          dataFilter.tag.push(stringsFilter[i].getAttribute("idtag"));
        }
      }

      if (!dataFilter.tag[0]) {
        dataFilter.tag = "all";
        document.querySelector(".stringTag[idtag='all']").setAttribute("active", "1");
      }

    }
  } else if (el.getAttribute("class") == "stringSort") {
    var stringsFilter = document.querySelectorAll("#listSortBlock .stringSort");
    for (var i = 0; i < stringsFilter.length; i++) {
      stringsFilter[i].setAttribute("active", "0");
    }
    el.setAttribute("active", "1");

    dataFilter.sort = document.querySelector(".stringSort[active='1']").getAttribute("idsort");
  }

  document.getElementById("listOfGames").style.transform = "scale(0)";
  document.getElementById("nextGames").style.transform = "scale(0)";
  clearTimeout(timeoutSendFilterGame);
  timeoutSendFilterGame = setTimeout(function functionName() {
    document.getElementById("listOfGames").innerHTML = "";
    socket.emit('getGamesFilter1', dataFilter);
  }, 2000);
}

socket.on('getGamesFilter2', function(games) {
  for (var i = 0; i < games.length; i++) {
    var gameBlock = document.createElement("div");
    gameBlock.setAttribute("class", "gameBlock");
    gameBlock.setAttribute("idgame", games[i].id);
    document.getElementById("listOfGames").appendChild(gameBlock);

    var imgGame = document.createElement("div");
    imgGame.setAttribute("class", "imgGame");
    imgGame.style.backgroundImage = "url('/g/"+games[i].name+"/gmer/preview.png')";
    gameBlock.appendChild(imgGame);

    var nameGame = document.createElement("div");
    nameGame.setAttribute("class", "nameGame");
    nameGame.innerHTML = games[i].name;
    gameBlock.appendChild(nameGame);

    var authorGame = document.createElement("div");
    authorGame.setAttribute("class", "authorGame");
    authorGame.innerHTML = games[i].authors;
    gameBlock.appendChild(authorGame);

    var buttonPlay = document.createElement("a");
    buttonPlay.setAttribute("class", "buttonPlay");
    buttonPlay.setAttribute("href", "/g/"+games[i].name);
    buttonPlay.innerHTML = "play";
    gameBlock.appendChild(buttonPlay);
  }
  console.log(games.length);
  document.getElementById("listOfGames").style.transform = "scale(1)";
  if (games.length >= 20) {
    document.getElementById("nextGames").style.transform = "scale(1)";
  } else {
    document.getElementById("nextGames").style.transform = "scale(0)";
  }
});

// var globalCountGames = 0;
// function readAllGames(games) {
//   if (games[globalCountGames]) {
//     var gameBlock = document.createElement("div");
//     gameBlock.setAttribute("class", "gameBlock");
//     gameBlock.setAttribute("idgame", globalCountGames);
//     document.getElementById("listOfGames").appendChild(gameBlock);
//
//     var iframeGame = document.createElement("iframe");
//     iframeGame.setAttribute("src", "https://gmer.io/g/"+games[globalCountGames].name);
//     iframeGame.setAttribute("width", "1920px");
//     iframeGame.setAttribute("height", "1080px");
//     document.body.appendChild(iframeGame);
//
//     //var canvas = document.createElement("canvas");
//     iframeGame.onload = () => {
//       html2canvas(iframeGame.contentDocument.documentElement).then((canvas) => {
//         var image = new Image();
//         image.src = canvas.toDataURL();
//         gameBlock.appendChild(image);
//         iframeGame.remove();
//         console.log("ok");
//
//         globalCountGames++;
//         readAllGames(games);
//       });
//     };
//
//
//   }
// }

function loadMoreGames() {
  var domGames = document.getElementById("listOfGames").querySelectorAll(".gameBlock");
  console.log(parseInt(domGames.length/20));
  socket.emit('getGamesFilter1', dataFilter, parseInt(domGames.length/20));
}
