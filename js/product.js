//* Faire le lien entre un produit de la page
//* d’accueil et la page Produit
let params = new URL(document.location).searchParams;
let idkanap = params.get("idkanap");
let produitsPanier = localStorage.getItem("cart");

//* Récupération du  produit ayant été cliqué sur la page d’accueil.
//* Insérer un produit et ses détails dans la page Produit
//fetch("http://localhost:3000/api/products/" + idkanap)

fetch("http://"+localStorage.getItem("ipaws")+"/api/products/" + idkanap)
  .then((response) => response.json())
  .then((data) => {
    let selectColors = document.getElementById("colors");
    let selectQuantity = document.getElementById("quantity");

    const itemImg = document.getElementsByClassName("item__img");
    let imgIndex = document.createElement("img");
    itemImg[0].appendChild(imgIndex);
    imgIndex.src = data.imageUrl;
    imgIndex.classList.add("imgindex");
    imgIndex.setAttribute("alt", data.altTxt);

    const itemNomProduit = document.getElementsByClassName(
      "item__content__titlePrice"
    );
    let nomProduit = document.createElement("h1");
    itemNomProduit[0].appendChild(nomProduit);
    nomProduit.innerHTML = data.name;
    nomProduit.setAttribute("id", data.name);

    const itemPrice = document.getElementById("price");
    itemPrice.innerHTML = data.price;

    const itemDescr = document.getElementById("description");
    itemDescr.innerHTML = data.description;

    const itemColor = document.getElementById("colors");
    for (i = 0; i < data.colors.length; i++) {
      let nameColor = document.createElement("option");
      itemColor.appendChild(nameColor);
      nameColor.innerHTML = data.colors[i];
    }

    let bouton = document.getElementById("addToCart");
    bouton.addEventListener("click", function () {
      //* Si produitsPanier est null, nous créon un tableau et
      //* on ajoutons les valeurs du produit au tableu
      if (produitsPanier === null) {
        if (
          !selectColors.options[selectColors.selectedIndex].value == "" &&
          validQuantity(selectQuantity.value)
        ) {
          let cartlist = [];
          cartlist.push([
            idkanap,
            selectQuantity.value,
            selectColors.options[selectColors.selectedIndex].value,
          ]);
          localStorage.setItem("cart", JSON.stringify(cartlist));
          document.location.href = "./index.html";
        } else {
          alert("choisissez une couleur et un numéro d'article correct");
        }
      } else {
        //Si produitsPanier n'est pas null, nous créon un tableau et
        //on ajoutons les valeurs du produit au tableu
        if (
          !selectColors.options[selectColors.selectedIndex].value == "" &&
          validQuantity(selectQuantity.value)
        ) {
          let parseProdPanier = JSON.parse(produitsPanier);
          let findItem = false;
          //Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent
          //dans le panier (même id + même couleur), on incrémente
          //simplement la quantité du produit correspondant dans le tableau.
          for (let arrayItem of parseProdPanier) {
            if (
              arrayItem[0] === idkanap &&
              arrayItem[2] ===
                selectColors.options[selectColors.selectedIndex].value
            ) {
              findItem = true;
              arrayItem[1] = (
                parseFloat(arrayItem[1]) + parseFloat(selectQuantity.value)
              ).toString();
              localStorage.setItem("cart", JSON.stringify(parseProdPanier));
            }
          }

          if (!findItem) {
            parseProdPanier.push([
              idkanap,
              selectQuantity.value,
              selectColors.options[selectColors.selectedIndex].value,
            ]);
            localStorage.setItem("cart", JSON.stringify(parseProdPanier));
            document.location.href = "./index.html";
          } else {
            document.location.href = "./index.html";
          }
        } else {
          alert("choisissez une couleur et un numéro d'article correct2");
        }
      } //fin else
    });
  })
  .catch((error) => {
    console.log(error);
    alert(error);
  });

function validQuantity(quantity) {
  let lvalid = false;
  if (Number.isInteger(parseFloat(quantity))) {
    if (parseFloat(quantity) > 0 && parseFloat(quantity) < 101) {
      lvalid = true;
    }
  }
  return lvalid;
}
