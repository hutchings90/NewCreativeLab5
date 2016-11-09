const RATIO = 0.0003;
const ENEMY_SPEED = 6;
const LASER_SPEED = 20;
const SHIP_SPEED = 8;
var mainHeight, mainWidth, gameArea, mainMenuMusic, gameMusic, laserSound, celestials, lasers, enemies, ship, powerUp, points, mainMenu, gameOverMenu, playerName, animationTimer, enemyTimer, gameOver;

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
    ship.speed = SHIP_SPEED;
    ship.vertical = "";
    ship.horizontal = "";
    ship.fire = -1;
    ship.laserNumber = 0;
    gameOver = true;
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
    document.onkeydown = keydownHandler;
    document.onkeyup = keyupHandler;
    setPositions();
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
    points.innerHTML = 0;
    playerName.style.borderColor = "white";
    playerName.className = "";
    mainMenuMusic.pause();
    gameMusic.currentTime = 0;
    gameMusic.play();
    mainMenu.style.display = "none";
    points.style.display = "block";
    enemyTimer = setTimeout(makeEnemyGroup, Math.random() * 10000 + 5000);
    gameOver = false;
}

function end(){
    gameOver = true;
    clearInterval(enemyTimer);
    clearInterval(ship.fire);
    ship.fire = -1;
    removeEnemies();
    ship.horizontal = "";
    ship.vertical = "";
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
        if(element.left - element.speed < 0){
            element.left += mainWidth - element.dimensions - element.speed;
            element.style.top = Math.floor(Math.random() * (mainHeight - element.dimensions)).toString() + "px";
        }
        else{
            element.left -= element.speed;
        }
        element.style.left = element.left.toString() + "px";
    }
}

function animateEnemies(enemyList){
    for(var i = 0; i < enemyList.length; i++){
        var group = enemyList[i];
        group.move(group);
        if(!group.lastChild){
            if(group.parentNode == enemies){
                enemies.removeChild(group);
            }
        }
    }
}

function animateLasers(){
    var laserArray = lasers.childNodes;
    for(var i = 0; i < laserArray.length; i++){
        var laser = laserArray[i];
        if(laser.left + (laser.direction * LASER_SPEED) >= mainWidth - laser.width){
            lasers.removeChild(laser);
            i--;
        }
        else{
            laser.left += laser.direction * LASER_SPEED;
            if(laser.direction == 1){
                points.innerHTML = Number(points.innerHTML) + isEnemy(laser);
            }
            else{
                if(isShip(laser)){
                    end();
                }
            }
            laser.style.left = laser.left + "px";
        }
    }
}

function isEnemy(laser){
    var enemyArray = enemies.childNodes;
    for(var i = 0; i < enemyArray.length; i++){
        var enemyGroup = enemyArray[i].childNodes;
        for(var j = 0; j < enemyGroup.length; j++){
            var enemy = enemyGroup[j];
            if(isCollision(laser, enemy)){
                    var points = enemy.points;
                    enemyArray[i].removeChild(enemy);
                    if(!enemyArray[i].lastChild)
                        enemies.removeChild(enemyArray[i]);
                    return points;
            }
        }
    }
    return 0;
}

function isShip(collisionObject){
    return isCollision(ship, collisionObject)
}

function isCollision(object1, object2){
    if(!isVerticalCollision(object1, object2)) return false;
    if(!isHorizontalCollision(object1, object2)) return false;
    return true;
}

function isVerticalCollision(object1, object2){
    if(object1.top > object2.top){
        if(object1.top - object2.top < object2.height){
            return true;
        }
        return false;
    }
    if(object2.top - object1.top < object1.height){
        return true;
    }
    return false;
}

function isHorizontalCollision(object1, object2){
    if(object1.left > object2.left){
        if(object1.left - object2.left < object2.width){
            return true;
        }
        return false;
    }
    if(object2.left - object1.left < object1.width){
        return true;
    }
    return false;
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

function removeEnemies(){
    while(enemies.lastChild){
        var removingNode = enemies.lastChild;
        while(removingNode.lastChild){
            removingNode.removeChild(removingNode.lastChild);
        }
        enemies.removeChild(removingNode);
    }
}

function makeEnemyGroup(){
    enemies.appendChild(makeEnemies());
    enemyTimer = setTimeout(makeEnemyGroup, Math.random() * 5000 + 2000);
}

function makeEnemies(){
    var enemy = Math.floor(Math.random() * 3);
    var laser = Math.floor(Math.random() * 2);
    var enemyGroup = document.createElement("div");
    var startingTop = Math.floor(Math.random() * mainHeight);
    enemyGroup.className = "game-object";
    for(var i = 0, enemyCount = Math.floor(Math.random() * 2) + 3; i < enemyCount; i++){
        enemyGroup.appendChild(makeEnemy(enemy, laser, i, startingTop));
    }
    enemyGroup.startingTop = startingTop;
    enemyGroup.move = determineEnemyMove(Math.floor(Math.random() * 2));
    return enemyGroup;
}

function makeEnemy(imageNumber, laserNumber, count, startingTop){
    var enemy = document.createElement("img");
    enemy.className = "game-object";
    enemy.src = "images/enemy" + imageNumber + ".png";
    enemy.laser = laserNumber;
    enemy.points = 100 + (100 * imageNumber);
    enemy.top = startingTop;
    enemy.left = mainWidth + ((enemy.width + 10) * count);
    enemy.style.top = enemy.top + "px";
    enemy.style.left = enemy.left + "px";
    return enemy;
}

function determineEnemyMove(number){
    return number == 0 ? enemyMove1 : enemyMove2;
}

function enemyMove1(enemyGroup){
    var group = enemyGroup.childNodes;
    for(var i = 0; i < group.length; i++){
        var enemy = group[i];
        if(enemy.left - ENEMY_SPEED < 0){
            enemyGroup.removeChild(enemy);
            i--;
        }
        else if(isShip(enemy)){
            end();
            return;
        }
        else{
            if(enemy.left < mainWidth){
                if(enemy.top + enemy.height + ENEMY_SPEED > mainHeight){
                    enemy.top -= mainHeight - ENEMY_SPEED;
                }
                else{
                    enemy.top += ENEMY_SPEED;
                }
            }
            enemy.left -= ENEMY_SPEED;
            enemy.style.top = enemy.top + "px";
            enemy.style.left = enemy.left + "px";
        }
    }
}

function enemyMove2(enemyGroup){
    var group = enemyGroup.childNodes;
    for(var i = 0; i < group.length; i++){
        var enemy = group[i];
        if(enemy.left - ENEMY_SPEED < 0){
            enemyGroup.removeChild(enemy);
            i--;
        }
        else if(isShip(enemy)){
            end();
            return;
        }
        else{
            if(enemy.left < mainWidth){
                if(enemy.top - ENEMY_SPEED < 0){
                    enemy.top += mainHeight - enemy.height;
                }
                else{
                    enemy.top -= ENEMY_SPEED;
                }
            }
            enemy.left -= ENEMY_SPEED;
            enemy.style.top = enemy.top + "px";
            enemy.style.left = enemy.left + "px";
        }
    }
}
