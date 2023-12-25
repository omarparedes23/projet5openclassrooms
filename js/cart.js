//*------------------------------------------------------------------------
//* Afficher un tableau récapitulatif des achats dans la page Panier
//* Validation du champs de formulaire
//*------------------------------------------------------------------------
let produitsPanier = localStorage.getItem("cart");
let parseProdPanier = {};
//* Récupéreration du panier via localStorage.
//* Création et insértion des éléments dans la page Panier
if (produitsPanier === null) {
} else {
  parseProdPanier = JSON.parse(produitsPanier); //
  let totalPrice = 0;
  let totalQuantity = 0;
  //Récupération de l'id, la couleur et la quantité à partir du localstorage
  //puis on fait un fetch pour récupérer le prix, la description, etc.
  for (let i = 0; i < parseProdPanier.length; i++) {
    let id = parseProdPanier[i][0];
    let color = parseProdPanier[i][2];
    let quantity = parseProdPanier[i][1];
    
    //fetch("http://localhost:3000/api/products/" + id)
    fetch("https://"+localStorage.getItem("ipaws")+"/api/products/" + id)
      .then((response) => response.json())
      .then((data) => {
        let cartItems = document.getElementById("cart__items");
        let itemArticle = document.createElement("article");
        cartItems.appendChild(itemArticle);
        itemArticle.setAttribute("data-id", id);
        itemArticle.setAttribute("data-color", color);
        itemArticle.setAttribute("class", "cart__item");

        let divCartItemImg = document.createElement("div");
        itemArticle.appendChild(divCartItemImg);
        divCartItemImg.setAttribute("class", "cart__item__img");

        let itemImg = document.createElement("img");
        divCartItemImg.appendChild(itemImg);
        itemImg.src = data.imageUrl;

        let divCartItemCont = document.createElement("div");
        itemArticle.appendChild(divCartItemCont);
        divCartItemCont.setAttribute("class", "cart__item__content");

        let divCartItemContDes = document.createElement("div");
        divCartItemCont.appendChild(divCartItemContDes);
        divCartItemContDes.setAttribute(
          "class",
          "cart__item__content__description"
        );

        let nomProduit = document.createElement("h2");
        divCartItemContDes.appendChild(nomProduit);
        nomProduit.innerHTML = data.name;

        let couleurProduit = document.createElement("p");
        divCartItemContDes.appendChild(couleurProduit);
        couleurProduit.innerHTML = color;

        let prixProduit = document.createElement("p");
        divCartItemContDes.appendChild(prixProduit);
        prixProduit.innerHTML = data.price + ",00 €";

        let divCartItemContSet = document.createElement("div");
        divCartItemCont.appendChild(divCartItemContSet);
        divCartItemContSet.setAttribute(
          "class",
          "cart__item__content__settings"
        );

        let divCartItemContSetQ = document.createElement("div");
        divCartItemContSet.appendChild(divCartItemContSetQ);
        divCartItemContSetQ.setAttribute(
          "class",
          "cart__item__content__settings__quantity"
        );

        let qteProduit = document.createElement("p");
        divCartItemContSetQ.appendChild(qteProduit);
        qteProduit.innerHTML = "Qté : ";

        let inpProduit = document.createElement("input");
        divCartItemContSetQ.appendChild(inpProduit);
        inpProduit.innerHTML = "Qté : ";
        inpProduit.setAttribute("class", "itemQuantity");
        inpProduit.setAttribute("type", "number");
        inpProduit.setAttribute("name", "itemQuantity");
        inpProduit.setAttribute("min", 1);
        inpProduit.setAttribute("max", 100);
        inpProduit.setAttribute("value", parseFloat(quantity));

        let divCartItemContSetD = document.createElement("div");
        divCartItemContSet.appendChild(divCartItemContSetD);
        divCartItemContSetD.setAttribute(
          "class",
          "cart__item__content__settings__delete"
        );

        let delProduit = document.createElement("p");
        divCartItemContSetD.appendChild(delProduit);
        delProduit.innerHTML = "Supprimer";
        delProduit.setAttribute("class", "deleteItem");

        document
          .getElementsByName("itemQuantity")
          [
            document.getElementsByClassName("itemQuantity").length - 1
          ].addEventListener("change", (event) => {
            let itemArticle = event.target.closest(".cart__item");
            let idProd = itemArticle.dataset.id;
            let colorProd = itemArticle.dataset.color;
            changePanier(idProd, colorProd, event.target.value);
          });
        document
          .getElementsByClassName("deleteItem")
          [
            document.getElementsByClassName("deleteItem").length - 1
          ].addEventListener("click", (event) => {
            let itemArticle = event.target.closest(".cart__item");
            let idProd = itemArticle.dataset.id;
            let colorProd = itemArticle.dataset.color;

            itemArticle.remove();
            deletePanier(idProd, colorProd);
          });

        totalPrice += data.price * parseFloat(quantity);
        document.getElementById("totalPrice").innerHTML = totalPrice;
      })
      .catch((error) => {
        console.log(error);
      });
    totalQuantity += parseFloat(quantity);
    document.getElementById("totalQuantity").innerHTML = totalQuantity;
  }

  document.getElementById("order").addEventListener("click", (e) => {
    e.preventDefault();
    //Récupérer et analyser les données saisies par l’utilisateur dans le formulaire.
    //Afficher un message d’erreur si besoin
    let nameValid = regexValidation("firstName", "firstNameErrorMsg");
    let lastValid = regexValidation("lastName", "lastNameErrorMsg");
    let addressValid = regexValidation("address", "addressErrorMsg");
    let cityValid = regexValidation("city", "cityErrorMsg");
    let emailValid = regexValidation("email", "emailErrorMsg");
    if (nameValid && lastValid && addressValid && cityValid && emailValid) {
      // Constituer un objet contact (à partir des données du formulaire) et
      //un tableau de produits.
      let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      };
      let products = [];
      for (let i = 0; i < parseProdPanier.length; i++) {
        products.push(parseProdPanier[i][0]);

        localStorage.setItem("products", JSON.stringify(products));
      }
      let jsonData = JSON.stringify({ contact, products });

      //Effectuer une requête POST sur l’API et récupérer l’identifiant de
      //commande dans la réponse de celle-ci. Rediriger l’utilisateur sur la page Confirmation
      //Si ce numéro doit être affiché, on supprime les produits du localstorage
      
      //fetch("http://localhost:3000/api/products/order", {
      fetch("https://"+localStorage.getItem("ipaws")+"/api/products/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.clear();
          document.location.href =
            "./confirmation.html?orderid=" + data.orderId;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}
//* Fonction de modification de produits dans la page Panier
function changePanier(idProd, colorProd, quantite) {
  let beforeQuantity = 0;
  for (let arrayItem of parseProdPanier) {
    if (arrayItem[0] === idProd && arrayItem[2] === colorProd) {
      beforeQuantity = parseFloat(arrayItem[1]);
      arrayItem[1] = parseFloat(quantite).toString();
      localStorage.setItem("cart", JSON.stringify(parseProdPanier));
      //fetch("http://localhost:3000/api/products/" + idProd)
      
      fetch("https://"+localStorage.getItem("ipaws")+"/api/products/" + idProd)
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("totalQuantity").innerHTML =
            parseFloat(document.getElementById("totalQuantity").textContent) -
            beforeQuantity +
            parseFloat(quantite);
          document.getElementById("totalPrice").innerHTML =
            parseFloat(document.getElementById("totalPrice").textContent) +
            (parseFloat(quantite) - beforeQuantity) * parseFloat(data.price);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}
//* Fonction de suppresion de produits dans la page Panier
function deletePanier(idProd, colorProd) {
  let arrayvalue = [];
  let beforeQuantity = 0;
  for (let arrayItem of parseProdPanier) {
    if (arrayItem[0] === idProd && arrayItem[2] === colorProd) {
      arrayvalue = arrayItem;
      beforeQuantity = arrayItem[1];
    }
  }

  let index = parseProdPanier.indexOf(arrayvalue);
  if (index > -1) {
    parseProdPanier.splice(index, 1);
    //fetch("http://localhost:3000/api/products/" + idProd)
    
    fetch("https://"+localStorage.getItem("ipaws")+"/api/products/" + idProd)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("totalQuantity").innerHTML =
          parseFloat(document.getElementById("totalQuantity").textContent) -
          beforeQuantity;
        document.getElementById("totalPrice").innerHTML =
          parseFloat(document.getElementById("totalPrice").textContent) -
          beforeQuantity * parseFloat(data.price);
        if (parseProdPanier.length == 0) {
          document.getElementById("totalQuantity").innerHTML = 0;
          document.getElementById("totalPrice").innerHTML = 0;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  localStorage.setItem("cart", JSON.stringify(parseProdPanier));
  produitsPanier = localStorage.getItem("cart");
  parseProdPanier = JSON.parse(produitsPanier);

  if (parseProdPanier.length == 0) {
    let totQuantity = 0;
    let totPrice = 0;
    let totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerHTML = totQuantity;
    let totalPrice = document.getElementById("totalPrice");
    totalPrice.innerHTML = totPrice;
    localStorage.clear();
  }
}

//* fonction de validation du champs de formulaire
function regexValidation(itemInput, itemError) {
  let inputValue = document.getElementById(itemInput);
  let errorValue = document.getElementById(itemError);
  let emailRegex = new RegExp(
    /^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/
  );
  let nameRegex = new RegExp(
    /^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$/
  );
  let addressRegex = new RegExp(
    /^[0-9]{1,4}(?![\s.]+$)[a-zA-Zàâäéèêëïîôöùûüç-\s\-'.]+$/
  );
  let itemRegex;
  errorMessage = "la valeur saisie n'est pas correcte: " + inputValue.value;

  switch (itemInput) {
    case "firstName":
      itemRegex = nameRegex;
      break;
    case "lastName":
      itemRegex = nameRegex;
      break;
    case "address":
      itemRegex = addressRegex;
      break;
    case "city":
      itemRegex = nameRegex;
      break;
    case "email":
      itemRegex = emailRegex;
      break;
    default:
      return false;
  }

  if (inputValue.value == "" || itemRegex.exec(inputValue.value) == null) {
    errorValue.textContent = errorMessage;
    inputValue.focus();
    return false;
  } else {
    errorValue.textContent = "";
    return true;
  }
}
