data = []; //��Ԫ���е���������
score = 0; //����
best = 0; //�ۻ����
state = 1;
RUNNING = 1;
GAME_OVER = 0;
PLAYING = 2; //�������ڲ�����
//���ڼ��غ�
window.onload = function () {//�¼�������
    start();
    //console.log(game.moveLeftInRow(0));
    document.onkeydown = function () {
        /*step1���Ȼ���¼�����
        �����¼�����ʱ�����Զ�����һ��event����
        event�����з�װ���¼���Ϣ�����磺�������꣬�����¼���Ԫ�أ������ı��
        step2������¼������еİ������
        */
        if (state != PLAYING) {
            var event = window.event || arguments[0]; //��ȡ�¼��������event����||�������ڽ�����������������  
            if (state == RUNNING) {
                if (event.keyCode == 37) {//��
                    moveLeft();
                } else if (event.keyCode == 39) {//��
                    moveRight();
                }
                else if (event.keyCode == 38) {//��
                    moveUp();
                }
                else if (event.keyCode == 40) {//��
                    moveDown();
                }
            } else if (event.keyCode == 13) {//Enter
                start();
            }
        }
    }
}
//������Ϸʱ����
function start() {
    data = [[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]];
    //���������λ������2��4
    score = 0;
    best = 0;
    state = RUNNING;
    var div = document.getElementById("gameOver");
    div.style.display = "none";
    randomNum();
    randomNum();
    updateView();
}
function isFull() {//�ж��Ƿ�����
    /*����data���飬��ֻҪ����==0���ͷ���false������(����������)�˳�ѭ��������true*/
    //row��=4  col[��]��=4
    for (var row = 0; row < 4; row++) {//this.data.length=4
        for (var col = 0; col < 4; col++) {//this.data[row].length=4
            if (data[row][col] == 0) {
                return false;

            }
        }
    }
    return true;
}
//�����λ������2��4
function randomNum() {
    if (isFull()) { return; } //������˾Ͳ�������
    //ѭ��������true(����ѭ����break����ѭ��)     
    while (true) {
        var row = Math.floor(Math.random() * 2); //�����0��3��������һ�����±�row
        var col = Math.floor(Math.random() * 2); //�����0��3��������һ�����±�col
        if (data[row][col] == 0) {
            //�����λ��==0�����ѡ��2��4:���Math.random()<0.5,ѡ2������ѡ4��
            data[row][col] = Math.random() < 0.5 ? 2 : 4;
            if (data[row][col] > best) { best = data[row][col]; }
            break; //�����λ���˳�ѭ��
        }
    }
}
//����Ϸ����������µ�ҳ����
function updateView() {
    //������ά�����е�ÿ��Ԫ��
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            var div = document.getElementById("c" + row + col); // ͨ��ƴdiv��id(c+row+col)�ҵ���ǰԪ�ض�Ӧ��div        
            div.innerHTML = data[row][col] == 0 ? "" : data[row][col]; //����ǰԪ�ص�ֵ����div��,�����ǰֵ==0������Ϊ�գ�������뵱ǰֵ
            div.className = data[row][col] == 0 ? "cell" : "cell n" + data[row][col]; //���ݵ�ǰԪ��ֵ�޸�div��ʽ,�����ǰֵ==0����ʽ��Ϊcell������Ϊcell n+��ǰֵ
        }
    }
    /*����������span*/
    var span = document.getElementById("score");
    span.innerHTML = score;
    var span2 = document.getElementById("best");
    span2.innerHTML = best;
    /*�ж���Ϸ����
    �����Ϸ������this.state=GAME_OVER
    ��ʾ��Ϸ����div
    �ҵ�gameOverdiv
    �޸�div��style.display*/
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
//�ж���Ϸ�Ƿ����
function isGameOver() {
    /*�ܼ���ʱ����false�����򷵻�true*/
    //�ж��Ƿ����� ���(!false){����false}
    if (!isFull()) { return false; }
    /*�Ѿ�����*/	/*if(this.canLeft()||this.canRight()||this.canUp()||this.canDown()){return false;}
		else{return ture;}*/
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            if (col < 3) {/*��������Ƿ����*/
                if (data[row][col] == data[row][col + 1]) {
                    return false;
                }
            }
            if (row < 3) {/*��������Ƿ����*/
                if (data[row][col] == data[row + 1][col]) {
                    return false;
                }
            }
        }
    }
    return true;
}
//�ƶ�����
function setT() {
    state = PLAYING;
    animation.start();
    setTimeout(function () {
        state = RUNNING;
        randomNum();
        updateView();

    }, animation.times * animation.interval);
}
//�ж��ܷ�����
function canLeft() {
    /*����ÿ��Ԫ�أ�������г��⣩��ֻҪ��������Ԫ�������==0���ߵ�ǰֵ==���ֵreturn true  ���ѭ������������  return false*/
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
//ʵ������������
function moveLeft() {
    if (canLeft()) {//���ж��ܷ�����
        for (var row = 0; row < 4; row++) {
            //��0λ�ÿ�ʼ��2��������row���е�ÿ��Ԫ��
            for (var col = 0; col <= 2; col++) {
                var nextCol = getNextRight(row, col); //������в�Ϊ0��Ԫ�ص�nextCol�±� �����ƶ�
                if (nextCol == -1) {//���nextCol==-1 ˵��û�п��ƶ��� ����
                    break;
                } else {
                    if (data[row][col] == 0) { //����Լ�==0������һ��Ԫ�ص�ֵ�滻�Լ�������һ��Ԫ�ص�ֵ��Ϊ0����col����ԭ��
                        data[row][col] = data[row][nextCol];
                        data[row][nextCol] = 0;
                        animation.addTask("" + row + nextCol, "" + row + col);
                        col--;

                    } else if (data[row][col] == data[row][nextCol]) {//����Լ�==��һ��Ԫ�� ���Լ�*2 ����һ��Ԫ����Ϊ0
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
function getNextRight(row, col) {//��õ�ǰ���У�ָ��λ���Ҳ��һ����Ϊ0������������һ��Ϊ0������λ��
    /*������ǰλ���Ҳ�ÿ��Ԫ��	ֻҪ���֣�=0�ģ��ͷ�����λ���±�nextCol �˳�ѭ��������-1*/
    for (var i = col + 1; i < 4; i++) {
        if (data[row][i] != 0) {
            return i;
        }
    }
    return -1;
}
//�ж��ܷ�����
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
//�����ƶ�������
function moveRight() {
    if (canRight()) {
        for (var row = 0; row < 4; row++) {
            /*�������������飬�������Ԫ�س��⣩*/
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
    /*�ӵ�ǰλ����������һ����Ϊ0����*/
    for (var i = col - 1; i >= 0; i--) {
        if (data[row][i] != 0) {
            return i;
        }
    }
    return -1;
}
//���ж��ܷ�����
function canUp() {
    for (var row = 1; row < 4; row++) {//�ӵڶ��п�ʼ
        for (var col = 0; col < 4; col++) {
            if (data[row][col] != 0) {
                if (data[row - 1][col] == 0 || data[row][col] == data[row - 1][col]) {//��Ϊ0���������
                    return true;
                }
            }
        }
    }
    return false;
}
//�����ƶ�������
function moveUp() {
    if (canUp()) {
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 3; row++) {
                var nextRow = getNextDown(row, col);
                if (nextRow == -1) {
                    break;
                } else {
                    if (data[row][col] == 0) {//��һ������Ϊ0
                        data[row][col] = data[nextRow][col]; //��һ������=��һ������ 
                        data[nextRow][col] = 0; //��һ������Ϊ0
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
//ÿһ�����ȫ��0����-1��������ƶ��ĸ��ӷ��ؿ��ƶ�����һ��
function getNextDown(row, col) {
    for (var i = row + 1; i < 4; i++) {
        if (data[i][col] != 0) {
            return i;
        }
    }
    return -1;
}
//�ж��ܷ�����
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
//�����ƶ�������
function moveDown() {
    if (canDown()) {
        for (var col = 0; col < 4; col++) {
            /*�������������飬�������Ԫ�س��⣩*/
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
//ÿһ�����ȫ��0����-1��������ƶ��ĸ��ӷ��ؿ��ƶ�����һ��
function getNextUp(row, col) {
    /*�ӵ�ǰλ����������һ����Ϊ0����*/
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
/*moveStep��������ǰԪ�ض����ƶ�һ��*/
Task.prototype.moveStep = function () {//Task�Ƕ��� prototype�������
    var style = getComputedStyle(this.obj, null); //getComputedStyle ��ȡ��ʽ �ڶ���������α�ࡱ�Ǳ���ģ��������α�࣬����Ϊnull��
    var top = parseInt(style.top);
    var left = parseInt(style.left);
    this.obj.style.top = top + this.topStep + "px";
    this.obj.style.left = left + this.leftStep + "px";
}
/*���Ԫ�ض������ʽ��ʹ�䷵��ԭ��*/
Task.prototype.clear = function () {
    this.obj.style.left = "";
    this.obj.style.top = "";
}
var animation = {
    times: 10, //ÿ������10�����
    interval: 10, //10������һ��	
    timer: null, //���涨ʱ��id������
    tasks: [], //����ÿ����Ҫ�ƶ�������

    addTask: function (source, target) {
        console.log(source + "," + target);
        var sourceDiv = document.getElementById("c" + source); //��ȡҪ�ƶ��ĸ���
        var targetDiv = document.getElementById("c" + target); //��ȡҪ�Ƶ��ĸ���
        var sourceStyle = getComputedStyle(sourceDiv); //��ȡ������ʽ
        var targetStyle = getComputedStyle(targetDiv);
        var topStep = (parseInt(targetStyle.top) - parseInt(sourceStyle.top)) / this.times;
        var leftStep = (parseInt(targetStyle.left) - parseInt(sourceStyle.left)) / this.times;
        var task = new Task(sourceDiv, topStep, leftStep);
        this.tasks.push(task); //�������ĩβ���һ������Ԫ��
    },

    start: function () {
        this.timer = setInterval(function () {//��ʱ��
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