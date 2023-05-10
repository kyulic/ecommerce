async function getProducts(){
    try {
        //recibe la data
        const data= await fetch("https://ecommercebackend.fundamentos-29.repl.co");
        const res=await data.json();
        //guarda la data en el localstore
        window.localStorage.setItem("products", JSON.stringify(res))
        return res;
    } catch (error) {
        console.error(error);

    }
}

function printProducts(db) {
    const productsHtml=document.querySelector(".products");
    
    let html="";
    for (const product of db.products) {
        
        html +=`
        <div class="product">
            <div class="product__imag">
                <img src="${product.image}" alt="imagen">
            </div>

             
            <div class="product__info">
                <h5>
                    $${product.price}  <span> <b>Stock</b>:${product.quantity}</span>
                <i class='bx bx-plus' id='${product.id}'></i>
                ${product.quantity? `<i class='bx bx-plus' id='${product.id}'></i>`:"<span class='soldOut'>  Sold out</span>"}
                </h5>
                <h4>${product.name}</h4>
                
            </div>
        </div>`
    }
    
    productsHtml.innerHTML=html;
    
}

function handleShowCart() {
    
    const iconcartHTML=document.querySelector(".bx-cart");
    const cartHTML=document.querySelector(".cart")
    let count=0;

    iconcartHTML.addEventListener("click",function () {
        cartHTML.classList.toggle("cart__show");
        
    })
    
}

function addToCartFromProducts(db) {
    const productsHtml =document.querySelector(".products")
    productsHtml.addEventListener("click",function (e) {
        if(e.target.classList.contains("bx-plus")){
            const id=Number(e.target.id);
            

            
            const productFind=db.products.find(
                (product)=> product.id===id
            );

            if(db.cart[productFind.id]){
                // saca una alarma
                if (productFind.quantity===db.cart[productFind.id].amount) 
                return alert("No tenemos más en el stand");
                db.cart[productFind.id].amount++;

            }else{
                db.cart[productFind.id]={...productFind,amount:1};
            }
            // guarda en el localStorage
            window.localStorage.setItem("cart",JSON.stringify(db.cart))
            printProductsInCart(db)
            printTotal(db) 
            handlePrintAmountProducts(db)

        }
        
    })
        
}

function printProductsInCart(db) {
    const cartProducts=document.querySelector(".cart__products")
    let html="";

    for (const product in db.cart) {
        const {quantity,price,name,image,id, amount}=db.cart[product];
        html +=`
            <div class="cart__product">
                <div class="cart__product--img">
                    <img src="${image}" alt="imagen"/>
                </div>
                <div class="cart__product--body">
                    
                    <h4>${name}</h4>
                    <p>Stock: ${quantity} | $${price}.00</p>
                    <p>Subtotal: $${price*amount}.00</p>
                    
                    

                    <div class="cart__product--body-op" id='${id}'>
                        <i class='bx bx-minus'></i>
                        <span> ${amount} unit</span>
                        <i class='bx bx-plus' ></i>
                        <i class='bx bx-trash'></i>
                </div> 
                
                    
                </div>  
            </div> 
        
        `;
                
    }
    

    cartProducts.innerHTML=html;


}


function deleteAndSuCart(db) {
    const cartProducts=document.querySelector(".cart__products")

    cartProducts.addEventListener("click",function (e) {
        if(e.target.classList.contains("bx-plus")){
            const id=Number(e.target.parentElement.id);
            
            const productFind=db.products.find(
                (product)=> product.id===id);

            if (productFind.quantity===db.cart[productFind.id].amount) 
                return alert("No tenemos más en el stand");
            
            db.cart[id].amount++;
            

        };
        if(e.target.classList.contains("bx-minus")){
            const id=Number(e.target.parentElement.id);
            if (db.cart[id].amount===1) {
                const response= confirm("estas seguro que deseas eliminar el producto")
                if(!response)return;
                delete db.cart[id];
            }else{
                db.cart[id].amount--;

            }
            

        };
        if(e.target.classList.contains("bx-trash")){
            const id=Number(e.target.parentElement.id);
            delete db.cart[id];

        };
        window.localStorage.setItem("cart",JSON.stringify(db.cart))
        printProductsInCart(db);
        printTotal(db)
        handlePrintAmountProducts(db)
        
    });
    
}



function printTotal(db) {
    const infoTotal=document.querySelector('.info__total');
    const infoAmount=document.querySelector('.info__amount');

    let totalProducts=0
    let amountProducts=0

    for (const product in db.cart) {
      const{amount,price}=db.cart[product];
      totalProducts+=price*amount;
      amountProducts+=amount;
    }
    infoTotal.textContent="$"+totalProducts + ".00";
    
    infoAmount.textContent=amountProducts +" units";
    
    
}


function handleTotal(db) {
    const btnBuy=document.querySelector(".btn");
    btnBuy.addEventListener("click",function() {
        console.log(db.cart)

        
        if (!Object.values(db.cart).length)
            return alert('No tienes nada en el carrito')
        const response=confirm('Esta seguro de su compra?');
        if (!response)return;
        
        const currentProducts=[];
        for (const product of db.products) {
            const productCart=db.cart[product.id];
            if(product.id===productCart?.id){
                currentProducts.push({
                    ...product,
                    quantity:product.quantity-productCart.amount,

                });

            }else{
                currentProducts.push(product);

            }
            
        }
        
            db.products=currentProducts;
            db.cart={};

            window.localStorage.setItem("products", JSON.stringify(db.products));
            window.localStorage.setItem("cart",JSON.stringify(db.cart));
            printTotal(db);
            printProductsInCart(db);
            printProducts(db)
            handlePrintAmountProducts(db)

        
        
    });

    
}

function handlePrintAmountProducts(db) {
    const amountProducts=document.querySelector('.amountProducts');

    let amount=0;

    for (const product in db.cart) {
        console.log(db.cart[product]);
        amount+=db.cart[product].amount
        
    }

    amountProducts.textContent=amount;
   

    
}


function printButtons(db) {
    const objectProduct={}
    objectProduct.all=db.products.length;

    for (const product of db.products) {
        objectProduct[product.category]=objectProduct[product.category]+1||1
        
    }   

    let html=''

    Object.entries(objectProduct).forEach(info => {
        console.log(info)
        html+=`<button>${info[0]}<br/> ${info[1]}</button>`;
    });

    document.querySelector('.buttons').innerHTML=html
    
}

async function main(){
    const db={

        products:
        //estos son los productos
        //pregunta si la data esta en la red o en el localstore
            JSON.parse(window.localStorage.getItem("products") || await getProducts()),
        // pregunta si esta en la red o en el local store el añadir productos
        //esto es lo que se a añadido al carrito
            cart:JSON.parse(window.localStorage.getItem("cart"))||{},

    };

    
    
    printProducts(db);

    handleShowCart();
    addToCartFromProducts(db);
    printProductsInCart(db);
    deleteAndSuCart(db);
    printTotal(db);
    handleTotal(db); 
    handlePrintAmountProducts(db);
    printButtons(db);

    


    

    



    

    
}
main();
