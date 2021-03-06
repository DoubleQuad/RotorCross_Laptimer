//set some global stuff
var thePilotsElem;
var theRaceListElem;
var raceentrants;
var pname;
var pquad;
var pfreq;
var ptype;
var pclass;	
var rclass;
var rdesc;
var rlap;
var rlt;
var pid;
var rid;
var btnSave;
var btnDelete;
var Timer;
var Millis;
var COUNTDOWNTIME=120000, seconds = 0, minutes = 0, hours = 0, t, RACETYPE="LAPS";
var MODE = "PILOT";
var Mode;
var m1;
var m2;
var DoDebug = false;
var windowObjectReference = null;
var theRace;

//set colours for pilots
var colours = ["blue", "green", "yellow", "orange", "purple", "lightgreen"];
var N0 = [3,4,9,10,11,12,13,14,17,18,21,22,25,26,28,29,30,33,34,35,37,38,41,42,45,46,49,50,51,52,53,54,59,60]
var N1 = [3,4,10,11,12,17,18,19,20,27,28,35,36,43,44,50,51,52,53,57,58,59,60,61,62]
var N2 = [3,4,10,11,12,13,17,18,21,22,28,29,35,36,42,43,49,50,51,52,53,57,58,59,60,61,62]
var N3 = [2,3,4,5,9,10,11,12,13,14,17,18,21,22,28,29,36,37,41,42,45,46,49,50,51,52,53,54,58,59,60,61]

var Classes = ["3S", "4S", "A"]
var aryPilots = new Array();
var aryPilot = new Array();
var PJSON 		= {'pilots':[{'pilot':{'id':'', 'details':{'name':'', 'quad':'', 'rclass':'', 'freq':'', 'vtx':''}}}]};
var RJSON 		= {'races':[]};
//var aryRaces = new Array();
var aryRace 	= new Array();
var NUM_LEDS 	= 64;
var OFF 		= "black";
var ON 			= "yellow";
var EMPTY		= 1
var UNRACED		= 2
var INPROGRESS	= 3
var RACED		= 4

var BeepHigh = new Audio("Inc/BeepHigh.wav");
var BeepLow = new Audio("Inc/BeepLow.wav");

document.onkeydown = function(e){
	var key = (window.event) ? e.keyCode : e.which;
	Debug("User pressed key '" + key + "'");
	switch (key){
		case 27 : //ESC key
			switch (RE.Mode){
			case "PILOT":
				EmptyPilotBoxes();
				btnSave.value = "Save";
				break;
			case "PAUSED":
				RE.Mode = "READY";
				Mode.innerText = RE.Mode;
				ResetTime();
				ResetLEDs(OFF);						
				break;
				
			case "RUN":
				break;
			}
			break;
			
		case 323:	//space bar
			
			switch (RE.Mode){
			
			case "READY":
				//alert(MODE);
				RE.startRace();
				
			case "RACE":
				//alert(MODE);
				RE.Mode = "PAUSED";
				//ResetTime();
				//ResetLEDs(OFF);						
				Mode.innerText = RE.Mode;					
				break;						
				
			case "PAUSED":
				//alert(MODE);
				RE.Mode = "RACE";
				timer();
				Mode.innerText = RE.Mode;	
				break;

			}
			break;
		case 116 : //F5 button
			//event.returnValue = false;
			//event.keyCode = 0;
			//alert('Pressing F5 is not allowed in CHIP');
			//return false;
			break;
			
		case 122 : //F11 button - full screen

			
		case 123 : //F12 button - developer tools

		
		case 75 : //K button

		
		case 78 : //N button

		
		case 82 : //R button
			/*alert(MODE);
			if (MODE=="RACE" && MODE!="PAUSED"){
				var Yes = confirm("Click OK to start the race...");
				if (Yes){
					Race();

					
				}
			}
			break; 
			*/
		case 83 : //s button
			/*if (MODE=="RACE"){
				MODE = "PAUSED";
			}
			else {
				MODE = "RACE";
				timer();
			}*/
			break;
			
		case 84 : //T button

			
		case 85 : //U button - view source

	}
}

//local storage routines for arrays===========================================================================================
Storage.prototype.getArray = function(arrayName) {
  var thisArray = [];
  var fetchArrayObject = this.getItem(arrayName);
  if (typeof fetchArrayObject !== 'undefined') {
    if (fetchArrayObject !== null) { thisArray = JSON.parse(fetchArrayObject); }
  }
  return thisArray;
}

