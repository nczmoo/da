game = new Game()
ui = new UI()
ai = new AI();

ui.refresh()
function randNum(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}