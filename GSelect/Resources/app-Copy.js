
//Remove this (Only for seeing UI in chrome)// var appWindow = Ti.UI.getCurrentWindow();

//Initialization variables
var favGamesList = new Array();
var savedSettings;
var gameList;
var sortedGameList;
var gameList2;
var readFromSteamAPI = false;
var steamName = "ImmaHacker";
//Remove this (Only for seeing UI in chrome)// var gameImagesPath = Ti.App.getHome() + "\\Resources\\GameBanner\\";
//Remove this (Only for seeing UI in chrome)// var settingsPath = Ti.App.getHome() + "settings.dat";
//Remove this (Only for seeing UI in chrome)// console.log("*************************************************************Path of Home:" + Ti.App.getHome());
//For lunr
/*var gameIndex = lunr(function () {
	console.log("-----------------------1-lunr");
		this.field('title', {boost : 10});
		console.log("-----------------------2-lunr");
		this.ref('id');
		console.log("-----------------------3-lunr");
});*/
	
	
//For fuzzy
var options = {
  keys: ['title'],   // keys to search in
  id: 'id',  // return a list of identifiers only
  threshold: 0.3
}
var gameIndex;
var games = new Array();

	
console.log("-----------------------2");
var searchResult;



var selectedGameOverlay1 = "<div id='selectedGame'>" +
		"<img src='./OverlayCornerTL.png' class='corner corner-top-left'>" +
		"<img src='./OverlayCornerTR.png' class='corner corner-top-right'>" +
		"<img src='./OverlayCornerBL.png' class='corner corner-bottom-left'>" +
		"<img src='./OverlayCornerBR.png' class='corner corner-bottom-right'>" +
	"</div>";
var selectedGameOverlay = "<div id='selectedGame'>" +
		"<img src='./ImageOverlayCorners.png' class='cornersOverlay'>" +
	"</div>";
	
	
	