Storage.prototype.pushArrayItem = function(arrayName,arrayItem) {
  var existingArray = this.getArray(arrayName);
  existingArray.push(arrayItem);
  this.setItem(arrayName,JSON.stringify(existingArray));
}

Storage.prototype.popArrayItem = function(arrayName) {
  var arrayItem = {};
  var existingArray = this.getArray(arrayName);
  if (existingArray.length > 0) {
    arrayItem = existingArray.pop();
    this.setItem(arrayName,JSON.stringify(existingArray));
  }
  return arrayItem;
}

Storage.prototype.shiftArrayItem = function(arrayName) {
  var arrayItem = {};
  var existingArray = this.getArray(arrayName);
  if (existingArray.length > 0) {
    arrayItem = existingArray.shift();
    this.setItem(arrayName,JSON.stringify(existingArray));
  }
  return arrayItem;
}

Storage.prototype.unshiftArrayItem = function(arrayName,arrayItem) {
  var existingArray = this.getArray(arrayName);
  existingArray.unshift(arrayItem);
  this.setItem(arrayName,JSON.stringify(existingArray));
}

Storage.prototype.deleteArray = function(arrayName) {
  this.removeItem(arrayName);
}

//============================================================================================================================ 


//create Pilot and Race classes================================================================================================
function Pilot(theName){
	//external property
	this.PName = theName;
	this.PID = 0;
	
	//internal values
	this.QuadName 	= "";
	this.QuadVTx 	= "";
	this.QuadFreq 	= "";
	this.Class 		= "";
}	

//methods
Pilot.prototype = {
constructor: Pilot,
	addQuad:function(theQuad, theFreq, theVTx){
		//var Quad = [];
		this.QuadName 	= theQuad;
		this.QuadVTx 	= theVTx;
		this.QuadFreq 	= theFreq;
		//this.Quads.push(Quad);
	},
	getQuad:function(){
		return this.QuadName + ", " + this.QuadVTx + ", " + this.QuadFreq; 
	}

}


//race class
function ClassRace(){
	this.Description 	= ""; 	//short description e.g. "Round 1"
	this.Class 			= "";	//3s/4s/Open
	this.RType 			= "";	//Laps / Timed.
	this.Laps 			= 0;	//Number of laps for a lap event.
	this.Time 			= 0;	//The number of minutes for a timed race.
	this.Status			= EMPTY;
	
	this.Entrants = [];
	this.Placings = [];
	this.LapTimes = [];
}
	
ClassRace.prototype = {
constructor:ClassRace,
	addPlacing:function(theID){
		if (this.Placings.length < 3){
			this.Placings.push(theID);
		}
		else{
			alert("3 placings already set.");
		}
	},
	addEntrant:function(theID){
		this.Entrants.push(theID);
	},
	statusColour:function(status){
		
			return "green";
		
	}

}


//race engine class
function RaceEngine(){
	//race colours
	this.UNRACED		= "lightgreen";
	this.RACED			= "red";
	this.EMPTY			= "yellow";
	this.UNSELECTED		= "";
	this.PreviousRace 	= 0;
	
	this.StatusElement 	= "";		//the radio buttons that hold the status
	this.LEDElement		= ""; 		//the element containing the LED segments
	this.Mode 			= "READY";	//the current race / edit mode.
	this.SelectedRace	= "";
	this.Races			= [];
	this.Pilots			= [];	
	
}	

