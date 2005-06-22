
			key="";
			function captureKey(e){
				 if(!e) // IE
				 	e=window.event;
				key = e.keyCode;
			}
			
			function auotfillInit(divid){
				thediv=getObjectFromID(divid);
				displayfield=getObjectFromID("ds-"+divid.substring(3));
			}

			
			function autofillChange(theitem){
				
				var basename=theitem.name.substring(3);
				var changeitem=autofill[basename]["ch"];
				var uhitem=autofill[basename]["uh"];
				var tabledefid=autofill[basename]["td"];
				var displayfield=autofill[basename]["fl"];
				var xtrafield=autofill[basename]["xt"];
				var whereclause=autofill[basename]["wc"];

				var thediv=getObjectFromID("dd-"+basename);
				if(key){
					if (key==40 || key==38 || key==37 || key==39){
						if(thediv.style.display=="block"){
							if(key==40) {
								moveHighlight(thediv,"dn")
								return false;}
							else if(key==38){
								moveHighlight(thediv,"up")
								return false;}
						}
						if(theitem.value.toLowerCase()==changeitem.toLowerCase())
							return false;
					}
				}
				if (theitem.value.toLowerCase()!=changeitem.toLowerCase() && theitem.value!=""){
					
					var enteredlength=theitem.value.length
					
					var theURL=appPath+"autofill.php?l=" + escape(theitem.value);
					theURL=theURL+"&tid=" +tabledefid;
					theURL=theURL+"&fl=" +displayfield;
					theURL=theURL+"&xt=" +xtrafield;
					theURL=theURL+"&wc=" +whereclause;
					loadXMLDoc(theURL,null,false);
					if(req && req.responseXML)
						response = req.responseXML.documentElement;
					else{
						alert(req.responseText);
						return false;
					}
						
					
					var restofname="";
					var numrecs=response.getElementsByTagName('numrec')[0].firstChild.data
					if(numrecs>0){
						if(response.getElementsByTagName('val')[0].firstChild){
							restofname=response.getElementsByTagName('val')[0].firstChild.data							
						}
						//more than one result... need to display div
						var displays=new Array();
						var xtras=new Array();
						var thevalue;
						for(i=0;i<response.getElementsByTagName('fld').length;i++){
							thevalue="";
							if(response.getElementsByTagName('val')[i].firstChild)
								thevalue=response.getElementsByTagName('val')[i].firstChild.data;
							if(response.getElementsByTagName('fld')[i].firstChild.data=="display")
								displays[displays.length]=thevalue;
							 else
								xtras[xtras.length]=thevalue;								
						}//end if
						populateDiv(thediv,displays,xtras);
						thediv.style.display="block";
					} else thediv.style.display="none"; //end numrec>0 if
										
					var lower=theitem.value.toLowerCase()
					if(lower.indexOf("%")==-1){
						//highlight, and fill the rest of the stuff.. but only
						//if there is no wildcard character
						//stoopid ie crap
						if(document.selection){
							var temp=document.selection.createRange()
							var isend=(temp.text=="");
						}
						else
							var isend=(theitem.selectionStart==theitem.value.length);
						
						if(changeitem.substring(0,changeitem.length-1)!=theitem.value && isend && (lower!=uhitem)){
							if(restofname){
								//stoopid ie crap
								theitem.value+=restofname.substring(theitem.value.length);
								if(document.selection){
								   var oRange = theitem.createTextRange();
								   oRange.moveStart("character", enteredlength);
								   oRange.moveEnd("character", theitem.value.length );      
									oRange.select(); 							   
								} else {
									theitem.setSelectionRange(enteredlength,theitem.value.length);						
								}
							} 
						}
					} //end % if
					autofill[basename]["uh"]=lower;
					autofill[basename]["ch"]=theitem.value;
				}
				if (theitem.value==""){
					autofill[basename]["ch"]="";
					autofill[basename]["uh"]="";
					thediv.style.display="none";
				}
				
			}//end function
			
			function autofillOnChange(theitem){
				var basename=theitem.name.substring(3);
				var thefield=getObjectFromID(basename);			

				if(theitem.value==""){
					thefield.value="";
				} else {
					var tabledefid=autofill[basename]["td"];
					var displayfield=autofill[basename]["fl"];
					var xtrafield=autofill[basename]["xt"];
					var whereclause=autofill[basename]["wc"];
					var getfield=autofill[basename]["gf"];
				
					var theURL=appPath+"autofill.php?l=" + escape(theitem.value);
					theURL=theURL+"&tid=" +tabledefid;
					theURL=theURL+"&fl=" +displayfield;
					theURL=theURL+"&xt=" +xtrafield;
					theURL=theURL+"&gf=" +getfield;
					theURL=theURL+"&wc=" +whereclause;
										
					loadXMLDoc(theURL,null,false);
					if(req.responseXML)
						response = req.responseXML.documentElement;
					if(response.getElementsByTagName('val').length){
						theitem.value=response.getElementsByTagName('val')[0].firstChild.data;											
						thefield.value=response.getElementsByTagName('val')[2].firstChild.data;
					} else {
						if(autofill[basename]["bo"])
							theitem.value="";
						thefield.value="";
					}

				}
				if(thefield.onchange) thefield.onchange();
			}
			
			function blurAutofill(theitem){
				var thediv=getObjectFromID("dd-"+theitem.name.substring(3));
				var thetable=thediv.childNodes[0];
				var hide=true;
				if(thetable)
					for(i=0;i<thetable.childNodes[0].childNodes.length;i++)
						if(thetable.childNodes[0].childNodes[i].className=="af-highlighted")
							if(thetable.childNodes[0].childNodes[i].firstChild.firstChild.data!=theitem.value) 
								hide=false;
				
				if(hide)
					thediv.style.display="none";
			}

			function populateDiv(thediv,displays,extras){
				var i;
				while (thediv.childNodes[0]) 
					thediv.removeChild(thediv.childNodes[0]);
				//set div poision appropriatley
				var displayfield=getObjectFromID("ds-"+thediv.id.substring(3));
				thediv.style.left=getLeft(displayfield);
				//stoopid IE
				if(document.selection)
					thediv.style.top=getTop(displayfield)+displayfield.offsetHeight;

				var thetr,thetd;
				var thetable=document.createElement("TABLE");
				thetable.setAttribute("border",0);
				thetable.setAttribute("cellSpacing",0);
				thetable.setAttribute("cellPadding",0);
				var thetbody=document.createElement("TBODY");
				for(i=0; i<displays.length;i++){
					thetr=document.createElement("TR");
					thetr.onclick=clickHighlightListItem;
					thetr.onmouseover=highlightListItem;
						thetd=document.createElement("TD")
							thetd.appendChild(document.createTextNode(displays[i]));
							thetd.className="af-choice";
							thetd.setAttribute("valign","top");
						thetr.appendChild(thetd);
						if(extras[i]){
						thetd=document.createElement("TD");
							thetd.appendChild(document.createTextNode("\u00A0\u00A0\u00A0"+extras[i]));
							thetd.className="af-extra";
							thetd.align="right";
							thetd.setAttribute("valign","top");
						thetr.appendChild(thetd);
						}
					thetbody.appendChild(thetr);
				}
				thetable.appendChild(thetbody);
				thediv.appendChild(thetable);
			}//end function


			function highlightListItem(theitem){
				if(!theitem || !theitem.parentNode) theitem=this;
				var thetable=theitem.parentNode.parentNode;
				var thediv=thetable.parentNode;

				var i;
				for(i=0;i<thetable.childNodes[0].childNodes.length;i++) 
					thetable.childNodes[0].childNodes[i].className="";
				theitem.className="af-highlighted";
			}
		
			function moveHighlight(thediv,direction){
				var thedisplay=getObjectFromID("ds-"+thediv.id.substring(3));				
				var thetable=thediv.childNodes[0];
				var highlightnumber=-1;
				var dnum;
				if(direction=="up") dnum=-1; else dnum=1
				for(i=0;i<thetable.childNodes[0].childNodes.length;i++)
					if(thetable.childNodes[0].childNodes[i].className=="af-highlighted")
						highlightnumber=i+dnum;
				if(highlightnumber==-1 && direction=="dn") highlightnumber=0;
				if(highlightnumber>-1 && highlightnumber<thetable.childNodes[0].childNodes.length){
					highlightListItem(thetable.childNodes[0].childNodes[highlightnumber]);
					thedisplay.value=thetable.childNodes[0].childNodes[highlightnumber].firstChild.firstChild.data;
				}
	
			};
			
			function clickHighlightListItem(){
				theitem=this;
				var thetable=theitem.parentNode.parentNode;
				var thediv=thetable.parentNode;
				var thedisplay=getObjectFromID("ds-"+thediv.id.substring(3));				
				thediv.style.display="none";
				thedisplay.value=theitem.firstChild.firstChild.data;
				autofillOnChange(thedisplay);
			}

			function getLeft(theitem){
				var offsetTrail = theitem;
				var offsetLeft = 0;
				while (offsetTrail) {
					offsetLeft += offsetTrail.offsetLeft;
					offsetTrail = offsetTrail.offsetParent;
				}
				if (navigator.userAgent.indexOf("Mac") != -1 && typeof document.body.leftMargin != "undefined") 
					offsetLeft += document.body.leftMargin;
			    return offsetLeft;
			}

			function getTop(theitem){
				var offsetTrail = theitem;
				var offsetTop = 0;
				while (offsetTrail) {
					offsetTop += offsetTrail.offsetTop;
					offsetTrail = offsetTrail.offsetParent;
				}
				if (navigator.userAgent.indexOf("Mac") != -1 && typeof document.body.leftMargin != "undefined") 
					offsetLeft += document.body.TopMargin;
			    return offsetTop;
			}


			function getObjectFromID(id){
				var theObject;
				if(document.getElementById)
					theObject=document.getElementById(id);
				else
					theObject=document.all[id];
				return theObject;
			}

		
			function loadXMLDoc(url,readyStateFunction,async) 
			{
				// branch for native XMLHttpRequest object
				if (window.XMLHttpRequest) {
					req = new XMLHttpRequest();
					req.onreadystatechange = readyStateFunction;
					req.open("GET", url, async);
					req.send(null);
				// branch for IE/Windows ActiveX version
				} else if (window.ActiveXObject) {
					req = new ActiveXObject("Microsoft.XMLHTTP");
					if (req) {
						if(readyStateFunction) req.onreadystatechange = readyStateFunction;
						req.open("GET", url, async);
						req.send();
					}
				}
			}

autofill=new Array();