let cart = [];

const openCart = document.querySelector('.i-carrito');
openCart.addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});

// clase Producto y funcion constructora
class Product {
    constructor(
        productName,
        productPrice,
        productStock,
        productImg,
    ){
        this.name = productName;
        this.price = productPrice;
        this.stock = productStock;
        this.img = productImg;
    }
    estaRestaStock(qty){
        if(this.stock>= Number(qty)){
        this.stock-= Number (qty);
        }
        else{
        alert(`No tenemos stock suficiente, nos quedan ${this.stock}`);
        }
    }
};

class ProductInCart {
    constructor(
        name,
        qty,
    ){
        this.name = name;
        this.qty = Number (qty);
    }
    estaAgregaqty(qty){
        this.qty+= Number (qty);
    }
};

let dataBase = []; //base de datos vacía, luego se pushean los productos adentro del array
 
let theCourseProduct = new Product('The Course', 750, 20, 'img/the-course-img.png');
let bigWhoopProduct = new Product('Big Whoop', 750, 20, 'img/big-whoop-img.png');
let tribecanguProduct = new Product('Tribecangu', 750, 0, 'img/tribecangu-img.png');
let ry4dProduct = new Product('Lechucks RY4D', 750, 0, 'img/lechuck-img.png');
let murrayProduct = new Product('Murrays Delight', 750, 20, 'img/murrays-img.png');
let monkeyIslandProduct = new Product('Monkey Island', 750, 20, 'img/monkey-island-img.png');
let bloodIslandProduct = new Product('Blood Island', 750, 20, 'img/blood-island-img.png');
let meleemonadeProduct = new Product('Meleemonade', 750, 20, 'img/meleemonade-img.png');   
let redParrotProduct = new Product('Red Parrot', 750, 20, 'img/red-parrot-img.png');
let lechimpProduct = new Product('LeChimp', 750, 20, 'img/lechimp-img.png');
let lemonheadProduct = new Product('LemonHead', 750, 20, 'img/lemonhead-img.png');
let secretGrogProduct = new Product('Secret Grog', 750, 20, 'img/secret-grog-img.png');

dataBase.push(bloodIslandProduct);
dataBase.push(theCourseProduct);
dataBase.push(bigWhoopProduct);
dataBase.push(tribecanguProduct);
dataBase.push(ry4dProduct);
dataBase.push(meleemonadeProduct);
dataBase.push(lemonheadProduct);
dataBase.push(redParrotProduct);
dataBase.push(murrayProduct);
dataBase.push(monkeyIslandProduct);
dataBase.push(lechimpProduct);
dataBase.push(secretGrogProduct);

let productsInPage = `` //escribe las cards de los productos en HTML, tomando los datos de cada objeto Product() de la dataBase
for (let i = 0; i < dataBase.length; i++){
    let product = dataBase[i];
    if (product.stock > 0){
    productsInPage += `
        <div class= "product-card" id="product-card" style= "grid-area: area-${i};">
            <img class= "foto-prod" src= "${product.img}"> 
            <h2 class="h2">${product.name}</h2>
            <h2 class="price">60ml $${product.price}</h2> 
            <button id= 'btn-${i}' class= "botonComprar" onclick = 'addToCart("${product.name}", 1)'>Añadir al carrito!</button>
        </div>
        `;
    }
    else {
        productsInPage += `
        <div class= "product-card" id="product-card" style= "grid-area: area-${i};">
            <img class= "foto-prod" src= "${product.img}"> 
            <h2 class="h2">${product.name}</h2>
            <h2 class="price">60ml $${product.price}</h2>
            <h3 class="sin-stock">No tenemos stock :(</h3>              
        </div>
        `;
    }
}

document.querySelector('#product-grid').innerHTML = productsInPage;


function addToCart(value){
    addToCart(value, 1);
};

function addToCart(value, qty){    //buscar en el carrito si ya existe el item. Si no existe, pushearlo y si existe sumarle uno a ese item.    
    var product = findProductByName(value, dataBase);
    if (product != null){
        var productInCart = findProductByName(value, cart);
        if (productInCart == null){ 
            product.estaRestaStock(qty);
            let productoAñadido = new ProductInCart(`${value}`, qty);
            cart.push(productoAñadido);
        }
        else {
            product.estaRestaStock(qty);
            productInCart.estaAgregaqty(qty);
        }
    localStorage.setItem('carrito', JSON.stringify(cart));
    showCart();
    };
};


