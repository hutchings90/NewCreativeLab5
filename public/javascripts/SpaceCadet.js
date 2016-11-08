const RATIO = 0.0003;
var mainHeight, mainWidth, gameArea, mainMenuMusic, gameMusic, laserSound, celestials, lasers, enemies, ship, powerUp, points, mainMenu, gameOverMenu, playerName, animationTimer, gameOver;

window.onload = function(){
    gameArea = mainHeight * mainWidth;
    mainMenuMusic = document.getElementById('main-menu-music');
    gameMusic = document.getElementById('game-music');
    laserSound = document.getElementById('laser-sound');
    celestials = document.getElementById('celestials');
    lasers = document.getElementById('lasers');
    enemies = document.getElementById('enemies');
    ship = document.getElementById('ship');
    ship.left = 10;
    ship.speed = 5;
    ship.vertical = "";
    ship.horizontal = "";
    ship.fire = -1;
    ship.laserNumber = 0;
    gameOver = false;
    powerUp = document.getElementById('power-up');
    points = document.getElementById('points');
    mainMenu = document.getElementById('main-menu');
    gameOverMenu = document.getElementById('game-over');
    playerName = document.getElementById('player-name');
    document.getElementById('start-button').onclick = function(ev){
        ev.preventDefault();
        start();
    }
    document.getElementById('restart-button').onclick = function(ev){
        ev.preventDefault();
        showMainMenu();
    }
    setPositions();
    animationTimer = setInterval(animate, 30);
}

window.onresize = setPositions;

function setPositions(){
    var prevHeight;
    prevHeight = mainHeight;
    clearInterval(animationTimer);
    mainHeight = window.innerHeight;
    mainWidth = window.innerWidth;
    gameArea = mainHeight * mainWidth;
    removeCelestials();
    makeCelestials();
    positionShip(prevHeight);
    animationTimer = setInterval(animate, 30);
}

function showMainMenu(){
    gameMusic.pause();
    mainMenuMusic.currentTime = 0;
    mainMenuMusic.play();
    playerName.value = "";
    mainMenu.style.display = "inline-block";
    gameOverMenu.style.display = "none";
    points.style.display = "none";
}

function start(){
    if(playerName.value == ""){
        playerName.style.borderColor = "red";
        playerName.className = "alert";
        return;
    }
    playerName.style.borderColor = "white";
    playerName.className = "";
    mainMenuMusic.pause();
    gameMusic.currentTime = 0;
    gameMusic.play();
    mainMenu.style.display = "none";
    points.style.display = "block";
//    setTimeout(end, 5000);
    document.onkeydown = keydownHandler;
    document.onkeyup = keyupHandler;
}

function end(){
    gameOver = true;
    gameOverMenu.style.display = "inline-block";
}

function animate(){
    animateCelestials(celestials.childNodes);
    animateEnemies(enemies.childNodes);
    animateLasers();
    animateShip();
}

function animateCelestials(array){
    for(var i = 0, length = array.length; i < length; i++){
        var element = array[i];
        element.left -= element.speed;
        if(element.left < element.dimensions){
            element.left += mainWidth - element.dimensions - 2;
            element.style.top = Math.floor(Math.random() * (mainHeight - element.dimensions)).toString() + "px";
        }
        element.style.left = element.left.toString() + "px";
    }
}

function animateEnemies(){
    
}

function animateLasers(){
    var laserArray = lasers.childNodes;
    for(var i = 0, length = laserArray.length; i < length; i++){
        var laser = laserArray[i];
        if(laser.left + (laser.direction * 8) >= mainWidth - laser.width){
            lasers.removeChild(laser);
        }
        else{
            laser.left += laser.direction * 8;
            if(laser.direction == 1){
                points += isEnemy(laser);
            }
            else{
                lives -= isShip(laser);
            }
            laser.style.left = laser.left + "px";
        }
    }
}

function isEnemy(laser){
    var enemyArray = enemies.childNodes;
    for(var i = 0, length = enemyArray.length; i < length; i++){
        var enemy = enemyArray[i];
        if(laser.top - enemy.top < enemy.height || enemy.top - laser.top < laser.height){
            if(laser.left - enemy.left < enemy.width || enemy.left - laser.left < laser.width){
                enemies.removeChild(enemy);
                return enemy.points;
            }
        }
    }
    return 0;
}