$(document).ready(function () {
	console.log("------------Available screen height:" + screen.availHeight + " and available screen width:" + screen.availWidth + "-------------------");
	//$('*').attachEvent ("ondrag", resetPosition);
	
	
	
	//Binding app close to saveSettings function
	/*appWindow.addEventListener(Ti.EXIT, function(event) {
        saveSettings();
    });
	*/
	
	
	//Remove this (Only for seeing UI in chrome)// getSettings();
	genereateGameList();
	gameIndex = new Fuse(games, options);
	//Remove this (Only for seeing UI in chrome)// appWindow.setY(0);
	
	
	
	//Use this to open up settingsWindow whenever users clicks on it
	//Remove this (Only for seeing UI in chrome)
	//var dialog=Ti.UI.showDialog({url:"app://settingsWindow.html", onclose:applyConfig, parameters:{"name": "faggathron" }});
	
	//$('html').height(window.screen.height);
	//$('body').height(window.screen.height);
	//$('#blocksParent').height(window.screen.height);

	//alert("first:"+window.screen.height + " second:"+appWindow.getHeight());


	//Add blockCont to the container
	var c = 0;
	gameList.forEach(function (gameItem) {
		var blockHtml = generateBlockCont(true, gameItem.appID, gameItem.gameRunLink, gameItem.name, c);
		gameList[c].gameBlockHtml = blockHtml;
		c++;
	});
	
	gameList.forEach(function (gameItem){
		
		$("#recentBlocksParent").append(gameItem.gameBlockHtml);
	});
	
	/*$("#recentResults").nanoScroller({
		sliderMinHeight : 50,
		
	});*/
	
	
	//Add sortedGames to the block
	sortedGameList = gameList.slice();
	sortByKey(sortedGameList, "name").forEach(function (gameItem) {
		$("#allBlocksParent").append(gameItem.gameBlockHtml);
	});
	
	
	rebindHandlersForTheGameBlock();	
	
	//Section to animate blockOverlay's transparency
	/*$("li").find(".gameImageOverlay").hoverIntent(function(){
	$(this).find(".favCont").animate({opacity : 1}, 25);
	},
	function(){
	$(this).find(".favCont").animate({opacity : 0}, 25);
	});*/
	//$("li").mouseover(function (){ $(this).find("div").animate({backgroundColor : 'rgba(0, 0, 0, 0.1)'}, 100); });
	//$("li").mouseout(function (){ $(this).find("div").animate({backgroundColor : 'rgba(0, 0, 0, 0.5)'}, 100); });
	
	
	//$("#blocksParent").nanoScroller();
	
	changeTabContent(2);
	
	$("#favourites-tab").click(function(){
		addGameBlocksToFavouritesTab();
		changeTabContent(1);
		/*$("#favouriteResults").nanoScroller({
			sliderMinHeight : 50,
			
		});*/
	});
	
	$("#recent-tab").click(function(){
		changeTabContent(2);
		/*$("#recentResults").nanoScroller({
			sliderMinHeight : 50,
			
		});*/
	});
	
	$("#all-tab").click(function(){
		$("#allBlocksParent").html("");
		sortedGameList.forEach(function (gameItem) {
			$("#allBlocksParent").append(gameItem.gameBlockHtml);
		});
		changeTabContent(3);
		/*$("#allResults").nanoScroller({
			sliderMinHeight : 50,
			
		});*/
	});
	
	$("#results-tab").click(function(){
		changeTabContent(4);	
	});
	

	/*

	var mouseWheelValue = {
	enable : true,
	};

	$("#blocksParent").mCustomScrollbar({
	theme : "light-3",
	autoHideScrollbar : true,
	contentTouchScroll : 25,
	scrollInertia : 500,
	mouseWheel : mouseWheelValue,
	advanced : {
	updateOnContentResize : false,
	updateOnImageLoad : false
	}
	});
	 */
	
	
	
	 
	//Code to convert the steam games lists's xml into json without using yahooapi
	/*
	var url = "http://steamcommunity.com/id/ImmaHacker/games?tab=all&xml=1";
	var httpClient = Ti.Network.createHTTPClient();
	httpClient.open("GET", url);
	httpClient.receive(function (data) {
		var jsonObj = xml.xmlToJSON("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><gamesList> <steamID64>76561198066543084</steamID64> <steamID><![CDATA[Chicken Slayer]]></steamID> <games> <game> <appID>440</appID> <name><![CDATA[Team Fortress 2]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/440/07385eb55b5ba974aebbe74d3c99626bda7920b8.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/440]]></storeLink> <hoursLast2Weeks>68.7</hoursLast2Weeks> <hoursOnRecord>873</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/TF2]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/TF2/achievements/]]></globalStatsLink> </game> <game> <appID>730</appID> <name><![CDATA[Counter-Strike: Global Offensive]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/730/d0595ff02f5c79fd19b06f4d6165c3fda2372820.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/730]]></storeLink> <hoursLast2Weeks>14.0</hoursLast2Weeks> <hoursOnRecord>626</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/CSGO]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/CSGO/achievements/]]></globalStatsLink> </game> <game> <appID>24240</appID> <name><![CDATA[PAYDAY: The Heist]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/24240/985cce1caab10e5b5f11af73c75fe0c5411ed76a.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/24240]]></storeLink> <hoursLast2Weeks>3.7</hoursLast2Weeks> <hoursOnRecord>3.8</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/PAYDAY:TheHeist]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/PAYDAY:TheHeist/achievements/]]></globalStatsLink> </game> <game> <appID>63380</appID> <name><![CDATA[Sniper Elite V2]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/63380/382d7f4a6eff4896ff4d137f0906735c99bd0300.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/63380]]></storeLink> <hoursLast2Weeks>3.2</hoursLast2Weeks> <hoursOnRecord>3.3</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/SniperEliteV2]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/SniperEliteV2/achievements/]]></globalStatsLink> </game> <game> <appID>92800</appID> <name><![CDATA[SpaceChem]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/92800/5ffbf030cd3e3af293e0509df7be6f9b2a159ca8.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/92800]]></storeLink> <hoursLast2Weeks>2.7</hoursLast2Weeks> <hoursOnRecord>2.7</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/SpaceChem]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/SpaceChem/achievements/]]></globalStatsLink> </game> <game> <appID>220090</appID> <name><![CDATA[The Journey Down: Chapter One]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/220090/4a1e3a25e7c1c0c51f0c72e3f0c7fe030b84dd5c.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/220090]]></storeLink> <hoursLast2Weeks>2.3</hoursLast2Weeks> <hoursOnRecord>2.3</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/TheJourneyDownChapterOne]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/TheJourneyDownChapterOne/achievements/]]></globalStatsLink> </game> <game> <appID>274310</appID> <name><![CDATA[Always Sometimes Monsters]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/274310/ff89d3b12d9bb81c2d1f418f837ab11eeecb31b3.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/274310]]></storeLink> <hoursLast2Weeks>1.9</hoursLast2Weeks> <hoursOnRecord>1.9</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/274310]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/274310/achievements/]]></globalStatsLink> </game> <game> <appID>224420</appID> <name><![CDATA[Afterfall InSanity Extended Edition]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/224420/099c673781fd457f9563a40d57fca42c71da174e.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/224420]]></storeLink> <hoursLast2Weeks>1.9</hoursLast2Weeks> <hoursOnRecord>1.9</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/AfterFallInsanity]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/AfterFallInsanity/achievements/]]></globalStatsLink> </game> <game> <appID>70000</appID> <name><![CDATA[Dino D-Day]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/70000/2c6bf7cf502511afe182edcc2b2d62d5a8eb4796.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/70000]]></storeLink> <hoursLast2Weeks>1.8</hoursLast2Weeks> <hoursOnRecord>1.8</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/DinoDDay]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/DinoDDay/achievements/]]></globalStatsLink> </game> <game> <appID>321260</appID> <name><![CDATA[Wickland]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/321260/74485e2cf686f7d8ef70fa5b0bd69789f321e97b.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/321260]]></storeLink> <hoursLast2Weeks>1.8</hoursLast2Weeks> <hoursOnRecord>1.8</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/321260]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/321260/achievements/]]></globalStatsLink> </game> <game> <appID>239450</appID> <name><![CDATA[Gun Monkeys]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/239450/858d5de04891402916627b2497610f3b5dcf9590.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/239450]]></storeLink> <hoursLast2Weeks>0.9</hoursLast2Weeks> <hoursOnRecord>1.1</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/GunMonkeys]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/GunMonkeys/achievements/]]></globalStatsLink> </game> <game> <appID>550</appID> <name><![CDATA[Left 4 Dead 2]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/550/205863cc21e751a576d6fff851984b3170684142.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/550]]></storeLink> <hoursLast2Weeks>0.9</hoursLast2Weeks> <hoursOnRecord>1.3</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/L4D2]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/L4D2/achievements/]]></globalStatsLink> </game> <game> <appID>4000</appID> <name><![CDATA[Garry's Mod]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/4000/dca12980667e32ab072d79f5dbe91884056a03a2.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/4000]]></storeLink> <hoursLast2Weeks>0.8</hoursLast2Weeks> <hoursOnRecord>4.7</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/GarrysMod]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/GarrysMod/achievements/]]></globalStatsLink> </game> <game> <appID>35450</appID> <name><![CDATA[Rising Storm/Red Orchestra 2 Multiplayer]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/35450/02d367780a6dcdba708bb8b94fbc42f23ba99a5b.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/35450]]></storeLink> <hoursLast2Weeks>0.8</hoursLast2Weeks> <hoursOnRecord>1.9</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/RedOrchestra2]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/RedOrchestra2/achievements/]]></globalStatsLink> </game> <game> <appID>102700</appID> <name><![CDATA[A.V.A - Alliance of Valiant Arms]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/102700/e1bc8797f8e467969b607a3853cce866af32c8fa.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/102700]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/AllianceofValiantArms]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/AllianceofValiantArms/achievements/]]></globalStatsLink> </game> <game> <appID>211440</appID> <name><![CDATA[Adventures of Shuggy]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/211440/4e60f6b884f1e90ffd963467b3dd281576a3c4d4.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/211440]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/AdventuresofShuggy]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/AdventuresofShuggy/achievements/]]></globalStatsLink> </game> <game> <appID>247830</appID> <name><![CDATA[Aerena]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/247830/9ad5927dda09bbca2e2f2fc1f05abe49099bb0b6.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/247830]]></storeLink> </game> <game> <appID>206500</appID> <name><![CDATA[AirMech]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/206500/fb333fd130be58406d06d6750fa49e58469fe8cd.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/206500]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/AirMech]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/AirMech/achievements/]]></globalStatsLink> </game> <game> <appID>207230</appID> <name><![CDATA[Archeblade]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/207230/5c7cc85970121315f97d4e689470f2772efb2966.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/207230]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/Archeblade]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/Archeblade/achievements/]]></globalStatsLink> </game> <game> <appID>33910</appID> <name><![CDATA[Arma 2]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/33910/9d4d576e4662870232eae35e50b041f93a9a6fa0.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/33910]]></storeLink> <hoursOnRecord>0.3</hoursOnRecord> </game> <game> <appID>33930</appID> <name><![CDATA[Arma 2: Operation Arrowhead]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/33930/c5eaa05810878e600d117be1c96107a20cd9b262.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/33930]]></storeLink> <hoursOnRecord>12.4</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/33930]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/33930/achievements/]]></globalStatsLink> </game> <game> <appID>219540</appID> <name><![CDATA[Arma 2: Operation Arrowhead Beta (Obsolete)]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/219540/c2ea07874fb1a776e4c5bfc659e5f296d656777d.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/219540]]></storeLink> <hoursOnRecord>0.2</hoursOnRecord> </game> <game> <appID>65790</appID> <name><![CDATA[Arma: Cold War Assault]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/65790/0646bac7ae94d0660b91f8b9b47573ef51358549.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/65790]]></storeLink> </game> <game> <appID>268420</appID> <name><![CDATA[Aura Kingdom]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/268420/bb09c5d38267fe31d6fc49ffddbb5b611d110710.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/268420]]></storeLink> </game> <game> <appID>46410</appID> <name><![CDATA[Avencast]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/46410/bc66feb72ed8c32d72b7670b4d5e26f3bd1291d1.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/46410]]></storeLink> </game> <game> <appID>209870</appID> <name><![CDATA[Blacklight: Retribution]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/209870/93fc09c32a6e22216dd7df4b23642783a1b8e2f9.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/209870]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/BlacklightRetribution]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/BlacklightRetribution/achievements/]]></globalStatsLink> </game> <game> <appID>336040</appID> <name><![CDATA[Combat Monsters]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/336040/abbb9a8661b78f1ed1de88c7d5b3e87d203f9339.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/336040]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/336040]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/336040/achievements/]]></globalStatsLink> </game> <game> <appID>273110</appID> <name><![CDATA[Counter-Strike Nexon: Zombies]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/273110/aaeb7214a039bdbf3aed649657096ce367672afc.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/273110]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/273110]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/273110/achievements/]]></globalStatsLink> </game> <game> <appID>11390</appID> <name><![CDATA[Crash Time II]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/11390/e0f0078e658a034f0486f4895226435b38318677.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/11390]]></storeLink> </game> <game> <appID>108800</appID> <name><![CDATA[Crysis 2 Maximum Edition]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/108800/bee338e11932e97e995b6e2d84d0772f7b22f2a9.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/108800]]></storeLink> </game> <game> <appID>267790</appID> <name><![CDATA[DARK BLOOD ONLINE]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/267790/2388e11e018118f936c544c8b673711699e9fefb.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/267790]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/267790]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/267790/achievements/]]></globalStatsLink> </game> <game> <appID>222900</appID> <name><![CDATA[Dead Island: Epidemic]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/222900/e5b801707f7373d69eab3f15b6fdb02f7270374a.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/222900]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/222900]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/222900/achievements/]]></globalStatsLink> </game> <game> <appID>224600</appID> <name><![CDATA[Defiance]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/224600/0b9d1e2e5f2a0a21773d1625b1e2b37bae30bc21.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/224600]]></storeLink> </game> <game> <appID>570</appID> <name><![CDATA[Dota 2]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/570/d4f836839254be08d8e9dd333ecc9a01782c26d2.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/570]]></storeLink> <hoursOnRecord>2.7</hoursOnRecord> </game> <game> <appID>263500</appID> <name><![CDATA[Dragons and Titans]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/263500/865fe58aa6bc656f70541a62a08d2eb71f60ea06.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/263500]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/263500]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/263500/achievements/]]></globalStatsLink> </game> <game> <appID>218130</appID> <name><![CDATA[Dungeonland]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/218130/80fa1305a0eb4c3512cf2423be2716a0140d9a35.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/218130]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/Dungeonland]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/Dungeonland/achievements/]]></globalStatsLink> </game> <game> <appID>298160</appID> <name><![CDATA[Eldevin]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/298160/dccc2ee4e5605fdb8931d62aba307c8dd0108571.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/298160]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/298160]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/298160/achievements/]]></globalStatsLink> </game> <game> <appID>227700</appID> <name><![CDATA[Firefall]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/227700/89c55efb73b88472ae69315dc691353955edcd98.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/227700]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/227700]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/227700/achievements/]]></globalStatsLink> </game> <game> <appID>265630</appID> <name><![CDATA[Fistful of Frags]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/265630/45ba88467785ebd77384e4b386abac1bfdad785b.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/265630]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/265630]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/265630/achievements/]]></globalStatsLink> </game> <game> <appID>339120</appID> <name><![CDATA[Fork Parker's Holiday Profit Hike]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/339120/67a7a9bd9dfa772ced79911a32c66bd79d9502ed.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/339120]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/339120]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/339120/achievements/]]></globalStatsLink> </game> <game> <appID>214420</appID> <name><![CDATA[Gear Up]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/214420/65861018dfcbf225bf5d3e68420c5787b6954c04.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/214420]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/GearUp]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/GearUp/achievements/]]></globalStatsLink> </game> <game> <appID>260410</appID> <name><![CDATA[Get Off My Lawn!]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/260410/f106d27b83a560757665848c4b4b28eba3ea7595.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/260410]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/260410]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/260410/achievements/]]></globalStatsLink> </game> <game> <appID>206210</appID> <name><![CDATA[Gotham City Impostors: Free To Play]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/206210/3590ca6e48449e7a69a9a51b31b6c74f2ac99825.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/206210]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/GothamCityImpostorsFreeToPlay]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/GothamCityImpostorsFreeToPlay/achievements/]]></globalStatsLink> </game> <game> <appID>242720</appID> <name><![CDATA[GunZ 2: The Second Duel]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/242720/bfbed482d38be7c731cace51f4d173f70a3f4dc2.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/242720]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/242720]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/242720/achievements/]]></globalStatsLink> </game> <game> <appID>246280</appID> <name><![CDATA[Happy Wars]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/246280/7a7706082a03aa96c3291187341ef7aa4ea0c941.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/246280]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/246280]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/246280/achievements/]]></globalStatsLink> </game> <game> <appID>271290</appID> <name><![CDATA[HAWKEN]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/271290/f767633be94e6072d6b476040a1decfd6bbd93fa.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/271290]]></storeLink> <hoursOnRecord>1.4</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/271290]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/271290/achievements/]]></globalStatsLink> </game> <game> <appID>222880</appID> <name><![CDATA[Insurgency]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/222880/b620a8286682299e2a1ff272b04fb09d1b4edd38.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/222880]]></storeLink> <hoursOnRecord>11.4</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/222880]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/222880/achievements/]]></globalStatsLink> </game> <game> <appID>17700</appID> <name><![CDATA[Insurgency: Modern Infantry Combat]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/17700/5eca94e145762bcd49ea63446d1856495e5b0384.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/17700]]></storeLink> <hoursOnRecord>0.1</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/Insurgency]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/Insurgency/achievements/]]></globalStatsLink> </game> <game> <appID>227180</appID> <name><![CDATA[Kingdom Wars]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/227180/96af3c5ad24df47b29f6c40a04e4fdb025094c1f.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/227180]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/DawnofFantasyKingdomWars]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/DawnofFantasyKingdomWars/achievements/]]></globalStatsLink> </game> <game> <appID>212030</appID> <name><![CDATA[Kung Fu Strike: The Warrior's Rise]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/212030/f4552c6c779a565160dab3e1541b2c669ec40eae.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/212030]]></storeLink> <hoursOnRecord>0.3</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/KungFuStrikeTheWarriorsRise]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/KungFuStrikeTheWarriorsRise/achievements/]]></globalStatsLink> </game> <game> <appID>264360</appID> <name><![CDATA[La Tale]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/264360/b8bcd7adbde87df3eceaf067a9ea3b2c36cd4f27.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/264360]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/264360]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/264360/achievements/]]></globalStatsLink> </game> <game> <appID>208090</appID> <name><![CDATA[Loadout]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/208090/bd03747de2f7380bd779b9a355790522b85615b2.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/208090]]></storeLink> <hoursOnRecord>32.3</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/208090]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/208090/achievements/]]></globalStatsLink> </game> <game> <appID>238590</appID> <name><![CDATA[Loadout Campaign Beta]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/238590/841ac8335537ed095be61929062e79ae6e67ca34.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/238590]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/238590]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/238590/achievements/]]></globalStatsLink> </game> <game> <appID>266150</appID> <name><![CDATA[Lost Saga North America]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/266150/5aee42fad2a1edad94f05918939a53e03c61a3dd.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/266150]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/266150]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/266150/achievements/]]></globalStatsLink> </game> <game> <appID>212200</appID> <name><![CDATA[Mabinogi]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/212200/7b0b7dffc578cda0327dd269249af36a6fb455f7.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/212200]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/Mabinogi]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/Mabinogi/achievements/]]></globalStatsLink> </game> <game> <appID>202090</appID> <name><![CDATA[Magicka: Wizard Wars]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/202090/757d299068d2edc1a2baed9f98c31157de3c8df9.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/202090]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/202090]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/202090/achievements/]]></globalStatsLink> </game> <game> <appID>216150</appID> <name><![CDATA[MapleStory]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/216150/bbe0f6fbbb4749121be6e50533ed05708bdeb3dd.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/216150]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/MapleStory]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/MapleStory/achievements/]]></globalStatsLink> </game> <game> <appID>234310</appID> <name><![CDATA[March of War]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/234310/7bb5dbdbd5614ccef81d68b2de8db0dbfff22111.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/234310]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/234310]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/234310/achievements/]]></globalStatsLink> </game> <game> <appID>226320</appID> <name><![CDATA[Marvel Heroes 2015]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/226320/7121a66719963c4790d6169d38b9c65ad8f238bc.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/226320]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/MarvelHeroes]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/MarvelHeroes/achievements/]]></globalStatsLink> </game> <game> <appID>43110</appID> <name><![CDATA[Metro 2033]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/43110/df9a163ac1f28dfc84c93a6fc0dc51719eaef518.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/43110]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/Metro2033]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/Metro2033/achievements/]]></globalStatsLink> </game> <game> <appID>256410</appID> <name><![CDATA[Might & Magic: Duel of Champions]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/256410/2d8d95032b85e64bc8acbcb45929c31ecee0f05d.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/256410]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/256410]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/256410/achievements/]]></globalStatsLink> </game> <game> <appID>244630</appID> <name><![CDATA[NEOTOKYO°]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/244630/d07eed25d0f5e234aaf51415f46310c3212cc58c.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/244630]]></storeLink> </game> <game> <appID>224260</appID> <name><![CDATA[No More Room in Hell]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/224260/670e9aba35dc53a6eb2bc686d302d357a4939489.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/224260]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/224260]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/224260/achievements/]]></globalStatsLink> </game> <game> <appID>200110</appID> <name><![CDATA[Nosgoth]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/200110/9894c6c94dca1b2c6f1836a3c780d8504efdd4ef.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/200110]]></storeLink> <hoursOnRecord>0.2</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/200110]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/200110/achievements/]]></globalStatsLink> </game> <game> <appID>240320</appID> <name><![CDATA[Panzar]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/240320/ddf712ef25df34fe2d85d77ea81fd232b1c20dd4.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/240320]]></storeLink> </game> <game> <appID>238960</appID> <name><![CDATA[Path of Exile]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/238960/174b8511e880b49251d598110b408596380944c4.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/238960]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/PathofExile]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/PathofExile/achievements/]]></globalStatsLink> </game> <game> <appID>238260</appID> <name><![CDATA[Pinball Arcade]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/238260/bbccee3097f4f5f7a93e07a4fcd73605a71cb070.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/238260]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/238260]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/238260/achievements/]]></globalStatsLink> </game> <game> <appID>218230</appID> <name><![CDATA[PlanetSide 2]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/218230/8bb9796bf871a1d620b28db4dfb2abef2138542d.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/218230]]></storeLink> </game> <game> <appID>235340</appID> <name><![CDATA[Prime World]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/235340/1ca1e8be9739a24744fdf22764f210ef6f7ecc5a.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/235340]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/235340]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/235340/achievements/]]></globalStatsLink> </game> <game> <appID>282440</appID> <name><![CDATA[Quake Live]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/282440/bba7e836bc54e709020ee4d95c08f4dff1d23537.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/282440]]></storeLink> <hoursOnRecord>26.3</hoursOnRecord> </game> <game> <appID>215100</appID> <name><![CDATA[Ragnarok]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/215100/09f5de55c81948ed382755ef1d2da74297f3b1dc.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/215100]]></storeLink> </game> <game> <appID>236830</appID> <name><![CDATA[Red Orchestra 2: Heroes of Stalingrad - Single Player]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/236830/ac6571422ba4768dbb8f5196d954872955f26b50.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/236830]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/236830]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/236830/achievements/]]></globalStatsLink> </game> <game> <appID>39120</appID> <name><![CDATA[RIFT™]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/39120/3937fe23570e314ca903ecccd902e2c5e8b650fc.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/39120]]></storeLink> </game> <game> <appID>91600</appID> <name><![CDATA[Sanctum]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/91600/d63198590c7bab5a332327a54f8ed0a00ac4b0d3.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/91600]]></storeLink> <hoursOnRecord>0.1</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/Sanctum]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/Sanctum/achievements/]]></globalStatsLink> </game> <game> <appID>218330</appID> <name><![CDATA[Smashmuck Champions]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/218330/b0e9cea6fdd4913367fd09c6726a91d8c579265f.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/218330]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/218330]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/218330/achievements/]]></globalStatsLink> </game> <game> <appID>239660</appID> <name><![CDATA[Soldier Front 2]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/239660/b96915bd3e70e8af5399fdc86c27a7d5dcab0d61.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/239660]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/SoldierFront2]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/SoldierFront2/achievements/]]></globalStatsLink> </game> <game> <appID>99900</appID> <name><![CDATA[Spiral Knights]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/99900/eef62584a3d0c3338f569b14a7e667758ad2b098.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/99900]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/SpiralKnights]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/SpiralKnights/achievements/]]></globalStatsLink> </game> <game> <appID>212070</appID> <name><![CDATA[Star Conflict]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/212070/78d5f3053bb1854258a9202324f9d37bca60a6d0.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/212070]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/StarConflict]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/StarConflict/achievements/]]></globalStatsLink> </game> <game> <appID>51100</appID> <name><![CDATA[Tactical Intervention]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/51100/76d3313e0ee24c76ac1ad05e780263ed3f8ca978.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/51100]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/TacticalIntervention]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/TacticalIntervention/achievements/]]></globalStatsLink> </game> <game> <appID>261510</appID> <name><![CDATA[Tesla Effect]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/261510/53d94354e7aee47eac3169b53cfe326b62f25144.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/261510]]></storeLink> </game> <game> <appID>312990</appID> <name><![CDATA[The Expendabros]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/312990/2f79038df0cb083412a603adcf933a082698a1b7.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/312990]]></storeLink> </game> <game> <appID>239220</appID> <name><![CDATA[The Mighty Quest For Epic Loot]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/239220/489ffbe185e907f0c38e6aecc4d2dfec84363b58.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/239220]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/239220]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/239220/achievements/]]></globalStatsLink> </game> <game> <appID>335240</appID> <name><![CDATA[Transformice]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/335240/f45dc55ed18469401f989a6e8905be0fd10b0d73.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/335240]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/335240]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/335240/achievements/]]></globalStatsLink> </game> <game> <appID>23490</appID> <name><![CDATA[Tropico 3 - Steam Special Edition]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/23490/c8e565a740d2e2c8a1a07548c875131eae72a1a7.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/23490]]></storeLink> </game> <game> <appID>304930</appID> <name><![CDATA[Unturned]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/304930/2db0ed4ecf4f7682b1f2d2f90badf40f228c887e.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/304930]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/304930]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/304930/achievements/]]></globalStatsLink> </game> <game> <appID>263540</appID> <name><![CDATA[Villagers and Heroes]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/263540/573b34c965a499e84a45087e35bab297c192792b.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/263540]]></storeLink> </game> <game> <appID>291480</appID> <name><![CDATA[Warface]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/291480/2b2281baa8ac33c11ff1ee20ae7a0f76a4e0f0ff.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/291480]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/291480]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/291480/achievements/]]></globalStatsLink> </game> <game> <appID>230410</appID> <name><![CDATA[Warframe]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/230410/9c666e1bc7c747c42b27e3b85b9c7ad49a2f9021.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/230410]]></storeLink> <hoursOnRecord>0.2</hoursOnRecord> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/Warframe]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/Warframe/achievements/]]></globalStatsLink> </game> <game> <appID>42160</appID> <name><![CDATA[War of the Roses]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/42160/78a33bc66b2d52371ee1dc7d210c95167bd0c895.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/42160]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/WaroftheRoses]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/WaroftheRoses/achievements/]]></globalStatsLink> </game> <game> <appID>306830</appID> <name><![CDATA[Zombies Monsters Robots]]></name> <logo><![CDATA[http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/306830/61025578ff588555d8ab5963a993979d0554973d.jpg]]></logo> <storeLink><![CDATA[http://steamcommunity.com/app/306830]]></storeLink> <statsLink><![CDATA[http://steamcommunity.com/id/ImmaHacker/stats/306830]]></statsLink> <globalStatsLink><![CDATA[http://steamcommunity.com/stats/306830/achievements/]]></globalStatsLink> </game> </games> </gamesList>");
		alert("*********************** Line 155" + JSON.stringify(jsonObj));
	});*/
	
	$(".mainTabCont").customScrollbar();
	
});


