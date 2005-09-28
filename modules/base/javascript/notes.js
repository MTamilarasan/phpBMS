function returnFalse(){
	return false;
}

function timeStamp(){
	var theDate= new Date()
	var theform=document.forms["record"]
	theform["content"].value=theform["content"].value+"[ "+theform["username"].value+" - "+theDate.toLocaleString()+" ]"
}

function initialize(){
	initializeOnClicks();
	changeType()
	completedCheck();
	
	var attachedField=getObjectFromID("attachedid");
	if(attachedField.value!="" && attachedField.value!=0){
		var associatedDiv=getObjectFromID("theassociated");
		var content=getObjectFromID("content");
		associatedDiv.style.display="block";
		content.rows+=7;
	}
	var theid=getObjectFromID("id");
	var thetype=getObjectFromID("thetype");
	if(theid.value)
		thetype.disabled=true;
	setEnglishDates();	
}

function changeType(){
	var thetype=getObjectFromID("thetype");

	var thestatus=getObjectFromID("thestatus");
	var endtext=getObjectFromID("endtext");
	var datediv=getObjectFromID("thedates");
	var content=getObjectFromID("content");
	var comptext=getObjectFromID("completedtext");
	var compdiv=getObjectFromID("thecompleted");
	var startcheck=getObjectFromID("startcheck");
	var endcheck=getObjectFromID("endcheck");
	var repeatdiv=getObjectFromID("therepeat");
	var parentid=getObjectFromID("parentid");
	var prviatecheck=getObjectFromID("private");
	var theid=getObjectFromID("id");
	
	switch(thetype.value){
		case "NT":
			datediv.style.display="none";
			compdiv.style.display="block";
			content.rows=16;
			comptext.innerHTML="read";
			thestatus.style.display="none";
			repeatdiv.style.display="none";
			prviatecheck.disabled=false;
		break;

		case "TS":
			datediv.style.display="block";
			compdiv.style.display="block";
			content.rows=24;
			comptext.innerHTML="completed";
			startcheck.disabled=false;
			endcheck.disabled=false;
			endtext.innerHTML="due date"
			thestatus.style.display="none";
			if(!parentid.value){
				repeatdiv.style.display="block";
				doRepeat();
			}
			prviatecheck.disabled=false;
			if(!theid.value) prviatecheck.checked=true;
		break;
		
		case "EV":
			datediv.style.display="block";
			compdiv.style.display="block";
			content.rows=27;
			comptext.innerHTML="done";
			startcheck.checked=true;
			endcheck.checked=true;			
			startcheck.disabled=true;
			endcheck.disabled=true;
			endtext.innerHTML="end"
			thestatus.style.display="block";			
			if(!parentid.value){
				repeatdiv.style.display="block";
				doRepeat();
			}
			prviatecheck.disabled=false;
			if(!theid.value) prviatecheck.checked=true;
		break;
		
		case "SM":
			thestatus.style.display="none";
			datediv.style.display="none";
			compdiv.style.display="none";
			repeatdiv.style.display="none";			
			content.rows=13;			
			prviatecheck.disabled=true;
			if(!theid.value) prviatecheck.checked=false;
		break;
	}
	dateChecked("start");
	dateChecked("end");

}

