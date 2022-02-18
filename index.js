'use strict';
import {createDom , getDom , getlevel} from "./dom.js";

//variables
const boardRow=20;
const boardCol=10;
const emptySQ= "black";
const SQsize=20;
let board=[];
let startPoint= Date.now();
let GameOver= false;
var animation;
let score=0;


//canvas
const cnvs= document.getElementById('cnvs');
const ctx = cnvs.getContext('2d');
cnvs.style="border:2px solid #000000;"
 
//FUNKTIONS
/*-----------------Board Construction-----------------------*/
const drawSQ=(x,y,clr)=>{
    ctx.fillStyle=clr;
    //ctx.fillRect(x*20,y*20,20,20);
    ctx.fillRect(x*SQsize , y*SQsize , SQsize , SQsize);
    ctx.strokeStyle="white";
    ctx.strokeRect(x*SQsize , y*SQsize , SQsize , SQsize);
}

//create Board
 for(let r=0; r < boardRow ; r++){
    board[r]= [];
    for(let c=0; c < boardCol; c++){
        board[r][c]= emptySQ;
    }
}  
//Draw Board
const drawBoard=()=>{
    for(let r=0; r < boardRow ; r++){
        for(let c=0; c < boardCol; c++){
           drawSQ(c,r,board[r][c]);
        }
    }  
}
drawBoard(); 
//Piece construction
function Piece (shape,clr){
    this.shape=shape;
    this.clr=clr;
    this.shapeNo =0;
    this.activeShape= this.shape[this.shapeNo];
    this.x =3;
    this.y=-2;

}
/**********PIECE*****************/
//piece default colors
const pieceConstruction=[
    [I,"cyan"],
    [O,"yellow"],
    [T,"purple"],
    [J,"blue"],
    [L,"orange"],
    [S,"green"],
    [Z,"red"]
];



//draw piece
Piece.prototype.draw= function(){
    for(let r=0; r < this.activeShape.length ; r++){
        for(let c=0; c < this.activeShape.length; c++){
            if(this.activeShape[r][c]){
                drawSQ(this.x + c, this.y + r , this.clr);
            }
        }
    }  
}
//p.draw();

//put away piece
Piece.prototype.undraw= function(){
    for(let r=0; r < this.activeShape.length ; r++){
        for(let c=0; c < this.activeShape.length; c++){
            if(this.activeShape[r][c]){
                drawSQ(this.x + c, this.y + r , emptySQ);
            }
        }
    }  
}

//------------Random Shapes-----------------//

const randomShapes= ()=>{
    let randomNo= Math.floor(Math.random() * pieceConstruction.length);
    return new Piece (pieceConstruction[randomNo][0],pieceConstruction[randomNo][1]);
}
//let p = new Piece (pieceConstruction[0][0],pieceConstruction[0][1]);
let p = randomShapes();


//drop down Func automaticly(update)
const autoDrop =()=>{
     
    let jetzt= Date.now();
    let diff = jetzt - startPoint;
    if(diff > 1000){
        p.moveDown();
        startPoint=Date.now();
    } 
        
    /*  if(getlevel().innerHTML==1)
    {
        if(diff > 1000){
        p.moveDown();
        startPoint=Date.now();
    }
        
    }
    else if(getlevel().innerHTML==2)
    {
        if(diff > 700){
        p.moveDown();
        startPoint=Date.now();
    }
        
    }  */
   
    if(!GameOver ){
    animation=  requestAnimationFrame(autoDrop);
    } 
   
    else if(GameOver){
    gameOverFunc("Game Over");
    cancelAnimationFrame(animation);
    } 
    
   
}
autoDrop();
//--------------Movements---------------------

//move down
Piece.prototype.moveDown = function(){
    if(! this.collision(0,1,this.activeShape)){
        this.undraw();
        this.y++;
        this.draw();
    }
    else{
        this.restOnFloor();
        p =randomShapes();
    }
   
    }

