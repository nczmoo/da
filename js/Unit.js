class Unit{
	critical = false;
	dead = false;
	name = null;
  health = 100;
  morale = 100;
  combat = null;
  race = null;
  traits = [];
  x = null;
  y = null;
  constructor(min, max){
	this.combat = randNum(min, max);
	this.race = this.genRandRace();
	this.name = this.genRandName();
	
  }
  
  
  genRandRace(){
	  let races = ['black', 'white', 'asian', 'hispanic'];
	  return races[randNum(0, 3)];
  }
  
  genRandName(){
	  let first = ['John', 'Gary', 'Glenn', 'Paul', 'Tyson', 'Jacob', 'Andy', 'Robert', 'Cheech'];
	  let surname = ['Hall', 'Smith', 'Garcia', 'Gomez', 'Garrison', 'Anderson', 'Black', 'White'];
	  return first[randNum(0, first.length -1)] + " " + surname[randNum(0, surname.length - 1)];
  }
}
