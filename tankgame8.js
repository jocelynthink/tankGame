/*8.防止敌人的坦克互相碰撞*/
/*为了颜色方便取到，定义一个颜色数组*/
var heroColor = new Array("#BA9658","#FEF26E");
var enemyColor = new Array("#00A2B5","#00FEFE");
/*显示我的坦克*/
var hero = null;
//定义我的子弹
var heroBullets = new Array();

/*将敌人的坦克放在数组中*/
var EnemyTanks = new Array();
/*将敌人的子弹放在一个数组中*/
var enemyBullets = new Array();
//定义一个敌人坦克爆炸的效果
var bombs = new Array();
//创建障碍物
var barriers = new Array();

var canvas1 = document.getElementById('tankMap');
var cxt = canvas1.getContext("2d");
/*敌人坦克的数量*/
var enemySize = undefined;

var startGame = document.getElementById("startgame");
startGame.addEventListener("click",startgame,false);

function getEnemySize(){
    enemySize = parseInt(document.getElementById("enemySize").value);
}
function updateGoal(data){
    var goal = document.getElementById("goal");
    goal.innerText = data;
}
function startgame(){
    getEnemySize();
    hero = new Hero(140,270,0);
    for(var i = 0;i < enemySize;i ++){
        //创建一个坦克,把坦克放入数组
        EnemyTanks[i] = new EnemyTank((i+1)*50.0,0,2);
        // 启动这个敌人的坦克
        window.setInterval("EnemyTanks["+i+"].run()",50);
        //当创建这个敌人的坦克的时候，就分配子弹
        enemyBullets[i] = new Bullet(EnemyTanks[i].x+9,EnemyTanks[i].y+30,2,1,"enemy",EnemyTanks[i]);
        //启动该子弹
        enemyBullets[i].timer = window.setInterval("enemyBullets["+i+"].run()",50);
    }
    //障碍物类型0
    for (var i = 0; i < 40; i++) {
        barriers[i] = new Barrier(60+6*i,50,0,1,5,10,"yellow");
    }
    for(var i=40;i < 80;i ++){
        barriers[i] = new Barrier(60+6*(i-40),62,0,1,5,10,"yellow");
    }
    //障碍物类型1
    for(var i=80;i < 100;i ++){
        barriers[i] = new Barrier(60+12*(i-80),122,1,3,10,10,"white");
    }
    for(var i=100;i < 120;i ++){
        barriers[i] = new Barrier(60+12*(i-100),134,1,3,10,10,"white");
    }
    //障碍物类型2
    barriers[120] = new Barrier(60,194,2,0,240,24,"blue");
    //打开页面的时候就刷新
    flashTankMap();

    // 每隔100毫秒去刷新一个函数
    setInterval("flashTankMap()",100);
}
//专门写一个函数，用于定时刷新我们的作战区，把要在作战区出现的元素（自己的坦克，敌人的坦克，子弹，炸弹，障碍物...）->游戏的思想
function flashTankMap(){
    //把画布清除
    //重启绘制
    cxt.clearRect(0,0,400,300);
    /*画出我自己的坦克*/
    hero.drawTank();
    hero.isHitEnemyTank();
    /*画出自己的子弹,子弹飞效果怎么样时间，首先我们应该每隔一定时间来刷新这个作战区,子弹坐标在变化，感觉在动态变化*/
    /*子弹坐标如何发生变化，定时修改子弹的坐标*/
    /*画出所有的子弹*/
    for(var i=0;i < heroBullets.length;i ++){
        heroBullets[i].drawBullet();
    }
    /*画出敌人的坦克*/
    for(var i = 0;i < EnemyTanks.length;i ++){
        EnemyTanks[i].drawTank();
        //判断敌人的子弹是否击中了我的坦克
        EnemyTanks[i].isHitheroTank();
    }
    //画出敌人的子弹
    for(var i = 0;i < enemyBullets.length;i++){
        enemyBullets[i].drawBullet();
    }

    //敌人坦克爆炸效果
    for(var i = 0;i < bombs.length;i ++){
        bombs[i].drawEnemyBomb();
    }

    /*在画布上画出障碍物*/
    for(var i = 0;i < barriers.length;i++){
        barriers[i].drawBarrier();
    }
}
/*接受用户按键的函数*/
function getCommand(){
    var code = event.keyCode;
    switch(code){
        case 87://上 
           hero.moveUp();
            break;
        case 68: //右
            hero.moveRight();
            break;
        case 83://下
            hero.moveDown();
            break;
        case 65:// 左
            hero.moveLeft();
            break;
        case 74://j  发子弹
            hero.shotEnemy();
            break;
    }
    //把画布清除
    //重启绘制
    //重新绘制所有的敌人的坦克，
    //思想我们干脆写一个函数，专门用于定时刷新
    if(hero != null){
        flashTankMap();
    }
    
}
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
        //先判断坦克有没有碰到障碍物
        if(!this.isTouchBarrier()){
            this.y -=this.speed;
        }
        this.direct= 0;
    };

    this.moveRight = function(){
        if(!this.isTouchBarrier()){
            this.x +=this.speed;
        }
        this.direct = 1;
    };

    this.moveDown = function(){
        if(!this.isTouchBarrier()){
            this.y+=this.speed;
        }
        this.direct = 2;
    };
    this.moveLeft = function(){
        if(!this.isTouchBarrier()){
            this.x-=this.speed;
        }
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
                cxt.fillStyle=this.color[0];
                cxt.fillRect(this.x,this.y,30,5);
                cxt.fillRect(this.x,this.y+15,30,5);
                cxt.fillRect(this.x+5,this.y+6,20,8);
                cxt.fillStyle = this.color[1];
                cxt.arc(this.x+15,this.y+10,4,0,360,false);
                cxt.fill();

                cxt.strokeStyle=this.color[1];
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

     //判断坦克是否碰到了障碍物
    this.isTouchBarrier = function(){
        switch(this.direct){
            case 0://坦克向上
                for(var i =0;i < barriers.length;i++){
                    var barrier = barriers[i];
                    if(this.x>=barrier.x&&this.x<=barrier.x+barrier.width && this.y>=barrier.y && this.y<= barrier.y+ barrier.height){
                        return true;
                    }
                    if(this.x + 20 >=barrier.x && this.x + 20<=barrier.x+barrier.width && this.y>=barrier.y && this.y <= barrier.y + barrier.height){
                        return true;
                    }
                }
                break;               
            case 1:
                for(var i =0;i < barriers.length;i++){
                    var barrier = barriers[i];
                    if(this.x+30>=barrier.x&&this.x+30<=barrier.x+barrier.width && this.y>=barrier.y && this.y<= barrier.y+ barrier.height){
                        return true;
                    }
                    if(this.x + 30 >=barrier.x && this.x + 30<=barrier.x+barrier.width && this.y+20>=barrier.y && this.y+20 <= barrier.y + barrier.height){
                        return true;
                    }
                }
                break;     
            case 2:
                for(var i =0;i < barriers.length;i++){
                    var barrier = barriers[i];
                    if(this.x>=barrier.x&&this.x<=barrier.x+barrier.width && this.y+30>=barrier.y && this.y+30<= barrier.y+ barrier.height){
                        return true;
                    }
                    if(this.x + 20 >=barrier.x && this.x + 20<=barrier.x+barrier.width && this.y+30>=barrier.y && this.y +30<= barrier.y + barrier.height){
                        return true;
                    }
                }   
                break; 
            case 3:
                for(var i =0;i < barriers.length;i++){
                    var barrier = barriers[i];
                    if(this.x>=barrier.x&&this.x<=barrier.x+barrier.width && this.y>=barrier.y && this.y<= barrier.y+ barrier.height){
                        return true;
                    }
                    if(this.x  >=barrier.x && this.x <=barrier.x+barrier.width && this.y+20 >=barrier.y&& this.y+20 <= barrier.y + barrier.height){
                        return true;
                    }
                }     
                break;
            default:
                return false;
                break;
        }
    }
}
/*我的坦克类，继承坦克类，使用继承*/
function Hero(x,y,direct){
    Tank.call(this,x,y,direct,heroColor);
    this.goal = 0;
    // hero有可以发子弹的方法
    this.shotEnemy = function(){
        //创建子弹，子弹的位置应该和hero有关系，并且可以和hero的方法有关系
        var heroBullet = null;
        switch(this.direct){
            case 0:
                heroBullet = new Bullet(this.x+9,this.y,this.direct,1,"hero",this);
                break;
            case 1:
                heroBullet = new Bullet(this.x+30,this.y+9,this.direct,1,"hero",this);
                break;
            case 2:
                heroBullet = new Bullet(this.x+9,this.y+30,this.direct,1,"hero",this);
                break;
            case 3:
                heroBullet = new Bullet(this.x,this.y+9,this.direct,1,"hero",this);
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
                                   //创建一颗炸弹
                                   var bomb=new Bomb(enemyTank.x,enemyTank.y);
                                   //然后把该炸弹放入到bombs数组中
                                   bombs.push(bomb);
                                   /*更新我的分数*/
                                   this.goal +=1;
                                   updateGoal(this.goal);
                                   if(this.goal==enemySize){
                                        alert("你赢了!");
                                   }
                                }
                                break;
                            case 1:
                            case 3:
                                if(heroBullet.x>=enemyTank.x && heroBullet.x<=enemyTank.x+30 && heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+20){
                                    enemyTank.isLive = false;
                                    heroBullet.isLive = false;
                                    //创建一颗炸弹
                                    var bomb=new Bomb(enemyTank.x,enemyTank.y);
                                    //然后把该炸弹放入到bombs数组中
                                    bombs.push(bomb);
                                    this.goal +=1;
                                    updateGoal(this.goal);
                                    if(this.goal==enemySize){
                                         alert("你赢了!");
                                    }
                                }
                                break;
                        }
                    }
                }
                //判断子弹有没有击中障碍物
                for(var k= 0;k < barriers.length;k++){
                    var barrier = barriers[k];
                    switch(barrier.type){
                        case 0:
                            if(heroBullet.x >= barrier.x && heroBullet.x <=barrier.x+5 && heroBullet.y>=barrier.y && heroBullet.y<=barrier.y+10){
                                barrier.bloodDown(k);
                                heroBullet.isLive = false;
                            }
                            break;
                        case 1:
                            if(heroBullet.x >= barrier.x && heroBullet.x <=barrier.x+10 && heroBullet.y>barrier.y && heroBullet.y<=barrier.y+10){
                                barrier.bloodDown(k);
                                heroBullet.isLive = false;
                            }
                            break;
                        case 2:
                            if(heroBullet.x >= barrier.x && heroBullet.x <=barrier.x+240 && heroBullet.y>barrier.y && heroBullet.y<=barrier.y+24){
                                heroBullet.isLive = false;
                            }
                            break;
                    }
                }
            }
        }
    }
}
/*敌人的坦克类，继承坦克类，EnemyTank类*/
function EnemyTank(x,y,direct){
    Tank.call(this,x,y,direct,enemyColor);
    this.count = 0;
    this.bulletIsLive = true;
    this.run = function run(){
        //判断敌人的坦克的当前方向
        switch(this.direct){
            case 0:
                if(this.y > 0){
                    this.y -= this.speed;
                }
                break;
            case 1:
                if(this.x + 30 < 400 ){
                    this.x+=this.speed;
                }
                break;
            case 2:
                if(this.y+30<300 ){
                    this.y+=this.speed;
                }
                break;
            case 3:
                if(this.x>0){
                    this.x-=this.speed;
                }
        }
        //改变方向，走30次，再改变方法
        //如果发现有碰撞，那么也就立马改变方法
        if(this.count>30 || this.isTouchOtherEnemy() || this.isTouchBarrier()){
            this.direct=Math.round(Math.random()*3);
            this.count = 0;
        }
        this.count++;

        // 判读子弹是否已经死亡，如果死亡，则增加新的子弹
        if(this.bulletIsLive==false){
            //增加子弹，需要考虑当前这个敌人坦克的方法，在增加子弹
            var etBullet = null;
            switch(this.direct){
                case 0:
                    etBullet = new Bullet(this.x+9,this.y,this.direct,1,"enemy",this);
                    break;
                case 1:
                    etBullet = new Bullet(this.x+30,this.y+9,this.direct,1,"enemy",this);
                    break;
                case 2:
                    etBullet = new Bullet(this.x+9,this.y+30,this.direct,1,"enemy",this);
                    break;
                case 3:
                    etBullet = new Bullet(this.x,this.y+9,this.direct,1,"enemy",this);
                    break;
            }
            //把子弹添加到敌人子弹数组中
           enemyBullets.push(etBullet);
            //启动新子弹run
           var timer=window.setInterval("enemyBullets["+(enemyBullets.length-1)+"].run()",50);
           enemyBullets[enemyBullets.length-1].timer=timer;

           this.bulletIsLive=true;
        }
    }

    //将判断敌人坦克是否发生碰撞
    this.isTouchOtherEnemy= function(){
        switch(this.direct){
            case 0://我的坦克向上
                //取出所有的敌人坦克
                for(var i = 0;i < EnemyTanks.length;i++){
                    //取出第一个坦克，也包括你自己
                    //如果不是自己
                    var enemyTank = EnemyTanks[i];
                    if(enemyTank!= this){
                        if(enemyTank.direct==0 || enemyTank.direct ==2){
                            //如果敌人的方向是向上或者向下
                            //我的上一点
                            if(this.x>=enemyTank.x && this.x <=enemyTank.x+20 && this.y>=enemyTank.y && this.y<=enemyTank.y+30){
                                return true;
                            }
                            //我的下一点
                            if(this.x+20>=enemyTank.x && this.x+20<=enemyTank.x+20 && this.y>=EnemyTank.y && this.y<=enemyTank.y+30){
                                return true;
                            }
                        }else if(enemyTank.direct==1 || enemyTank.direct ==3){
                            //如果敌人的方向是向上或者向下
                            if(this.x>=enemyTank.x && this.x <=enemyTank.x+30 && this.y>=enemyTank.y && this.y<=enemyTank.y+20){
                                return true;
                            }
                            if(this.x+20>=enemyTank.x && this.x+20<=enemyTank.x+30 && this.y>=EnemyTank.y && this.y<=enemyTank.y+20){
                                return true;
                            }
                        }
                    }
                }
                break;
            case 1://坦克向右
                //取出所有的敌人坦克
                for(var i = 0;i < EnemyTanks.length;i++){
                    //取出第一个坦克，也包括你自己
                    //如果不是自己
                    var enemyTank = EnemyTanks[i];
                    if(enemyTank!= this){
                        if(enemyTank.direct==0 || enemyTank.direct ==2){
                            //如果敌人的方向是向上或者向下
                            if(this.x+30>=enemyTank.x && this.x+30 <=enemyTank.x+20 && this.y>=enemyTank.y && this.y<=enemyTank.y+30){
                                return true;
                            }
                            if(this.x+30>=enemyTank.x && this.x+30<=enemyTank.x+20 && this.y+20>=EnemyTank.y && this.y+20<=enemyTank.y+30){
                                return true;
                            }
                        }else if(enemyTank.direct==1 || enemyTank.direct ==3){
                            //如果敌人的方向是向上或者向下
                            if(this.x+30>=enemyTank.x && this.x+30 <= enemyTank.x+30 && this.y>=enemyTank.y && this.y<=enemyTank.y+20){
                                return true;
                            }
                            if(this.x+30>=enemyTank.x && this.x+30<=enemyTank.x+30 && this.y+20>=EnemyTank.y && this.y+20<=enemyTank.y+20){
                                return true;
                            }
                        }
                    }
                }
                break;
            case 2:// 坦克向下
                //取出所有的敌人坦克
                for(var i = 0;i < EnemyTanks.length;i++){
                    //取出第一个坦克，也包括你自己
                    //如果不是自己
                    var enemyTank = EnemyTanks[i];
                    if(enemyTank!= this){
                        if(enemyTank.direct==0 || enemyTank.direct ==2){
                            //如果敌人的方向是向上或者向下
                            if(this.x>=enemyTank.x && this.x <=enemyTank.x+20 && this.y+30>=enemyTank.y && this.y+30<=enemyTank.y+30){
                                return true;
                            }
                            //我的右点
                            if(this.x+20>=enemyTank.x && this.x+20<=enemyTank.x+20 && this.y+30>=EnemyTank.y && this.y+30<=enemyTank.y+30){
                                return true;
                            }
                        }else if(enemyTank.direct==1 || enemyTank.direct ==3){
                            //如果敌人的方向是向上或者向下
                            if(this.x>=enemyTank.x && this.x<=enemyTank.x+30 && this.y+30>=enemyTank.y && this.y+30<=enemyTank.y+20){
                                return true;
                            }
                            if(this.x+20>=enemyTank.x && this.x+20<=enemyTank.x+30 && this.y+30>=EnemyTank.y && this.y+30<=enemyTank.y+20){
                                return true;
                            }
                        }
                    }
                }
                break;
            case 3:
                //取出所有的敌人坦克
                for(var i = 0;i < EnemyTanks.length;i++){
                    //取出第一个坦克，也包括你自己
                    //如果不是自己
                    var enemyTank = EnemyTanks[i];
                    if(enemyTank!= this){
                        if(enemyTank.direct==0 || enemyTank.direct ==2){
                            //如果敌人的方向是向上或者向下
                            if(this.x>=enemyTank.x && this.x <=enemyTank.x+20 && this.y>=enemyTank.y && this.y<=enemyTank.y+30){
                                return true;
                            }
                            if(this.x>=enemyTank.x && this.x<=enemyTank.x+20 && this.y+20>=EnemyTank.y && this.y+20<=enemyTank.y+30){
                                return true;
                            }
                        }else if(enemyTank.direct==1 || enemyTank.direct ==3){
                            //如果敌人的方向是向上或者向下
                            if(this.x>=enemyTank.x && this.x <=enemyTank.x+30 && this.y>=enemyTank.y && this.y<=enemyTank.y+20){
                                return true;
                            }
                            if(this.x>=enemyTank.x && this.x<=enemyTank.x+30 && this.y+20>=EnemyTank.y && this.y+20<=enemyTank.y+20){
                                return true;
                            }
                        }
                    }
                }
                break;
            default:
                return false;
        }

    }
    this.isHitheroTank = function(){
        //判断子弹是否击中我的坦克
        //取出每一颗子弹进行判断，前提是，子弹要存活
        for(var i = 0;i < enemyBullets.length;i ++){
            var enemyBullet = enemyBullets[i];
            if(enemyBullet.isLive){
                //让这个存活的子弹判断师击中了我的的坦克
                if(hero.isLive){
                    switch(hero.direct){
                        case 0:
                        case 2:
                            if(enemyBullet.x>=hero.x && enemyBullet.x<=hero.x+20 && enemyBullet.y>=hero.y&&enemyBullet.y<=hero.y+30){
                                enemyBullet.isLive = false;
                                hero.isLive = false;
                               //创建一颗炸弹
                               var bomb=new Bomb(hero.x,hero.y);
                               //然后把该炸弹放入到bombs数组中
                               bombs.push(bomb);
                                // alert("你输了!");
                               
                            }
                            break;
                        case 1:
                        case 3:
                            if(enemyBullet.x>=hero.x && enemyBullet.x<=hero.x+30 && enemyBullet.y>=hero.y&&enemyBullet.y<=hero.y+20){
                                enemyBullet.isLive = false;
                                hero.isLive = false;
                                //创建一颗炸弹
                                var bomb=new Bomb(hero.x,hero.y);
                                //然后把该炸弹放入到bombs数组中
                                bombs.push(bomb);
                                // alert("你输了!");
                            }
                            break;
                    }
                }

                //让这颗子弹判断是否击中了障碍物
                for(var k= 0;k < barriers.length;k++){
                    var barrier = barriers[k];
                    switch(barrier.type){
                        case 0:
                            if(enemyBullet.x >= barrier.x && enemyBullet.x <=barrier.x+5 && enemyBullet.y>=barrier.y && enemyBullet.y<=barrier.y+10){
                                barrier.bloodDown(k);
                                enemyBullet.isLive = false;
                            }
                            break;
                        case 1:
                            if(enemyBullet.x >= barrier.x && enemyBullet.x <=barrier.x+10 && enemyBullet.y>barrier.y && enemyBullet.y<=barrier.y+10){
                                barrier.bloodDown(k);
                                enemyBullet.isLive = false;
                            }
                            break;
                        case 2:
                            if(enemyBullet.x >= barrier.x && enemyBullet.x <=barrier.x+240 && enemyBullet.y>barrier.y && enemyBullet.y<=barrier.y+24){
                                enemyBullet.isLive = false;
                            }
                            break;
                    }
                }
                
            }
        }
    }
}

