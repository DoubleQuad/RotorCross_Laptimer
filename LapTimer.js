//set some global stuff
var theRacesElem;
var theRaceListElem;
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
var COUNTDOWNTIME=120000, seconds = 0, minutes = 0, hours = 0, t, RACETYPE="TIMED";
var MODE = "PILOT";
var Mode;

//set colours for pilots
var colours = ["blue", "green", "yellow", "orange", "purple", "lightgreen"];
var N0 = [3,4,9,10,11,12,13,14,17,18,21,22,25,26,28,29,30,33,34,35,37,38,41,42,45,46,49,50,51,52,53,54,59,60]
var N1 = [3,4,10,11,12,17,18,19,20,27,28,35,36,43,44,50,51,52,53,57,58,59,60,61,62]
var N2 = [3,4,10,11,12,13,17,18,21,22,28,29,35,36,42,43,49,50,51,52,53,57,58,59,60,61,62]
var N3 = [2,3,4,5,9,10,11,12,13,14,17,18,21,22,28,29,36,37,41,42,45,46,49,50,51,52,53,54,58,59,60,61]

var Classes = ["3S", "4S", "A"]
var aryPilots = new Array();
var aryPilot = new Array();
var PJSON = {'pilots':[{'pilot':{'id':'', 'details':{'name':'', 'quad':'', 'rclass':'', 'freq':'', 'vtx':''}}}]};
var RJSON = {'races':[]};
var aryRaces = new Array();
var aryRace = new Array();
var NUM_LEDS = 64;
var OFF = "black";
var ON = "yellow";
var BeepHigh = new Audio("BeepHigh.wav");
var BeepLow = new Audio("BeepLow.wav");