function resetPosition(event){
	alert('called');
	event.preventDefault();
	event.stopPropagation();
}




//Function that will save and activate new settings from the settings window
function applyConfig(configObject){
    alert("applyConfig waz called");
}


//Function to read the settings file and initialize variables
function getSettings(){
	if(doesFileExists(Ti.App.getHome(), "settings.dat")){
		var settingsFile = Ti.Filesystem.getFile(Ti.App.getHome(),"settings.dat");
		//var settingsContent = JSON.stringify(settingsFile.read());
		savedSettings = JSON.parse(settingsFile.read());
		
		
		//Assigning all the variables from settings file
		gameList = savedSettings.gamesList;
		favGamesList = saveSettings.favouriteGamesArray;
		if(favGamesList == null) {
			favGamesList = new Array();
		}
	}
}



//Function to save all the prefenreces to the settings.dat file
function saveSettings(){
	
	//Base structure of the settings.dat json
	var settings = {
		"steamUserName": null,
		
		"resolution": {
			"w": null,
			"h": null
		},
		
		"position": {
			"x": null,
			"h": null
		},
		
		"moddableStuff": null,
		
		"favouriteGamesArray": null,
		
		"ignoreGameArray": null,
		
		"gamesList": null	
	};
	
	settings.steamUserName = steamName;
	settings.resolution.w = appWindow.getBounds().width;
	settings.resolution.h = appWindow.getBounds().height;
	settings.position.x = appWindow.getBounds().x;
	settings.position.y = appWindow.getBounds().y;
	settings.favouriteGamesArray = favGamesList;
	settings.gamesList = gameList;
	
	
	//var t = Ti.Filesystem.getFile(Ti.App.getHome(),"tempsettings.dat").deleteFile();
	//alert(t);
	var file = Ti.Filesystem.getFileStream(Ti.App.getHome(),"tempsettings.dat");
	file.open(Ti.Filesystem.MODE_WRITE);
	file.write(JSON.stringify(settings));
	file.close();
}



