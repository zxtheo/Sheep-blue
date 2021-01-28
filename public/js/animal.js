class Animal {
    constructor(p, id, maxVel, minVel, img) {
        this.p = p;
        this.id = id;
        this.loc = p.createVector(randInt(10, c.width - 10), randInt(10, c.height - 10))
        this.movement = p.createVector(0,0);
        this.maxVel = 5;
        this.minVel = 0.5;
        this.direction = randInt(0,360);
        this.img = p.loadImage('assets/' + img);
    }

    draw(p){
        p.imageMode(p.CENTER);
        p.push();
        p.translate(this.loc.x, this.loc.y);
        p.rotate(this.direction - 90);
        p.image(this.img, 0,0, 50, 30);
        p.pop();
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

         //constrain walls
         location.y = p.constrain(location.y, 10, c.width-10);
         location.x = p.constrain(location.x, 10, c.height-10);
        return location;
    }
}


