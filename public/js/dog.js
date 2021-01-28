class Dog extends Animal{
    constructor (id, p){
        super(p, id, 5, 1, 'doggo.png');
        this.turnVel = 0;
        this.travelVel = 0;
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
}