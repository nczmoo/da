/*
TODO:
match ends when an entire team on field dies OR when both teams have at least one unit incapacitated

*/

class Game{	
	automation = null;
	battlefield = [];
	critical =  {enemies: [], units: [] };
	deck = [];
	dead = { enemies: [], units: [] };
	discard = [];
	enemies = [];
	goFirst = false;
	intervalRate = 100;
	hand = [];
	handSize = 5;
	matchDown = { enemies: 0, units: 0 };
	matches = [];
	movingTo = null;
	onBattlefield = { critical: 0, dead: 0, enemies: [], units: [] };
	recruits = [];
	units = [];		
  constructor(){
	  for (let x = 0; x < 5; x ++){
		  this.battlefield.push([null, null, null, null, null, null, null, null, null, null]);
		  
	  }
    for (let i = 0; i < 10; i++){
		this.enemies.push(new Unit(1,3));
		this.recruits.push(new Unit(1,3));
		this.units.push(new Unit(1,3));
		
	}
	this.shuffle();
	this.draw();
  }
  
	anyoneHere(x, y){
		if (this.battlefield[x][y] != null){
			let isItAnEnemy =  this.battlefield[x][y].which == 'enemies';
			let combat = this[this.battlefield[x][y].which][this.battlefield[x][y].id].combat;
			return {combat: combat, enemy: isItAnEnemy};
		}
		return null;
	}
	attack (enemyID, unitID){
		let dmg = 1;
		let unit = this.units[unitID];
		let unitPower = unit.combat + this.fetchNumOfRaceOnField(unit.race, 'units');
		let enemy = this.enemies[enemyID];
		let enemyPower = enemy.combat + this.fetchNumOfRaceOnField(unit.race, 'enemies');
		let neutral = Math.round((unitPower + enemyPower)/2);

		let hit = randNum(1, unitPower + enemyPower + neutral);
		if (hit == 1 || hit == enemyPower + neutral + unitPower){
			dmg *= 2;
			if (hit == 1){
				this.skillCheck (enemyID, 'enemies');
			} else {
				this.skillCheck(unitID, 'units');
			}
			
		}
		if (hit < enemyPower + 1){
			this.hitThem(unitID, 'units', dmg);
		} else if (hit > enemyPower + neutral){
			this.hitThem(enemyID, 'enemies', dmg);
		} else {
		}
	}
	
	discardCard(id){
		this.discard.push(id);
		this.hand.splice(this.hand.indexOf(id), 1);

		this.shouldWeStartMatch();
	}
	
	draw(){
		for (let i = 0; i < this.handSize; i ++){
			if (this.deck.length == 0){
				this.deck = this.discard;
				this.shuffle();
			}
			this.hand.push(this.deck.pop());
		}
	}
  
	fetchNumOfRace(race){
		let n = 0;
		for (let unit of this.units){
			if (unit.race == race){
				n++;
			}
		}
		return n;
	}

	fetchNumOfRaceOnField(race, team){
		let n = 0;
		for (let id of this.onBattlefield[team]){
			let unit = this[team][id];
			if (unit.race == race){
				n++;
			}
		}
		return n;
	}
	
	hitThem(id, type, dmg){
		let incapacitated = false;
		this[type][id].health -= dmg;
		if (this[type][id].health <= 0){
			this[type][id].dead = true;
			this.dead[type].push(id);
			incapacitated = true;
			for (let i of this.battlefield[type]){
				this[type][i].morale -= randNum(1-5);
			}
			ui.status(this[type][id].name + " of " + type + " team died");
		} else if (this[type][id].health <= 25 && randNum(1, this[type][id].health) == 1){			
			this[type][id].critical = true;
			this[type][id].morale -= 50;			
			this.critical[type].push(id);
			incapacitated = true;
			ui.status(this[type][id].name + " of " + type + " team was critically injured");
		}
		if(incapacitated){
			this.battlefield[this[type][id].x][this[type][id].y] = null;
			this.onBattlefield[type].splice(this.onBattlefield[type].indexOf(id), 1);
			this[type][id].x = null;
			this[type][id].y = null;
			this.matchDown[type]++;
		}
		
	}
	
	isAnyoneLeftOrRight(id, team){
		let opposites = { enemies: 'units', units: 'enemies' };
		let opposite = opposites[team];
		let unit = this[team][id];
		for (let i of this.onBattlefield[opposite]){
			let opposition = this[opposite][i];
			if (unit.y  == opposition.y && unit.x > opposition.x){
				return -1;
			} else if (unit.y  == opposition.y && unit.x < opposition.x){
				return 1;
			}
		}
		return false;
	}