function isShip(){
    
}

function animateShip(){
    if(ship.horizontal == "left"){
        if(ship.left > ship.speed) ship.left -= ship.speed;
        else ship.left = 0;
        ship.style.left = ship.left + "px";
    }
    else if(ship.horizontal == "right"){
        if(ship.left < mainWidth / 5) ship.left += ship.speed;
        else ship.left = (mainWidth / 5);
        ship.style.left = ship.left + "px";
    }
    if(ship.vertical == "up"){
        if(ship.top > ship.speed) ship.top -= ship.speed;
        else ship.top = 0;
        ship.style.top = ship.top + "px";
    }
    else if(ship.vertical == "down"){
        if(ship.top < mainHeight - ship.height - ship.speed) ship.top += ship.speed;
        else ship.top = mainHeight - ship.height;
        ship.style.top = ship.top + "px";
    }
}

function keydownHandler(ev){
    if(gameOver) return;
    switch(ev.keyCode){
    case 32:
        if(ship.fire == -1){
            fire(ship, new Date().getTime(), 1);
            ship.fire = setInterval(function(){
                fire(ship, new Date().getTime(), 1);
            }, 250);
        }
        break;
    case 37: ship.horizontal = "left"; break;
    case 38: ship.vertical = "up"; break;
    case 39: ship.horizontal = "right"; break;
    case 40: ship.vertical = "down"; break;
    default: return;
    }
    ev.preventDefault();
}

function keyupHandler(ev){
    if(gameOver) return;
    switch(ev.keyCode){
    case 32:
        clearInterval(ship.fire);
        ship.fire = -1;
        break;
    case 37: if(ship.horizontal != "right") ship.horizontal = ""; break;
    case 38: if(ship.vertical != "down") ship.vertical = ""; break;
    case 39: if(ship.horizontal != "left") ship.horizontal = ""; break;
    case 40: if(ship.vertical != "up") ship.vertical = ""; break;
    default: return;
    }
    ev.preventDefault();
}

function fire(shooter, time, direction){
    if(lasers.childNodes.length < 5){
        new Audio("sounds/laser.mp3").play();
        lasers.appendChild(makeLaser(shooter, direction));
    }
}

function makeLaser(shooter, direction){
    var element = document.createElement("img");
    element.className = "game-object";
    element.src = "images/laser" + shooter.laserNumber + ".png";
    element.direction = direction;
    element.top = shooter.top + ((shooter.height - element.height) / 2);
    element.left = shooter.left + shooter.width;
    element.style.top = element.top + "px";
    element.style.left = element.left + "px";
    return element;
}

function positionShip(prevHeight){
    if(prevHeight){
        var newTop = (ship.top / prevHeight) * mainHeight;
        if(newTop > mainHeight - ship.height) ship.top = mainHeight - ship.height;
        else ship.top = newTop;
    }
    else{
        ship.top = (mainHeight - ship.height) / 2;
    }
    if(ship.left > mainWidth / 5) ship.left = mainWidth / 5;
    ship.style.top = ship.top + "px";
    ship.style.left = ship.left + "px";
}

function removeCelestials(){
    while(celestials.lastChild) celestials.removeChild(celestials.lastChild);
}

function makeCelestials(){
    for(var i = 0, length = RATIO * gameArea; i < length; i++){
        celestials.appendChild(makeCelestial());
    }
}

function makeCelestial(){
    var color;
    var dimensions = Math.floor((Math.random() * 3) + 1);
    var value = Math.floor(Math.random() * 6);
    var top = Math.floor(Math.random() * (mainHeight - dimensions));
    var left = Math.floor(Math.random() * (mainWidth - dimensions));
    var element = document.createElement("div");
    element.style.width = dimensions + "px";
    element.style.height = dimensions + "px";
    element.style.top = top.toString() + "px";
    element.style.left = left.toString() + "px";
    element.left = left;
    switch(value){
    case 0:
    case 1: color = "red"; break;
    case 2:
    case 3: color = "blue"; break;
    default: color = "white"; break;
    }
    element.dimensions = dimensions;
    element.speed = Math.floor((Math.random() * 5)  + 1);
    element.style.backgroundColor = color;
    element.style.zIndex = element.speed - 6;
    element.className = "game-object";
    return element;
}
