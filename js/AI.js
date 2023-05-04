class AI{

  constructor(){
	  this.pickInitial(null);
  }
  battling (){	  
		
	  for (let id of game.onBattlefield.enemies){
		  game.move(id, 'enemies');
	  }
	  for (let id of game.onBattlefield.units){
		  game.move(id, 'units');
	  }	  
	  if ((game.onBattlefield.units.length == 0 || game.onBattlefield.enemies.length == 0) 
		|| (game.matchDown.enemies > 0 && game.matchDown.units > 0 && game.onBattlefield.enemies.length != game.onBattlefield.units.length)){
		clearInterval(game.automation);
		game.automation = null;
		game.stopBattle();
	}
	  ui.refresh();
	  
  }
  pickInitial(num){
	  let numOnField = randNum(1, 5), onField = [], where = [];
		if (num != null){
			numOnField = num;
		}
	  for (let i = 0; i < numOnField; i ++){
		  let picking = true;
		  while(picking){
			 let potential = randNum(0, game.enemies.length - 1), randWhere = randNum(0, 4);
			 if (!onField.includes(potential) && !where.includes(randWhere) ){
				 onField.push(potential);
				 where.push(randWhere);
				 picking = false;
				 
			 }
		  }
	  }
	  for (let i in onField){
		game.battlefield[where[i]][0] = {which: 'enemies', id: onField[i]}
		game.enemies[onField[i]].x = where[i];
		game.enemies[onField[i]].y = 0;
		
		game.onBattlefield.enemies.push(onField[i]);
	  }
	  
  }

	
}
