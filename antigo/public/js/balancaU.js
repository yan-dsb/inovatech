
var count = new Number();
var count = 0;
var kilo = [];

function start(kg){
var total = 0;
var k =0;
/*
var kg = kg.reduce(function(total, numero){
console.log(total,numero);
resultado =  total + numero;
return resultado;
}, 0);
*/

for (let index = 0; index < kg.length; index++) {
   total += kg[index];
   console.log('total peso'+total);
   k = total;
   console.log(k);
}

//console.log(resultado);
if (count != k) {
count = count+1;
flex.innerText = count+",00Kg";
setTimeout('start(kilo);',1);
}

}
function addelement(url,peso) {

if(kilo.length < 10){
console.log("Clicou");
console.log(url);

console.log(peso);

var node = document.createElement("img");
var element = document.getElementById("elements");
element.appendChild(node);
node.className = 'lixo';
node.setAttribute("src",url);
var box = $('.lixo');
kilo.push(peso);
console.log(kilo);

box.animate({
top:"175px",
},1000);
setTimeout('start(kilo);', 1000);
}else
alert("Quantidade de equipamentos esgotado");
}
