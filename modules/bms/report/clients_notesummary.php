<?PHP
	require("../../../include/session.php");
	//turn debug borders on to troubleshoot PDF creation (1 or 0)
	$border_debug=0;
	
	require("../../../fpdf/fpdf.php");
	
	if($_SESSION["printing"]["sortorder"])
		$sortorder=$_SESSION["printing"]["sortorder"];
	else
		$sortorder=" ORDER BY concat(clients.lastname,clients.firstname,clients.company)";

	//Generate the Query
	$querystatement="SELECT if(clients.lastname!=\"\",concat(clients.lastname,\", \",clients.firstname,if(clients.company!=\"\",concat(\" (\",clients.company,\")\"),\"\")),clients.company) as thename,clients.id 
						FROM clients ".$_SESSION["printing"]["whereclause"].$sortorder;
	$clientquery=mysql_query($querystatement,$dblink);
	if(!$clientquery) reportError(100,"Client Query Could not be executed");
	
	//===================================================================================================
	// Generating PDF File.
	//===================================================================================================
	
	$leftmargin=.5;
	$rightmargin=.5;
	$topmargin=.75;
	$paperwidth=8.5;
	$paperlength=11;
	
	//define the documents and margins
	$pdf=new FPDF("P","in","Letter");
	$pdf->SetMargins($leftmargin,$topmargin,$rightmargin);
	$pdf->Open();
	
	$pdf->AddPage();
	
	$tempwidth=$paperwidth-$leftmargin-$rightmargin;
	$tempheight=.25;
	$pdf->SetXY($leftmargin,$topmargin);
	
	//Report Title
	$pdf->SetFont("Arial","B",16);
	$pdf->Cell($tempwidth,.25,"Clients Notes Summary",$border_debug,1,"L");
	$pdf->SetFont("Arial","",12);
	$pdf->Cell($tempwidth,.18,"Date Created: ".date("m/d/Y"),$border_debug,1,"L");
	$pdf->SetLineWidth(.04);
	$pdf->Line($leftmargin,$pdf->GetY(),$paperwidth-$rightmargin,$pdf->GetY());
	
	$pdf->SetY($topmargin+.43+.1);
	
	while($clientrecord=mysql_fetch_array($clientquery)) {
		$querystatement="SELECT invoices.id FROM invoices INNER JOIN clients ON invoices.clientid=clients.id WHERE clients.id=".$clientrecord["id"];
		$invoicequery=mysql_query($querystatement,$dblink);
		if(!$invoicequery) reportError(100,"Invoice query could not be executed");
		
		$notewhereclause="( notes.attachedtabledefid=2 AND notes.attachedid=".$clientrecord["id"].")"; 
		if(mysql_num_rows($invoicequery)){
			$notewhereclause.="OR (notes.attachedtabledefid=3 AND (";
			while($invoicerecord=mysql_fetch_array($invoicequery))
				$notewhereclause.="notes.attachedid=".$invoicerecord["id"]." OR ";
			$notewhereclause=substr($notewhereclause,0,strlen($notewhereclause)-4)."))";
		}			
		$pdf->SetLineWidth(.01);		
		$pdf->SetFont("Arial","B",12);
		$pdf->Cell($tempwidth,.18,$clientrecord["thename"],$border_debug,1,"L");
		$pdf->SetLineWidth(.02);		
		$pdf->Line($leftmargin,$pdf->GetY(),$paperwidth-$rightmargin,$pdf->GetY());

		$pdf->SetY($pdf->GetY()+.05);		
		$pdf->SetLineWidth(.01);		

		$querystatement="SELECT users.firstname, users.lastname, notes.id, date_Format(notes.creationdate,\"%c/%e/%Y %T\") as thecreationdate,
							date_Format(notes.modifieddate,\"%c/%e/%Y %T\") as themodifieddate, users2.firstname as mfirstname ,users2.lastname as mlastname,
							notes.attachedtabledefid,notes.attachedid , notes.subject, notes.content 
							FROM (notes INNER JOIN users on notes.createdby=users.id) LEFT JOIN users as users2 on notes.modifiedby=users2.id
							WHERE ".$notewhereclause." ORDER BY  notes.modifieddate DESC";
		$notequery=mysql_query($querystatement,$dblink);
		if(!$notequery) reportError(100,"Note query could not be executed.".$querystatement);
		while($therecord=mysql_fetch_array($notequery)) {
			$pdf->SetFont("Arial","B",10);
			$pdf->SetX($leftmargin+.125,$pdf->GetY()+.04);
			$pdf->Cell($tempwidth-.375,.19,$therecord["subject"],$border_debug,1,"L");

			$pdf->SetFont("Arial","",9);
			$pdf->SetX($leftmargin+.125);
			$pdf->Cell($tempwidth-.375,.17,"ID: ".$therecord["id"],$border_debug,1,"L");
	
			$pdf->SetX($leftmargin+.125);
			$pdf->Cell($tempwidth-.375,.17,"Created: ".$therecord["firstname"]." ".$therecord["lastname"]." ".$therecord["thecreationdate"],$border_debug,1,"L");
			
			$pdf->SetX($leftmargin+.125);
			$pdf->Cell($tempwidth-.375,.17,"Modified: ".$therecord["mfirstname"]." ".$therecord["mlastname"]." ".$therecord["themodifieddate"],$border_debug,1,"L");
			
			if($therecord["attachedtabledefid"]==3)	{
				$pdf->SetX($leftmargin+.125);
				$pdf->Cell($tempwidth-.375,.17,"Attached to Invoice: ".$therecord["attachedid"],$border_debug,1,"L");
			}
	
			$pdf->SetX($leftmargin+.125);
			$pdf->SetFont("Arial","",8);
			$pdf->MultiCell($tempwidth-.375,.14,$therecord["content"],1,1,"L");
			$pdf->SetY($pdf->GetY()+.25);
		}// end fetch_array while loop
	}
	
	if($border_debug==1){
		$pdf->Output();
	}
	else {
		//write the frickin thing! Need to write to a temp file and then you know...
		chdir("../../../report");
		$file=basename(tempnam(getcwd(),'tmp'));
		rename($file,$file.'.pdf');
		$file.='.pdf';
	
		// write to file and then output
		$pdf->Output($file);
		echo "<HTML><SCRIPT>document.location='../../../report/".$file."';</SCRIPT></HTML>";
	}
?>