//move right
Piece.prototype.moveRight = function(){
    if(! this.collision(1,0,this.activeShape)){
    this.undraw();
    this.x++;
    this.draw();
    }
}
//move left
Piece.prototype.moveLeft = function(){
    if(! this.collision(-1,0,this.activeShape)){
    this.undraw();
    this.x--;
    this.draw();
    }
}
//Rotations
Piece.prototype.rotatePiece = function(){
    let nextShape= this.shape[(this.shapeNo +1)% this.shape.length];//I[0+1]%4=1
    let forceRotate = 0;
    if( this.collision(0,0,nextShape)){
        if(this.x > boardCol/2){
            //right
            forceRotate = -1;
        }
        else{
            //left
            forceRotate = 1;
        }
    }
    if(!this.collision(forceRotate,0,nextShape)){
    this.undraw();
    this.x += forceRotate;
    this.shapeNo=(this.shapeNo +1)% this.shape.length;
    this.activeShape = this.shape[this.shapeNo];//update
    this.draw();
    }
}
 //piece rest on the floor
 Piece.prototype.restOnFloor = function (){
    for(let r=0; r < this.activeShape.length ; r++){
        for(let c=0; c < this.activeShape.length; c++){
            if(!this.activeShape[r][c]){
               continue;
            }
            //console.log("y on reset:"+this.y+ " r:"+r);
            if(this.y + r < 0){
                gameOverFunc("Game Over");
                //alert('Game Over'); 
                GameOver=true;
               // console.log("gameover restonfloor: "+GameOver);
                document.removeEventListener("keydown",keyDownHandler);
                break;
            }
           board[this.y+r][this.x+c]=this.clr;
        }
    }  
    /*********array of combo************ */
    let combo =[];
    for(let arr=0; arr < 20 ; arr++){
        combo[arr]=false;

    }
    //full row removal
    for(let row=0; row < boardRow ; row++)
    {

        let fullRow = true;
        for(let col=0; col < boardCol ; col++)
        {
            fullRow = fullRow && (board[row][col]!= emptySQ);
         }
         combo[row]=fullRow;
        if( fullRow)
        {
            for (let i= row; i > 1; i--)
            {
                for(let j=0; j < boardCol ; j++)
                {
                    board[i][j]= board[i-1][j];
                }
            } 
            //above row[0]
            for(let j=0; j < boardCol ; j++)
            {
                board[0][j]= emptySQ;
            }

        }
    }
    let result= combo.filter((el)=>{
        return el==true;
    });
    //console.log(result);
    
    if(result.length==4){
        console.log("combo");
        score += 1200;

    }
    else if(result.length==3){
        console.log("3 rows");
        score += 300;

    }
    else if(result.length==2){
        console.log("2 rows");
        score += 100;

    }
    else if(result.length==1){
        console.log("1 row");
        score += 40;

    } 
   // console.log(combo);
    drawBoard();
        
    //console.log(score);
    getDom().innerHTML=score;

    if(score >= 1200){
    getlevel().innerHTML=2;
    }
     
}

/**********CONTROLS*********************/


const keyDownHandler=(event)=>{
   
    const key = event.key;
    switch (event.key) {
        case "ArrowLeft":
            p.moveLeft();
            startPoint=Date.now();
            break;

        case "ArrowRight":
            p.moveRight();
            startPoint=Date.now();
            break;
        
        case "ArrowDown":
            p.moveDown();
            startPoint=Date.now();
            break;

        case 'ArrowUp':
            p.rotatePiece();
            startPoint=Date.now();
            break;
    }
    }



document.addEventListener("keydown",keyDownHandler);

/*-----------Detecting Collision-------*/
Piece.prototype.collision= function(x,y,shape){
    for(let r=0; r < shape.length ; r++){
        for(let c=0; c < shape.length; c++){
            if(!shape[r][c]){
             continue;
            }
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if(newX < 0 || newX >= boardCol || newY >= boardRow){
                return true;
            } 
           
            if (newY < 0 )
            {
               
                continue; 
            }
           
            if( board[newY][newX] != emptySQ){
                return true;
            }
        }
    }  
    return false;
} 

/*********Game Over*************/
const gameOverFunc =(text)=>{
   
    /* ctx.save(); */
    ctx.fillStyle = "rgba(255,255,255, 0.8)";
    /* ctx.restore(); */
    ctx.font = "30px Black Ops One ";    
    ctx.textAlign = "center";
    ctx.fillRect(0,0,cnvs.width,cnvs.height);
    ctx.fillStyle = '#000';
    ctx.fillText(text, cnvs.width/2,cnvs.height/2);
    const myRestart=setTimeout(resetfunc, 5000);
    
}


/*********comboFunc****** */
/* const comboFunc=()=>{
    ctx.fillStyle = "rgba(255,255,255, 0.8)";
    ctx.font = "30px Black Ops One ";    
    ctx.textAlign = "center";
    ctx.fillRect(0,0,cnvs.width,cnvs.height);
    ctx.fillStyle = '#000';
    ctx.fillText("Combo", cnvs.width/2,cnvs.height/2); 
} */

/*******Restart btn***********/
export const resetfunc=()=>{
    score=0;
    level=1;
    GameOver=false;
    
    for(let r=0; r < boardRow ; r++){
        board[r]= [];
        for(let c=0; c < boardCol; c++){
            board[r][c]= emptySQ;
        }
    }   
    drawBoard();
    console.log("reset");
    getDom().innerHTML=score;
    getlevel().innerHTML=level;
    // console.log("gameover on resetfunc: "+GameOver);
    autoDrop();
    document.addEventListener("keydown",keyDownHandler);
    
}
/*******pause*********/

const pauseGame=()=>{
    ctx.save();
    cancelAnimationFrame(animation);
    document.removeEventListener('keydown',keyDownHandler  );
    
    ctx.fillStyle = "rgba(0,0,0, 0.5)";
    ctx.fillRect(0,0,cnvs.width,cnvs.height);
    ctx.restore();
    ctx.font = "30px Black Ops One";    
    ctx.textAlign = "center";
    ctx.fillText("Paused", cnvs.width/2,cnvs.height/2);  
}
const resumeGame=()=>{
    ctx.clearRect(0,0,cnvs.width,cnvs.height); 
    drawBoard(); 
    autoDrop();
    document.addEventListener('keydown',  keyDownHandler);
   
}
let container=document.querySelector('#container');
let pausebtn= document.createElement('button');
pausebtn.id="pauseId";
pausebtn.innerHTML="pause";
container.prepend(pausebtn);
pausebtn.addEventListener("click",pauseGame);
let resumebtn= document.createElement('button');
resumebtn.id="resumeId";
resumebtn.innerHTML="resume";
container.prepend(resumebtn);
resumebtn.addEventListener("click",resumeGame);