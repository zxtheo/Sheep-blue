function randInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function rand(min, max) {
    return (Math.random() * (max - min) + min);
}

function dtor(a){
    return (a * Math.PI / 180);
}

function rtod(a){
    return (a * 180 / Math.PI);
}

function magnitude(a){
    return Math.sqrt(a.x*a.x + a.y*a.y);
}