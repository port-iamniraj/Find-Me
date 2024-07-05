const canvas = document.querySelector("canvas");
const dialogueBox = document.querySelector(".dialogue-box");
const c = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 720;

class Background {
    constructor({ position, image }) {
        this.position = position;
        this.image = image;
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        };
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}

class Sprite {
    constructor({ position }) {
        this.position = position;
        this.width = 50;
        this.height = 50;
    }

    draw() {
        c.fillStyle = "#ff0000";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const offset = {
    x: -170,
    y: -250
};

const image = new Image();
image.src = "./ASSETS/TILED/Map.png";

const player = new Sprite({
    position: {
        x: 565,
        y: 600
    }
});

const background = new Background({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image,
});

const keys = {
    ArrowUp: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
};

function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    background.draw();
    player.draw();

    dialogueBox.style.opacity = "0";

    if (keys.ArrowUp.pressed) {
        player.position.y -= 1;
        console.log(player.position);
    }
    if (keys.ArrowLeft.pressed) {
        player.position.x -= 1;
        console.log(player.position);
    }
    if (keys.ArrowDown.pressed) {
        player.position.y += 1;
        console.log(player.position);
    }
    if (keys.ArrowRight.pressed) {
        player.position.x += 1;
        console.log(player.position);
    }

    if (player.position.x === 325 && player.position.y === 501) {
        dialogueBox.style.top = (player.position.y - (player.width + player.height)) + "px";
        dialogueBox.style.left = (player.position.x - (player.width + player.width)) + "px";
        dialogueBox.style.opacity = "1";
    }
}
animate();

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            keys.ArrowUp.pressed = true;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            break;
        case "ArrowDown":
            keys.ArrowDown.pressed = true;
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowUp":
            keys.ArrowUp.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
        case "ArrowDown":
            keys.ArrowDown.pressed = false;
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
    }
});