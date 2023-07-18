let colorArray = [

    "#2185C5",
    "#7ECEFD",
    // "#FFF6E5",
    "#FF7F66"
];

let MYColor = [
    157,
    216
];

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let Radius = 62;
let totalBallsINwindow = (Math.floor(window.innerWidth / Radius) - 1) * (Math.floor(window.innerHeight / Radius) - 1);

if (totalBallsINwindow > 50) {
    totalBallsINwindow -= 10;
}
else if (totalBallsINwindow > 100) {
    totalBallsINwindow -= 20;
}
else if (totalBallsINwindow > 400) {
    totalBallsINwindow -= 80;
}
else if (totalBallsINwindow > 1000) {
    totalBallsINwindow -= 200;
}
else {
    totalBallsINwindow -= 1000;
}


let mouse = {
    x: 0,
    y: 0,
    radius: 60
};

addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

function Xrotate(dx, dy, angle) {
    let newDx = dx * Math.cos(angle) - dy * Math.sin(angle);
    return newDx;
}
function Yrotate(dx, dy, angle) {
    let newDy = dx * Math.sin(angle) + dy * Math.cos(angle);
    return newDy;
}
function distance(x1, y1, x2, y2) {
    let dist = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    return dist;
}

class myCircle {
    constructor(x, y, dx, dy, radius, color, colorA, colorB, colorC, opacity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.color2 = color;
        this.dx = dx;
        this.dy = dy;

        this.colorA = colorA;
        this.colorB = colorB;
        this.colorC = colorC;
        this.opacity = opacity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.strokeStyle = this.color;
        context.lineWidth = 1;
        context.save();
        context.globalAlpha = 0.8;
        context.fillStyle = this.color;
        context.fill();
        context.restore();
        context.stroke();
        context.closePath();
    };

    collusion(otherCircle) {

        let distance = Math.pow(this.x - otherCircle.x, 2) + Math.pow(this.y - otherCircle.y, 2);
        distance = Math.sqrt(distance);

        if (distance <= (otherCircle.radius + this.radius + 1)) {
            // this.color = "red";
            this.draw();

            let newVeloccityX = otherCircle.x - this.x;
            let newVeloccityY = otherCircle.y - this.y;

            let difx = this.dx - (otherCircle.dx);
            let dify = this.dy - (otherCircle.dy);

            if (newVeloccityX * difx + newVeloccityY * dify >= 0) {

                // if (otherCircle.x == this.x) {
                // otherCircle.x += 1e10;
                // }
                const angle = -Math.atan2(otherCircle.y - this.y, otherCircle.x - this.x);

                this.dx = Xrotate(this.dx, this.dy, angle);
                // this.dy = Yrotate(this.dx, this.dy, angle);

                otherCircle.dx = Xrotate(otherCircle.dx, otherCircle.dy, angle);
                // otherCircle.dy = Yrotate(otherCircle.dx, otherCircle.dy, angle);

                let tempdx = this.dx;
                this.dx = otherCircle.dx;
                otherCircle.dx = tempdx;

                let tempdy = this.dy;
                this.dy = otherCircle.dy;
                otherCircle.dy = tempdy;

                this.dx = Xrotate(this.dx, this.dy, -angle);
                // this.dy = Yrotate(this.dx, this.dy, -angle);

                otherCircle.dx = Xrotate(otherCircle.dx, otherCircle.dy, -angle);
                // otherCircle.dy = Yrotate(otherCircle.dx, otherCircle.dy, -angle);
            }
        }
        else {
            this.color = this.color2;
        }
    }

    update() {

        if (this.x + this.radius >= innerWidth || (this.x - this.radius) < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius >= innerHeight || (this.y - this.radius) < 0) {
            this.dy = -this.dy;
        }

        // console.log(this.opacity);
        if (distance(mouse.x, mouse.y, this.x, this.y) <= 132) {
            if (this.opacity < 1) {
                // this.opacity += 0.02;
            }
            if (this.colorB >= 15) {
                this.colorB -= 15;
            }
            if (this.colorA >= 15) {
                this.colorA -= 15;
            }
            this.color = "rgba(" + this.colorA + "," + this.colorB + "," + this.colorC + "," + this.opacity + ")";
            this.draw();
            // console.log(this.color);
        }
        else if (this.opacity > 0) {
            // this.opcatiy -= 0.02;

            if (this.colorB + 15 <= 255) {
                this.colorB += 15;
            }
            if (this.colorA + 15 <= 255) {
                this.colorA += 15;
            }
        }


        this.x += this.dx;
        this.y += this.dy;
    }
};
function checkCollusion(Circle1, Circle2) {
    let distance = Math.pow(Circle1.x - Circle2.x, 2) + Math.pow(Circle1.y - Circle2.y, 2);
    distance = Math.sqrt(distance);
    if (distance <= (Circle1.radius + Circle2.radius)) {
        return true;
    }
    return false;
};

let circleArray = [];
console.log(totalBallsINwindow);
init();
function init() {

    // if (dx == 0) {
    // dx++;
    // }
    // if (dy == 0) {
    // dy++;
    // }

    for (let i = 0; i < totalBallsINwindow; i++) {
        let radius = 24;
        let choice = MYColor[(Math.floor(Math.random() * 2))];
        let color = colorArray[(Math.floor(Math.random() * colorArray.length))];
        let x = Math.floor(Math.random() * (window.innerWidth - 2 * radius)) + radius;
        let y = Math.floor(Math.random() * (window.innerHeight - 2 * radius)) + radius;
        let dx = Math.floor((Math.random() - 0.5));
        if (dx == 0) {
            dx++;
        }
        let dy = Math.floor((Math.random() - 0.5));
        if (dy == 0) {
            dy++;
        }
        // "rgb(216, 216, 255)"
        let createCircle = new myCircle(x, y, dx, dy, radius, "rgb(200, 200, 255)", choice, choice, 255, 1);

        for (let j = 0; j < i; j++) {
            if (checkCollusion(createCircle, circleArray[j])) {
                createCircle.x = Math.floor(Math.random() * (window.innerWidth - 2 * radius)) + radius;
                createCircle.y = Math.floor(Math.random() * (window.innerHeight - 2 * radius)) + radius;
                j = 0;
            }
        }
        circleArray.push(createCircle);
    }
};

// console.log(circleArray);

// let newCircle = new myCircle(200, 200, 2, 2, 10, "blue");
// let newCircle2 = new myCircle(300, 300, -4, -4, 10, "blue");
// let newCircle3 = new myCircle(500, 500, -2, 2, 10, "blue");


animate();
function animate() {
    requestAnimationFrame(animate);

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].draw();
        circleArray[i].update();
    }
    for (let i = 0; i < circleArray.length; i++) {
        for (let j = 0; j < circleArray.length; j++) {
            if (i != j) {
                circleArray[i].collusion(circleArray[j]);
            }
        }
    }

}
