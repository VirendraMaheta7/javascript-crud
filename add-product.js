let categoriesList = [];
let productId;
document.getElementById("product-form").style.visibility = "hidden";
checkIfAddorEditProduct();

function checkIfAddorEditProduct(){
        getProductCategories();
        let url = new URL(window.location.href);
         productId = url.searchParams.get("productId");
        if(productId){
            document.getElementById("product-form").style.visibility = "hidden";
            getProductById(productId).then((data)=>{
                document.getElementById("product-form").style.visibility = "visible";
                document.getElementById("loader").style.visibility = "hidden";
                document.getElementById("title").value = data.title;
                document.getElementById("price").value = data.price;
                document.getElementById("description").value = data.description;
                document.getElementById("category").value = data.category;
                let findIndex = categoriesList.findIndex((category)=> category == data.category);
                if(findIndex > -1){
                    document.getElementById("category").selectedIndex = findIndex+1;
                }
                document.getElementById("saveProduct").innerText = "Update";
            })
        }else{
            document.getElementById("loader").style.visibility = "hidden";
            document.getElementById("product-form").style.visibility = "visible";
        }
        
}

function getProductCategories(){
    getAllProductsCategory().then((categories)=>{
        categoriesList = categories;
      console.log('data:', categories)
      if(categories && categories.length > 0){
              addOption("Please select", "");
              categories.forEach((categoryObject)=>{
                  addOption(categoryObject, categoryObject);
              })
      }
    })
  }

function addOption(category,value){
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = category;
    let categoryControl = document.getElementById("category");
    categoryControl.options.add(option);
}

  async function getAllProductsCategory(){
    let categories = await fetch("https://fakestoreapi.com/products/categories");
    let response = await categories.json();
    return response;
  }

  function onSaveProduct(){
    const form = document.querySelector('form');
    if(form.checkValidity()){
        const data = Object.fromEntries(new FormData(form).entries());
        const body = {
            title: data.title,
            price:data.price,
            description: data.description,
            image: data.productFile,
            category: data.category
        }
    
        document.getElementById("loader").style.visibility = "visible";
        if(productId){
            // edit product
            fetch(`https://fakestoreapi.com/products/${productId}`,{
                method:"PUT",
                body: JSON.stringify(body)
            }).then((data) => {
                if(data && data.status == 200){
                    document.getElementById("loader").style.visibility = "hidden";
                    window.location.replace("index.html");
                }
            }).catch(error =>{
                console.log(error);
                document.getElementById("loader").style.visibility = "hidden";
            })
        }else{
            // add product
            fetch("https://fakestoreapi.com/products",{
                method:"POST",
                body:JSON.stringify(body)
            }).then((data)=>{
                if(data && data.status == 200){
                    document.getElementById("loader").style.visibility = "hidden";
                    window.location.replace("index.html");
                }
            }).catch(error =>{
                console.log('error:', error);
                document.getElementById("loader").style.visibility = "hidden";
            })
        }
    }else{
        alert("Please fill required and correct data");
    }
  

  }

  async function getProductById(id){
    let productDetail = await fetch(`https://fakestoreapi.com/products/${id}`);
    let response = await productDetail.json();
    return response;
  }

 function onCancelClick(){
      window.location.replace("index.html");
  }