//Function to rebind all the even handlers for the game blocks so that newly generated block from "Fav" tab and "Results" tab can work like the blocks in "All" tab
function rebindHandlersForTheGameBlock(){
	/*$("li").find(".gameImageOverlay").hover(function(){
		$(this).find(".favCont").css("opacity" , 1);
	},
	function(){
		$(this).find(".favCont").animate({opacity : 0}, 100);
	});*/
}



//Function to change content on clicking tabs
function changeTabContent(tabNum){
	
	$("#favourites-tab , #recent-tab , #all-tab , #results-tab").css({
		backgroundColor : "#1c1c1c",
		color: "#c7c7c7",
		textShadow: ""
	});
	$("#favouriteResults , #recentResults , #allResults , #searchResults").css("height", "0px");
	
	
	if(tabNum == 1){
		
		$("#favourites-tab").css({
			backgroundColor : "#0d0d0d",
			color: "#fff"/*,
			textShadow: "0px 0px 8px rgba(169,169,169, 1)"*/
		});
		$("#favouriteResults").css("height", "654px");//This value comes from .nano's styling in your mainStyleSheet.css
		
	} else if(tabNum == 2){
		
		$("#recent-tab").css({
			backgroundColor : "#0d0d0d",
			color: "#fff"/*,
			textShadow: "0px 0px 8px rgba(169,169,169, 1)"*/
		});
		$("#recentResults").css("height", "654px");//This value comes from .nano's styling in your mainStyleSheet.css
		
	} else if(tabNum == 3){
		
		$("#all-tab").css({
			backgroundColor : "#0d0d0d",
			color: "#fff"/*,
			textShadow: "0px 0px 8px rgba(169,169,169, 1)"*/
		});
		$("#allResults").css("height", "654px");//This value comes from .nano's styling in your mainStyleSheet.css
		
	} else if(tabNum == 4){
		
		$("#results-tab").css({
			backgroundColor : "#0d0d0d",
			color: "#fff"/*,
			textShadow: "0px 0px 8px rgba(169,169,169, 1)"*/
		});
		$("#searchResults").css("height", "654px");
		
	}
}



