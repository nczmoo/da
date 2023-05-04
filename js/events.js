$(document).on('click', '#recruitAll', function(e){
});
$(document).on('click', '.recruit', function(e){
});

$(document).on('click', '.battleMenu', function(e){
	$(".battleWindow").addClass('d-none');
	$(".battleMenu").prop('disabled', false);
	$("#" + e.target.id.split('-')[1]).prop('disabled', true);
	$("#" + e.target.id.split('-')[1]).removeClass('d-none');
});

$(document).on('click', '#discardAll', function(e){
	for (let i of game.hand){
		game.discardCard(i);
	}
});

$(document).on('click', ".gangCard", function(e){
	$(".gangCard").removeClass('selected');
	$(this ).addClass('selected');
	game.movingTo = Number(e.currentTarget.id.split('-')[1]);
	$(".last:not('occupied')").addClass('movingOption');
	$(".battleWindow").addClass('d-none');
	$("#battlefieldWindow").removeClass('d-none');
});

$(document).on('click', "#go", function(e){
	game.startBattle();

});

$(document).on('click', '.discard', function(e){
	game.discardCard(Number(e.target.id.split('-')[1]));
	ui.refresh();
});
$(document).on('click', '.movingOption', function(e){
	game.place(Number(e.target.id.split('-')[1]), Number(e.target.id.split('-')[2]));
	$(".last").removeClass('movingOption');
	$(".gangCard").removeClass('selected');
	ui.refresh();
});

$(document).on('click', 'button', function(e){
  ui.refresh()
});