RaceEngine.prototype = {
constructor:RaceEngine,
	startRace:function(id){
		var Yes = confirm("Click OK to start the race...");
		if (Yes){
			this.Mode = "RACE";
			closeDiv('main'); 
			openDiv('racecont');
			millis = COUNTDOWNTIME;
			timer();
			//this.Race();
		}
	},
	selectRace:function(id){
		//highlight the div that holds the race info.
		//if the race hasn't been run, enable the racing options.
		var thisRace = RE.searchRacesById(id);
		Debug("theRace is '" + thisRace + "'");
		var theStatus = thisRace.Status;
		Debug("Status is '" + theStatus + "'");
		var theColour = thisRace.statusColour(theStatus); //(theStatus==false) ? this.UNRACED : this.RACED ;
		//find the div that this relates to:
		var theDIV = document.getElementById("R"+id);
		
		//set the div colours
		
		if (RE.PreviousRace > 0){
			var oldDIV = document.getElementById("R"+RE.PreviousRace);
			if (oldDIV){
				oldDIV.style.backgroundColor = RE.UNSELECTED;
			}
		}
		
		
		if (theDIV){
			theDIV.style.backgroundColor = theColour;
			theOldDIV = document.getElementById(this.SelectedRace);
			if (theOldDIV && theOldDIV!=theDIV){
				theOldDIV.style.backgroundColor = this.UNSELECTED;
			}
			RE.SelectedRace = id;
			RE.PreviousRace = id;
			
			//show the start race button if the current selected race hasn't been run yet
			ShowHide('StartRace', 'hidden')
			if (theDIV.style.backgroundColor = this.UNRACED){
				ShowHide('StartRace', 'visible')
			}
		}
		
		//enable the racing options.
		RE.Mode = "READY";
		m2.checked = true;
		
	},
	addRace:function(race){
		this.Races.push(race);
	},removeRace:function(raceid){
		var thisRace = this.searchRaceByPos(parseInt(rid.value));
		this.Races.splice(thisRace, 1);
	},
	getPilotsForRace:function(id){
		var aryPilots = [];
		var thisRace = this.searchRacesById(id);
		if (thisRace.Entrants.length > 0){
			aryPilots = thisRace.Entrants;
		};
		return aryPilots;
	},
	searchRaceByPos:function(id){
		for (var i=0; i < RE.Races.length; i++){
			if (RE.Races[i].RID===id){
				return(i);
			}
		}
		return false;
	},
	searchRacesById:function(id){
		for (var i=0; i < RE.Races.length; i++){
			if (RE.Races[i].RID===parseInt(id)){
				return(RE.Races[i]);
			}
		}
		return false;
	},
	updateRace:function(id, desc, lt, laps){
	/*this.Description = ""; 	//short description e.g. "Round 1"
	this.Class = "";		//3s/4s/Open
	this.RType = "";		//Laps / Timed.
	this.Laps = 0;			//Number of laps for a lap event.
	this.Time = 0;	
	*/
	var thisRace = this.searchRacesById(id);
	if (thisRace!=false){
		thisRace.Description 	= desc;
		//thisRace.Class	= Class;
		thisRace.RType	= lt;
		thisRace.Laps	= laps;
		thisRace.Time	= laps;
	}
	},
	Race:function(){
		alert("Starting Race")
	}
}

var RE = new RaceEngine();

/*var Race1 = new ClassRace();
Race1.Description = "Round 1";
Race1.addPlacing(1);
Race1.addPlacing(2);
Race1.addPlacing(3);
Race1.addPlacing(4);
*/

//================================================================================================================================

var PilotTemplate = '<div class="chip"><img src="images/img_avatar.png" alt="Person" width="38" height="38">{Pilot}<span class=editbutton onclick="EnableEdit({id})">&nbsp;&#9776;</span></div>'

if (DoDebug){OpenDebugWindow();};

function openDiv(theDiv) {
    document.getElementById(theDiv).style.height = "100%";
}

function closeDiv(theDiv) {
    document.getElementById(theDiv).style.height = "0%";
}

function ToggleDIV(theDiv, theState) {
    document.getElementById(theDiv).style.visibility = theState;
}

function OpenDIV(theDiv) {
    document.getElementById(theDiv).style.visibility = "visible";
}


function add() {
	//Debug("RACETYPE is '" + RACETYPE + "'");
	switch(RACETYPE){
	case "LAPS":
		IncrementTime();
		break;
		
	case "TIMED": 
		DecrementTime();
		break;
	}
}

function AddPilot(thePilot, theQuad, theClass, theFreq, theType){
	//generate a Pilot ID if they don't have one and then add to the JSON 
	
	var P = new Pilot(thePilot);
	P.PID = aryPilots.length + 1			//(PJSON.pilots!=undefined) ? PJSON.pilots.length + 1 : 1;
	P.addQuad(theQuad, theFreq, theType);
	P.Class = theClass;
	aryPilots.push(P);
	//alert(P.PName);
	
	//PJSON.pilots.push({pilot:{id:PID, details: {name: thePilot, quad:theQuad, rclass : theClass, freq:theFreq, vtx:theType}}});

	//alert(PJSON.pilots[0].pilot.details.name);
	Debug("Added Pilot '" + thePilot + "'");
}	
function AddRace(theDesc, theLap, theLapTime, theClass){
	//=================================================
	//Called by CreateRacesList()
	//Adds a new race to the Race Engine's list of races
	//=================================================
	
	//generate a Pilot ID if they don't have one and then add to the JSON 
	var RID = (RE.Races!=undefined) ? RE.Races.length + 1 : 1;
	var R = new ClassRace();
	R.RID 			= RID;
	R.Description 	= theDesc;
	R.Class 		= theClass;		//3s/4s/Open
	R.RType 		= "";		//Laps / Timed.
	R.Laps 			= theLap;			//Number of laps for a lap event.
	R.Time 			= theLapTime;
	RE.addRace(R);
	Debug("Added Race '" + theDesc + "'");
	//RJSON.races.push({id:RID, details: {description: theDesc, laps:theLap, rclass : theClass, laptime:theLapTime}});
	//alert(RJSON.races.length)
	//alert(PJSON.pilots[0].pilot.details.name);
}	

