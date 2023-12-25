//*------------------------------------------------------------------------
//* FETCH | Requêter l’API pour lui demander l’ensemble
//* des produits ; récupérer la réponse émise, et parcourir celle-ci pour
//* insérer chaque élément (chaque produit) dans la page d’accueil
//* (dans le DOM).
//*------------------------------------------------------------------------
localStorage.setItem("ipaws","easytable.zapto.org");
//let ip="ec2-35-181-51-145.eu-west-3.compute.amazonaws.com:3010";
//let url = "http://" + ip + ":3000/api/products";
//"http://localhost:3000/api/products"
fetch("https://"+localStorage.getItem("ipaws")+"/api/products")
  .then((response) => response.json())
  .then((data) => {
    const idItems = document.getElementById("items");
    for (let i = 0; i < data.length; i++) {
      let aIndex = document.createElement("a");
      idItems.appendChild(aIndex);
      aIndex.className = "aindex";
      aIndex.setAttribute("href", "product.html?idkanap=" + data[i]._id);

      let articleIndex = document.createElement("article");
      aIndex.appendChild(articleIndex);
      articleIndex.classList.add("articleindex");

      let imgIndex = document.createElement("img");
      articleIndex.appendChild(imgIndex);
      imgIndex.src = data[i].imageUrl;
      imgIndex.classList.add("imgindex");

      let titreIndex = document.createElement("h3");
      articleIndex.appendChild(titreIndex);
      titreIndex.innerHTML = data[i].name;

      let descriptionIndex = document.createElement("p");
      articleIndex.appendChild(descriptionIndex);
      descriptionIndex.innerHTML = data[i].description;
    }
  })
  .catch((error) => {
    console.log("erreur : " + err);
  });
