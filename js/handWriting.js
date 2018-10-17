// 简化ID操作
var $$ = function(id) {
    return document.getElementById(id);
};
var canvasWidth = 600; // 默认600
var rectLineWidth = 6; // 边框默认线条宽度
var riceLineWidth = 3; // 米字形线条宽度
var canvasSpace = 10; // 手机端跟两边的间隔

var offCanvas = $$('offCanvas');
var offCtx = offCanvas.getContext('2d');
var canvas = $$('canvas');
var ctx = canvas.getContext('2d');
var isMouseDown = false; // 默认鼠标没按下
var lastCoordinate = null; // 前一个坐标
var lastTimestamp = 0; // 前一个时间戳
var lastLineWidth = -1; // 用于线光滑过度
var strokeColor = 'black'; // 默认黑色笔触
var lastClickId = 'black-btn'; // 上一次点击ID
var point = null; // 存储鼠标或触发坐标

offCanvas.width = Math.min(canvasWidth, window.innerWidth - canvasSpace);
offCanvas.height = Math.min(canvasWidth, window.innerWidth - canvasSpace);
canvas.width = Math.min(canvasWidth, window.innerWidth - canvasSpace);
canvas.height = Math.min(canvasWidth, window.innerWidth - canvasSpace);

$$('wrapper').style.width = canvas.width + 'px';
$$('control-button').style.top = canvas.height + 'px';
// 绘制米字形背景
drawGraph();

// canvas鼠标事件
canvas.onmousedown = function(event) {
    event = event || window.event;
    event.preventDefault(); // 取消默认行为
    point = { x: event.clientX, y: event.clientY };
    beginStroke(point);
};
canvas.onmouseup = function(event) {
    stopStroke(event);
};
canvas.onmousemove = function(event) {
    event = event || window.event;
    event.preventDefault();
    if (isMouseDown) {
        point = { x: event.clientX, y: event.clientY };
        moveStroke(point);
    }
};
canvas.onmouseout = function(event) {
    stopStroke(event);
};
// canvas触摸事件
canvas.addEventListener('touchstart', function(event) {
    event = event || window.event;
    event.preventDefault(); // 取消默认行为
    point = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    beginStroke(point);
});
canvas.addEventListener('touchend', function(event) {
    stopStroke(event);
});
canvas.addEventListener('touchmove', function(event) {
    event = event || window.event;
    event.preventDefault();
    if (isMouseDown) {
        point = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        moveStroke(point);
    }
});
// 更换笔触颜色
$$('colors').onclick = function(event) {
    event = event || window.enent;
    var curClickId = event.target.id; // 点击ID
    switch (curClickId) {
        case 'black-btn':
            strokeColor = 'black';
            $$(lastClickId).className = 'color-btn'; // 上一个点击去掉选择className
            $$(curClickId).className = 'color-btn color-btn-selected'; // 点击加上选择className
            lastClickId = curClickId;
            break;
        case 'blue-btn':
            strokeColor = 'blue';
            $$(lastClickId).className = 'color-btn';
            $$(curClickId).className = 'color-btn color-btn-selected';
            lastClickId = curClickId;
            break;
        case 'green-btn':
            strokeColor = 'green';
            $$(lastClickId).className = 'color-btn';
            $$(curClickId).className = 'color-btn color-btn-selected';
            lastClickId = curClickId;
            break;
        case 'red-btn':
            strokeColor = 'red';
            $$(lastClickId).className = 'color-btn';
            $$(curClickId).className = 'color-btn color-btn-selected';
            lastClickId = curClickId;
            break;
        case 'orange-btn':
            strokeColor = 'orange';
            $$(lastClickId).className = 'color-btn';
            $$(curClickId).className = 'color-btn color-btn-selected';
            lastClickId = curClickId;
            break;
    }
};
// 更换背景
$$('changeBg').onchange = function(event) {
    event = event || window.event;
    var changeValue = event.target.value;
    drawImg(changeValue);
};
// 清空文字canvas
$$('clearCanvas').onclick = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};
// 保存canvas文字内容（需要优化）
$$('saveImg').onclick = function() {
    // 下载后的文件名
    var filename = 'canvas_' + (new Date()).getTime() + '.png';    
    var textImg = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'); // 兼容大部分浏览器，缺点就是保存的文件没有后缀名
    saveFile(textImg, filename);
};

/**
 * 模拟鼠标点击事件进行保存
 * @param  {String} data     要保存到本地的图片数据
 * @param  {String} filename 文件名
 */
var saveFile = function(data, filename) {
    var saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    saveLink.href = data;
    saveLink.download = filename; // download只兼容chrome和firefox，需要兼容全部浏览器，只能用服务器保存

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    saveLink.dispatchEvent(event);
};

