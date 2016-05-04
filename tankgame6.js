/*为了颜色方便取到，定义一个颜色数组*/
var heroColor = new Array("#BA9658","#FEF26E");
var enemyColor = new Array("#00A2B5","#00FEFE");

var canvas1 = document.getElementById('tankMap');
var cxt = canvas1.getContext("2d");
 /*面向对象的思想*/
 /*坦克类*/
function Tank(x,y,direct,color){
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.direct = direct;
    this.color = color;
    this.isLive=true;
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
    //坦克类应该有一个画出坦克的方法
    this.drawTank = function(){
        /*把绘制坦克封装成一个函数，将来可以作为成员函数 */
        /*将来找个函数可以换自己的坦克，也可以画敌人的坦克*/
        /*根据方向的不同，改变*/
        if(this.isLive){         
            switch(this.direct){
            case 0://向上
            case 2:
                cxt.fillStyle=this.color[0];
                cxt.fillRect(this.x,this.y,5,30);
                cxt.fillRect(this.x+15,this.y,5,30);
                cxt.fillRect(this.x+6,this.y+5,8,20);
                cxt.fillStyle = this.color[1];
                cxt.arc(this.x+10,this.y+15,4,0,360,false);
                cxt.fill();

                cxt.strokeStyle=this.color[1];
                cxt.lineWidth = 1.5;
                cxt.beginPath();
                cxt.moveTo(this.x+10,this.y+15);
                if(this.direct==0){
                    cxt.lineTo(this.x+10,this.y);
                }else if(this.direct==2){
                    cxt.lineTo(this.x+10,this.y+30);
                }
                cxt.closePath();
                cxt.stroke();
                break;
            case 1://向右
            case 3:
                cxt.fillStyle="#BA9658";
                cxt.fillRect(this.x,this.y,30,5);
                cxt.fillRect(this.x,this.y+15,30,5);
                cxt.fillRect(this.x+5,this.y+6,20,8);
                cxt.fillStyle = "#FEF26E";
                cxt.arc(this.x+15,this.y+10,4,0,360,false);
                cxt.fill();

                cxt.strokeStyle="#FEF26E";
                cxt.lineWidth = 1.5;
                cxt.beginPath();
                cxt.moveTo(this.x+15,this.y+10);
                if(this.direct==1){
                    cxt.lineTo(this.x+30,this.y+10);
                }else if(this.direct==3){
                    cxt.lineTo(this.x,this.y+10);
                }
                cxt.closePath();
                cxt.stroke();
                break;
            }
        }

    }
}
/*我的坦克类，继承坦克类，使用继承*/
function Hero(x,y,direct){
    Tank.call(this,x,y,direct,heroColor);
    // hero有可以发子弹的方法
    this.shotEnemy = function(){
        //创建子弹，子弹的位置应该和hero有关系，并且可以和hero的方法有关系
        var heroBullet = null;
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
        heroBullets.push(heroBullet);
        var timer = window.setInterval("heroBullets["+(heroBullets.length-1)+"].run()",50);
        heroBullets[heroBullets.length-1].timer = timer;
    }
    this.isHitEnemyTank = function(){
        //取出每一颗子弹进行判断，前提是，子弹要存活
        for(var i = 0;i < heroBullets.length;i ++){
            var heroBullet = heroBullets[i];
            if(heroBullet.isLive){
                //让这个存活的子弹和每个敌人子弹去判断，是否击中了敌人的坦克
                for(var j = 0;j < EnemyTanks.length;j++){
                    var enemyTank = EnemyTanks[j];
                    if(enemyTank.isLive){
                        switch(enemyTank.direct){
                            case 0:
                            case 2:
                                if(heroBullet.x>=enemyTank.x && heroBullet.x<=enemyTank.x+20 && heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+30){
                                    enemyTank.isLive = false;
                                    heroBullet.isLive = false;
                                }
                                break;
                            case 1:
                            case 3:
                                if(heroBullet.x>=enemyTank.x && heroBullet.x<=enemyTank.x+30 && heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+20){
                                    enemyTank.isLive = false;
                                    heroBullet.isLive = false;
                                }
                                break;
                        }
                    }
                }
            }
        }
    }
}
/*敌人的坦克类，继承坦克类，EnemyTank类*/
function EnemyTank(x,y,direct){
    Tank.call(this,x,y,direct,enemyColor);
}

/*子弹类*/
function Bullet(x,y,direct,speed){
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.direct = direct;
    this.timer = null;
    this.isLive = true;//如果创建了一个子弹那么刚开始就是活的
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
    /*画出所有的子弹*/
    this.drawHeroBullet = function(){
        if(this.isLive){
            cxt.fillStyle="#FEF26E";
            cxt.fillRect(this.x,this.y,2,2);
        }
    }
}
