data = []; //单元格中的所有数字
score = 0; //分数
best = 0; //累积最高
state = 1;
RUNNING = 1;
GAME_OVER = 0;
PLAYING = 2; //动画正在播放中
//窗口加载后
window.onload = function () {//事件处理函数
    start();
    //console.log(game.moveLeftInRow(0));
    document.onkeydown = function () {
        /*step1：先获得事件对象
        所有事件发生时，都自动创建一个event对象
        event对象中封装了事件信息，比如：鼠标的坐标，触发事件的元素，按键的编号
        step2：获得事件对象中的按键编号
        */
        if (state != PLAYING) {
            var event = window.event || arguments[0]; //获取事件触发后的event对象，||经常用于解决浏览器兼容性问题  
            if (state == RUNNING) {
                if (event.keyCode == 37) {//左
                    moveLeft();
                } else if (event.keyCode == 39) {//右
                    moveRight();
                }
                else if (event.keyCode == 38) {//上
                    moveUp();
                }
                else if (event.keyCode == 40) {//下
                    moveDown();
                }
            } else if (event.keyCode == 13) {//Enter
                start();
            }
        }
    }
}
//启动游戏时调用
function start() {
    data = [[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]];
    //在两个随机位置生成2或4
    score = 0;
    best = 0;
    state = RUNNING;
    var div = document.getElementById("gameOver");
    div.style.display = "none";
    randomNum();
    randomNum();
    updateView();
}
function isFull() {//判断是否已满
    /*遍历data数组，否只要发现==0，就返回false，否则(即格子满了)退出循环，返回true*/
    //row行=4  col[行]列=4
    for (var row = 0; row < 4; row++) {//this.data.length=4
        for (var col = 0; col < 4; col++) {//this.data[row].length=4
            if (data[row][col] == 0) {
                return false;

            }
        }
    }
    return true;
}
//在随机位置生成2或4
function randomNum() {
    if (isFull()) { return; } //如果满了就不用生成
    //循环条件：true(无限循环，break跳出循环)     
    while (true) {
        var row = Math.floor(Math.random() * 2); //随机在0到3行中生成一个行下标row
        var col = Math.floor(Math.random() * 2); //随机在0到3列中生成一个列下标col
        if (data[row][col] == 0) {
            //如果该位置==0，随机选择2或4:如果Math.random()<0.5,选2，否则选4；
            data[row][col] = Math.random() < 0.5 ? 2 : 4;
            if (data[row][col] > best) { best = data[row][col]; }
            break; //放入该位置退出循环
        }
    }
}
//将游戏数据整体更新到页面上
function updateView() {
    //遍历二维数组中的每个元素
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            var div = document.getElementById("c" + row + col); // 通过拼div的id(c+row+col)找到当前元素对应的div        
            div.innerHTML = data[row][col] == 0 ? "" : data[row][col]; //将当前元素的值放入div中,如果当前值==0，内容为空，否则放入当前值
            div.className = data[row][col] == 0 ? "cell" : "cell n" + data[row][col]; //根据当前元素值修改div样式,如果当前值==0，样式名为cell，否则为cell n+当前值
        }
    }
    /*将分数放入span*/
    var span = document.getElementById("score");
    span.innerHTML = score;
    var span2 = document.getElementById("best");
    span2.innerHTML = best;
    /*判断游戏结束
    如果游戏结束，this.state=GAME_OVER
    显示游戏结束div
    找到gameOverdiv
    修改div的style.display*/
    var div = document.getElementById("gameOver");
    if (isGameOver() || best == 2048) {
        div.style.display = "block";
        if (isGameOver()) {div.innerHTML = div.innerHTML.replace(/You Win!/g, "Game Over!");}
        if (best == 2048) {div.innerHTML = div.innerHTML.replace(/Game Over/g, "You Win");}
        state = GAME_OVER;
        var finalSocre = document.getElementById("finalScore");
        finalSocre.innerHTML = score;
        var finalBest = document.getElementById("finalBest");
        finalBest.innerHTML = best;
    }
}
//判断游戏是否结束
function isGameOver() {
    /*能继续时返回false，否则返回true*/
    //判断是否满了 如果(!false){返回false}
    if (!isFull()) { return false; }
    /*已经满了*/	/*if(this.canLeft()||this.canRight()||this.canUp()||this.canDown()){return false;}
		else{return ture;}*/
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            if (col < 3) {/*检查左右是否相等*/
                if (data[row][col] == data[row][col + 1]) {
                    return false;
                }
            }
            if (row < 3) {/*检查上下是否相等*/
                if (data[row][col] == data[row + 1][col]) {
                    return false;
                }
            }
        }
    }
    return true;
}
//移动调用
function setT() {
    state = PLAYING;
    animation.start();
    setTimeout(function () {
        state = RUNNING;
        randomNum();
        updateView();

    }, animation.times * animation.interval);
}
//判断能否左移
function canLeft() {
    /*遍历每个元素（最左侧列除外），只要发现任意元素左侧数==0或者当前值==左侧值return true  如果循环正常结束，  return false*/
    for (var row = 0; row < 4; row++) {
        for (var col = 1; col < 4; col++) {
            if (data[row][col] != 0) {
                if (data[row][col - 1] == 0 || data[row][col] == data[row][col - 1]) {
                    return true;
                }
            }
        }
    }
    return false;
}
//实现左移所有行
function moveLeft() {
    if (canLeft()) {//先判断能否左移
        for (var row = 0; row < 4; row++) {
            //从0位置开始到2结束遍历row行中的每个元素
            for (var col = 0; col <= 2; col++) {
                var nextCol = getNextRight(row, col); //获得这行不为0的元素的nextCol下标 用来移动
                if (nextCol == -1) {//如果nextCol==-1 说明没有可移动的 结束
                    break;
                } else {
                    if (data[row][col] == 0) { //如果自己==0，用下一个元素的值替换自己，将下一个元素的值设为0，让col留在原地
                        data[row][col] = data[row][nextCol];
                        data[row][nextCol] = 0;
                        animation.addTask("" + row + nextCol, "" + row + col);
                        col--;

                    } else if (data[row][col] == data[row][nextCol]) {//如果自己==下一个元素 将自己*2 将下一个元素设为0
                        data[row][col] *= 2;
                        score += data[row][col];
                        if (data[row][col] > best) best = data[row][col];
                        data[row][nextCol] = 0;
                        animation.addTask("" + row + nextCol, "" + row + col);
                    }
                }
            }
        }
        setT();
    }
}
function getNextRight(row, col) {//获得当前行中，指定位置右侧第一个不为0的数，返回下一个为0的数的位置
    /*遍历当前位置右侧每个元素	只要返现！=0的，就返回其位置下标nextCol 退出循环，返回-1*/
    for (var i = col + 1; i < 4; i++) {
        if (data[row][i] != 0) {
            return i;
        }
    }
    return -1;
}
//判断能否右移
function canRight() {
    for (var row = 0; row < 4; row++) {
        for (var col = 2; col >= 0; col--) {
            if (data[row][col] != 0) {
                if (data[row][col + 1] == 0 || data[row][col] == data[row][col + 1]) {
                    return true;
                }
            }
        }
    }
    return false;
}
//向右移动所有行
function moveRight() {
    if (canRight()) {
        for (var row = 0; row < 4; row++) {
            /*从右向左遍历检查，（最左边元素除外）*/
            for (var col = 3; col > 0; col--) {
                var nextCol = getNextLeft(row, col);
                if (nextCol == -1) {
                    break;
                } else {
                    if (data[row][col] == 0) {
                        data[row][col] = data[row][nextCol];
                        data[row][nextCol] = 0;
                        animation.addTask("" + row + nextCol, "" + row + col);
                        col++;
                    } else if (data[row][col] == data[row][nextCol]) {
                        data[row][col] *= 2;
                        score += data[row][col];
                        if (data[row][col] > best) best = data[row][col];
                        data[row][nextCol] = 0;
                        animation.addTask("" + row + nextCol, "" + row + col);
                    }
                }
            }
        }
        setT();
    }
}
function getNextLeft(row, col) {
    /*从当前位置向左，找下一个不为0的数*/
    for (var i = col - 1; i >= 0; i--) {
        if (data[row][i] != 0) {
            return i;
        }
    }
    return -1;
}
//先判断能否上移
function canUp() {
    for (var row = 1; row < 4; row++) {//从第二行开始
        for (var col = 0; col < 4; col++) {
            if (data[row][col] != 0) {
                if (data[row - 1][col] == 0 || data[row][col] == data[row - 1][col]) {//上为0或上下相等
                    return true;
                }
            }
        }
    }
    return false;
}
//向上移动所有行
function moveUp() {
    if (canUp()) {
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 3; row++) {
                var nextRow = getNextDown(row, col);
                if (nextRow == -1) {
                    break;
                } else {
                    if (data[row][col] == 0) {//上一个格子为0
                        data[row][col] = data[nextRow][col]; //上一个格子=下一个格子 
                        data[nextRow][col] = 0; //下一个格子为0
                        animation.addTask("" + nextRow + col, "" + row + col);
                        row--;
                    } else if (data[row][col] == data[nextRow][col]) {
                        data[row][col] *= 2;
                        score += data[row][col];
                        if (data[row][col] > best) best = data[row][col];
                        data[nextRow][col] = 0;
                        animation.addTask("" + nextRow + col, "" + row + col);
                    }
                }
            }
        }
        setT();
    }
}
//每一列如果全是0返回-1，如果有移动的格子返回可移动的那一列
function getNextDown(row, col) {
    for (var i = row + 1; i < 4; i++) {
        if (data[i][col] != 0) {
            return i;
        }
    }
    return -1;
}
//判断能否下移
function canDown() {
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 4; col++) {
            if (data[row][col] != 0) {
                if (data[row + 1][col] == 0 || data[row][col] == data[row + 1][col]) {
                    return true;
                }
            }
        }
    }
    return false;
}
//向下移动所有行
function moveDown() {
    if (canDown()) {
        for (var col = 0; col < 4; col++) {
            /*从右向左遍历检查，（最左边元素除外）*/
            for (var row = 3; row > 0; row--) {
                var nextRow = getNextUp(row, col);
                if (nextRow == -1) {
                    break;
                } else {
                    if (data[row][col] == 0) {
                        data[row][col] = data[nextRow][col];
                        data[nextRow][col] = 0;
                        animation.addTask("" + nextRow + col, "" + row + col);
                        row++;
                    } else if (data[row][col] == data[nextRow][col]) {
                        data[row][col] *= 2;
                        score += data[row][col];
                        if (data[row][col] > best) best = data[row][col];
                        data[nextRow][col] = 0;
                        animation.addTask("" + nextRow + col, "" + row + col);
                    }
                }
            }
        }
        setT();
    }
}
//每一列如果全是0返回-1，如果有移动的格子返回可移动的那一列
function getNextUp(row, col) {
    /*从当前位置向左，找下一个不为0的数*/
    for (var i = row - 1; i >= 0; i--) {
        if (data[i][col] != 0) {
            return i;
        }
    }
    return -1;
}

