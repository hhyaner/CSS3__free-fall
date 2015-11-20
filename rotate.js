var ball = (function() {
    var requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 60);
            }
    }());

    var supportCanvas = document.createElement("canvas").getContext;

    function Ball(options) {
        options = options || {
            cWidth: 1000,
            cHeight: 500,
            width: 100,
            height: 100,
            id: 'canvas',
            imgSrc:'football.png'
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
    }

    Ball.prototype.createCanvas = function() {
        // 初始化画布
        if (supportCanvas) {
            this.canvasNode = document.createElement("canvas");
        } else {
            this.canvasNode = document.createElement("div");
        }
        this.containerNode.appendChild(this.canvasNode);

        this.canvasNode.style.width = this.cWidth+"px";
        this.canvasNode.style.height = this.cHeight+"px";
        if (supportCanvas) {
        	this.canvas = this.canvasNode.getContext("2d");
        }else{
        	this.canvas = this.canvasNode;
        }
    }
    Ball.prototype.createBall = function() {
        this.loadImage();
    }
    Ball.prototype.draw = function() {
        if (supportCanvas) {
            this.canvas.drawImage(this.image,
                0, 0, 100, 100,
                this.x, this.y,
                this.width, this.height);
        } else {

        }
    }
    Ball.prototype.begin = function() {
    	return this.draw;
    }
    Ball.prototype.loadImage = function() {
        var img = new Image();
        img.onload = this.begin.call(this); // 在此处绑定开始事件
        img.src = this.imgSrc;
        this.image = img;
    }
    Ball.prototype.init = function() {
      	this.createCanvas(); // 1.首先创建画布
        this.createBall(); // 2.创建要运动的物体，这里称之为ball
    }

    function init(options) {
        var ball = new Ball(options);
        ball.init();
    }

    return {
        play: function(options) {
            init(options);
        }
    }
}());
