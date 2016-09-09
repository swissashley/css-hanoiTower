/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const View = __webpack_require__(1);
	const Game = __webpack_require__(2);

	$( () => {
	  const rootEl = $('.hanoi');
	  const game = new Game();
	  new View(game, rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Game {
	  constructor() {
	    this.towers = [[3, 2, 1], [], []];
	  }

	  isValidMove(startTowerIdx, endTowerIdx) {
	      const startTower = this.towers[startTowerIdx];
	      const endTower = this.towers[endTowerIdx];

	      if (startTower.length === 0) {
	        return false;
	      } else if (endTower.length == 0) {
	        return true;
	      } else {
	        const topStartDisc = startTower[startTower.length - 1];
	        const topEndDisc = endTower[endTower.length - 1];
	        return topStartDisc < topEndDisc;
	      }
	  }

	  isWon() {
	      // move all the discs to the last or second tower
	      return (this.towers[2].length == 3) || (this.towers[1].length == 3);
	  }

	  move(startTowerIdx, endTowerIdx) {
	      if (this.isValidMove(startTowerIdx, endTowerIdx)) {
	        this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());
	        return true;
	      } else {
	        return false;
	      }
	  }

	  print() {
	      console.log(JSON.stringify(this.towers));
	  }

	  promptMove(reader, callback) {
	      this.print();
	      reader.question("Enter a starting tower: ", start => {
	        const startTowerIdx = parseInt(start);
	        reader.question("Enter an ending tower: ", end => {
	          const endTowerIdx = parseInt(end);
	          callback(startTowerIdx, endTowerIdx)
	        });
	      });
	  }

	  run(reader, gameCompletionCallback) {
	      this.promptMove(reader, (startTowerIdx, endTowerIdx) => {
	        if (!this.move(startTowerIdx, endTowerIdx)) {
	          console.log("Invalid move!");
	        }

	        if (!this.isWon()) {
	          // Continue to play!
	          this.run(reader, gameCompletionCallback);
	        } else {
	          this.print();
	          console.log("You win!");
	          gameCompletionCallback();
	        }
	      });
	  }
	}

	module.exports = Game;


/***/ }
/******/ ]);