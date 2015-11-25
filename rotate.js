var ball = (function() {
    var requestAnimFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    var supportCanvas = document.createElement("canvas").getContext,
        ball,
        img;

    function Ball(options) {
        options = options || {
            cWidth: 1000,
            cHeight: 500,
            width: 100,
            height: 100,
            id: 'canvas',
            imgSrc: 'football.png'
        }; //没有值则设置默认值

        this.cWidth = options.cWidth;
        this.cHeight = options.cHeight;
        this.width = options.width;
        this.height = options.height;
        this.container = options.id;
        this.containerNode = document.getElementById(this.container);
        this.canvasNode;
        this.imgSrc = options.imgSrc;
        this.image;
        this.x = 0;
        this.y = 0;
        this.vy = 0; // y轴的初始速度
        this.vx = 5; // x轴的初始速度
        this.end = false;
        this.factor = 0.02; // 阻力，影响速度的因素
        this.gravity = 0.9; //重力加速度
        this.degree = 0;
    }

    Ball.prototype.createCanvas = function() {
        // 初始化画布
        if (supportCanvas) {
            this.canvasNode = document.createElement("canvas");
            this.canvasNode.width = this.cWidth;
            this.canvasNode.height = this.cHeight
            this.containerNode.appendChild(this.canvasNode);
            this.canvas = this.canvasNode.getContext("2d");
        } else {

            this.canvasNode = document.createElement("div");
            /*测试不同浏览器对 style属性的支持方式*/
            // this.canvasNode.style.width = this.cWidth+"px";
            // this.canvasNode.style.height = this.cHeight+"px";
            // this.canvasNode.style.backgroundColor = "#000";
            // this.canvasNode.style.backgroundColor = "#000";

            // this.canvasNode.style["width"] = this.cWidth+"px";
            // this.canvasNode.style["height"] = this.cHeight+"px";
            // this.canvasNode.style["backgroundColor"] = "#000";
            // this.canvasNode.style["backgroundColor"] = "#000";

            this.canvasNode.style.cssText = "width:" + this.cWidth + "px;height:" + this.cHeight + "px;background-color:#000;";

            this.canvas = document.createElement("img");
            this.canvas.src = img.src;
            this.canvasNode.style.cssText = "width:" + this.width + "px;height:" + this.height + "px;position:absolute; left:0;top:0;";
            this.canvasNode.appendChild(this.canvas);
            this.containerNode.appendChild(this.canvasNode);
            this.canvas = this.canvasNode;
        }
    }

    Ball.prototype.draw = function() {
        if (supportCanvas) {
            this.canvas.save();
            this.rotate();
            this.canvas.drawImage(img,
                0, 0, 100, 100,
                this.x, this.y,
                this.width, this.height);
            this.canvas.restore();

            if (this.vx > 0) {
                this.degree += this.vx;
            }
        } else {
            this.canvas.style.left = this.x;
            this.canvas.style.top = this.y;
        }
    }

    /*改变其x,y轴坐标，算法 */
    Ball.prototype.move = function() {
        if (supportCanvas) {
            this.clearCanvas();
        }


        // 1.x轴的速度
        this.vx = this.vx - this.factor;
        if (this.vx < 0) {
            console.log("x轴的速度停了，当前速度为：" + this.vx);
            // this.end = true;
            this.vx = 0;
        }
        this.x = this.x + this.vx;
        if (this.x > this.cWidth) {
            console.log("已经跑出了画布了：" + this.x + " " + this.cWidth);
            this.end = true;
        }

        // 2.y轴的速度
        this.vy = this.vy + this.gravity - this.factor * 4;
        this.y = this.y + this.vy;
        if (this.vy == 0) {
            this.end = true;
            console.log("y轴的速度为0了");
        }

        if (this.vy > 0 && this.y > this.cHeight - 100) {
            this.vy = -this.vy + this.factor * 4 + 4;
            this.y = this.cHeight - 100;
            if (this.vy < 2 && this.vy > -2) {
                setTimeout(function(ball) {
                    return function() {
                        ball.end = true;
                    };
                }(this), 1000);
            }
            console.log("y轴的速度:" + this.vy + " this.y:" + this.y);
        }

        this.draw();
    }
    Ball.prototype.rotate = function() {
        this.canvas.translate(this.x + 50, this.y + 50); // 1.改变canvas的原点
        this.canvas.rotate(this.degree * Math.PI / 180); // 2.旋转
        this.canvas.translate(-this.x - 50, -this.y - 50); // 3.将canvas的原点改为原来的0,0
    }

    Ball.prototype.clearCanvas = function() {
        this.canvas && this.canvas.clearRect(0, 0, this.cWidth, this.cHeight);
    }

    Ball.prototype.init = function(img) {
        this.createCanvas(); // 1.首先创建画布.
        this.draw(); // 2.第一次绘制足球.
        loop(); // 3.开始运动
    }

    function loop() {
        ball.move();
        if (!ball.end) {
            requestAnimFrame(loop);
        } else {
            console.log("ball.y:" + ball.y + " ball.x:" + ball.x);
        }
    }

    function begin() {
        ball.init(this);
    }

    function init(options) {
        ball = new Ball(options);
        img = new Image();
        img.onload = begin; // 在此处绑定开始事件
        img.src = ball.imgSrc;
    }

    return {
        play: function(options) {
            init(options);
        }
    }
}());
