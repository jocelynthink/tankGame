/* 
* @Author: jocelyn
* @Date:   2016-05-01 18:15:49
* @Last Modified by:   anchen
* @Last Modified time: 2016-05-02 16:14:08
*/

/*数组转置*/
var arr = [[1,2,3,4],[4,5,6,8],[7,6,4,2]];
var arr_new = [];

for(var i = 0;i < arr[0].length;i++){
    arr_new[i] = [];
}
for(var i = 0;i < arr.length;i++){
    var j = 0; 
    while(j < arr[i].length){
        arr_new[j][i] = arr[i][j];
        j++;
    }
}
console.log(arr);
console.log(arr_new);
for(var val in arr){
    console.log(arr[val]);
}
for(var val in arr_new){
    console.log(arr_new[val]);
}

/*二分查找*/
var arr = [2,3,4,5,6,7,8,9,10,11];
function binarySearch(arr,findVal,leftIndex,rightIndex){
    if(leftIndex > rightIndex){
        document.writeln("not fond");
        return ;
    }
    var minIndex = Math.floor((leftIndex+rightIndex)/2);
    var midVal = arr[minIndex];

    if(midVal > findVal){
        binarySearch(arr,findVal,leftIndex,minIndex-1);
    }else if(midVal < findVal){
        binarySearch(arr,findVal,minIndex+1,rightIndex);
    }else{
        console.log("find "+minIndex);
        return;
    }
}
binarySearch(arr,6,0,arr.length);


var arr = [ '*', '##', "***", "&&", "****", "##*" ];
arr[7] = "**";
var arr1 = new Array();
var num = 0;
for ( var i in arr) {
    if (arr[i][0] == '*') {
        arr1[num++] = arr[i];
    }
}
arr1.sort();
for ( var i in arr1) {
    document.write(arr1[i] + "<br /><br />");
}

function Person(name,i_age,sal){
    this.name = name; //公开属性
    var age = i_age; //私有属性
    var salary = sal;  //私有属性

    this.show = function(){ //公开方法
        console.log(age + "," + salary);  //访问私有的属性，不要加this
    }
    function show_name(){ //私有方法
        console.log(this.name)
    }
}
var p = new Person('sp',20,5000);
console.log(p.name + "," + p.age);
p.show();
// p.show_name();

/*多态案例*/
function Master(animal,food){
    this.feed = function(){
        console.log("主人给"+animal.name+"喂"+food.name);
    }
}

/*食物类*/
function Food(name){
    this.name = name;
}

function Fish(name){
    this.food = Food;
    this.food(name);
}
function Bone(name){
    this.food = Food;
    this.food(name);
}

/*动物类*/
function Animal(name){
    this.name = name;
}
function Cat(name){
    this.animal = Animal;
    this.animal(name);
}
function Dog(name){
    this.animal = Animal;
    this.animal(name);
}

var cat = new Cat("小猫");
var fish  = new Fish("鱼");
var master = new Master(cat,fish);
master.feed();