function AddNewPilotNode(text, nclass, id){
	//==============================================
	//Called by DrawEntriesList()
	//==============================================
	
	//these are being added to the thePilotsElem elem.
	//create the new node
	var theNewElem = document.createElement("DIV");
	
	theNewElem.innerText = text;
	theNewElem.setAttribute('id', id);
	theNewElem.setAttribute('class', nclass);
	if (nclass=="classentry"){
		var PilotText = PilotTemplate;
		PilotText = PilotText.replace("{id}", id);
		PilotText = PilotText.replace("{Pilot}", text);
		theNewElem.innerHTML = PilotText;
	}
	if (!isNaN(id)){
		theNewElem.addEventListener("dblclick", function () {
			EnableEdit(parseInt(this.id));
		});

	}
	//add to the main elem.				
	thePilotsElem.appendChild(theNewElem);
	Debug("Createad Class entry '" + text + "'");
}

function AddNewRaceNode(text, nclass, id){					
	//this adds a race to the list of races to be run.
	//id = raceid
	var theNewElem = document.createElement("DIV");
	theNewElem.innerText = text;
	theNewElem.setAttribute('id', "R"+id);
	theNewElem.setAttribute('class', nclass);
	if (!isNaN(id)){
		theNewElem.addEventListener("dblclick", function () {
			EnableRaceEdit(this.id);
		});
	theNewElem.addEventListener("click", function () {
			RE.selectRace(id);
		});
	}
	//add to the main elem.				
	theRaceListElem.appendChild(theNewElem);
	
}

function DecrementTime(){

	//var h1 = document.getElementById('timer');
	//Debug("Current timer value is '"  + Timer.innerHTML + "'");
	//Debug("millis value is '"  + millis + "'");
	millis -= 100;
	//var messagetime = (parseInt(screenrefresh) - parseInt(screenloop))
	var minutes = (parseInt(millis / 60000) >= 1) ? parseInt(millis/60000) : 0;
	var seconds = (parseInt(millis / 1000))
	seconds = (seconds > 60) ? seconds - 60 : seconds;
	var Millis = (millis % 1000)
	Millis = String(Millis).substr(0,2);
	//if (seconds.length == 1){seconds = '0' + seconds};
    Timer.innerHTML = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds) + "." + (Millis > 9 ? Millis : "0" + Millis);
	Millis.innerHTML = millis;
	
    if (millis > 1){
		timer();
		}
	else 
		{
		MODE = "READY";
		millis = COUNTDOWNTIME;
		ResetTime();
		BeepLow.play();
		}
	
	
}

function DeletePilot(){
	var d = confirm("Are you sure you wisth to remove this pilot?")
	if (d){
		var thePilot = SearchPilotByPos(parseInt(pid.value));
		//PJSON.pilots.splice(thePilot, 1);
		aryPilots.splice(thePilot, 1);
		EmptyPilotBoxes();
		DrawEntriesList();
	}
}

function DeleteRace(){
	var d = confirm("Are you sure you wisth to remove this race?")
	if (d){
		//var theRace = SearchRaceByPos(parseInt(rid.value));
		//PJSON.pilots.splice(thePilot, 1);
		RE.removeRace(rid.value);
		//aryRaces.splice(theRace, 1);
		//RE.Races = aryRaces;
		//alert(RE.Races);
		EmptyRaceBoxes();
		DrawRacesList();
	}
}

function DrawCharacter(Char){
	for (var i=0; i < Char.length; i++){
		document.getElementById("s" + Char[i]).style.backgroundColor = ON;
	}
}			

