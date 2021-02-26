$(async function (){

    let cart = [];

    const openCart = document.querySelector('.i-carrito');
    openCart.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });


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


    const dataBase = await getData();
    console.log(dataBase);

    async function getData(){
        const response = await fetch("database.json");
        const json = await response.json();
        console.log(response);
        return json;
    };

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

    $("#product-grid").html(productsInPage);


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
    //const listaCompra = $('#lista-carrito tbody')

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
                    <td><input id='item-${i}' class= "inp"  value="${productoAñadido.qty}" onchange='addToCart("${productoAñadido.name}", Number (this.value - "${productoAñadido.qty}"))' type="number" min="0"></td>
                    <td> $${productoAñadido.qty*findProductByName(productoAñadido.name, dataBase).price} </td>
                    <td><button id='btn-remove-${i}' class="btn-remove" onclick='removeItemFromCart("${productoAñadido.name}")'>X</button></td>
                `;
                listaCompra.appendChild(row);
                var precioProducto = findProductByName(productoAñadido.name, dataBase).price;
                purchaseTotal += precioProducto * productoAñadido.qty;
                itemTotal += productoAñadido.qty;
            };
        };

        $("#precio-tot").html(`$${purchaseTotal}`);
        $("#cant-tot").html(`${itemTotal}`);
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
                //document.querySelector('#product-grid').innerHTML = productsInPage;
                $("#product-grid").html(productsInPage);
                newGridArea++
            };
        };
    };
});
