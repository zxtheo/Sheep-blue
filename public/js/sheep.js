class Sheep {
    constructor(id, p) {
        this.p = p;
        this.id = id;
        this.loc = p.createVector(randInt(10, c.width - 10), randInt(10, c.height - 10))
        this.fill = "white";
        this.movement = p.createVector(0,0);
        this.vel = p.createVector(0,0);
        this.flightRadius = 100;
        this.maxVel = 5;
        this.minVel =0.5;
        this.inTarget = 0;
    }

    //checks if the sheep is colliding wit onother sheep
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

    move(){
        
        var p = this.p;
        var dog = dogList[0].loc;
        
        var l = this.loc.copy();
        var sheepCopy = [...sheepList];
        var movement = p.createVector(0,0); //set movement to zero to act more like sheep
        var dogDistnace = this.magnitude(this.loc.copy().sub(dog));
        var ruleMultiplier = this.ruleMultiplier(dogDistnace);
        //multipliers added from "Extending Reynolds’ flocking model to a simulation of sheep in the presence of a predator"
        var c1 = 0.1 , c2 =1;
        var s1 = 30, s2 = 1;
        var a1 = 12, a2 = 12;
        var e = 20;

        var cohesion =  this.cohesion(p, sheepCopy);
        var seperation = this.seperation(p, sheepCopy);
        var alignment = this.alignment(p, sheepCopy);
        var evade = this.evade(p, dog);

        
        //add direction

        movement.add(cohesion.mult(c1 * (1 + ruleMultiplier * c2)));
        movement.add(seperation.mult(s1));// * (1 + ruleMultiplier* s2)));
        movement.add(alignment.mult(a1 * (1 + ruleMultiplier * a2)));
        movement.add(evade.mult(e));

        
        
        
        

        movement = this.limitMaxVelocity(movement);
        movement = this.limitMinVelocity(movement);
        this.vel = movement;
        l.add(movement);

        //check new locaiton
        l = this.checkLocation(l);
        
        

        // set new locaiton
        this.loc = l
        this.inTarget = p.collidePointRect(this.loc.x, this.loc.y, target.startx, target.starty, target.height, target.width);
        if (this.inTarget){
            this.fill="red"
        }
        else{
            this.fill = "white"
        }

    }

    draw(p){
        p.fill(this.fill);
        p.circle(this.loc.x, this.loc.y, 20);
    }

    cohesion(p, sheepCopy){
        var averagePos = p.createVector(0,0);
        var sheepNo = 0;
        sheepCopy.forEach(sheep => {
            var norm = sheep.loc.copy().sub(this.loc);
            var mag = this.magnitude(norm);
            if (this.id != sheep.id){
                if (mag < this.flightRadius){ //added so sheep only cohese with near sheep
                    averagePos.add(sheep.loc);
                    sheepNo ++;
                }
            }
        });
        
        if (sheepNo > 0){
            averagePos.div(sheepNo);
            var norm = averagePos.copy().sub(this.loc);
            var mag = this.magnitude(norm);
            return norm.div(mag);
        }
        return p.createVector(0,0);
    }

    seperation(p, sheepCopy){
        var seperation = p.createVector(0,0);
        sheepCopy.forEach(sheep => {
            if (this.id != sheep.id){
                var norm = this.loc.copy().sub(sheep.loc);
                var mag = this.magnitude(norm);
                var contribution = this.inv(mag, 1);
                seperation.add(norm.div(mag).mult(contribution));

            }
        });

        return seperation;
    }
    
    alignment(p, sheepCopy){
        var averagevel = p.createVector(0,0);
        var sheepNo = 0;
        sheepCopy.forEach(sheep => {
            var norm = sheep.loc.copy().sub(this.loc);
            var mag = this.magnitude(norm);
            if (mag < 100){
                averagevel.add(sheep.vel);
                sheepNo ++ 
            }
            
        });
        averagevel.div(sheepNo);
        return(averagevel).div(100); //added div 100 to turn 100th the way there

    }

    magnitude(a){
        return Math.sqrt(a.x*a.x + a.y*a.y);
    }

    //renolds boyds
    limitMaxVelocity(vel){

        if (magnitude(vel) > this.maxVel){
            vel.div(this.magnitude(vel)).mult(this.maxVel);
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

    evade(p, dog){
        var norm = this.loc.copy().sub(dog);
        var mag = this.magnitude(norm);
        var contribution = this.inv(mag, 10);
        return norm.div(mag).mult(contribution);
    }

    ruleMultiplier(x){
        return (1/Math.PI) * Math.atan((this.flightRadius - x)/20) + 0.5;
    }
    
    inv(x, s){
        return Math.pow((x/s) + 0.001,-2);
    }
  }

  