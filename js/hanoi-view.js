function View (game, $el) {
  this.game = game;
  this.$el = $el;
  this.towerSetup();
  this.clickTower();
  this.bindHoverClick();
  this.startIndex = undefined;
  this.endIndex = undefined;
}

View.prototype.towerSetup = function(){
  for (var i = 0; i < 3; i++) {
    let $ul = $("<ul></ul>");
    $ul.addClass("tower tower"+i);
    $ul.data("id", i);
    this.$el.append($ul);
  }
  for (var j = 0; j < 3; j++) {
    let $li = $("<li></li>");
    $li.addClass("disc disc" + (3-j));
    $li.css({
      "width": `${ (3 - j) * 50}`,
      "height": "50px",
      "background-color": "gray",
      "border-radius": "25px"
    });
    $(".tower0").append($li);
  }

};

View.prototype.clickTower = function(){

  $(".tower").on("click", (event) => {
    if (this.startIndex === undefined){
      this.startIndex = $(event.currentTarget).data("id");
      let $tower = $(event.currentTarget);
      $tower.css("border-color", "red");
      $tower.off("mouseenter");
      $tower.off("mouseleave");
    } else {
        this.endIndex = $(event.currentTarget).data("id");
        if (this.game.isValidMove(this.startIndex, this.endIndex)){
         this.game.move(this.startIndex, this.endIndex);
         this.renderMove(this.startIndex, this.endIndex);
        } else {
         alert("invalid move!");
        }
        this.startIndex = undefined;
        this.endIndex = undefined;
        this.bindHoverClick();
        $(".tower").css("border-color", "black");
        if (this.game.isWon()) {
          alert("You win!");
        }
    }
  });
};

View.prototype.renderMove = function (startIndex, endIndex) {
  console.log(`startIndex: ` + startIndex);
  console.log("endIndex:" + endIndex);
  let $startTower = $(".tower" + startIndex);
  let $endTower = $(".tower" + endIndex);
  let $disc = $startTower.children().last();
  $startTower.children().last().remove();
  $endTower.append($disc);
};

View.prototype.bindHoverClick = function () {
  $(".tower").on("mouseenter", (event) => {
    let $tower = $(event.currentTarget);
    $tower.css("border-color", "blue");
  }).on("mouseleave", (event) => {
    let $tower = $(event.currentTarget);
    $tower.css("border-color", "black");
  });
};

module.exports = View;
