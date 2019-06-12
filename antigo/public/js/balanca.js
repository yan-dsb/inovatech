

var count = new Number();
var count = 0;
var kilo = [];
peso = 20;



function start(kg){
var total;
var kg = kg.reduce(function(total, numero){
console.log(total,numero);
resultado =  total + numero;
return resultado;
}, 0);

function calcponto(count){
    point = count*20;
    return point;
}

//console.log(resultado);
if (count != kg) {
count = count+1;
flexpeso = document.getElementById("flexpeso");
flexpeso.setAttribute("value",count);
flex.innerText = count+",00Kg";
point = calcponto(count);
var textnode = document.createTextNode(point);
setTimeout('start(kilo);',10);

}


ponto.setAttribute("value",point);
ponto.innerText = point;
}






function addelement(url,peso) {
if(kilo.length < 10){
console.log("Clicou");
var node = document.createElement("img");
var element = document.getElementById("elements");
element.appendChild(node);
node.className = 'lixo';
node.setAttribute("src",url);
var box = $('.lixo');
kilo.push(peso);
box.animate({
top:"175px",
},1000);
setTimeout('start(kilo);', 1000);
}else
alert("Quantidade de equipamentos esgotado");
}




// function hidediv(element){
//     console.log("Hide Son of mom")
//    var div = document.getElementById(element);
//    div.className='divoff';
// }