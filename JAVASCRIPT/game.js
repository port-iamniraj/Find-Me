const canvas = document.querySelector("canvas");
const dialogueBox = document.querySelector(".dialogue-box");
const c = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 720;

const collisionsMap = [];
for (i = 0; i < collisions.length; i += 25) {
    collisionsMap.push(collisions.slice(i, 25 + i));
}

const hideSpotsMap = [];
for (i = 0; i < hideSpotsData.length; i += 25) {
    hideSpotsMap.push(hideSpotsData.slice(i, 25 + i));
}

const boundaries = [];
const offset = {
    x: -170,
    y: -250
};

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1) {
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }));
        }
    });
});

const hideSpots = [];
hideSpotsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1) {
            hideSpots.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }));
        }
    });
});

const image = new Image();
image.src = "./ASSETS/TILED/Map.png";

const foregroundImage = new Image();
foregroundImage.src = "./IMAGES/Foreground.png";

const playerDownImage = new Image();
playerDownImage.src = "./IMAGES/Characters/Adam-Down-Run.png";

const playerUpImage = new Image();
playerUpImage.src = "./IMAGES/Characters/Adam-Up-Run.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./IMAGES/Characters/Adam-Left-Run.png";

const playerRightImage = new Image();
playerRightImage.src = "./IMAGES/Characters/Adam-Right-Run.png";

const player = new Sprite({
    position: {
        x: 565,
        y: 600
    },
    image: playerDownImage,
    frames: {
        max: 6
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        down: playerDownImage,
        right: playerRightImage,
        none: playerDownImage.style.opacity = "0"
    }
});
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image,
});
const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage,
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

const movables = [background, ...boundaries, foreground, ...hideSpots];

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + 20 <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y);
}

const isHiding = {
    yes: false
};

function animate() {
    window.requestAnimationFrame(animate);
    // c.clearRect(0, 0, canvas.width, canvas.height);

    background.draw();
    boundaries.forEach(boundary => {
        boundary.draw();
    });
    hideSpots.forEach(hideSpot => {
        hideSpot.draw();
    });
    player.draw();
    foreground.draw();

    dialogueBox.style.opacity = "0";

    let moving = true;
    player.moving = false;

    if (isHiding.yes) {
        return;
    }

    // hiding
    if (keys.ArrowUp.pressed || keys.ArrowLeft.pressed || keys.ArrowDown.pressed || keys.ArrowRight.pressed) {
        for (i = 0; i < hideSpots.length; i++) {
            const hideSpot = hideSpots[i];
            const overlappingArea = (Math.min(player.position.x + player.width, hideSpot.position.x + hideSpot.width) -
                Math.max(player.position.x, hideSpot.position.x)) *
                (Math.min(player.position.y + player.height, hideSpot.position.y + hideSpot.height) -
                    Math.max(player.position.y, hideSpot.position.y));

            if (rectangularCollision({ rectangle1: player, rectangle2: hideSpot }) &&
                overlappingArea > (player.width * player.height) / 2
            ) {
                // console.log("hide spot detected");
                // showing dialogue box

                dialogueBox.style.top = (player.position.y - (player.width + player.height)) + "px";
                dialogueBox.style.left = (player.position.x - (player.width + player.width)) + "px";
                dialogueBox.style.opacity = "1";

                window.addEventListener("keydown", e => {
                    if (e.key === "Enter") {
                        console.log("working");
                        isHiding.yes = true;
                        player.image = player.sprites.none;

                        window.addEventListener("keydown", e => {
                            if (e.key === "Enter") {
                                console.log("working");
                                isHiding.yes = false;
                                player.image = player.sprites.down;
                            }
                        });
                    }
                });
                // break;
            }
        }
    }

    if (keys.ArrowUp.pressed) {
        player.moving = true;
        player.image = player.sprites.up;

        for (i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            // for(i = 0; i <= movables.length; i++){
            //     const boundary = boundaries[i];
            //     if(background.position.y !== -1 && foreground.position.y !== -1){
            //         foreground.position.y += 3;
            //         background.position.y += 3;
            //         boundary.position.y += 3;
            //         console.log(movables[i].position.y);
            //         moving = false;
            //         break;
            //     }
            // if(background.position.y === -1 && foreground.position.y === -1){
            //     // player.moving = false;
            //     player.position.y += 3;
            //     console.log("hi");
            // }
            // }
            movables.forEach(movable => {
                if (movable.position.y !== -1) {
                    movable.position.y += 3;
                    // console.log(movable.position.y);
                    // moving = false;
                    // break;
                }
            });
        }
    }
    else if (keys.ArrowLeft.pressed) {
        player.moving = true;
        player.image = player.sprites.right;

        for (i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.x += 3;
            });
        }
    }
    else if (keys.ArrowDown.pressed) {
        player.moving = true;
        player.image = player.sprites.down;

        for (i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.y -= 3;
            });
        }
    }
    else if (keys.ArrowRight.pressed) {
        player.moving = true;
        player.image = player.sprites.left;

        for (i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.x -= 3;
            });
        }
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