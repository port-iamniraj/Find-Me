class Sprite {
    constructor({ position, image, frames = { max: 1 }, sprites = [] }) {
        this.position = position;
        this.image = image;
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
        this.moving = false;
        this.sprites = sprites;
    }

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        if (this.moving) {
            if (this.frames.max > 1) {
                this.frames.elapsed++;
            }

            if (this.frames.elapsed % 9 === 0) {
                if (this.frames.val < this.frames.max - 1) {
                    this.frames.val++;
                }
                else {
                    this.frames.val = 0;
                }
            }
        }
    }
}

class Boundary {
    static width = 57.6;
    static height = 57.6;
    constructor({ position }) {
        this.position = position;
        this.width = 57.6;
        this.height = 57.6;
    }
    draw() {
        c.fillStyle = "rgba(0, 0, 0, 0.5)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}