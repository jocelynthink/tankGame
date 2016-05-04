/*为了颜色方便取到，定义一个颜色数组*/
var heroColor = new Array("#BA9658","#FEF26E");
var enemyColor = new Array("#00A2B5","#00FEFE");

var canvas1 = document.getElementById('tankMap');
var cxt = canvas1.getContext("2d");
 /*面向对象的思想*/
function Tank(x,y,direct,color){
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.direct = direct;
    this.color = color;
    this.moveUp = function(){
        this.y -=this.speed;
        this.direct= 0;
    };

    this.moveRight = function(){
        this.x +=this.speed;
        this.direct = 1;
    };

    this.moveDown = function(){
        this.y+=this.speed;
        this.direct = 2;
    };
    this.moveLeft = function(){
        this.x-=this.speed;
        this.direct = 3;
    };
}
/*定义一个Hero坦克类,，使用继承*/
function Hero(x,y,direct){
    Tank.call(this,x,y,direct,heroColor);
    // hero有可以发子弹的方法
    this.shotEnemy = function(){
        //创建子弹，子弹的位置应该和hero有关系，并且可以和hero的方法有关系
        switch(this.direct){
            case 0:
                heroBullet = new Bullet(this.x+9,this.y,this.direct);
                break;
            case 1:
                heroBullet = new Bullet(this.x+30,this.y+9,this.direct);
                break;
            case 2:
                heroBullet = new Bullet(this.x+9,this.y+30,this.direct);
                break;
            case 3:
                heroBullet = new Bullet(this.x,this.y+9,this.direct);
                break;
        }
        /*调用子弹的run函数*/
        var timer = window.setInterval("heroBullet.run()",50);
        heroBullet.timer = timer;
    }
}
function drawHeroBullet(){
    if(heroBullet != null && heroBullet.isLive){
        cxt.fillStyle="#FEF26E";
        cxt.fillRect(heroBullet.x,heroBullet.y,2,2);
    }
    
}
/*定义一个EnemyTank类*/
function EnemyTank(x,y,direct){
    Tank.call(this,x,y,direct,enemyColor);
}

/*把绘制坦克封装成一个函数，将来可以作为成员函数 */
/*将来找个函数可以换自己的坦克，也可以画敌人的坦克*/
function drawTank(tank){
    /*根据方向的不同，改变*/
    switch(tank.direct){
    case 0://向上
    case 2:
        cxt.fillStyle=tank.color[0];
        cxt.fillRect(tank.x,tank.y,5,30);
        cxt.fillRect(tank.x+15,tank.y,5,30);
        cxt.fillRect(tank.x+6,tank.y+5,8,20);
        cxt.fillStyle = tank.color[1];
        cxt.arc(tank.x+10,tank.y+15,4,0,360,false);
        cxt.fill();

        cxt.strokeStyle=tank.color[1];
        cxt.lineWidth = 1.5;
        cxt.beginPath();
        cxt.moveTo(tank.x+10,tank.y+15);
        if(tank.direct==0){
            cxt.lineTo(tank.x+10,tank.y);
        }else if(tank.direct==2){
            cxt.lineTo(tank.x+10,tank.y+30);
        }
        cxt.closePath();
        cxt.stroke();
        break;
    case 1://向右
    case 3:
        cxt.fillStyle="#BA9658";
        cxt.fillRect(tank.x,tank.y,30,5);
        cxt.fillRect(tank.x,tank.y+15,30,5);
        cxt.fillRect(tank.x+5,tank.y+6,20,8);
        cxt.fillStyle = "#FEF26E";
        cxt.arc(tank.x+15,tank.y+10,4,0,360,false);
        cxt.fill();

        cxt.strokeStyle="#FEF26E";
        cxt.lineWidth = 1.5;
        cxt.beginPath();
        cxt.moveTo(tank.x+15,tank.y+10);
        if(tank.direct==1){
            cxt.lineTo(tank.x+30,tank.y+10);
        }else if(tank.direct==3){
            cxt.lineTo(tank.x,tank.y+10);
        }
        cxt.closePath();
        cxt.stroke();
        break;
    }
}

/*子弹类*/
function Bullet(x,y,direct,speed){
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.direct = direct;
    this.timer = null;
    this.isLive = true;
    this.run = function run(){
        //在改变这个子弹的坐标时，先判断子弹是否已经到边界了
        if(this.x<=0 || this.x>=400 ||this.y <=0 || this.y>=400){
            //子弹的定时器要停止
            window.clearInterval(this.timer);
            this.isLive = false;
        }else{
            //这个可以去修改坐标
            switch(this.direct){
                case 0:
                    this.y -= this.speed;
                    break;
                case 1:
                    this.x += this.speed;
                    break;
                case 2:
                    this.y += this.speed;
                    break;
                case 3:
                    this.x -= this.speed;
                    break;
            }
        }
        
        document.getElementById("data").innerText = "子弹x=" + this.x +",子弹y=" + this.y;
    }
}