//Function to sort an array of objects with a particular keys
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}



//Function to add game blocks to the favourites tab content
function addGameBlocksToFavouritesTab(){
	$("#favouriteBlocksParent").html("");
	
	favGamesList.forEach(function(item){
		gameList.forEach(function(item2){
			if(item2.appID == item){
				$("#favouriteBlocksParent").append(item2.gameBlockHtml);
			}
		});
	});
}



//Function that will be called when the users types in the search field
function searchForThis(caller) {
	$("#searchBlocksParent").html("");
	
	var searchQuery = $(caller).val();
	var errorMessage = "No results found for \"" + searchQuery.trim() + "\".";
	var errorOccured = false;
	
	if(searchQuery.trim().length == 0){
		return;
	}
	
	try {
		if(searchQuery.length  >= 32){
			errorMessage = "Search query is too long.";
			errorOccured = true;
		} else{
			searchResult = gameIndex.search(searchQuery);
			console.log(searchResult);
		}
	}
	catch(err) {
		errorMessage = "An error occurred while searching for your query. Please try again.";
		errorOccured = true;
	}
	
	
	if (errorOccured || searchResult.length == 0) {
		$("#searchBlocksParent").append("<li><div class='searchErrors'>" + errorMessage + "</div></li>");
	}
	else {
		searchResult.forEach(function (gameItem) {
			//$("#searchBlocksParent").append(generateBlockCont(true, gameList[gameItem - 1].appID, gameList[gameItem - 1].gameRunLink, gameList[gameItem - 1].name, gameItem - 1));
			$("#searchBlocksParent").append(gameList[gameItem - 1].gameBlockHtml);
		});
		
		/*$("#searchResults").nanoScroller({
			sliderMinHeight : 50,
			
		});	*/	
		
		changeTabContent(4);
	}
	
	rebindHandlersForTheGameBlock();
}