document.onkeydown = function(e){
	var key = (window.event) ? e.keyCode : e.which;
	//alert(key);
	switch (key){
		case 27 : //ESC key
			switch (MODE){
			case "PILOT":
				EmptyPilotBoxes();
				btnSave.value = "Save";
				break;
			case "PAUSED":
				MODE = "READY";
				Mode.innerText = MODE;
				ResetTime();
				ResetLEDs(OFF);						
				break;
				
			case "RUN":
				break;
			}
			break;
			
		case 32:	//space bar
			
			switch (MODE){
			
			case "READY":
				//alert(MODE);
				var Yes = confirm("Click OK to start the race...");
				if (Yes){
					Race();
				}
				break;
				
			case "RACE":
				//alert(MODE);
				MODE = "PAUSED";
				//ResetTime();
				//ResetLEDs(OFF);						
				Mode.innerText = MODE;					
				break;						
				
			case "PAUSED":
				//alert(MODE);
				MODE = "RACE";
				timer();
				Mode.innerText = MODE;	
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

function add() {
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
	var PID = (PJSON.pilots!=undefined) ? PJSON.pilots.length + 1 : 1;
	
	PJSON.pilots.push({pilot:{id:PID, details: {name: thePilot, quad:theQuad, rclass : theClass, freq:theFreq, vtx:theType}}});

	//alert(PJSON.pilots[0].pilot.details.name);
}	
function AddRace(theDesc, theLap, theLapTime, theClass){
	//generate a Pilot ID if they don't have one and then add to the JSON 
	var RID = (RJSON.races!=undefined) ? RJSON.races.length + 1 : 1;
	
	RJSON.races.push({id:RID, details: {description: theDesc, laps:theLap, rclass : theClass, laptime:theLapTime}});
	alert(RJSON.races.length)
	//alert(PJSON.pilots[0].pilot.details.name);
}	

function AddNewRacesNode(text, nclass, id){
	//these are being added to the theRacesElem elem.
	//create the new node
	var theNewElem = document.createElement("DIV");
	theNewElem.innerText = text;
	theNewElem.setAttribute('id', id);
	theNewElem.setAttribute('class', nclass);
	if (!isNaN(id)){
		theNewElem.addEventListener("click", function () {
			EnableEdit(parseInt(this.id));
		});

	}
	//add to the main elem.				
	theRacesElem.appendChild(theNewElem);
	
}

function AddNewRaceNode(text, nclass, id){
	//these are being added to the theRacesElem elem.
	//create the new node
	var theNewElem = document.createElement("DIV");
	theNewElem.innerText = text;
	theNewElem.setAttribute('id', id);
	theNewElem.setAttribute('class', nclass);
	if (!isNaN(id)){
		theNewElem.addEventListener("click", function () {
			EnableEdit(parseInt(this.id));
		});

	}
	//add to the main elem.				
	theRaceListElem.appendChild(theNewElem);
	
}

function DecrementTime(){

	//var h1 = document.getElementById('timer');
	
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
		PJSON.pilots.splice(thePilot, 1);
		EmptyPilotBoxes();
		DrawRaceList();
	}
}

function DrawCharacter(Char){
	for (var i=0; i < Char.length; i++){
		document.getElementById("s" + Char[i]).style.backgroundColor = ON;
	}
}			

function DrawRaceList(){
	//iterate through the classes array and for each
	//class, find the pilots in that class.
	//var theRacesElem = document.getElementById("races");
	var rid = 0;
	var C3Entries = new Array();
	var C4Entries = new Array();
	var CAEntries = new Array();
	
	var Entry = new Array();
	
	//iterate through the pilots and add to a class
	//GatherClassEntries();
	EmptyRaceList();
	
	for (var p=0; p < PJSON.pilots.length; p++){
		var pn = PJSON.pilots[p].pilot.details.name;
		var pc = PJSON.pilots[p].pilot.details.rclass;
		var pq = PJSON.pilots[p].pilot.details.quad;
		var pi = PJSON.pilots[p].pilot.id;
		
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
		
		AddNewRacesNode(Classes[i], "classhead", Classes[i]);

		switch(Classes[i]){
		case "3S":
			for (var e=0; e < C3Entries.length; e++){
				rid++;
				AddNewRacesNode(C3Entries[e][1], "classentry", C3Entries[e][0]);
			}
			break;
			
		case "4S":
			for (var e=0; e < C4Entries.length; e++){
				rid++;
				AddNewRacesNode(C4Entries[e][1], "classentry", C4Entries[e][0]);
			}
			break;
			
		case "A":
			for (var e=0; e < CAEntries.length; e++){	
				rid++;
				AddNewRacesNode(CAEntries[e][1], "classentry", CAEntries[e][0]);
			}
			break;
		
		
		}
	}
	
	localStorage.setItem("PJSON", JSON.stringify(PJSON));
	//alert(localStorage.getItem("PJSON"));
	
}

function DrawRacesList(){
	//iterate through the classes array and for each
	//class, find the pilots in that class.
	//var theRacesElem = document.getElementById("races");
	var rid = 0;
	var REntries = new Array();
	//var C4Entries = new Array();
	//var CAEntries = new Array();
	
	var REntry = new Array();
	
	//iterate through the pilots and add to a class
	//GatherClassEntries();
	EmptyRacesList();
	
	for (var p=0; p < RJSON.races.length; p++){
		//details: {description: theDesc, laps:theLap, rclass : theClass, laptime:theLapTime}
		var pd = RJSON.races[p].details.description;
		var pl = RJSON.races[p].details.laps;
		var pc = RJSON.races[p].details.rclass;
		var pt = RJSON.races[p].details.laptime;
		var pi = RJSON.races[p].id;
		
		REntry = [];
		REntry.push(pi);
		REntry.push(pc + " : " + pd);					
		
		REntries.push(REntry);	
		
		
	}	
	
	//add a header bar for each one
	
	//for (var i=0; i < Classes.length; i++){
		
		//AddNewRacesNode(Classes[i], "classhead", Classes[i]);

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
				AddNewRacesNode(C4Entries[e][1], "classentry", C4Entries[e][0]);
			}
			break;
			
		case "A":
			for (var e=0; e < CAEntries.length; e++){	
				rid++;
				AddNewRacesNode(CAEntries[e][1], "classentry", CAEntries[e][0]);
			}
			break;
		
		*/
		//}
	//}
	
	localStorage.setItem("RJSON", JSON.stringify(RJSON));
	//alert(localStorage.getItem("PJSON"));
	
}

function EnableEdit(id){
	var thePilot = SearchPilotById(id);
	if (thePilot!=false){
		pname.value		= thePilot.details.name;
		pclass.value 	= thePilot.details.rclass;
		pquad.value 	= thePilot.details.quad;
		pid.value		= thePilot.id;
		pfreq.value 	= thePilot.details.freq;
		ptype.value		= thePilot.details.vtx;;
		btnSave.value = "Update";
		btnDelete.style.visibility = "visible";
	}
	else{
		btnDelete.style.visibility = "hidden";
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
	btnDelete.style.visibility= "hidden";
	
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
	//btnDelete.style.visibility= "hidden";
	
}

function EmptyRaceList(){
	//iterate through and remove all child nodes.
	while (theRacesElem.firstChild) {
		theRacesElem.removeChild(theRacesElem.firstChild);
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
	theRacesElem 	= document.getElementById("races");
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
	pid				= document.getElementById("pid");
	rid				= document.getElementById("rid");
	btnDelete		= document.getElementById("btnDelete");
	Timer			= document.getElementById("timer");
	Mode			= document.getElementById("Mode");
	
	MODE			= "EDIT";
	
	for (var i=0; i<6; i++){
		var cNum = i+1
		var thePilot = document.getElementById("P"+cNum);
		thePilot.style.backgroundColor = colours[i];
	}
	
	if (storageAvailable('localStorage')) {
		//see if we have a JSON object in localstorate and load it if we do...
		tmpJSON = localStorage.getItem("PJSON");
		tmpJSON = JSON.parse(tmpJSON)
		//alert("tmpJSON is " + tmpJSON.pilots.length);
		if (tmpJSON.pilots.length > 1){
			PJSON = tmpJSON;
			DrawRaceList();
		}
	}
	else {
		//alert("// Too bad, no localStorage for us");
	}
	
	//kick off the timer if need be.
	//timer();
	
	ResetLEDs(OFF);
	//Race();
	
}

function Race(){
	MODE = "RACE";
	Mode.innerText = MODE;
	millis = COUNTDOWNTIME;
	
	ResetTime();
	
	//countdown!
	//start at 3 with a red background.
	setTimeout(ResetLEDs("blue"),1000);
	
	//now 3 with an red background
	setTimeout(function(){BeepLow.play(); ResetLEDs("red"); DrawCharacter(N3);}, 2000);
	
	//now 2 with an brown background
	setTimeout(function(){BeepLow.play(); ResetLEDs("brown"); DrawCharacter(N2)},3000);
	
	//now 1 with an orange background
	setTimeout(function(){BeepLow.play(); ResetLEDs("orange"); DrawCharacter(N1)},4000);
	
	//now 0 with an green background
	setTimeout(function(){BeepHigh.play(); ResetLEDs("green"); DrawCharacter(N0);},5000);
	
	setTimeout(function(){ResetLEDs("black"); timer();},5500);
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
		DrawRaceList();
		btnSave.value = "Save";
	}
	else
	{
		if (SearchPilotByName(thePilot, theClass)===false){
			//alert("Not found!");
			AddPilot(thePilot, theQuad, theClass);
			EmptyPilotBoxes();
		}
	}
	DrawRaceList();
	
}

function SaveRace(){
	var theDesc 	= rdesc.value;
	var theLap	 	= rlap.value;
	var theLapTime 	= rlt.value;
	var theClass	= pclass.value;

	//var thePilots = localStorage.getItem("PilotJSON");
	if (rid.value!=""){
		UpdateRace(parseInt(pid.value), thePilot, theQuad, theClass, theFreq, theType);
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
	
}

function SearchPilotById(id){
	for (var i=0; i < PJSON.pilots.length; i++){
		if (PJSON.pilots[i].pilot.id===id){
			//pname.value		= PJSON.pilots[i].pilot.details.name;
			//pclass.value 	= PJSON.pilots[i].pilot.details.rclass;
			//pquad.value 	= PJSON.pilots[i].pilot.details.quad;
			return(PJSON.pilots[i].pilot);
		}
	}
	return false;
}

function SearchPilotByName(pName, pClass){
	if(PJSON.pilots!=undefined){
		var pl = PJSON.pilots.length;
		if (pl > 0){
			for (var ps=0; ps < pl; ps++){
				if (PJSON.pilots[ps].pilot.details.name===pName && PJSON.pilots[ps].pilot.details.rclass===pClass){
					return true;
				}
			}
		}
		return false;
	}
	return false;
}

function SearchRaceByName(pDesc, pClass){
	if(RJSON.races!=undefined){
		var pl = RJSON.races.length;
		if (pl > 0){
			for (var ps=0; ps < pl; ps++){
				if (RJSON.races[ps].details.description===pDesc && RJSON.races[ps].details.rclass===pClass){
					return true;
				}
			}
		}
		return false;
	}
	return false;
}

function SearchPilotByPos(id){
	for (var i=0; i < PJSON.pilots.length; i++){
		if (PJSON.pilots[i].pilot.id===id){
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
	MODE = mode;
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
	if (MODE=="RACE"){
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
		thePilot.details.name 	= Pilot;
		thePilot.details.rclass	= Class;
		thePilot.details.quad	= Quad;
		thePilot.details.freq	= Freq;
		thePilot.details.vtx	= Vtx;
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