function DrawEntriesList(){
	//=====================================
	//Called by OnLoad(), SavePilot() and DeletePilot().
	//=====================================
	//iterate through the classes array and for each
	//class, find the pilots in that class.
	//var thePilotsElem = document.getElementById("races");
	var rid = 0;
	var C3Entries = new Array();
	var C4Entries = new Array();
	var CAEntries = new Array();
	
	var Entry = new Array();
	
	//iterate through the pilots and add to a class
	//GatherClassEntries();
	EmptyRaceList();
	
	for (var p=0; p < aryPilots.length; p++){
		var pn = aryPilots[p].PName		//PJSON.pilots[p].pilot.details.name;
		var pc = aryPilots[p].Class		//PJSON.pilots[p].pilot.details.rclass;
		var pq = aryPilots[p].QuadName;//PJSON.pilots[p].pilot.details.quad;
		var pi = aryPilots[p].PID		//PJSON.pilots[p].pilot.id;
		
		Entry = [];
		Entry.push(pi);
		Entry.push(pn + " (" + pq + ")");					
		
		switch(pc){
		case "3S":
			C3Entries.push(Entry);	
			break;
		case "4S":
			C4Entries.push(Entry);					
			break;
		case "A":
			CAEntries.push(Entry);					
		}
		
	}	
	
	//add a header bar for each one
	
	for (var i=0; i < Classes.length; i++){
		
		AddNewPilotNode(Classes[i], "classhead", Classes[i]);

		switch(Classes[i]){
		case "3S":
			for (var e=0; e < C3Entries.length; e++){
				rid++;
				AddNewPilotNode(C3Entries[e][1], "classentry", C3Entries[e][0]);
			}
			break;
			
		case "4S":
			for (var e=0; e < C4Entries.length; e++){
				rid++;
				AddNewPilotNode(C4Entries[e][1], "classentry", C4Entries[e][0]);
			}
			break;
			
		case "A":
			for (var e=0; e < CAEntries.length; e++){	
				rid++;
				AddNewPilotNode(CAEntries[e][1], "classentry", CAEntries[e][0]);
			}
			break;
		
		
		}
	}
	
	//localStorage.setItem("PJSON", JSON.stringify(PJSON));
	//SaveSettings();
	//alert(localStorage.getItem("PJSON"));
	
}

function DrawRacesList(){
	//=======================================
	//Called by Onload(), SaveRace() and DeleteRace()
	//=======================================
	
	//iterate through the classes array and for each
	//class, find the pilots in that class.
	//var thePilotsElem = document.getElementById("races");
	var rid = 0;
	var REntries = new Array();
	//var C4Entries = new Array();
	//var CAEntries = new Array();
	
	var REntry = new Array();
	
	//iterate through the pilots and add to a class
	//GatherClassEntries();
	EmptyRacesList();
	
	for (var p=0; p <RE.Races.length; p++){
		//details: {description: theDesc, laps:theLap, rclass : theClass, laptime:theLapTime}
		var pd = RE.Races[p].Description;
		var pl = RE.Races[p].Laps;
		var pc = RE.Races[p].Class;
		var pt = "" //aryRaces[p].;
		var pi = RE.Races[p].RID;
		
		REntry = [];
		REntry.push(pi);
		REntry.push(pc + " : " + pd);					
		
		REntries.push(REntry);	
		
		
	}	
	
	//add a header bar for each one
	
	//for (var i=0; i < Classes.length; i++){
		
		//AddNewPilotNode(Classes[i], "classhead", Classes[i]);

		//switch(Classes[i]){
		//case "3S":
			for (var e=0; e < REntries.length; e++){
				rid++;
				AddNewRaceNode(REntries[e][1], "classentry", REntries[e][0]);
			}
			//break;
			
		/*case "4S":
			for (var e=0; e < C4Entries.length; e++){
				rid++;
				AddNewPilotNode(C4Entries[e][1], "classentry", C4Entries[e][0]);
			}
			break;
			
		case "A":
			for (var e=0; e < CAEntries.length; e++){	
				rid++;
				AddNewPilotNode(CAEntries[e][1], "classentry", CAEntries[e][0]);
			}
			break;
		
		*/
		//}
	//}
	
	//SaveSettings();
	//alert(localStorage.getItem("PJSON"));
	
}

function SaveSettings(){
	localStorage.setItem("Races", JSON.stringify(RE.Races));
	localStorage.setItem("Pilots", JSON.stringify(aryPilots));
}

function EnableEdit(id){
	var thePilot = SearchPilotById(id);
	if (thePilot!=false){
		pname.value		= thePilot.PName;
		pclass.value 	= thePilot.Class;
		pquad.value 	= thePilot.QuadName;
		pid.value		= thePilot.PID;
		pfreq.value 	= thePilot.QuadFreq;
		ptype.value		= thePilot.QuadVTx;
		btnSave.value = "Update";
		ShowHide('addedit', 'visible');
		//btnDelete.style.visibility = "visible";
		btnDelete.disabled=false;
	}
	else{
		//btnDelete.style.visibility = "hidden";
		btnDelete.disabled=true;
	}
}