function findProductByName(value, list){ //busca en una lista si el nombre de algun producto es igual a value
    var encontrado = null; //primero designamos un espacio nulo para la variable encontrado
    let i = 0; 
    while (encontrado == null && i < list.length){ //mientras que encontrado sea nulo y la i sea menor a la longitud de la base de datos de productos, segui buscando!
       var product = list[i]; 
       if (product.name == value){ // si el value es igual al nombre de algun producto, encontrado deja de ser nulo y pasa a ser ese producto (un objeto!!!)
       encontrado = product;
       }
       i++;
    }
    return encontrado; // pase lo que pase, siempre devuelve encontrado, que puede seguir siendo nulo o un producto.
};

const listaCompra = document.querySelector('#lista-carrito tbody');

function showCart() {   
    listaCompra.innerHTML = "";
    let cart = JSON.parse(localStorage.getItem('carrito'));
    var purchaseTotal = 0;
    var itemTotal = 0;
    if (cart != null) { // si es nulo, no muestra nada
        for (let i = 0; i < cart.length; i++){     
            const row = document.createElement('tr');  
            let productoAñadido = cart[i];
            row.id = productoAñadido.name;
            row.innerHTML = `
                <td>${productoAñadido.name} </td>
                <td><input id='item-${i}' class= "inp" value="${productoAñadido.qty}" onchange='addToCart("${productoAñadido.name}", Number (this.value - "${productoAñadido.qty}"))'></td>
                <td> $${productoAñadido.qty*findProductByName(productoAñadido.name, dataBase).price} </td>
                <td><button id='btn-remove-${i}' class="btn-remove" onclick='removeItemFromCart("${productoAñadido.name}")'>X</button></td>
            `;
            listaCompra.appendChild(row);
            var precioProducto = findProductByName(productoAñadido.name, dataBase).price;
            purchaseTotal += precioProducto * productoAñadido.qty;
            itemTotal += productoAñadido.qty;
        };

    };
    document.getElementById('precio-tot').innerHTML = `$${purchaseTotal}`;   
    document.getElementById('cant-tot').innerHTML = `${itemTotal}`;
};

function clearCart(){
    cart.length = 0;    
    listaCompra.innerHTML = "";
    localStorage.clear('carrito');
    showCart();
};

function removeItemFromCart(name){   // el i es el string de productoAñadido.name
    var cartItem = document.getElementById(name); //el row que muestra el item en el carrito tiene el nombre del producto como id
    cartItem.remove(); 
    var productInCart = findProductByName(name, cart); //acá compara ese name con los que están en la lista cart
    var index = cart.indexOf(productInCart);
    cart.splice(index,1);
    localStorage.removeItem('carrito');
    localStorage.setItem('carrito', JSON.stringify(cart));
    showCart();
};

const searchBar = document.getElementById('searchbar');
searchBar.addEventListener('input', searchForProducts);

function searchForProducts(){
    productsInPage = ``;
    var newGridArea = 0;
    for (let i = 0; i < dataBase.length; i++){
        product = dataBase[i];
        if (product.name.toLowerCase().startsWith(searchBar.value.toLowerCase())){   
            productsInPage += `
                <div class= "product-card" id="product-card" style= "grid-area: area-${newGridArea};">
                    <img class= "foto-prod" src= "${product.img}"> 
                    <h2 class="h2">${product.name}</h2>
                <h2 class="price">60ml $${product.price}</h2> 
                    <button id= 'btn-${i}' class= "botonComprar" onclick = 'addToCart("${product.name}", 1)'>Añadir al carrito!</button>
                </div>
                `;    
            document.querySelector('#product-grid').innerHTML = productsInPage;
            newGridArea++
        };
    };
};


//TODO agregar un buscador de productos e intentar no volverse loco. GOTIT MADAFAKA
//TODO agregar en algun lado una forma de que cuando vos vayas a restar stock, te devuelva la cantidad de stock actual. y poder usarla para poder setear el input 