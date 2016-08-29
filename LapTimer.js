
	//start = document.getElementById('start'),
    //stop = document.getElementById('stop'),
    //clear = document.getElementById('clear'),
    var millis=0, seconds = 0, minutes = 0, hours = 0, t;

function add() {
	var h1 = document.getElementById('timer');
    millis++;
	if (millis > 100){
		millis=0;
		seconds++;
		if (seconds >= 60) {
			seconds = 0;
			minutes++;
		}
    }
    h1.innerHTML = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds) + ":" + (millis > 9 ? millis : "0" + millis);

    timer();
}
function timer() {
	if (MODE=="TIMER"){
		t = setTimeout(add, 10);
	}
}



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