
var sheepList = [];
var dogList = [];
var states = []; //[sheep1x, sheep1y.....sheepNx, sheepNy, targetpointa, targetpointb, targetpointc, targetpointd, dogx, dogy, dogDirection, dogLeft, dogRight, dogForward]

var start = false;
var timer = null;
var interval = 100 * 1000;

var score = 0;

var noOfSheep = 30;
var noOfDogs = 1;
var c = {
    width: 600,
    height: 600
}
var locked = false;
var target = {
    startx: 0,
    starty: 0,
    width: 100,
    height: 100
};

var sim = function(p){
    p.setup = function(){
        p.createCanvas(0, 0);
        p.ellipseMode(p.CENTER);
        p.angleMode(p.DEGREES);
        p.rectMode(p.CORNER);
        for (i = 0; i < noOfSheep; i++){
            sheepList.push(new Sheep(i, p));
        }
        for(i = 0; i < noOfDogs; i++){
            dogList.push(new Dog(i, p));
        }
    }
    p.draw = function() {
        p.frameRate(Number(document.getElementById("speed").value));
        frames = p.frameRate();
        if (start){
            moveSheep();
            moveDog();
            saveState();
        }
    }

    function moveSheep(){
        sheepList.forEach(sheep => {
            sheep.move();    
        });
    }

    function moveDog(){
        dogList.forEach(dog => {
            dog.move();
        });
    }

    function saveState(){
        var state = [];
        sheepList.forEach(sheep => {
            state.push(sheep.loc.x);
            state.push(sheep.loc.y);
        });
        state.push(target.startx);
        state.push(target.starty);
        state.push(target.startx + target.width);
        state.push(target.starty + target.height);
        state.push(dogList[0].loc.x);
        state.push(dogList[0].loc.y);
        state.push(dogList[0].direction);
        state.push(dogList[0].left);
        state.push(dogList[0].right);
        state.push(dogList[0].forward);
        states.push(state);
    }
}
let myp5 = new p5(sim, 'c1');


var draw = function(p){
    p.setup = function(){
        p.createCanvas(c.width, c.height);
        p.ellipseMode(p.CENTER);
        p.angleMode(p.DEGREES);
        p.rectMode(p.CORNER);
        
    }

    p.draw = function() {
        p.background('green');
        framerate();
        drawTimer();
        drawTarget();
        drawSheep();
        drawDog();
        
    }

    p.mousePressed = function(){
        if (!start){
            if (!locked){
                locked = true;
                target.startx = p.mouseX;
                target.starty = p.mouseY;
                target.width = 0;
                target.height = 0;
            }
        }
    }

    p.mouseDragged = function(){
        if (!start){
            target.width =  p.mouseY - target.starty;
            target.height =  p.mouseX - target.startx;
        }
    }

    p.mouseReleased = function(){
        locked = false;
    }

    p.keyPressed = function(){
        if (keyCode == ENTER) {
          start = true;
        }
        
    }

    function drawTarget(){
        p.fill(255, 153, 153, 200);
        p.rect(target.startx, target.starty, target.height, target.width);
    }

    function framerate(){
        p.frameRate(Number(document.getElementById("framerate").value));
        p.textSize(10);
        p.fill("black");
        p.text(frames.toString() , 0, 10);
    }

    function drawSheep(){
        score = 0;
        sheepList.forEach(sheep => {
            sheep.draw(p);
            score += sheep.inTarget;
        });
    }
    function drawDog(){
        dogList.forEach(dog => {
            dog.draw(p);
        });
    }

    function drawTimer(){
        p.textSize(50);
        

        if (start){
            var countdown = p.ceil((timer-p.millis())/1000);
            p.text(countdown, p.width - 100, 50);
            if (timer == null){
                timer = p.millis() + interval;
            }
            if (timer < p.millis()) {
                p.text("GAME OVER", width/2, height*0.7);
                start = false;
                timer = null;
                saveToFile();
              }
        }
    }

    function saveToFile(){
        var csv = states.map(function(d){
            return d.join(',');
        }).join('\n');     
        downloadToFile(csv, 'recordings/test.csv', 'text/csv');
    }

    function downloadToFile (content, filename, contentType){
        const a = document.createElement('a');
        const file = new Blob([content], {type: contentType});
        
        a.href= URL.createObjectURL(file);
        a.download = filename;
        a.click();
      
          URL.revokeObjectURL(a.href);
      };

}

let myp52 = new p5(draw, 'c2');


