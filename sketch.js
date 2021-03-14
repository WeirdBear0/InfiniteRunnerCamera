var PLAY = 1;
var END = 0;
var gameState = PLAY;

var runner, running, runner_collided, runner_walk;
var ground, invisibleGround, groundImage;
var backgroundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
 running =   loadAnimation("images/walk1.png","images/walk2.png","images/walk3.png");
 runner_collided = loadAnimation("images/jump.png");
 
  
  groundImage = loadImage("images/ground.png");
  backgroundImage = loadImage("images/day.jpg");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/pipe.png");
  obstacle2 = loadImage("images/stopsign.png");
  obstacle3 = loadImage("images/hydrant.png");

  gameOverImg = loadImage("images/gameOverText.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(displayWidth - 20, displayHeight-120);
  
  
  runner = createSprite(100,180,20,50);
  
  runner.addAnimation("running", running);

  runner.addAnimation("collided", runner_collided);
  runner.scale = 0.55;
  
  ground = createSprite(200,180,700,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(150,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(150,140);
  restart.addImage(restartImg);
  
  

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  textSize(18);

  textFont("Georgia");
  textStyle(BOLD);
  fill("white");
  score = 0;
}

function draw() {
  
  camera.x = runner.x;
  camera.y = runner.y;

  gameOver.position.x = restart.position.x = camera.x

  background(backgroundImage);
  
  textAlign(RIGHT, TOP);
  text("Score: "+ score, 600,-50);
 
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    

    if(keyDown("space") && runner.y >= 109) {
      runner.velocityY = -12;
    }
   
    
    runner.velocityY = runner.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/3;
    }
  
    runner.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(runner)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    runner.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the mario animation
  
    runner.changeAnimation("collided",runner_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }


  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,270,40,10);
    cloud.y = Math.round(random(50,0));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = runner.depth;
    runner.depth = runner.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+width/2,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  runner.changeAnimation("running",running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
