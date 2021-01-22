class Dog{
    constructor(id, p){
        this.p = p;
        this.id = id;
        this.loc = p.createVector(randInt(10, c.width - 10), randInt(10, c.height - 10));
        this.movement = p.createVector(0,0);
        this.maxVel = 5;
        this.minVel = 1;
        this.direction = randInt(0,360);
        this.turnVel = 0;
        this.travelVel = 0;
        this.img = p.loadImage('assets/doggo.png');
        this.left = 0;
        this.right = 0; 
        this.forward = 0;
    }

    move(){
        var p = this.p;
        this.left = 0;
        this.right = 0;
        this.forward = 0;
        if (p.keyIsDown(p.LEFT_ARROW)) {
            this.turnLeft()
          }
        
          if (p.keyIsDown(p.RIGHT_ARROW)) {
            this.turnRight()
          }
        
          if (p.keyIsDown(p.UP_ARROW)) {
            this.goForwards()
          }
          
          
          this.direction = (this.direction + this.turnVel)%360

          //add movement
          var movement = p5.Vector.fromAngle(dtor(this.direction), 1);
          movement = this.limitMaxVelocity(movement);
          movement = this.limitMinVelocity(movement);
          this.movement = movement;
          this.loc.add(movement.mult(this.travelVel));
          this.checkLocation(this.loc)
          //friction/slow down
          this.travelVel += (0 - this.travelVel)/10;
          this.turnVel += (0 - this.turnVel)/2;
    }

    turnLeft(){
        this.turnVel -= 10;
        this.left = 1;
    }
    turnRight(){
        this.turnVel += 10;
        this.right = 1;
    }
    goForwards(){
        this.travelVel += 1;
        this.forward = 1;
    }

    draw(p){
        // p.fill("black");
        // p.circle(this.loc.x, this.loc.y, 20);
        // p.line(this.loc.x, this.loc.y, this.loc.x + this.movement.x*20, this.loc.y + this.movement.y *20)
        p.imageMode(p.CENTER);
        p.push();
        p.translate(this.loc.x, this.loc.y);
        p.rotate(this.direction - 90);
        p.image(this.img, 0,0, 50, 30);
        p.pop();
    }

    checkLocation(location){
        var p = this.p;
        sheepList.forEach(sheep => {
            if (sheep.id != this.id){

                //hit other sheep
                var hit = p.collideCircleCircle(location.x, location.y, 20, sheep.loc.x, sheep.loc.y, 20);
                var distance = p5.Vector.dist(sheep.loc, location)
                if(hit){
                   var move = p.createVector(location.x - sheep.loc.x, location.y - sheep.loc.y);
                   move.normalize();
                   move.mult(20.5-distance);
                   location.add(move);
                }
            }  
        });
         // hit walls
         var left = p.collideLineCircle(0, 0, 0, c.height, location.x, location.y, 20);
         var right = p.collideLineCircle(c.width, 0, c.width, c.height, location.x, location.y, 20);
         var top = p.collideLineCircle(0, 0, c.width, 0, location.x, location.y, 20);
         var bottom = p.collideLineCircle(0, c.height, c.width, c.height, location.x, location.y, 20);

         //constrain walls
         location.y = p.constrain(location.y, 10, c.width-10);
         location.x = p.constrain(location.x, 10, c.height-10);
        return location;
    }

    //renolds boyds
    limitMaxVelocity(vel){

        if (magnitude(vel) > this.maxVel){
            vel.div(magnitude(vel)).mult(this.maxVel);
        }

        return vel;
    }

    //renolds boyds
    limitMinVelocity(vel){

        if (magnitude(vel) < this.minVel){
            vel.x = 0;
            vel.y = 0;
        }

        return vel;
    }   
}