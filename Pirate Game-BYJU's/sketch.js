const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var mjengine, mjworld;
var backgroundImage;

var canvas;
var tower, towerImage;
var ground;
var cannon;
var score, angle;
var cannonBall, ballsArray;
var boat, boatsArray;

var boatSpriteSheet, boatSpriteData, boatAnimation;
var brokenBoatSpriteSheet, brokenBoatSpriteData, brokenBoatAnimation; 
var waterSplashSpriteSheet, waterSplashSpriteData, waterSplashBoatAnimation; 

function preload() {
  backgroundImage = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

  boatSpriteData = loadJSON("./assets/boat/boat.json");
  boatSpriteSheet = loadImage("./assets/boat/boat.png");
}

function setup() {

  canvas = createCanvas(1200, 600);
  mjengine = Engine.create();
  mjworld = mjengine.world;

  angleMode(DEGREES);

  angle = 15;
  score = 0;

  var options = {
    isStatic: true
  }
  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(mjworld, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(mjworld, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);

  //cannonball = new Cannonball(170, 110);
  ballsArray = [];

  //boat = new Boat (1100,350,130,130);
  boatsArray = [];

  boatAnimation = [];
  var boatFrames = boatSpriteData.frames;
  for (var i = 0; i < boatFrames.length;) {
    var pos = boatFrames [i].position;
    var Img = boatSpriteSheet.get (pos.x, pos.y, pos.w, pos.h); 
    boatAnimation.push(Img) 
  }

  brokenBoatAnimation = [];
  var brokenBoatFrames = brokenBoatSpriteData.frames;
  for (var i = 0; i < brokenBoatFrames.length;) {
    var pos = brokenBoatFrames [i].position;
    var Img = brokenBoatSpriteSheet.get (pos.x, pos.y, pos.w, pos.h); 
    brokenBoatAnimation.push(Img) 
  }

  waterSplashAnimation = [];
  var waterSplashFrames = waterSplashSpriteData.frames;
  for (var i = 0; i < waterSplashFrames.length;) {
    var pos = waterSplashFrames [i].position;
    var Img = waterSplashSpriteSheet.get (pos.x, pos.y, pos.w, pos.h); 
    waterSplashAnimation.push(Img) 
  }
}

function draw() {

  image(backgroundImage, 0, 0, width, height);

  Engine.update(mjengine);

  // display of ground body 
  rect(ground.position.x, ground.position.y, width * 2, 1);

  //display of tower body super-imposed with image
  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  cannon.display();
  //cannonball.display();

  //travelling through the ballArray using a loop to go over each and every item(cannonball) inside it
  for (var index = 0; index < ballsArray.length; index++) {
    //function call to display cannonball item one by one
    //by passing each item based on the index
    showCannonBalls(ballsArray[index]);

    //number of items in array = length of array
    //index = 0 to length-1
    // for ex, number of items in array = length of array = 5, in that case
    //index = 0 to 4

    //ballsArray[0] = first cannonball object
    //ballsArray[1] = second cannonball object
    //ballsArray[2] = third cannonball object
    //ballsArray[3] = fourth cannonball object

    collisionWithBoat(index);
  }
  //boat.display();
  // function call to create and display multiple boats in a series from right to left
  showBoats();
}

//function definition to display cannonball item one by one by passing each item based on the index
function showCannonBalls(ballItem) {
  if (ballItem) {
    ballItem.display();
  }
}


//function definition to be trigerred when a keyboard button is pressed
function keyPressed() {
  //identify specific key being pressed
  if (keyCode === DOWN_ARROW) {
    //create a new cannonball object each time down arrow key is pressed
    cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    //add each cannonball object in the array
    ballsArray.push(cannonBall);
  }
}



//function definition to be trigerred when a keyboard button is released after being pressed

function keyReleased() {
  //identify specific key is released after being pressed
  if (keyCode == DOWN_ARROW) {
    //shoot the current cannonball
    ballsArray[ballsArray.length - 1].shoot();
  }
}


// function defintion to create and display multiple boats in a series from right to left
function showBoats() {
  if (boatsArray.length > 0) {
    if (
      boatsArray[boatsArray.length - 1] === undefined ||
      boatsArray[boatsArray.length - 1].body.position.x < width - 300
    ) {
      var multiplePositions = [-40, -60, -70, -20];
      var randomlySelectedPos = random(multiplePositions);
      boat = new Boat(width, height - 100, 170, 170, randomlySelectedPos, boatAnimation);

      boatsArray.push(boat);
    }

    for (var i = 0; i < boatsArray.length; i++) {
      if (boatsArray[i]) {
        Matter.Body.setVelocity(boatsArray[i].body, {
          x: -0.9,
          y: 0
        });

        boatsArray[i].display();
      }
    }
  } else {
    boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boatsArray.push(boat);
  }
}


function collisionWithBoat(index) {
  for (var i = 0; i < boatsArray.length; i++) {
    if (ballsArray[index] !== undefined && boatsArray[i] !== undefined) {
      var collision = Matter.SAT.collides(ballsArray[index].body, boatsArray[i].body);
      if (collision.collided) {
        boatsArray[i].remove(i);
        Matter.World.remove(mjworld, ballsArray[index].body);
        delete ballsArray[index];
      }
    }
  }
}
//  At the start the length of the boats array will always be 0 so the if condition won’t be
// satisfied and the code will move to else condition creating a new boat.
// When this new boat is created the if condition will become true and the code inside the
// brackets will be executed.
// Now that we have a boat we want to add velocity to that boat.
// So to get the boats from the boats array we’ll use a for loop as later on we’ll be adding
// many boats to the boats array.
// Inside this loop, we’ll use another if condition to check whether there is a boat at that
// index. If there is a boat then using the Matter.Body.setVelocity

//  Inside the first if condition we have another if condition which checks if the last element
// inside the boats array is a boat body and not any undefined body OR the position of the
// boat is lesser than the width-300 , we are using width-300 as we want the next boat to
// appear only when the previous boat has covered a certain distance.
// As there is only one boat in the array, we’ll see only one boat on the screen and we want
// to create the second boat when the first boat covers some distance on the screen so that
// it looks like the second boat is following the first one.
// To do this in the above loop we’ll use another if condition which will check if the boat on
// the screen has crossed 300 distance from the total width of the screen. If the boat has
// crossed the distance then inside that if condition we:-
// ● Declare the positions array and in the array have some values which will be the
// position for the boat to enter the screen.
// ● Declare a position variable and use the random() function on the positions array
// to get a random value from it.
// ● Declare a boat variable and using the boat class create a new boat and pass the
// position that we got earlier
// ● Then finally push the boat in the boats array.
// After this our boat will be created continuously when a boat crosses a width-300 distance


// To avoid any unexpected errors or exceptions we’ll add another condition to check if the
// boat is undefined then also create the boat and push in the boats array so that we have a
// new boat to continue with the game.