function EnableRaceEdit(id){
	id = parseInt(id.replace("R",""));
	theRace = RE.searchRacesById(id);
	if (theRace!=false){
		rclass.value	=theRace.Class
		rdesc.value		=theRace.Description
		rlap.value		= theRace.Laps;
		rlt.value		= theRace.Time;
		//rclass.value	=t;
		rid.value		= id;
		btnSaveR.value = "Update";
		//btnDeleteR.style.visibility = "visible";
		PopulateRaceEntrants(theRace);
		ToggleDIV('relist', 'visible');
	}
	else{
		//btnDeleteR.style.visibility = "hidden";
	}
	//alert("Race edit mode enabled");
}

function PopulateRaceEntrants(race){
	//==================================================
	//Called by EnableRaceEdit()
	//==================================================
	//empty the current list 
	var reedit = document.getElementById("reedit");
	reedit.innerText = "Entry List - " + race.Class + " " + race.Description;
	while (raceentrants.firstChild) {
		raceentrants.removeChild(raceentrants.firstChild);
	}


	//load up the list of pilots for the class
	//highlight the currently selected pilots.
	//alert(race);
	
	var aryEntrants = RE.getPilotsForRace(race.RID);
	
	for (var p=0; p < aryPilots.length; p++){
		//alert(aryPilots[p].Class);
		var InClass = aryEntrants.indexOf(aryPilots[p].PID);
		if (aryPilots[p].Class==race.Class){
			AddEntrantNode(aryPilots[p], InClass)
		}
	}
	
	function AddEntrantNode(pilot, inclass){
		//=============================================
		//Called from PopulateRaceEntrants()
		//Pilot 'name':'', 'quad':'', 'rclass':'', 'freq':'', 'vtx':''
		//=============================================
		
		//var parentElement = document.getElementById('raceentrants');
		var newDiv = document.createElement("div");
		var newSpan = document.createElement("span");
		var newChk = document.createElement("input");
		
		//set the attributes for the Checkbox
		newChk.type = "checkbox";
		newChk.id = "RE" + pilot.PID;
		newChk.value = pilot.PID;
		newChk.checked = (inclass > -1) ? true : false;
		
		//set the attributes for the span
		newSpan.innerText = pilot.PName + " : (" + pilot.QuadFreq + ")";
		
		//add both to the DIV
		newDiv.appendChild(newChk);
		newDiv.appendChild(newSpan);
		
		raceentrants.appendChild(newDiv);
		
		
		
	}


}

function EmptyPilotBoxes(){
	pname.value="";
	pquad.value="";
	pfreq.value="";
	ptype.value="";
	pclass.selectedIndex=0;
	pid.value="";
	btnSave.value="Save";
	//btnDelete.style.visibility= "hidden";
	btnDelete.disabled=true;
	
}

function EmptyRaceBoxes(){
	/*
	rclass 			= document.getElementById("rclass");
	rdesc 			= document.getElementById("rdesc");
	rlap			= document.getElementById("rlap");
	rlt		
	*/
	rclass.value="";
	rdesc.value="";
	rlap.value="";
	rlt.value="";
	rclass.selectedIndex=0;
	rid.value="";
	btnSaveR.value="Save";
	btnDeleteR.style.visibility= "hidden";
	
}

function EmptyRaceList(){
	//iterate through and remove all child nodes.
	while (thePilotsElem.firstChild) {
		thePilotsElem.removeChild(thePilotsElem.firstChild);
	}

}

function EmptyRacesList(){
	//iterate through and remove all child nodes.
	while (theRaceListElem.firstChild) {
		theRaceListElem.removeChild(theRaceListElem.firstChild);
	}

}

function IncrementTime(){
	//var h1 = document.getElementById('timer');
    millis+=10;
	if (millis > 100){
		millis=0;
		seconds++;
		if (seconds >= 60) {
			seconds = 0;
			minutes++;
		}
    }
	//millis = String(millis).substr(0,2);
	var theMills = (millis > 9 ? millis : "0" + millis)
	theMills = String(theMills).substr(0,2);
    Timer.innerHTML = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds) + "." + theMills;

    timer();
}

