const query = (element) => document.querySelector(element);

const queryAll = (element) => document.querySelectorAll(element);

let modalQt = 1;

let cart = [];
let modalKey = 0;

// mapea o Json de pizzas e retorna um novo array para ser manipulado no site
// listagem das pizzas que abre e cria o modal
pizzaJson.map((item, index) => {
  // seleciona no html todos as tag que devem ser adicionas e clona ela tendo acesso na variavel PizzaItem

  let pizzaItem = query(".models .pizza-item").cloneNode(true);

  // adiciona um atributo data com o indice de cada pizza no Html
  pizzaItem.setAttribute("data-key", index);
  // selecionou e adicionou os item ao HTML
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;

  // clica na pizza abre o modal com evento
  pizzaItem.querySelector("a").addEventListener("click", (event) => {
    event.preventDefault();
    // cria uma variavel que seleciona o atributo key saindo do valor a e indo para  valor mais proximo de pizzaitem
    let key = event.target.closest(".pizza-item ").getAttribute("data-key");
    modalQt = 1;
    modalKey = key;

    // adiciona cada item ao seu campo no modal
    console.log(pizzaJson);
    query(".pizzaBig img").src = pizzaJson[key].img;
    query(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    query(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    query(".pizzaInfo--actualPrice").innerHTML = `$${pizzaJson[
      key
    ].price.toFixed(2)}`;

    query(".pizzaInfo--size.selected").classList.remove("selected");

    // faz um loop pelos sizes e adiciona os tamanhos a div
    queryAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    query(".pizzaInfo--qt").innerHTML = modalQt;

    document.querySelector(".pizzaWindowArea").style.opacity = "0";
    document.querySelector(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      document.querySelector(".pizzaWindowArea").style.opacity = "1";
    }, 100);
  });

  query(".pizza-area").append(pizzaItem);
});

// eventos do modal

function closeModal() {
  document.querySelector(".pizzaWindowArea").style.opacity = "0";

  setTimeout(() => {
    document.querySelector(".pizzaWindowArea").style.display = "none";
  }, 500);
}
queryAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (button) => {
    button.addEventListener("click", closeModal);
  }
);

query(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
  }
  query(".pizzaInfo--qt").innerHTML = modalQt;
});

query(".pizzaInfo--qtmais").addEventListener("click", () => {
  ++modalQt;
  query(".pizzaInfo--qt").innerHTML = modalQt;
});

queryAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (event) => {
    query(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

// carrinho informacoes
query(".pizzaInfo--addButton").addEventListener("click", () => {
  // qual a pizza ?
  console.log(`Pizza ${modalKey}`);

  // qual tamanho?
  let size = parseInt(
    query(".pizzaInfo--size.selected").getAttribute("data-key")
  );
  console.log(`pizza tamanho :${size}`);

  let idetifier = pizzaJson[modalKey].id + "@" + size;
  let key = cart.findIndex((item) => {
    return item.idetifier == idetifier;
  });
  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      idetifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }

  // quantas pizzas? para adicionar no carrinho
  console.log(modalQt);

  updateCart();
  closeModal();
});



query('.menu-openner').addEventListener('click',()=>{
  if(cart.length >0){
    query('aside').style.left='0';
  }

  
})

query('.menu-closer').addEventListener('click',()=>{
  query('aside').style.left='100vw'
})

function updateCart() {
  query('.menu-openner span').innerHTML = cart.length

  if (cart.length > 0) {
    query("aside").classList.add("show");
    query(".cart").innerHTML = "";

    let subtotal =0;
    let desconto =0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;
      let cartItem = query(".models .cart--item").cloneNode(true);
      let pizzaSizeName;


      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "Small";
          break;
        case 1:
          pizzaSizeName = "Medium";
          break;
        case 2:
          pizzaSizeName = "Large";
      }

      let pizzaName = ` ${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
        if(cart[i].qt > 1){
          cart[i].qt--;
        }else{
          cart.splice(i, 1);
        }
        updateCart()
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
         cart[i].qt++;
         updateCart();
      });



      query(".cart").append(cartItem);
    }

    desconto = subtotal * 0.1;

    total = subtotal - desconto;

    query('.subtotal span:last-child').innerHTML = `U$ ${subtotal.toFixed(2)}`
    query('.desconto span:last-child').innerHTML = `U$ ${desconto.toFixed(2)}`
    query('.total span:last-child').innerHTML = `U$ ${total.toFixed(2)}`

  } else {
    query("aside").classList.remove("show");
    query("aside").style.left='100vw';
  }
}
