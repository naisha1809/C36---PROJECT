//Create variables here
var dog1, happyDog, database, foodS, foodStock,dog,lastFed;
var dog1, happyDog, feed, addFood,database, foodS, foodStock,dog,lastFed;
var bedR,gardenbg,washrbg;
var readState, fedTime;
var foodObj, currentTime;
var gameState,readState;

function preload()
{
  //load images here
  dog = loadImage("dogImg.png");

  happyDog = loadImage("dogImg1.png");

  bedR = loadImage("Bed Room.png");

  washrbg = loadImage("Wash Room.png");

  gardenbg = loadImage("Garden.png");

  sadDog = loadImage("Lazy.png");


}

function setup() {
	createCanvas(500,500);
  
  database = firebase.database();
    
  dog1  = createSprite(250,350,10,10);
  dog1.addImage(dog);
  dog1.scale = 0.3;

  foodObj = new Food();

  feed = createButton("Feed The Dog");
  feed.position(670,95);
  feed.mousePressed(feedDog);

  addfood = createButton("Add Food");
  addfood.position(770,95);
  addfood.mousePressed(addFoods);
  

 foodStock = database.ref('Food');
 foodStock.on("value",readStock);

 
 fedTime = database.ref('FeedTime');
 fedTime.on("value",function(data){
   lastFed = data.val();
 });

 readState = database.ref('gameState');
 readState.on("value",function(data){
   gameState = data.val();
 });
}


function draw() {  
  background("green");

  foodObj.display();

   currentTime = hour();
  if(currentTime === (lastFed+1)){
    update("Playing");
    foodObj.gardenBg();
  }else if(currentTime === (lastFed+2)){
    update("Sleeping");
    foodObj.bedRoom();
  }else if(currentTime> (lastFed+2)&& currentTime <= (lastFed+4)){
    update("Bathing");
    foodObj.washRoom();
  }else{
    update("Hungry");
    foodObj.display();
  }


   if(gameState!="Hungry"){
    feed.hide();
    addfood.hide();
    dog1.remove();
 }else{
    feed.show();
    addfood.show();
    dog1.addImage(sadDog);
  }

   drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}



function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
 })
}

function feedDog(){
  dog1.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
 })
}
function update(state){
  database.ref('/').update({
    gameState:state
 });
}


