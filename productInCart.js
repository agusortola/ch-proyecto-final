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
