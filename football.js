var football = (function() {
    var requestAnimFram = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequetAnimationFrame ||
            window.msRequetAnimationFrame || window.oRequetAnimationFrame(callback) || function(callback) {
                setTimeout(callback, 1000 / 60);
            };
    }());

    var canvas, context, image, ball;

    function Ball(ballimage, options) {
        this.width = options.width;
        this.height = options.height;
        this.x = options.left;
        this.y = options.top;
        this.image = ballimage;
        this.gravity = 0.4;
        this.vy = 0.8;
        this.vx = 3;
        this.vyAdjust = -15;
        this.vxAdjust = 10;
        this.factor = 0.65;
        this.end = false;
        this.bounceFactor = options.factor;
    }
    Ball.prototype.draw = function() {
        context.drawImage(this.image,
            0, 0, 100, 100,
            this.x, this.y,
            this.width, this.height);
    }
    Ball.prototype.hit = function() {
        this.vy = this.vyAdjust;
    }
    Ball.prototype.move = function() {
        this.y += this.vy
        this.vy += this.gravity

        if ((this.y + this.height) > canvas.height) {
            this.hit()
            this.vyAdjust = (this.vyAdjust * this.bounceFactor)
            if (this.vx) {
                this.vx = this.vx - 0.5
            }
        }

        if ((this.x + this.width) < canvas.width - 50) {
            if (this.vx) {
                this.x += this.vx
            }
        }
    }

    function clearCanvas() {
        context && context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        clearCanvas(); //清除画布
        ball.move();
        ball.draw();
    }

    function loop() {
        update();
        if (!ball.end) {
            requestAnimFram(loop);
        };
    }

    function loadBall() {
        ball = new Ball(image, {factor: 0.65,
            width: 100,
            height: 100,
            left: 0,
            top: 0
        });
        loop();
    }

    function init() {
        canvas = document.getElementById("football");
        context = canvas.getContext("2d");
        image = new Image();
        image.onload = loadBall;
        image.src = 'football.png';
    }
    var football = {
        play: function() {
            init();
        }
    }

    return football;
}());