function OnLoad(){
	//these are document elements.
	thePilotsElem 	= document.getElementById("races");
	theRaceListElem	= document.getElementById("racelist");
	pname 			= document.getElementById("pname");
	pquad 			= document.getElementById("pquad");
	pfreq 			= document.getElementById("pfreq");
	ptype 			= document.getElementById("ptype");
	pclass			= document.getElementById("pclass");
	rclass 			= document.getElementById("rclass");
	rdesc 			= document.getElementById("rdesc");
	rlap			= document.getElementById("rlap");
	rlt				= document.getElementById("rlt");
	btnSave			= document.getElementById("btnSave");
	btnSaveR		= document.getElementById("btnSaveR");
	pid				= document.getElementById("pid");
	rid				= document.getElementById("rid");
	btnDelete		= document.getElementById("btnDelete");
	Timer			= document.getElementById("timer");
	Mode			= document.getElementById("Mode");
	m1				= document.getElementById("m1");
	m2				= document.getElementById("m2");
	raceentrants	= document.getElementById('raceentrants');
	btnDelete.disabled=true;
	
	RE.Mode			= "EDIT";
	
	for (var i=0; i<6; i++){
		var cNum = i+1
		var thePilot = document.getElementById("P"+cNum);
		thePilot.style.backgroundColor = colours[i];
	}
	
	
	if (storageAvailable('localStorage')) {
		//see if we have a JSON object in localstorate and load it if we do...
		//tmpJSON = localStorage.getItem("PJSON");
		
		//get the list of pilots from local storate and build the list.
		tmpJSON = (localStorage.getItem("Pilots")!=undefined) ? localStorage.getItem("Pilots") : new Array();
		tmpJSON = JSON.parse(tmpJSON)

		if (tmpJSON.length >= 1){;
			aryPilots = tmpJSON;
			DrawEntriesList();
		}
		
		//now do the same with the races list.
		tmpJSON = (localStorage.getItem("Races")!=undefined) ? localStorage.getItem("Races") : new Array();
		tmpJSON = JSON.parse(tmpJSON)
		Debug("Races JSON is '" + tmpJSON + "'");
		
		if (tmpJSON.length >= 1){;
			RE.Races = tmpJSON;
			//CreateRacesList();
			DrawRacesList();
		}
		//alert(RE.Races.length);
	}
	else {
		//alert("// Too bad, no localStorage for us");
	}
	
	//kick off the timer if need be.
	//timer();
	
	ResetLEDs(OFF);
	//Race();
	
}

function CreateRacesList(){
	//=======================================
	//Called by OnLoad()
	//=======================================
	alert("# of races:" + RE.Races.length);
	var xR = 0;
	//for (var R=0; R < RE.Races.length; R++){
	while (xR < RE.Races.length){
		//AddRace(RE.Races[xR].Description, RE.Races[xR].Laps, RE.Races[xR].Time, RE.Races[xR].Class)
		xR++;
		alert(xR + ":" + RE.Races.length);
	}
}


function ResetLEDs(colour){
	for (var i=0; i < NUM_LEDS; i++){
		document.getElementById("s" + i).style.backgroundColor = colour;
	}
}

function ResetTime(){
	Timer.innerHTML = "00:00.00";
}

function SavePilot(){
	var thePilot 	= pname.value;
	var theQuad 	= pquad.value;
	var theFreq 	= pfreq.value;
	var theType 	= ptype.value;
	var theClass	= pclass.value;
	//var thePilots = localStorage.getItem("PilotJSON");
	if (pid.value!=""){
		UpdatePilot(parseInt(pid.value), thePilot, theQuad, theClass, theFreq, theType);
		EmptyPilotBoxes();
		DrawEntriesList();
		btnSave.value = "Save";
	}
	else
	{
		if (SearchPilotByName(thePilot, theClass)===false){
			//alert("Not found!");
			AddPilot(thePilot, theQuad, theClass, theFreq, theType);
			EmptyPilotBoxes();
		}
	}
	DrawEntriesList();
	SaveSettings();
	
}

function SaveRace(){
	var theDesc 	= rdesc.value;
	var theLap	 	= rlap.value;
	var theLapTime 	= rlt.value;
	var theClass	= rclass.value;

	//var thePilots = localStorage.getItem("PilotJSON");
	if (rid.value!=""){
		RE.updateRace(parseInt(rid.value), theDesc, theLap, theLapTime);
		EmptyRaceBoxes();
		DrawRacesList();
		btnSaveR.value = "Save";
	}
	else
	{
		if (SearchRaceByName(theDesc, theClass)===false){
			//alert("Not found!");
			AddRace(theDesc, theLap, theLapTime, theClass);
			EmptyRaceBoxes();
		}
	}
	DrawRacesList();
	SaveSettings();
}

function SaveRE(){
	var childs = raceentrants.childNodes;
	var len = childs.length, i = -1;
	//theRace = RE.searchRacesById(rid.value);
	//empty the current entrant list
	theRace.Entrants = [];
	if(++i < len) do {
		var fc = childs[i].firstChild;
		if (fc){
			if (fc.checked){
				theRace.Entrants.push(parseInt(fc.value));
			}
		}
	} while(++i < len);
	SaveSettings();
}