	isAnyoneNearby(id, team){
		let opposites = { enemies: 'units', units: 'enemies' };
		let opposite = opposites[team];
		let unit = this[team][id];
		for (let i of this.onBattlefield[opposite]){
			let opposition = this[opposite][i];
			if (Math.sqrt(Math.pow(unit.y  - opposition.y, 2) + Math.pow(unit.x - opposition.x, 2)) == 1){
				return i;
			} 
		}
		return false;
	}

	move (id, whichTeam){	
		let leftOrRight = this.isAnyoneLeftOrRight(id, whichTeam)

		//BUG: moved sideways through another player
		let nearestEnemy = this.isAnyoneNearby(id, whichTeam);
		
		if (whichTeam == 'enemies'){
			
			if (nearestEnemy !== false){
				game.attack(id, nearestEnemy);
				return;
			} else if (leftOrRight != false){
				game.battlefield[game[whichTeam][id].x][game[whichTeam][id].y] = null;				
				game.enemies[id].x += leftOrRight;
				game.battlefield[game[whichTeam][id].x][game[whichTeam][id].y] = { id: id, which: whichTeam }
				return;
			}
			game.battlefield[game[whichTeam][id].x][game[whichTeam][id].y] = null;
			game.enemies[id].y ++;
			
		} else if (whichTeam == 'units'){
			if (nearestEnemy !== false){
				game.attack(nearestEnemy, id);
				return;
			} else if (leftOrRight != false){
				game.battlefield[game[whichTeam][id].x][game[whichTeam][id].y] = null;				
				game.units[id].x += leftOrRight;
				game.battlefield[game[whichTeam][id].x][game[whichTeam][id].y] = { id: id, which: whichTeam }
			
				return;
			}
			game.battlefield[game[whichTeam][id].x][game[whichTeam][id].y] = null;
			game.units[id].y --
		}
		game.battlefield[game[whichTeam][id].x][game[whichTeam][id].y] = { id: id, which: whichTeam };
	}
	place (x, y){
		this.units[this.movingTo].x = x;
		this.units[this.movingTo].y = y;
		this.battlefield[x][y] = { which: 'units', id: this.movingTo };
		this.onBattlefield.units.push(this.movingTo);
		
		this.hand.splice(this.hand.indexOf(this.movingTo), 1);
		this.movingTo = null;
		this.shouldWeStartMatch();
	}
	shouldWeStartMatch(){
		if (!this.goFirst && this.onBattlefield.units.length >= this.onBattlefield.enemies.length 
			|| (this.goFirst && this.hand.length == 0)){
			this.startBattle();
			return;
		} 
		if(this.hand.length == 0){
			this.draw();
		}
	}
	shuffle(){
		let deck = [], n = 0;
		for (let i = 0; i < this.units.length ; i ++){
			let picking = true;
			while (picking){
				let randUnit = randNum(0, this.units.length - 1);
				if (!deck.includes(randUnit)){
					deck.push(randUnit);
					picking = false;
				}			
			}
		}
		this.deck = deck;
	}
	
	skillCheck(id, type){
		let unit = null;
		unit = this[type][id];
		let didItGoUp = randNum(1, Math.pow(unit.combat * 2, 2)) == 1;
		if (didItGoUp){
			this[type][id].combat++;
			console.log(type + " #" + id + "'s combat went up to " + this[type][id].combat);

		}
	}
	startBattle(){
		if (this.goFirst){
			ai.pickInitial(this.onBattlefield.units.length);
		}
		this.goFirst = !this.goFirst;
		for (let i = 0; i < this.hand.length; i ++){
			this.discard.push(this.hand[i]);
		}
		this.hand = [];
		this.onBattlefield.dead  = this.dead.units.length + this.dead.enemies.length; 
	    this.onBattlefield.critical =  this.critical.units.length + this.critical.enemies.length;
		this.matchDown.enemies = 0;
		this.matchDown.units = 0;
		this.automation = setInterval(ai.battling, this.intervalRate);
	}
	stopBattle(){
		console.log(this.onBattlefield);
		this.matches.push(this.onBattlefield.units.length > this.onBattlefield.enemies.length);
		this.draw();
		if (!this.goFirst){
			ai.pickInitial(null);
		}
	}
}
