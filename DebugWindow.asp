<html>
	<head>
		<script type="text/javascript">
			//var theDIV = document.getElementById("divbug");
			//var levels = {'default': 'color:black; font-weight:normal', 'info': 'color:green; font-weight:normal', 'error': 'color:red; font-weight:bold'}
			var ID = 0;
			var method = "f";
			var PStyle;
			var lineCount = 0;
			var filterCount = 0;
			
			
			function DoDebug(action, text, level){
				var theLevel = (level!=undefined) ? level : 'info';
				//var theID = "ID" + ID;
				var d = new Date();
				var now = String(d).substr(0,19);
				
				switch(action){
				case "clear":
					document.getElementById("scrollableContent").innerHTML = "";
					//lineCount = 0;
					break;
					
				case "add":
					if (String(text).indexOf(".asp?") > -1){text = "<a href='" + text + "'>" + text + "</a>"}
					var theText = "<p onMouseOver='MouseIn(this)' onMouseOut='MouseOut(this)'  id='ID" + ID + "' class='" + theLevel + "'>" + now + " - <span ID='SP" + ID + "' onDblClick='ShowOthers(this)'>" + text + "</span></p>"
					document.getElementById("scrollableContent").innerHTML = document.getElementById("scrollableContent").innerHTML + theText;
					lineCount++;
					//alert(theText);
					break;
				}
				ID++;
				UpdateLineCount(lineCount);
			}
			
			function UpdateFilteredCount(){
				filterCount = (method=="h") ? 0 : lineCount;
				var Ps = document.getElementById("scrollableContent").getElementsByTagName("p");
				if (Ps.length > 0){
					for (var i=0; i < Ps.length; i++){
						switch (method){
						case "h":
							if (Ps[i].style.backgroundColor=="#e6ffff"){
								filterCount++;
							}
							break;
						case "f":
							if (Ps[i].style.display=="none"){
								filterCount--;
							}
							break;
						}
					}
				}
				
				UpdateLineCount(lineCount, filterCount);
			}
			
			function UpdateLineCount(count, filter){
				var theCount = document.getElementById("result");
				var theText = count + " lines";
				theCount.innerText = theText;
				if (filter!=undefined){
					theCount.innerText = theText + " (" + filter + ")";
				}
			}
			
			function ShowOthers(item){
				var text = item.innerText;
				Filter(text);
			}
			
			function Filter(text){
				var Ps = document.getElementById("scrollableContent").getElementsByTagName("p");
				if (Ps.length > 0){
					for (var i=0; i < Ps.length; i++){
						if (Ps[i].innerText.toLowerCase().indexOf(text.toLowerCase())>=0)
							{	//filterCount++;
								DoFilter(Ps[i], '');
								//UpdateLineCount(lineCount, filterCount);
							}
						else
							{DoFilter(Ps[i], 'none')}
					}
				}				
				UpdateFilteredCount();
			}
			
			function DoFilter(el, style){
		
				switch (method){
				case 'h':											//highlight the row.
					var theStyle = (style=='') ? '#e6ffff' : '';
					el.style.backgroundColor = theStyle;
					break;
				case 'f':											//filter the row.
					el.style.display = style;
					break
				case 'u':											//unhide the row.
					el.style.backgroundColor = '';
					break;
				}
				
				//UpdateFilteredCount();
			}
			
			function SetMethod(item){
				method = item;
				
				//if 'h', unhide the previously hidden items
				if (method=='h'){
					method = 'f';
					Filter('');
					method = 'h';
				}
				
				if (method=='f'){
					method = 'u';
					Filter('');
					method = 'f';
				}
				
				Filter(document.getElementById('filtertext').value);
				
				return true;
			}
			
			function DoKeys(){
				//if(window.event && ((window.event.keyCode == 69) && window.event.ctrlKey))
				var theCode = window.event.keyCode;
				switch (theCode){
				case 27:
					Filter('');
					filterCount = 0;
					UpdateLineCount(lineCount, filterCount);
					break;
				case 67:
					if (window.event.ctrlKey) {
						DoDebug("clear");
						filterCount = 0;
						lineCount = 0;
						UpdateLineCount(lineCount, filterCount);
					}
					break;
				default:
					//DoDebug("add", "Key code is " + theCode);
				}
			}
			
			function MouseIn(elem){
				PStyle=elem.style.color;
				elem.style.color = "#ffffff";
			}
			
			function MouseOut(elem){
				elem.style.color = PStyle;
			}
		</script>
	
		<style>
			body {margin:0px; font-family:verdana;  height:100%; height: 100%; background: #000000; color: #FFFFFF; position:relative;}
			#topbar {height:50px; width:100%; top:0px;left:0px; background: #CCCCCC;position:absolute;color:black;}
			#content {-webkit-box-sizing: border-box;-moz-box-sizing: border-box; box-sizing: border-box; height:100%; padding: 50px 0; overflow: hidden;}	
			#content #scrollableContent { height: 100%; width: 100%;overflow: auto;}	
			#info {float:left; width:200px;margin-top:3px; margin-left:4px;}
			#result {float:right; position:fixed; z-align:1; padding-right:0px;}
			#filterspan {float:right; width:280px;}
			#footer {height:50px; width:100%; bottom:0px;left:0px; background: #CCCCCC; position:absolute;}
			p.default {font-family:verdana; font-size:12px; margin:2px; cursor: pointer;}
			p.info {font-family:verdana; font-size:12px; margin:2px; color:lightgreen; cursor: pointer;}
			p.error {font-family:verdana; font-size:12px; margin:2px; font-weight:bold; color:red; cursor: pointer;}
			p.bp {font-family:verdana; font-size:12px; margin:2px; font-weight:bold; color:orange; cursor: pointer;}
		</style>
	</head>
	
	<body onKeyDown="DoKeys()">
		<div id="topbar">
			<span id="info"><p>Debug information.</p> </span>
			
			<span id="filterspan">
				<input type=radio id="filter" name="option" checked onClick="SetMethod('f');"><label for="filter">Filter</label><input type=radio id="highlight" name="option" onClick="SetMethod('h');"><label for="highlight">Highlight</label><input id="filtertext" size=16 onKeyUp="Filter(this.value)">
			<span id="result">0 lines</span></span>
		</div>
		<div id="content">
			<div id="scrollableContent">
			</div>
		</div>
		<div id="footer">
			Footer
		</div>
	
	</body>
</html>