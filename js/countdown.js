var WINDOW_WIDTH = 1024; //画布宽度
var WINDOW_HEIGHT = 600; //画布高度
var RADIUS = 8;  //数字圆点半径
var MARGIN_LEFT = 60;  //定义左边距常量
var MARGIN_TOP = 30;  //定义上边距常量
// 倒计时设置
// const endTime = new Date(); //es6定义截止时间的常量
// endTime.setTime(endTime.getTime() + 3600 * 1000);
var curShowTimeSeconds = 0; //截止时间和现在时间的差值的初始值
var balls = []; //小球的数组
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]; //随机颜色

window.onload = function() {
    console.log(digit);
    // 自适应屏幕(左边距1/10屏幕宽，中间文字4/5屏幕宽)
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;
    console.log(WINDOW_HEIGHT);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
    MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowSeconds();
    setInterval(function() { //数字倒数动画
    	render(context);
    	update();
    }, 50);
};

// 计算截止时间跟现在时间相差的毫秒数
function getCurrentShowSeconds() {
	var curTime = new Date();
	// 倒计时设置
	// var ret = endTime.getTime() - curTime.getTime();
	// ret = Math.round(ret / 1000); //转换为秒
	// return ret >= 0 ? ret : 0;
	// 时钟设置
	ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();
	return ret;
}

// 更新当前时间
function update() {
	var nextShowTimeSeconds = getCurrentShowSeconds();
	var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = parseInt(nextShowTimeSeconds % 60);

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = parseInt(curShowTimeSeconds % 60);

    if (nextSeconds != curSeconds) {
    	if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
    		addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10));
    	}
    	if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
    		addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10));
    	}
    	if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
    		addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
    	}
    	if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
    		addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
    	}
    	if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
    		addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
    	}
    	if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
    		addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
    	}
    	curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
}

// 小球动画
function updateBalls() {
	for(var i = 0; i < balls.length; i++) {
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;
		if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = -balls[i].vy * 0.75;
		}
	}
	// 减掉掉出画布的小球，提高性能
	var cnt = 0;
	for(var j = 0; j < balls.length; j++) {
		if ((balls[j].x + RADIUS) > 0 && (balls[j].x - RADIUS) < WINDOW_WIDTH) {
			balls[cnt++] = balls[j];
		}
	}
	while(balls.length > Math.min(300, cnt)) { //当有掉出画布的小球时，就删除最后一项
		balls.pop();
	}
}

// 数值1添加随机小球对象属性
function addBalls(x, y, num) {
	for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) { 
            	var aBall = {
            		x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
            		y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
            		g: 1.5 + Math.random(),
            		vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
            		vy: -5,
            		color: colors[Math.floor(Math.random() * colors.length)]
            	};
            	balls.push(aBall);
            }
        }
    }
}

// 获取时间并计算值进行画图
function render(cxt) {
	cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
    var seconds = parseInt(curShowTimeSeconds % 60);
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt);
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);
    for(var i = 0; i < balls.length; i++) {
    	cxt.fillStyle = balls[i].color;
    	cxt.beginPath();
    	cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
    	cxt.closePath();

    	cxt.fill();
    }
}

// 数字画图操作
function renderDigit(x, y, num, cxt) {
    cxt.fillStyle = 'rgb(0, 102, 153)';
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) { //当二维数组值为1才画图
                cxt.beginPath();
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                cxt.closePath();

                cxt.fill();
            }
        }
    }
}