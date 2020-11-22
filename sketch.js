//Create variables here
var dog;
var happyDog;
var database;
var foodS;
var foodStock = 30;
var dogImg;
var feed;
var addFood;
var fedTime;
var lastFed;
var FoodObj;
var changeState;
var readState;
var bedroom, garden, washroom;
var sadDog;
var gameState;



function preload()
{
  //load images here
  dogImg = loadImage("Dog.png");
  happyDog = loadImage("happydog.png");
  bedroom = loadImage("Bed Room.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Wash Room.png");
  sadDog = loadImage("deadDog.png");
}

function setup() {
  database = firebase.database();
	createCanvas(1000, 500);
  dog = createSprite(650,300,10,10);
  dog.addImage(dogImg);
  dog.scale=0.5;

  foodS=database.ref('Food');
  foodS.on("value",readStock);

  FoodObj = new Foods;


  feed=createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
}


function draw() {  
  background(46,139,87);
  
  drawSprites();
 /* //add styles here
  textSize(30);
  fill("black");
  stroke("black");
  text("Food remaining : "+foodS,170,160);
  textSize(13);
 */

 fedTime=database.ref('FeedTime');
 fedTime.on("value",function(data){
   lastFed=data.val();
 });

 fill(255,255,254);
 textSize(15);
 if(lastFed>=12){
   text("Last Fed : "+ lastFed%12 + " PM", 350, 30);
 }else if(lastFed<=0){
   text("Last Fed : 12 AM", 350,30);
 }else{
   text("Last Fed : "+ lastFed + " AM", 350, 30);
 }

 if(gameState!="hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog);
 }

 currentTime=hour();
 if(currentTime==(lastFed+1)){
   update("playing");
   FoodObj.garden();
 }else if(currentTime==(lastFed+2)){
   update("sleeping");
   FoodObj.bedroom();
 }else if(currentTime>(lastFed+2)&&currentTime<(lastFed+4)){
   update("bathing");
   FoodObj.washroom();
 }else{
   update("hungry");
   FoodObj.display();
   }
}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){


  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }


  database.ref('/').update({
    foodS:x
  })

}



function feedDog(){
  dog.addImage(happyDog);

  FoodObj.updateFoodStock(FoodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:FoodObj.getFoodStock(),
    FeedTime:hour()
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    foodS:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}