// animation
function Task(obj, topStep, leftStep) {
    this.obj = obj;
    this.topStep = topStep;
    this.leftStep = leftStep;
}
/*moveStep方法将当前元素对象移动一步*/
Task.prototype.moveStep = function () {//Task是对象 prototype添加属性
    var style = getComputedStyle(this.obj, null); //getComputedStyle 获取样式 第二个参数“伪类”是必需的（如果不是伪类，设置为null）
    var top = parseInt(style.top);
    var left = parseInt(style.left);
    this.obj.style.top = top + this.topStep + "px";
    this.obj.style.left = left + this.leftStep + "px";
}
/*清楚元素对象的样式，使其返回原地*/
Task.prototype.clear = function () {
    this.obj.style.left = "";
    this.obj.style.top = "";
}
var animation = {
    times: 10, //每个动画10步完成
    interval: 10, //10毫秒迈一步	
    timer: null, //保存定时器id的属性
    tasks: [], //保存每次需要移动的任务

    addTask: function (source, target) {
        console.log(source + "," + target);
        var sourceDiv = document.getElementById("c" + source); //获取要移动的格子
        var targetDiv = document.getElementById("c" + target); //获取要移到的格子
        var sourceStyle = getComputedStyle(sourceDiv); //获取所有样式
        var targetStyle = getComputedStyle(targetDiv);
        var topStep = (parseInt(targetStyle.top) - parseInt(sourceStyle.top)) / this.times;
        var leftStep = (parseInt(targetStyle.left) - parseInt(sourceStyle.left)) / this.times;
        var task = new Task(sourceDiv, topStep, leftStep);
        this.tasks.push(task); //向数组的末尾添加一个或多个元素
    },

    start: function () {
        this.timer = setInterval(function () {//计时器
            for (var i = 0; i < animation.tasks.length; i++) {
                animation.tasks[i].moveStep();
            }
            animation.times--;
            if (animation.times == 0) {
                for (var i = 0; i < animation.tasks.length; i++) {
                    animation.tasks[i].clear();
                }
                clearInterval(animation.timer);
                animation.timer = null;
                animation.tasks = [];
                animation.times = 10;
            }
        }, this.interval);
    }
}