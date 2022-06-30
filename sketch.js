var jumpmusic,diemusic,pointmusic;

var gameover,gameoverimg,restart,restartimg;

var obstaclegroup,cloudgroup;

var PLAY=1;

var END=0;

var gamestate=PLAY

var score=0

var obstaculo,obs1,obs2,obs3,obs4,obs5,obs6

var ground,groundimg,groundinvisible;

var trex, trex_img, edges, treximg2;

var nuvem, nuvem_img;

function preload(){
    //carregar as imagens e animações do código

    trex_img = loadAnimation("trex1.png","trex2.png","trex3.png");
    treximg2 = loadAnimation("trex_collided.png");

    groundimg=loadImage ("ground2.png") 
    nuvem_img=loadImage ("cloud.png") 

    obs1=loadImage ("obstacle1.png")
    obs2=loadImage ("obstacle2.png")
    obs3=loadImage ("obstacle3.png")
    obs4=loadImage ("obstacle4.png")
    obs5=loadImage ("obstacle5.png")
    obs6=loadImage ("obstacle6.png")

    gameoverimg=loadImage ("gameOver.png")
    restartimg=loadImage ("restart.png")

    jumpmusic=loadSound("jump.mp3");
    diemusic=loadSound("die.mp3");
    pointmusic=loadSound("checkpoint.mp3");
}

function setup(){
    //criar os componentes

    createCanvas(windowWidth,windowHeight);

    //criar o trex
    trex = createSprite(100,height-70,20,50);

    trex.addAnimation("correndo", trex_img);
    trex.addAnimation("colidindo",treximg2)
    trex.scale = 0.5;
    trex.setCollider("circle",0,0,40)
    //trex.debug="true"

    ground=createSprite(width/2,height-50,width,20);
    ground.addImage(groundimg);

    groundinvisible=createSprite(width/2,height-40,width,10);
    groundinvisible.visible=false;

    obstaclegroup = new Group();
    cloudgroup = new Group();

    gameover=createSprite(width/2,height/2);
    gameover.addImage(gameoverimg);

    restart=createSprite(width/2,height/2+50);
    restart.addImage(restartimg);

  // a mensagem e uma variavel local 
  var mensagem = "isto e uma mesagem";
  console.log(mensagem)
  
   
}

function draw(){
  //crio o jogo em si
  background("white");
  textSize(25);
  text("score:"+score,width-200,50);
  
  console.log("isto é:"+gamestate)

  if (gamestate===PLAY){
    score = score + Math.round(getFrameRate()/60);

    if (score>0 && score%1000===0){
    pointmusic.play();  
    }

    gameover.visible=false
    restart.visible=false
  
    //movimentando o solo em direção ao trex
    ground.velocityX=-(4+3*score/1000);
  
    //reiniciando a posição do solo
   if (ground.x<width/2-200){
    ground.x=ground.width/2;
    }

    //fazer o trex saltar
    if(touches.length > 0 ||  keyDown("space") && trex.y>height-100){
        trex.velocityY = -10;
      jumpmusic.play();  
      touches  = [] ;
    }
    //gravidade
    trex.velocityY = trex.velocityY + 0.5;
    
    //chamar a função
    gerarNuvens();
    gerarobstaculos();

    if (obstaclegroup.isTouching(trex)){
    gamestate = END;
    diemusic.play();
     
    }
 
    } 

    else if (gamestate===END){
     ground.velocityX=0;
     trex.velocityY=0;
     
    trex.changeAnimation("colidindo",treximg2);

    gameover.visible=true
    restart.visible=true
  

    obstaclegroup.setVelocityXEach(0);
    cloudgroup.setVelocityXEach(0);
    obstaclegroup.setLifetimeEach(-1)
    cloudgroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset (); 
     }

     if(touches.length > 0 ||  keyDown("space")) {
      reset();
      touches = [];
     }
   
    }

  
  //trex colide com a parede
  trex.collide(groundinvisible);

   
  drawSprites();
}

function reset () {
gamestate = PLAY;
gameover.visible = false;
restart.visible = false;
obstaclegroup.destroyEach();
cloudgroup.destroyEach();
trex.changeAnimation("correndo",trex_img);
score = 0
}

//função para gerar nuvens

function gerarNuvens(){

if (frameCount%100===0) {
nuvem = createSprite(width,100,40,10); 
nuvem.addImage(nuvem_img)
nuvem.velocityX = -4 
nuvem.y=random(15,height/2-100) 
nuvem.scale=0.8 

nuvem.lifetime = width/2 
//profundidade 
//console.log(trex.depth);
//console.log(nuvem.depth);
trex.depth=nuvem.depth;
trex.depth=trex.depth+1;

cloudgroup.add(nuvem);
 }
}

 function gerarobstaculos(){
if (frameCount % 90 === 0){  
 obstaculo = createSprite(width,height-60,10,40)
 obstaculo.velocityX = -(5+score/1000)  
 
 var sorteio =Math.round(random(1,6));
 switch(sorteio){
 case 1:obstaculo.addImage(obs1);
 break;
 case 2:obstaculo.addImage(obs2);
 break;  
 case 3:obstaculo.addImage(obs3);
 break;
 case 4:obstaculo.addImage(obs4);
 break;
 case 5:obstaculo.addImage(obs5);
 break;
 case 6:obstaculo.addImage(obs6);
 break;
 default:break;
 }
 obstaculo.scale=0.6
 obstaculo.lifetime=width/2

 obstaclegroup.add(obstaculo);
}


 }