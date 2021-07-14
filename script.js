const updateStonx = async () => {
  var time = document.getElementById("time")
  var currentdate = new Date(); 
  var datetime = "Last Sync: " + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  time.innerHTML = datetime;
  var response = await fetch('https://api.torn.com/torn/?selections=stocks&key=35qCGHHOjbVTk196');
  var stonx = await response.json(); //extract JSON from the http response
  stonx = stonx["stocks"];    
  return stonx;
}

async function createTable(stonx) {
	var stonx = await updateStonx();
// iterate and add table rows
  var table = document.getElementById("stonx table");
  for (i in stonx){
  	var row = table.insertRow();
  	row.id = stonx[i]["acronym"];
  	var cell1 = row.insertCell(0);
  	var cell2 = row.insertCell(1);
  	var cell3 = row.insertCell(2);
  	var cell4 = row.insertCell(3);
  	var cell5 = row.insertCell(4);
  	cell4.id = "price";
  	cell1.innerHTML = stonx[i]["stock_id"];
  	cell2.innerHTML = stonx[i]["acronym"];
  	cell3.innerHTML = stonx[i]["name"];
  	cell4.innerHTML = stonx[i]["current_price"];
  	cell5.innerHTML = stonx[i]["current_price"] - 0.01;

  	var loss = document.createElement("INPUT");
  	loss.value = 0;
	loss.setAttribute("type", "number");
	loss.id = "loss"+stonx[i]["stock_id"];
	row.appendChild(loss);

	var gain = document.createElement("INPUT");
	gain.value = 0;
	gain.setAttribute("type", "number");
	gain.id = "gain"+stonx[i]["stock_id"];
	row.appendChild(gain);
  }
  //document.getElementById("stonx list").innerHTML = "New text!";
}

async function updateTable() {
	const sound = document.getElementById("”sound”").checked;
	console.log(sound);
	var stonx = await updateStonx();
	var table = document.getElementById("stonx table");
	for (i in stonx){	
		var acro = stonx[i]["name"] + " (" + stonx[i]["acronym"] + ")";
		var cell = table.rows[stonx[i]["stock_id"]].cells[3];
		var cellLowest = table.rows[stonx[i]["stock_id"]].cells[4];
		var oldPrice = cell.innerHTML;
		var newPrice = stonx[i]["current_price"];
		var cellLowestPrice = cellLowest.innerHTML;

		if (newPrice <= cellLowestPrice) {
			cellLowest.innerHTML = newPrice;
			cellLowest.style.background = 'red';
		}
		else {cellLowest.style.background = 'transparent';}

		if (newPrice < oldPrice) {
			cell.style.background = 'red';
		}
		else if (newPrice > oldPrice) {
			cell.style.background = 'lime';
		}
		//else {cell.style.background = 'transparent'};
		cell.innerHTML = newPrice;
		// alarm
		var loss = document.getElementById("loss"+stonx[i]["stock_id"]);
		var gain = document.getElementById("gain"+stonx[i]["stock_id"]);
		var lossPrice = loss.value;
		var gainPrice = gain.value;
		var lossAlarm = " is below " + lossPrice;
		var gainAlarm = " reached " + gainPrice;
		if (lossPrice > 0 && newPrice < lossPrice){
			loss.value = newPrice - 0.01; 
			loss.style.background = "red";
			if (sound) {lossSound.play()}; 
			alert(acro + lossAlarm)}
			else {
				loss.style.background = "transparent";
			};
		if (gainPrice > 0 && newPrice > gainPrice){
			gain.value = newPrice + 0.01; 
			gain.style.background = "lime";
			if (sound) {cashSound.play()}; 
			alert(acro + gainAlarm)}
			else {
				gain.style.background = "transparent";
			};;
	}

}
const cashSound = new Audio("https://www.myinstants.com/media/sounds/cash-register-sound-fx_HgrEcyp.mp3");
const lossSound = new Audio("https://www.myinstants.com/media/sounds/emergency-meeting.mp3");
createTable();
var interval = setInterval(updateTable, 20000);