// 绘制图像到画布
function drawImg(changeValue) {
    offCtx.clearRect(0, 0, canvas.width, canvas.height);
    if (changeValue == 'default') {
        drawGraph();
    } else {
        var changeImg = new Image();
        changeImg.src = 'images/' + changeValue + '.jpg';
        changeImg.onload = function() {
            offCtx.drawImage(changeImg, 0, 0, canvas.width, canvas.height);
        };
    }
}
// 鼠标和触发函数
function beginStroke(point) {
    isMouseDown = true;
    lastCoordinate = windowToCanvas(point.x, point.y);
    lastTimestamp = new Date().getTime();
}

function moveStroke(point) {
    var curCoordinate = windowToCanvas(point.x, point.y);
    var curTimestamp = new Date().getTime();

    var s = calcDistance(lastCoordinate, curCoordinate); // 计算两点之间的距离
    var t = curTimestamp - lastTimestamp; // 计算两点之间的时间差
    var curLineWidth = caleLineWidth(s, t);
    // console.log(curLineWidth);

    // 鼠标按下去移动时画线
    drawLine(ctx, lastCoordinate.x, lastCoordinate.y, curCoordinate.x, curCoordinate.y, curLineWidth, strokeColor);

    lastCoordinate = curCoordinate; // 现在坐标替换前一个坐标
    lastTimestamp = curTimestamp;
    lastLineWidth = curLineWidth;
}

function stopStroke(event) {
    event = event || window.event;
    event.preventDefault();
    isMouseDown = false;
}

// 根据不同速度计算线的宽度函数
function caleLineWidth(s, t) {
    var v = s / t; // 获取速度
    // 声明最多最小速度和最大最小边界
    var maxVelocity = 10,
        minVelocity = 0.1,
        maxLineWidth = Math.min(30, canvas.width / 20), // 避免手机端线条太粗
        minLineWidth = 1,
        resultLineWidth; // 用于返回的线宽度

    if (v <= minVelocity) {
        resultLineWidth = maxLineWidth;
    } else if (v >= maxVelocity) {
        resultLineWidth = minLineWidth;
    } else {
        resultLineWidth = maxLineWidth - (v - minVelocity) / (maxVelocity - minVelocity) * (maxLineWidth - minLineWidth);
    }
    if (lastLineWidth == -1) { // 开始时候
        return resultLineWidth;
    } else {
        return resultLineWidth * 2 / 3 + lastLineWidth * 1 / 3; // lastLineWidth占得比重越大越平滑
    }
}

// 计算两点之间的距离函数
function calcDistance(lastCoordinate, curCoordinate) {
    var distance = Math.sqrt(Math.pow(curCoordinate.x - lastCoordinate.x, 2) + Math.pow(curCoordinate.y - lastCoordinate.y, 2));
    return distance;
}

// 坐标转换
function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return { x: x - bbox.left, y: y - bbox.top };
}

// 绘制米字形背景函数
function drawGraph() {
    var num = 8, // 线条数量
        ang, // 旋转角度
        diagonal = Math.sqrt((canvas.width / 2 - rectLineWidth) * (canvas.width / 2 - rectLineWidth) + (canvas.height / 2 - rectLineWidth) * (canvas.height / 2 - rectLineWidth)); // 对角线长度
    offCtx.save();

    offCtx.strokeStyle = 'rgb(230, 11, 9)'; //公共颜色
    drawRect(offCtx, rectLineWidth / 2, rectLineWidth / 2, rectLineWidth);

    offCtx.setLineDash([10, 5]); //设置虚线(不兼容IE11以下)
    offCtx.translate(canvas.width / 2, canvas.height / 2);
    for (var i = 0; i < num; i++) {
        ang = -Math.PI * 2 * i / num;
        offCtx.save();
        offCtx.rotate(ang);
        if (i % 2 == 0) {
            drawLine(offCtx, 0, 0, canvas.width / 2 - rectLineWidth, 0, riceLineWidth);
        } else {
            drawLine(offCtx, 0, 0, diagonal, 0, riceLineWidth);
        }
        offCtx.restore();
    }

    offCtx.restore();
}

// 绘制直线
function drawLine(context, x1, y1, x2, y2, /*optional*/ lineWidth, /*optional*/ strokeColor) {
    context.beginPath();
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);

    context.lineWidth = lineWidth || 1;
    context.lineCap = 'round'; // 线与线交合不会产生空隙
    context.lineJoin = 'round';
    context.strokeStyle = strokeColor || '#ff0000';

    context.stroke();
}
// 绘制矩形
function drawRect(context, x, y, /*optional*/ lineWidth, /*optional*/ strokeColor) {
    context.beginPath();
    context.lineTo(x, y);
    context.lineTo(canvas.width - x, y);
    context.lineTo(canvas.width - x, canvas.height - y);
    context.lineTo(x, canvas.height - y);
    context.closePath();

    context.lineWidth = lineWidth || 1;
    context.lineCap = 'round'; // 线与线交合不会产生空隙
    context.lineJoin = 'round';
    context.strokeStyle = strokeColor || '#ff0000';

    context.stroke();
}