function completedCheck(){
	var checkbox=getObjectFromID("completed");
	var completedDate=getObjectFromID("completeddate");
	var completedDateButton=getObjectFromID("completeddateButton");
	if(checkbox.checked){
		
		completedDate.setAttribute("readonly",null);
		completedDate.className=null;
		completedDateButton.onclick=CDBOC;
		if(!completedDate.value){
			var today=new Date();
			completedDate.value=(today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
		}
	} else {
		completedDate.setAttribute("readonly","readonly");
		completedDate.className="uneditable";
		completedDateButton.onclick=returnFalse;
	}	
}

function dateChecked(type){
	var checkbox=getObjectFromID(type+"check");

	var thedate=getObjectFromID(type+"date");
	var thetime=getObjectFromID(type+"time");		
	var thedateButton=getObjectFromID(type+"dateButton");
	var thetimeButton=getObjectFromID(type+"timeButton");		
	var thetext=getObjectFromID(type+"text");
	var repeat=getObjectFromID("repeat");

	if(!checkbox.checked){
		if(type=="start" && repeat.checked){
			alert("Repeatable tasks must have a start date.");
			checkbox.checked=true;
			return false;
		}
		thetext.className="disabledtext";		
		thedate.value="";
		thetime.value="";
		thedate.setAttribute("readonly","readonly");
		thetime.setAttribute("readonly","readonly");
		thedate.className="uneditable";
		thetime.className="uneditable";
		thetimeButton.onclick=returnFalse;
		thedateButton.onclick=returnFalse;
	} else {
		
		if(!thedate.value){
			var today=new Date();
			thedate.value=(today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
	
			if (type=="end")
				today.setHours(today.getHours()+1);
			var ampm = " AM";
			var hours = today.getHours()
			if(hours==0) hours=12;
			if (hours>12){
				var ampm = " PM";
				hours=hours-12
			}
			var minutes=today.getMinutes();
			if(minutes<10)
				minutes="0"+minutes.toString();
			thetime.value=hours+":"+minutes+ampm;
		}
		thetext.className=null;
		thedate.removeAttribute("readonly");
		thetime.removeAttribute("readonly");
		thedate.className=null;
		thetime.className=null;		
		if(type=="end"){
			thetimeButton.onclick=ETBOC;
			thedateButton.onclick=EDBOC;
		} else{
			thetimeButton.onclick=STBOC;
			thedateButton.onclick=SDBOC;
		}
	}
	
	return true;
}

function initializeOnClicks(){
	var startDateButton=getObjectFromID("startdateButton");
	SDBOC=startDateButton.onclick;	
	var startTimeButton=getObjectFromID("starttimeButton");
	STBOC=startTimeButton.onclick;	
	var endDateButton=getObjectFromID("enddateButton");
	EDBOC=endDateButton.onclick;	
	var endTimeButton=getObjectFromID("endtimeButton");
	ETBOC=endTimeButton.onclick;	
	var completedDateButton=getObjectFromID("completeddateButton");
	CDBOC=completedDateButton.onclick;	
	var repeatUntilDateButton=getObjectFromID("repeatuntildateButton");
	RUDB=repeatUntilDateButton.onclick;
}

function addS(freqfield){
	var rpType=getObjectFromID("repeattype");
	var plural="";
	
	if(freqfield.value>1)
		plural="s";
	rpType.options[0].text="Day"+plural;
	rpType.options[1].text="Week"+plural;
	rpType.options[2].text="Month"+plural;
	rpType.options[3].text="Year"+plural;
}

function doRepeat(){
	var rpdiv=getObjectFromID("therepeat");
	var startcheck = getObjectFromID("startcheck");
	var rpspan=getObjectFromID("repeatoptions");
	var rpchk=getObjectFromID("repeat");
	if(rpdiv.style.display!="none"){
		var rpFreq=getObjectFromID("repeatfrequency");
		var rpType=getObjectFromID("repeattype");
		var rpUntilrdF=getObjectFromID("rprduntilforever");
		var rpUntilrdT=getObjectFromID("rprduntilftimes");
		var rpUntilTimes=getObjectFromID("repeattimes");
		var rpUntilrdD=getObjectFromID("rprduntildate");
		var rpUntilDate=getObjectFromID("repeatuntildate");
		var rpUntilDateButton=getObjectFromID("repeatuntildateButton");
		var rpWO=getObjectFromID("weeklyoptions");
		var rpMO=getObjectFromID("monthlyoptions");
		if(rpchk.checked){
			if(!startcheck.checked){
				alert("Setting up recurring tasks requires a start date.");
				rpchk.checked=false;
				return false;
			}
			rpspan.className="";
			rpFreq.removeAttribute("readonly");
			rpFreq.className="";
			rpType.disabled=false;
			rpUntilrdF.disabled=false;
			rpUntilrdT.disabled=false;
			rpUntilrdD.disabled=false;
			if(rpUntilrdT.checked){
				rpUntilTimes.removeAttribute("readonly");
				rpUntilTimes.className="";
			}
			if(rpUntilrdD.checked){
				rpUntilDate.removeAttribute("readonly");
				rpUntilDate.className="";
				rpUntilDateButton.onclick=RUDB;
			}
			if(rpType.value=="Weekly")
				rpWO.style.display="block";
			else if(rpType.value=="Monthly")
				rpMO.style.display="block";			
		} else
		{
			rpspan.className="disabledtext";			
			rpFreq.setAttribute("readonly","readonly");
			rpFreq.className="uneditable";
			rpType.disabled=true;
			rpUntilrdF.disabled=true;
			rpUntilrdT.disabled=true;
			rpUntilrdD.disabled=true;
			rpUntilTimes.setAttribute("readonly","readonly");
			rpUntilTimes.className="uneditable";
			rpUntilDate.setAttribute("readonly","readonly");
			rpUntilDate.className="uneditable";
			rpUntilDateButton.onclick=returnFalse;
			if(rpType.value=="Weekly")
				rpWO.style.display="none";			
			else if(rpType.value=="Monthly")
				rpMO.style.display="none";			
		}
	}
}

function changeRepeatType(){
	var rpType=getObjectFromID("repeattype");	
	var rpWO=getObjectFromID("weeklyoptions");
	var rpMO=getObjectFromID("monthlyoptions");
	
	switch(rpType.value){
		case "Daily":
			rpWO.style.display="none";
			rpMO.style.display="none";
		break;
		case "Weekly":
			rpWO.style.display="block";			
			rpMO.style.display="none";
		break;
		case "Monthly":
			setEnglishDates();
			rpWO.style.display="none";
			rpMO.style.display="block";
		break;
		case "Yearly":
			rpWO.style.display="none";
			rpMO.style.display="none";
		break;
	}
}

function setEnglishDates(){
	var byDateText= getObjectFromID("rpmobydate");
	var byDayText= getObjectFromID("rpmobyday");	
	var startdate= getObjectFromID("startdate");
	var thedate= new Date();
	var themonth= startdate.value.substring(0,startdate.value.indexOf("/"))
	var theday= parseInt(startdate.value.substring(startdate.value.indexOf("/")+1,startdate.value.lastIndexOf("/")));
	thedate.setMonth(themonth-1,theday);
	
	var dayending="th";
	if(theday==3) dayending="rd";
	if(theday==2) dayending="nd";
	if(theday==1) dayending="st";
	
	byDateText.innerHTML=theday+dayending;
	
	
	var whichday=Math.floor((thedate.getDate()-1)/7);
	var dayname;
	var which;
	switch (thedate.getDay()){
		case 0:
			dayname="Sunday";
		break;
		case 1:
			dayname="Monday";
		break;
		case 2:
			dayname="Tuesday";
		break;
		case 3:
			dayname="Wednesday";
		break;
		case 4:
			dayname="Thursday";
		break;
		case 5:
			dayname="Friday";
		break;
		case 6:
			dayname="Saturday";
		break;		
	};
	switch(whichday){
		case 0:
			which="First";
		break;
		case 1:
			which="Second";
		break;
		case 2:
			which="Third";
		break;
		case 3:
			which="Fourth";
		break;
		case 4:
			which="Last";
		break;
		
	}
	byDayText.innerHTML=which+" "+dayname;
}

function updateRepeatUntil(){
	var rpUntilrdF=getObjectFromID("rprduntilforever");
	var rpUntilrdT=getObjectFromID("rprduntilftimes");
	var rpUntilTimes=getObjectFromID("repeattimes");
	var rpUntilrdD=getObjectFromID("rprduntildate");
	var rpUntilDate=getObjectFromID("repeatuntildate");
	var rpUntilDateButton=getObjectFromID("repeatuntildateButton");

	if(rpUntilrdF.checked){
		rpUntilTimes.setAttribute("readonly","readonly");
		rpUntilTimes.className="uneditable";
		rpUntilDate.setAttribute("readonly","readonly");
		rpUntilDate.className="uneditable";
		rpUntilDateButton.onclick=returnFalse;
	} else if(rpUntilrdT.checked) {
		rpUntilTimes.removeAttribute("readonly");
		rpUntilTimes.className="";
		rpUntilDate.setAttribute("readonly","readonly");
		rpUntilDate.className="uneditable";
		rpUntilDateButton.onclick=returnFalse;
		rpUntilTimes.focus()
	} else if(rpUntilrdD.checked) {
		rpUntilTimes.setAttribute("readonly","readonly");
		rpUntilTimes.className="uneditable";
		rpUntilDate.removeAttribute("readonly");
		rpUntilDate.className="";
		rpUntilDateButton.onclick=RUDB;
		var today=new Date();
		theday= new Date(today.valueOf()+(1000*60*60*24));
		rpUntilDate.value=(theday.getMonth()+1)+"/"+theday.getDate()+"/"+theday.getFullYear();
		
		rpUntilDate.focus()
	}
}

function goParent(){
	parentid=getObjectFromID("parentid");
	theback=getObjectFromID("thebackurl");
	theURL="notes_addedit.php?id="+parentid.value;
	if(theback.value!="")
		theURL+="&backurl="+theback.value;
	document.location=theURL;
}