//Generate a blockCont for each games
function generateBlockCont(imageExists, gameId, gameRunLink, gameName, c) {
	var imageName = "./defaultGameImage.jpg";
	if (imageExists) {
		imageName = "./GameBanner/" + gameId + ".jpg";
	}
	return "<li class=\"gameImageLi pixelated\" style=\"background-image: url(" + imageName + ");\">" +
				"<div class=\"gameImageOverlay\">" + 
					"<div onclick='favContClicked(" + gameId + ", this)' class=\"favCont\"><img src=\"./favourite.png\" class=\"favImg\"></div>" +
				"<div class=\"gameNameDiv text pixelated\">" + gameName + "</div></div>" +
			"</li>";
}




//Get gamenames, gameId, link to run the game from steam api
// using this link http://steamcommunity.com/id/<steamName>/games?tab=all&xml=1
function genereateGameList() {
	var steamAPILink = "https://query.yahooapis.com/v1/public/yql?q=select+%2A+from+xml+where+url%3D%22http%3A%2F%2Fsteamcommunity.com%2Fid%2F" + steamName + "%2Fgames%3Ftab%3Dall%26xml%3D1%22&format=json&diagnostics=false";
	var myData;
	$.ajax({
		url : steamAPILink,
		type : "GET",
		crossDomain : true, // enable this
		async : false,
		dataType : "json",
		success : function (data) {
			gameList = data.query.results.gamesList.games.game;
			gameList2 = data;
			var removeItemsAt = new Array();
			var count = 1;
			gameList.forEach(function (gameItem) {
	
				var gameItem = gameList[count - 1];
				//gameIndex.add({	id : count, title : gameItem.name});
				games.push({id: count, title: gameItem.name});
				if (gameItem.name.indexOf("(Obsolete)") != -1) {
					removeItemsAt.push(count - 1);
				} else {
					gameItem.headerImg = "http://cdn.akamai.steamstatic.com/steam/apps/" + gameItem.appID + "/header.jpg";
					gameItem.gameRunLink = "steam://rungameid/" + gameItem.appID;
					gameItem.bannerImageFileName = gameItem.appID + ".jpg";
					//Download header images if they don't exist
					//if (!doesFileExists(gameImagesPath, gameItem.appID + ".jpg")) {
						//downloadFile("http://cdn.akamai.steamstatic.com/steam/apps/" + gameItem.appID + "/header.jpg", gameImagesPath, gameItem.appID + ".jpg");
					//}
				}
				count++;
			});
			
			readFromSteamAPI = true;
		},
		error : function (xhr, status, error) {
			readFromSteamAPI = false;
			console.log("----------------------------------------------ERRORRRR::" + error);
		}
	});

}



