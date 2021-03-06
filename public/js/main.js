var ai = false;

var timegiven = 30;
var noOfSheep = 10;
var noOfDogs = 1;
var c = {
    width: 600,
    height: 600
}


var sheepList = [];
var dogList = [];
var states = []; //[sheep1x, sheep1y.....sheepNx, sheepNy, targetpointa, targetpointb, targetpointc, targetpointd, dogx, dogy, dogDirection, dogLeft, dogRight, dogForward]
var start = false;
var end = false;
var timer = null;
var interval = timegiven * 1000;
var score = null;
var locked = false;
var target = {
    startx: 0,
    starty: 0,
    width: 600,
    height: 300
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
            saveState();
            moveDog();
        }
    }
    function moveDog(){
        dogList.forEach(dog => {
            if (ai){
                var input = states.pop()
                // console.out(input)
                playnet(input.slice(0, input.length - 3))
            }
            dog.move();
            });
    }
    function moveSheep(){
        sheepList.forEach(sheep => {
            sheep.move();    
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
        ai = document.getElementById("togBtn").checked;
        p.background('green');
        framerate();
        
        drawTarget();
        drawSheep();
        drawDog();
        drawTimer();
    }

    p.mousePressed = function(){
        if (p.mouseX < c.width && p.mouseX >0 && p.mouseY >0 && p.mouseY < c.width)
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
        if (!start && !end){
            target.width =  p.mouseY - target.starty;
            target.height =  p.mouseX - target.startx;
        }
    }

    p.mouseReleased = function(){
        if (!start && !end){
            locked = false;
        }
    }

    p.keyPressed = function(){
        if (!end){
            if (keyCode == ENTER) {
            start = true;
            }
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
            if (timer-p.millis() < 0) {
                start = false;
                end = true;
                console.log("training dog please wait...")
                trainmodel(states);
                console.log("trained")
                
                saveToFile();
              }
        }
        else if (end){
            p.text("GAME OVER", c.width/2-150, c.height/2);
            p.text("SCORE: " + score, c.width/2-120, c.height/2 + 100);
        }
    }

    function saveToFile(){
        var csv = states.map(function(d){
            return d.join(',');
        }).join('\n');    
        sendJson(states, "http://127.0.0.1:5000/postdata");
        //downloadToFile(csv, 'recordings/test.csv', 'text/csv');
    }

    function sendJson(content, url){
        //create xhr object
        let xhr = new XMLHttpRequest(); 
        //open conneciton
        xhr.open("POST", url, true); 
        //set request header
        xhr.setRequestHeader("Content-Type", "application/json"); 
        // Create a state change callback 
        xhr.onreadystatechange = function () { 
            if (xhr.readyState === 4 && xhr.status === 200) { 

                // Print received data from server 
                result.innerHTML = this.responseText; 

            } 
        };
        // Converting JSON data to string 
        var date = new Date().toLocaleDateString();
        var time = new Date().toLocaleTimeString();
        var data = JSON.stringify({ "datetime": date + "_" + time + "_test" , "csv":content }); 
  
        // Sending data with the request 
        xhr.send(data); 

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