/*子弹类*/
//type表示：这颗子弹是敌人的，还是自己的
//tank表示对象，说明这颗子弹，属于哪个坦克.
function Bullet(x,y,direct,speed,type,tank){
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.direct = direct;
    this.timer = null;
    this.isLive = true;//如果创建了一个子弹那么刚开始就是活的
    this.type = type;
    this.tank = tank;

    this.run = function run(){
        //在改变这个子弹的坐标时，先判断子弹是否已经到边界了,或者碰到了敌人的坦克
        ////子弹不前进，有两个逻辑，1.碰到边界，2. 碰到敌人坦克.
        if(this.x<=0 || this.x>=400 ||this.y <=0 || this.y>=300||this.isLive==false){
            //子弹的定时器要停止
            window.clearInterval(this.timer);
            this.isLive = false;
            if(this.type=="enemy"){
                this.tank.bulletIsLive=false;
            }
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
    }
    /*画出所有的子弹*/
    this.drawBullet = function(){
        if(this.isLive){
            cxt.fillStyle="#FEF26E";
            cxt.fillRect(this.x,this.y,2,2);
        }
    }
}


/*炸弹类*/
/*定义一个炸弹类,坦克毁灭的时候显示其效果*/
function Bomb(x,y){
    this.x = x;
    this.y =y;
    this.isLive = true;//炸弹是否活的，默认true;
    //炸弹有一个生命值
    this.blood = 9;
    //减生命值
    this.bloodDown = function(){
        if(this.blood>0){
            this.blood--;
        }else{
            //说明炸弹死亡
            this.isLive = false;
        }
    }
    this.drawEnemyBomb  = function(){
        for(var i = 0;i < bombs.length;i ++){
            //取出一颗炸弹
            var bomb = bombs[i];
            if(bomb.isLive){
                //更据当前这个炸弹的生命值，来画出不同的炸弹图片
                if(bomb.blood>6){
                    var img1 = new Image();
                    img1.src= "bomb_1.gif";
                    img1.onload = function(){
                        cxt.drawImage(img1,bomb.x,bomb.y,30,30);
                    }
                }else if(bomb.blood>3){
                    var img2 = new Image();
                    img2.src = "bomb_2.gif";
                    img2.onload = function(){
                        cxt.drawImage(img2,bomb.x,bomb.y,30,30);
                    }
                }else{
                    var img3 = new Image();
                    img3.src = "bomb_3.gif";
                    img3.onload = function(){
                        cxt.drawImage(img3,bomb.x,bomb.y,30,30);
                    }
                }
                bomb.bloodDown();
                if(bomb.blood<=0){
                    bombs.splice(i,1);
                }
            }
        }
    }
}

/*障碍物*/
function Barrier(x,y,type,blood,width,height,color){
    this.x = x;
    this.y = y;
    this.type = type;
    this.blood = blood;
    this.isLive = true;
    this.width = width;
    this.height = height;
    this.color = color;
    this.bloodDown = function(k){
        this.blood--;
        if(this.blood==0){
            this.isLive = false;
            /*障碍物要从数组中删除*/
            barriers.splice(k,1);
        }
    }
    this.drawBarrier = function(){
        if(this.isLive){ 
            cxt.fillStyle=this.color;
            cxt.fillRect(this.x,this.y,this.width,this.height);
        }
    }
}