//Function to add a game to Fav
function favContClicked(gameId, caller){
	var theIdIndex = favGamesList.indexOf(gameId);
	if(theIdIndex != -1){
		favGamesList.splice(theIdIndex, 1);
		$(caller).find("img").attr("src", "./favourite.png");
		changeBlockHtmlFavIconSrc(1, gameId);
	} else{
		favGamesList.push(gameId);
		$(caller).find("img").attr("src", "./favouriteColored.png");
		changeBlockHtmlFavIconSrc(2, gameId);
	}
}



//Function to change the image in gameBlockHtml
function changeBlockHtmlFavIconSrc(num, gameId){
	gameList.forEach(function(item){
		if(item.appID == gameId){
			if(num == 1){
				item.gameBlockHtml = item.gameBlockHtml.replace("favouriteColored.png", "favourite.png");
			} else{
				item.gameBlockHtml = item.gameBlockHtml.replace("favourite.png", "favouriteColored.png");
			}
		}
	});
	
	
	sortedGameList.forEach(function(item){
		if(item.appID == gameId){
			if(num == 1){
				item.gameBlockHtml = item.gameBlockHtml.replace("favouriteColored.png", "favourite.png");
			} else{
				item.gameBlockHtml = item.gameBlockHtml.replace("favourite.png", "favouriteColored.png");
			}
		}
	});
}



//Function to check if a file exists
function doesFileExists(pathLoc, fileName) {
	//Remove this (Only for seeing UI in chrome)// var disFile = Ti.Filesystem.getFile(pathLoc, fileName);
	//Remove this (Only for seeing UI in chrome)// return disFile.exists();
}



//Function to download stuff from online
function downloadFile(url, pathLoc, fileName) {
	var httpClient = Ti.Network.createHTTPClient();
	httpClient.open("GET", url);
	httpClient.receive(function (data) {
		var file = Ti.Filesystem.getFileStream(pathLoc, fileName);
		file.open(Ti.Filesystem.MODE_APPEND);
		file.write(data);
		file.close();
	});
}



function rundisgame() {
	console.log("------------------------------------------------------------------------------------");
	//Ti.Platform.openURL("steam://run/730");
	//Ti.Platform.openApplication("steam://run/730"); // <---Works for steam urls like steam://run/730
	//Ti.Platform.openApplication("C:\\Program Files (x86)\\Steam\\Steam.exe"); // <---- Works for shortcuts like C:\\Program Files (x86)\\Steam\\Steam.exe
	alert("IWAZCALsdgasdgLED");
}





