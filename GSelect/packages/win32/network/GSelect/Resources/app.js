var appWindow = Ti.UI.getCurrentWindow();


//Initialization variables
var gameList;
var steamName = "ImmaHacker";

var selectedGameOverlay = "<div id='selectedGame'>"+
							"<img src='./OverlayCornerTL.png' class='corner corner-top-left'>"+
							"<img src='./OverlayCornerTR.png' class='corner corner-top-right'>"+
							"<img src='./OverlayCornerBL.png' class='corner corner-bottom-left'>"+
							"<img src='./OverlayCornerBR.png' class='corner corner-bottom-right'>"+
						   "</div>";
						   


$( document ).ready(function() {
	genereateGameList();
	$("body").append(gameList);
	appWindow.setY(100);
	$("#blocksParent").mCustomScrollbar({
		theme: "light-3",
		autoHideScrollbar: true,
		scrollInertia: 500,
	});


	//$('html').height(window.screen.height);
	//$('body').height(window.screen.height);
	//$('#blocksParent').height(window.screen.height);

	//Section to animate blockOverlay's transparency
	$( ".blockCont" )
  .mouseover(function() {
  	$(this).find(".block").append(selectedGameOverlay);
  	$( this ).find(".block").find(".blockImgOverlay").animate({
    opacity: 0.01
	}, 100, function() {

	});
  })
  .mouseout(function() {
    $(this).find(".block").find("#selectedGame").remove();
    $( this ).find(".block").find(".blockImgOverlay").animate({
    opacity: 0.20
	}, 100, function() {

	});
  });
  $(".blockCont").click(function(){
  	alert("clicked on block");
  });
  //alert("first:"+window.screen.height + " second:"+appWindow.getHeight());
  
  
  /*
  var file = Ti.Filesystem.getFileStream(Ti.Filesystem.getApplicationDataDirectory()/*Ti.App.getHome(),'custom.txt');
   file.open(Ti.Filesystem.MODE_WRITE);
   file.write('New Data for File');
   file.close();
   console.log("-----------------------Wrote data------------------------------------");
  console.log(Ti.Filesystem.getApplicationDataDirectory());
  
  */
  //Code to download a file
  var httpClient = Ti.Network.createHTTPClient();
  httpClient.open("GET", "http://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg");
  httpClient.receive(function(data) {
	//console.log(data);
	var file = Ti.Filesystem.getFileStream(Ti.App.getHome()/*Ti.Filesystem.getApplicationDataDirectory()*/,"440.jpg");
	file.open(Ti.Filesystem.MODE_APPEND);
	file.write(data);
	file.close();
  });
});



//Get gamenames, gameId, link to run the game from steam api
// using this link http://steamcommunity.com/id/<steamName>/games?tab=all&xml=1
function genereateGameList(){
	console.log("*****************************************************************************************");
	var steamAPILink = "https://query.yahooapis.com/v1/public/yql?q=select+%2A+from+xml+where+url%3D%22http%3A%2F%2Fsteamcommunity.com%2Fid%2F"+steamName+"%2Fgames%3Ftab%3Dall%26xml%3D1%22&format=json&diagnostics=false";
	var myData;
	$.ajax({
		url: steamAPILink,
		type: "GET",
		crossDomain: true, // enable this
		async: true,
		dataType: "json",
		success: function(data){
			gameList = data.query.results.gamesList.games.game;
			//console.log(gameList);
			
			gameList.forEach(function(gameItem){
				gameItem.headerImg = "http://cdn.akamai.steamstatic.com/steam/apps/" + gameItem.appID + "/header.jpg";
				gameItem.gameRunLink = "steam://rungameid/"+gameItem.appID;
			});
			
		},
		error: function(xhr, status, error) { console.log("ERRORRRR::" +error); }
	});
	
	//gameList = xml2json.parser(xhr.responseText,'steamID64,steamID');
	 	
}


function rundisgame(){
	console.log("------------------------------------------------------------------------------------");
	//Ti.Platform.openURL("steam://run/730");
	//Ti.Platform.openApplication("steam://run/730"); // <---Works for steam urls like steam://run/730
	//Ti.Platform.openApplication("C:\\Program Files (x86)\\Steam\\Steam.exe"); // <---- Works for shortcuts like C:\\Program Files (x86)\\Steam\\Steam.exe
	
	
	alert("IWAZCALLED");
}


//Function and stuff to get gamelist xml from steamserver
simpleAJAXLib = {
        init: function (link) {
            this.fetchJSON(link);
        },
 
        fetchJSON: function (url) {
            var root = 'https://query.yahooapis.com/v1/public/yql?q=';
            var yql = 'select * from xml where url="' + url + '"';
            var proxy_url = root + encodeURIComponent(yql) + '&format=json&diagnostics=false&callback=simpleAJAXLib.display';
            document.getElementsByTagName('body')[0].appendChild(this.jsTag(proxy_url));
        },
 
        jsTag: function (url) {
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', url);
            return script;
        },
 
        display: function (results) {
            // do the necessary stuff
            document.getElementById('demo').innerHTML = "Result = " + (results.error ? "Internal Server Error!" : JSON.stringify(results.query.results));
        }
}



