/**
 * [canvas图形库]
 * 注意：1.因为位移、旋转、变大小等需要使用save()和restore()，不然会导致多个叠加效果；
 *       2.按translate--rotate--scale顺序，不然会有问题；
 *       3.尽量少用scale，因为不止缩放图形，还会缩放原点坐标和线条宽度
 *       4.setInterval执行后，如果原来存在restore()，会复位，导致位移等不起作用；
 *       5.setInterval多个执行同个画布会错乱，解决办法分开不同画布或者一个动画执行完毕后再执行另一个动画。
 * 参数：r半径，xy坐标位置，rot旋转角度，num边长数量，strokeColor（可选）线颜色，millisec（可选）定时器时间
 */
(function() {
    // 规则图形：五角星、六边形
    // 五角星
    CanvasRenderingContext2D.prototype.strokeStar = function(r, x, y, rot, /*optional*/ strokeColor) {
        ruleGraph(this, r, x, y, rot, strokeColor, 10, starLineTo);
    };
    // 五角星（动画）
    CanvasRenderingContext2D.prototype.animateStrokeStar = function(r, x, y, rot, /*optional*/ strokeColor, /*optional*/ millisec) {
        animateRuleGraph(this, r, x, y, rot, strokeColor, millisec, 10, starLineTo);
    };
    // 多边形
    CanvasRenderingContext2D.prototype.strokePolygon = function(r, x, y, rot, num, /*optional*/ strokeColor) {
        ruleGraph(this, r, x, y, rot, strokeColor, num, hexagonLineTo);
    };
    // 多边形（动画）
    CanvasRenderingContext2D.prototype.animateStrokePolygon = function(r, x, y, rot, num, /*optional*/ strokeColor, /*optional*/ millisec) {
        animateRuleGraph(this, r, x, y, rot, strokeColor, millisec, num, hexagonLineTo);
    };
    // 月亮
    CanvasRenderingContext2D.prototype.strokeMoon = function(r, x, y, rot, /*optional*/ strokeColor) {
        ruleGraph(this, r, x, y, rot, strokeColor, 10, moonLineTo);
    };
    // 月亮（动画）
    CanvasRenderingContext2D.prototype.animateStrokeMoon = function(r, x, y, rot, /*optional*/ strokeColor, /*optional*/ millisec) {
        animateRuleGraph(this, r, x, y, rot, strokeColor, millisec, 10, moonLineTo);
    };
    // 绘制规则图形（根据边长数量（num）绘制不同形状）
    function ruleGraph(ctx, r, x, y, rot, strokeColor, num, fn) {
        var ang = 360 / num;
        ctx.beginPath();
        for (i = 0; i <= num; i++) {
            fn(ctx, i, r, x, y, rot, ang);
        }
        ctx.strokeStyle = strokeColor || '#fd5';
        // 设置
        ctx.stroke();
    }
    // 动画绘制规则图形
    function animateRuleGraph(ctx, r, x, y, rot, strokeColor, millisec, num, fn) {
        var n = 0, //循环数
            timer; //定时器
        var ang = 360 / num; 
        ctx.beginPath();
        ctx.strokeStyle = strokeColor || '#fd5';
        millisec = millisec || 100;
        fn(ctx, n, r, x, y, rot, ang);
        timer = setInterval(function() {
            n++;
            fn(ctx, n, r, x, y, rot, ang);
            // console.log(X + ' ' + Y);
            if (n >= num) { //画完清除定时器
                clearInterval(timer);
            }
            ctx.stroke();
        }, millisec);
    }
    // 五角星路径(标准五角星)
    function starLineTo(ctx, t, r, x, y, rot, ang) {
        if (t % 2 == 0) {
            ctx.lineTo(Math.cos((18 + t * ang) / 180 * Math.PI - rot) * r + x, -Math.sin((18 + t * ang) / 180 * Math.PI - rot) * r + y);
        } else {
            ctx.lineTo(Math.cos((18 + t * ang) / 180 * Math.PI - rot) * r * 0.5 + x, -Math.sin((18 + t * ang) / 180 * Math.PI - rot) * r * 0.5 + y);
        }
    }
    // 六边形路径
    function hexagonLineTo(ctx, t, r, x, y, rot, ang) {
        // var lineToX = Math.cos((30 + t * ang - rot) / 180 * Math.PI) * r + x; //六边形正显示
        var lineToX = Math.cos((t * ang - rot) / 180 * Math.PI) * r + x;
        var lineToY = -Math.sin((t * ang - rot) / 180 * Math.PI) * r + y;
        ctx.lineTo(lineToX, lineToY);
    }
    // 月亮路径（弯月）
    function moonLineTo(ctx, t, r, x, y, rot, ang) {
        if (t % 2 == 0) {
            ctx.moveTo(x, y - r);
            ctx.quadraticCurveTo(x + 0.5 * r, y, x, y + r);
        } else {
            ctx.arc(x, y, r, 0.5 * Math.PI, 1.5 * Math.PI, true);
        }
    }
    // 不规则图形：玫瑰线、心形
    // 玫瑰线
    CanvasRenderingContext2D.prototype.strokeRose = function(r, x, y, /*optional*/ strokeColor) {
        anomalyGraph(this, r, x, y, strokeColor, roseLineTo);
    };
    // 玫瑰线（动画）
    CanvasRenderingContext2D.prototype.animateStrokeRose = function(r, x, y, /*optional*/ strokeColor, /*optional*/ millisec) {
        animateAnomalyGraph(this, r, x, y, strokeColor, millisec, roseLineTo);
    };
    // 心形
    CanvasRenderingContext2D.prototype.strokeHeart = function(r, x, y, /*optional*/ strokeColor) {
        anomalyGraph(this, r, x, y, strokeColor, heartLineTo);
    };
    // 心形（动画）
    CanvasRenderingContext2D.prototype.animateStrokeHeart = function(r, x, y, /*optional*/ strokeColor, /*optional*/ millisec) {
        animateAnomalyGraph(this, r, x, y, strokeColor, millisec, heartLineTo);
    };
    // 动画绘制不规则图形
    function animateAnomalyGraph(ctx, r, x, y, strokeColor, millisec, fn) {
        var radian = 0, //循环数
            radian_add = Math.PI / 180, //设置弧度增量
            timer; //定时器
        ctx.beginPath();
        ctx.strokeStyle = strokeColor || '#fd5';
        millisec = millisec || 50;
        fn(ctx, radian, r, x, y);
        timer = setInterval(function() {
            radian += radian_add;
            fn(ctx, radian, r, x, y);
            // console.log(X + ' ' + Y);
            if (radian >= (Math.PI * 2)) { //画完清除定时器
                clearInterval(timer);
            }
            ctx.stroke();
        }, millisec);
    }
    // 绘制不规则图形
    function anomalyGraph(ctx, r, x, y, strokeColor, fn) {
        var radian = 0, //设置初始弧度
            radian_add = Math.PI / 180; //设置弧度增量
        ctx.beginPath(); //开始绘图
        fn(ctx, radian, r, x, y);
        while (radian <= (Math.PI * 2)) { //每增加一次弧度，绘制一条线
            radian += radian_add;
            fn(ctx, radian, r, x, y);
        }
        ctx.strokeStyle = "red"; //设置描边样式
        ctx.stroke(); //对路径描边
    }
    // 玫瑰线路径
    function roseLineTo(ctx, t, r, x, y) {
        var lineToX = Math.sin(4 * t) * Math.cos(t) * r + x;
        var lineToY = Math.sin(4 * t) * Math.sin(t) * r + y;
        ctx.lineTo(lineToX, lineToY);
    }
    // 心形路径
    function heartLineTo(ctx, t, r, x, y) {
        var lineToX = r * (16 * Math.pow(Math.sin(t), 3)) + x;
        var lineToY = -r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) + y;
        ctx.lineTo(lineToX, lineToY);
        // console.log(lineToX + ' ' + lineToY);
    }
    // 雪花
    CanvasRenderingContext2D.prototype.strokeSnowFlake = function(r, x, y, /*optional*/ strokeColor) {
        snowFlakeGraph(this, r, x, y, strokeColor);
    };
    // 雪花（动画）
    CanvasRenderingContext2D.prototype.animateStrokeSnowFlake = function(r, x, y, /*optional*/ strokeColor, /*optional*/ millisec) {
        animateSnowFlakeGraph(this, r, x, y, strokeColor, millisec);
    };
    // 绘制雪花图形
    function snowFlakeGraph(ctx, r, x, y, strokeColor) {
        //画一个大雪花
        var bigSnow = canvasSingleSnow(r, strokeColor);
        ctx.drawImage(bigSnow, 0, 0, bigSnow.width, bigSnow.height,
            x, y, r * 2, r * 2);
        //画六个小雪花
        var smallSnow = canvasSingleSnow(r / 3, strokeColor);
        var sizeSnow = r * 3 / 5; //小雪花的尺寸(直径)
        var rSnow = r - sizeSnow / 2; //小雪花的位置(离大雪花中心的距离)
        for (var i = 0; i < 6; i++) {
            ctx.save();
            ctx.translate(r + x, r + y);
            ctx.rotate(Math.PI * 2 * i / 6);
            ctx.drawImage(smallSnow, 0, 0, smallSnow.width, smallSnow.height,
                rSnow - sizeSnow / 2, -sizeSnow / 2, sizeSnow, sizeSnow);
            ctx.restore();
        }
    }
    // 动画绘制规则图形
    function animateSnowFlakeGraph(ctx, r, x, y, strokeColor, millisec) {
        var n = 0, //循环数
            timer; //定时器
            millisec = millisec || 100;
        //画一个大雪花
        var bigSnow = canvasSingleSnow(r, strokeColor);
        ctx.drawImage(bigSnow, 0, 0, bigSnow.width, bigSnow.height,
            x, y, r * 2, r * 2);
        //画六个小雪花
        var smallSnow = canvasSingleSnow(r / 3, strokeColor);
        var sizeSnow = r * 3 / 5; //小雪花的尺寸(直径)
        var rSnow = r - sizeSnow / 2; //小雪花的位置(离大雪花中心的距离)
        timer = setInterval(function() {
            n++;
            ctx.save();
            ctx.translate(r + x, r + y);
            ctx.rotate(Math.PI * 2 * n / 6);
            ctx.drawImage(smallSnow, 0, 0, smallSnow.width, smallSnow.height,
                rSnow - sizeSnow / 2, -sizeSnow / 2, sizeSnow, sizeSnow);
            if (n > 6) {
                clearInterval(timer);
            }
            ctx.restore();
        }, millisec);
    }
    // 画雪花的六条线（离屏canvas）
    function canvasSingleSnow(snowSize, strokeColor) {
        var singleSnow = document.createElement('canvas');
        var ctxSingle = singleSnow.getContext('2d');
        singleSnow.setAttribute('width', snowSize * 2);
        singleSnow.setAttribute('height', snowSize * 2);
        ctxSingle.translate(snowSize, snowSize); //定位原点到画布中心
        for (var i = 0; i < 6; i++) { //画六条线
            ctxSingle.save();
            ctxSingle.rotate(Math.PI * 2 * i / 6);
            snowFlakeLine(ctxSingle, 0, 0, snowSize, 0, strokeColor);
            ctxSingle.restore();
        }
        return singleSnow;
    }
    // 封装雪花画线函数
    function snowFlakeLine(ctx, x1, y1, x2, y2, strokeColor) {
        ctx.beginPath();
        ctx.strokeStyle = strokeColor || '#fd5';
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
     }
})();