const canvas= document.querySelector("canvas");
canvas.width= window.innerWidth;
canvas.height= window.innerHeight;

const c= canvas.getContext("2d");

const mouse = {
    x: "ndefined",
    y: "undefined"
}

const maxRadius = 10;
const minRadius = 2;

window.addEventListener("mousemove", function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    // console.log(mouse);
});

window.addEventListener("resize", function(){
    canvas.width= window.innerWidth;
    canvas.height= window.innerHeight;
});

function Circle(x, y, dx, dy, radius, red, green, blue){
    this.x= x;
    this.y= y;
    this.dx= dx;
    this.dy= dy;
    this.radius= radius;
    this.minRadius= radius;

    this.draw= function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fill();
        c.fillStyle= `rgb(${red},${green},${blue})`;
    }

    this.update= function(){
        if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
            this.dx = -this.dx;
        }
        if(this.y + this.radius > innerHeight || this.y - this.radius < 0){
            this.dy = -this.dy;
        }
        
        this.x += this.dx;
        this.y += this.dy;

        if(mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50){
            if(this.radius < maxRadius){
                this.radius += 1;
            }
        }
        else if(this.radius > this.minRadius){
            this.radius -= 1;
        }
        this.draw();
    }
}

var circleArray= []; 

for(i = 0; i < 500; i++){
    var radius= Math.random() * 3 + 1;
    var x= Math.random() * (innerWidth - radius * 2) + radius;
    var y= Math.random() * (innerHeight - radius * 2) + radius;
    var dx= (Math.random() * 5);
    var dy= (Math.random() * 5);
    var red= Math.floor(Math.random() * 256);
    var green= Math.floor(Math.random() * 256);
    var blue= Math.floor(Math.random() * 256);
    circleArray.push(new Circle(x, y, dx, dy, radius, red, green, blue));
}

console.log(circleArray);

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for(i = 0; i < circleArray.length; i++){
        circleArray[i].update();
    }
}

animate();