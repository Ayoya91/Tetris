'use strict';
import {resetfunc} from './index.js';
let controlDom,container,scoreDomCont,rightSide,levelDomCont;
var scoreDom,levelDom,btnDom;

 const createDom=()=>{

    controlDom = document.createElement('div');
    controlDom.id="rightSide";
    controlDom.innerHTML="*Use Arrow keys &#8678; &#8679; &#8680; &#8681;"
    container= document.querySelector('#container');
    container.append(controlDom);

    scoreDomCont = document.createElement('div');
    scoreDomCont.innerHTML=`*Score:`;
    rightSide= document.querySelector('#rightSide');
    rightSide.append(scoreDomCont);
    scoreDom = document.createElement('p');
    scoreDom.id="tetrisScore";
    scoreDom.innerHTML=`0`;
    scoreDomCont.append(scoreDom);
    
    levelDomCont = document.createElement('div');
    levelDomCont.innerHTML=`*level:`;
    rightSide.append(levelDomCont);
    levelDom = document.createElement('p');
    levelDom.id="level";
    levelDom.innerHTML=`1`;
    levelDomCont.append(levelDom);
    
    btnDom = document.createElement('button');
    btnDom.id="restartBtn";
    btnDom.innerHTML="Restart";
    rightSide= document.querySelector('#rightSide');
    rightSide.append(btnDom);
   /*  return scoreDom; */
   
}


const getDom=()=>{
    return scoreDom;
}
const getlevel=()=>{
    return levelDom;
}
const restartGame=()=>{
    /* alert("Game will start in 2sec");
    setTimeout(resetfunc,2000); */
    resetfunc();
    
  
}
const init=()=>{
   createDom();
   btnDom.addEventListener("click",restartGame);
};

document.addEventListener("DOMContentLoaded",init);


export {createDom , getDom , getlevel};