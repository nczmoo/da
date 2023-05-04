class UI{
	letters = [null, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
	log = [];
  constructor(){
  }
  refresh(){
		this.displayHand();			
	  this.displayBattlefield();
	  this.displayCombatants();
	//$("#hand").removeClass('d-none');

	if(game.automation != null){
		$("#hand").addClass('d-none');

	}
	let html = '';
	for (let win of game.matches){
		if (win){
			html += "&#128077;";
		} else {
			html += "&#128078;"; 
		}
	}
	$("#summary").html(html);;
	$("#go").addClass('d-none');
	if (game.goFirst){
		$("#go").removeClass('d-none');
	}
  }
  
  displayBattlefield(){
	  let html = '';
	  for (let y = 0; y < 11; y++){
		  html += "<div class='y'>";
		  for (let x = 0; x < 6; x ++){
			  let lastClass = '';
			  if (y == 10){
				  lastClass = ' last ';
				  
			  }
			  if (x==0 && y == 0) {
				  html += "<div class='cell label'></div>";
			  } else if (x == 0 && y != 0){
				  html += "<div class='cell label'>" + (y )  + "</div>";
			  }else if (y==0 && x!= 0){
				  html += "<div class='cell label'>" + (this.letters[x] )  + "</div>";
			  } else {
				html += "<div id='board-" + (x-1) + "-" + (y-1) + "'class='cell" 
					+ lastClass + "'>" + this.displayUnit(game.anyoneHere(x-1, y-1)) + "</div>";
			  }
		  }
		  html += "</div>";
	  }
	  $("#battlefield").html(html);
  }
  
  displayCombatants(){	  
	  let html = "<div class='text-center fw-bold fs-3 mt-2'>You</div>", crossedOutClass = '', healthClass = '';
		html += "<div>Dead : "+ game.dead.units.length + " Out: " + game.critical.units.length + "</div>";
	  for (let unitID of game.onBattlefield.units){
			crossedOutClass = '';
		  let unit = game.units[unitID];
			if (unit.critical || unit.dead){
				crossedOutClass = ' text-decoration-line-through ';
			}
			
			if (unit.health >= 75){
				healthClass = ' text-success ';
			} else if (unit.health <= 25){
				healthClass = ' text-danger fw-bold ';
			} else if (unit.health <= 50){
				healthClass = ' text-danger ';
			} else {
				healthClass = ' text-warning ';
			}
		  html += "<div class='" + crossedOutClass + "'><span class='fw-bold'>" + unit.name + "</span> ("
			+ (unit.y + 1) + this.letters[unit.x + 1] + ") H: <span class='" + healthClass + "'>" + unit.health 
			+ "%</span> " + unit.race + "</div>";
	  }
	  html += "<div class='text-center fw-bold fs-3 mt-2'>Enemies</div>";
		html += "<div>Dead : "+ game.dead.enemies.length + " Out: " + game.critical.enemies.length + "</div>";
	  for (let enemyID of game.onBattlefield.enemies){
			crossedOutClass = '';
		  let unit = game.enemies[enemyID];
			if (unit.critical || unit.dead){
				crossedOutClass = ' text-decoration-line-through ';
			}
						if (unit.health >= 75){
				healthClass = ' text-success ';
			} else if (unit.health <= 25){
				healthClass = ' text-danger fw-bold ';
			} else if (unit.health <= 50){
				healthClass = ' text-danger ';
			} else {
				healthClass = ' text-warning ';
			}
		  html += "<div class='" + crossedOutClass + "'><span class='fw-bold'>" + unit.name + " #" + enemyID + "</span> ("
			+ (unit.y + 1) + this.letters[unit.x + 1] + ") H: <span class='" + healthClass + "'>" + unit.health + "%</span> " + unit.race + "</div>";
	  }
	  $("#combatants").html(html);
	  
  }
  
  fetchCard(unit, id, type){
	  //console.log(unit);
	  let html = '';
	  html += "<div id='gang-" + id + "' class='row card p-5 gangCard'>";
		html += "<div class='text-center'>" + unit.name + "</div>";
		html += "<div class='text-center'>" + unit.combat +  " / " + unit.race + "</div>";
		html += "<div class='text-center'><span class='float-left'>H: " + unit.health + "/100</span>";
		html += "<span class='float-right ms-3'>M: " + unit.morale + "/100</span></div>";
		
		html += "</div>"
		html += "<div class='text-center mb-3'><button id='discard-" + id 
			+ "' class='btn btn-danger btn-lg discard'>discard</button></div>";
		return html;
  }
  displayGang(){
	let html = "";

	for (let i in game.units){
		html += this.fetchCard(game.units[i]);
	
	}
	$("#gangDisplay").html(html);  
  }
  
  displayHand(){
	  let html = "<div class='mt-5 mb-5'><button id='discardAll' class='btn btn-lg form-control btn-danger'>discard all</button></div>";
	  for (let i in game.hand){
		  html += this.fetchCard(game.units[game.hand[i]], game.hand[i], 'battlefield');		  
	  }
	  $("#hand").html(html);
  }
  
  displayRecruits(){
	  let html = "";
	  for (let i in game.recruits){
		html += "<div class='row card p-5'>";
		html += "<div class='text-center'>" + game.recruits[i].name + "</div>";
		html += "<div class='text-center fw-bold'>" 
			+ game.recruits[i].combat +  " / " + game.recruits[i].race 
			
			+ " (" + game.fetchNumOfRace(game.recruits[i].race) + ")</div>";
		html += "<div class='text-center'><span class='float-left'>H: " + game.recruits[i].health + "/100</span>";
		html += "<span class='float-right ms-3'>M: " + game.recruits[i].morale + "/100</span></div>";
		html += "<div><button id='recruit-" + i +"' class='recruit btn btn-success btn-lg form-control'>recruit</button></div>";
		html += "</div>";	
	
	}
	 $("#recruitDisplay").html(html);  
  }
  
  displayUnit(unit){
		if (unit != null){
			let enemyClass = '';
			if (unit.enemy){
				enemyClass = 'text-danger';
			}
			return "<span class='" + enemyClass + "'>" + unit.combat + "</span>";
			
		}
		return "";
		
  }
  
  status(msg){
	this.log.unshift(msg);
	let html = "";
	for (let i of this.log){
		html += "<div>" + i + "</div>";
	}
	  $("#log").html(html);
  }
}