function SearchPilotById(id){
	//for (var i=0; i < PJSON.pilots.length; i++){
	for (var i=0; i < aryPilots.length; i++){
		//if (PJSON.pilots[i].pilot.id===id){
		if (aryPilots[i].PID===id){
			//pname.value		= PJSON.pilots[i].pilot.details.name;
			//pclass.value 	= PJSON.pilots[i].pilot.details.rclass;
			//pquad.value 	= PJSON.pilots[i].pilot.details.quad;
			return(aryPilots[i]);
		}
	}
	return false;
}



function SearchPilotByName(pName, pClass){
	//if(PJSON.pilots!=undefined){
	if(aryPilots.length > 0){
		var pl = aryPilots.length;
		if (pl > 0){
			for (var ps=0; ps < pl; ps++){
				if (aryPilots[ps].PName===pName && aryPilots[ps].Class===pClass){
					return true;
				}
			}
		}
		return false;
	}
	return false;
}

function SearchRaceByName(pDesc, pClass){
	if(RE.Races.length > 0){
		var pl = RE.Races.length;
		if (pl > 0){
			for (var ps=0; ps < pl; ps++){
				if (RE.Races[ps].Description===pDesc && RE.Races[ps].Class===pClass){
					return true;
				}
			}
		}
		return false;
	}
	return false;
}

function SearchPilotByPos(id){
	for (var i=0; i < aryPilots.length; i++){
	//for (var i=0; i < PJSON.pilots.length; i++){
		if (aryPilots[i].PID===id){
		//if (PJSON.pilots[i].pilot.id===id){
			//pname.value		= PJSON.pilots[i].pilot.details.name;
			//pclass.value 	= PJSON.pilots[i].pilot.details.rclass;
			//pquad.value 	= PJSON.pilots[i].pilot.details.quad;
			return(i);
		}
	}
	return false;
}



function SetMode(mode){
	//alert(mode);
	RE.Mode = mode;
	
	switch(mode){
	case "READY":
		document.getElementById("racecont").style.visibility = "visible";
		break;
	case "PILOT":
		document.getElementById("racecont").style.visibility = "hidden";
		break;
	}
}

function ShowHide(id, state){
	//alert(state);
	try{
		document.getElementById(id).style.visibility = state;
		Debug("Set '" + id + "' to '" + state + "'");
	}
	catch(err)
	{
		Debug("Failed setting '" + id + "' to '" + state + "'");
	}
}

function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}

function timer() {
	//Debug("Mode is '" + RE.Mode + "'");
	if (RE.Mode=="RACE"){
		t = setTimeout(add, 100);
	}
}

function sleep (time) {
	var now = new Date().getTime();
    while(new Date().getTime() < now + time){ /* do nothing */ }
}

function UpdatePilot(id, Pilot, Quad, Class, Freq, Vtx){
	var thePilot = SearchPilotById(id);
	if (thePilot!=false){
		thePilot.PName 	= Pilot;
		thePilot.Class	= Class;
		thePilot.QuadName	= Quad;
		thePilot.QuadFreq	= Freq;
		thePilot.QuadVTx	= Vtx;
	}
}

	



// Usage!


/* Start button */
//start.onclick = timer;

/* Stop button 
stop.onclick = function() {
    clearTimeout(t);
}
*/
/* Clear button 
clear.onclick = function() {
    h1.textContent = "00:00:00";
    seconds = 0; minutes = 0; hours = 0;
}*/


/*debug stuff*/
function OpenDebugWindow(){
	if(windowObjectReference == null || windowObjectReference.closed)
  /* if the pointer to the window object in memory does not exist
     or if such pointer exists but the window was closed */

  {
    windowObjectReference = window.open("DebugWindow.asp", "db", "titlebar=no, toolbar=no; resizable=yes");
    /* then create it. The new window will be created and
       will be brought on top of any other window. */
  }
  else
  {
    windowObjectReference.focus();
    /* else the window reference must exist and the window
       is not closed; therefore, we can bring it back on top of any other
       window with the focus() method. There would be no need to re-create
       the window or to reload the referenced resource. */
  };
}

function Debug(text, level){
	try{
		if (windowObjectReference && DoDebug){
			windowObjectReference.DoDebug("add", text, level);
		}
	}
	catch(err){
		Debug(err, "error")
	}
}

/*end debug stuff*/
