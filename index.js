let productListTable = document.getElementById("productlist-table");
let productHeadingList = [
  "Product Image",
  "Product Title",
  "Category",
  "Price",
  "Actions",
];
let tableBody = document.createElement("tbody");

initializeProductsTable();

function initializeProductsTable(){
    
    if (productHeadingList && productHeadingList.length > 0) {
      if (productListTable) {
          // create table heading
        let tableHeading = document.createElement("thead");
        let headingRow = document.createElement("tr");
        productHeadingList.forEach((heading) => {
          let th = document.createElement("th");
          let thText = document.createTextNode(heading);
          th.appendChild(thText);
          headingRow.appendChild(th);
        });
        tableHeading.appendChild(headingRow);
        productListTable.appendChild(tableHeading);
    
        //   get Product list
        document.getElementById("loader").style.visibility = "visible";
        document.getElementById("productlist-table").style.visibility = "hidden";
     const getAllProducts =  getProductList().then((data) => {
          if (data && data.length > 0) {
            document.getElementById("loader").style.visibility = "hidden";
        document.getElementById("productlist-table").style.visibility = "visible";
              const createTdForProductsTable = (textValue,isImage,imageSrc) =>{
                  let td = document.createElement("td");
                  if(textValue){
                      let titleText = document.createTextNode(textValue);
                      td.appendChild(titleText);
                  }
                  if(isImage){
                      let productImage = document.createElement("img");
                      productImage.src = imageSrc;
                      td.classList.add("product-table-td");
                      td.appendChild(productImage)
                  }
                  return td;
                }
    
            // bind data in product table
            data.forEach((dataItem) => {
                let tableRow = document.createElement("tr");
              let tableData = createTdForProductsTable(null,true,dataItem.image);
              tableRow.appendChild(tableData);
    
              // set product title
             let titleTd = createTdForProductsTable(dataItem.title, false,null);
              tableRow.appendChild(titleTd);
    
              // set category
              let categoryTd = createTdForProductsTable(dataItem.category, false, null);
              tableRow.appendChild(categoryTd);
    
              // set price
              let priceTd = createTdForProductsTable(dataItem.price, false, null);
              tableRow.appendChild(priceTd);
    
              // set actions
              // edit
              let actionTd = document.createElement("td");
              let editLink = document.createElement("a");
              editLink.setAttribute("id",dataItem.id);
              editLink.text = "Edit";
              editLink.setAttribute("href", "javascript:void(0)");
              actionTd.appendChild(editLink);
    
              // delete
              let deleteLink = document.createElement("a");
              deleteLink.setAttribute("id",dataItem.id);
              deleteLink.text = "Delete";
              deleteLink.setAttribute("href", "javascript:void(0)");
              actionTd.appendChild(deleteLink);
    
              tableRow.appendChild(actionTd);
    
              tableBody.appendChild(tableRow);
            });
            productListTable.appendChild(tableBody);
    
           
          }
        });
      }
    
      async function getProductList() {
        let response = await fetch("https://fakestoreapi.com/products");
        let data = await response.json();
        return data;
      }
    }
}


      document.addEventListener('click', function(event){
          if(event){
              if(event.target.id){
                  if(event.target.text){
                      if(event.target.text.toLowerCase() == "edit"){
                          editProductItem(event.target.id);
                          console.log("edit");
                        }else if(event.target.text.toLowerCase() == 'delete'){
                          let isDelete = confirm("Are you sure you want to delete this product?");
                          if(isDelete){
                            deleteProductItem(event.target.id).then((data)=>{
                                  if(data){
                                      document.getElementById("productlist-table").deleteTHead();
                                      initializeProductsTable();
                                  }
                            })
                          }
                      }
                  }
              }
          }
      })

      function editProductItem(id){
        window.location.href=`add-product.html?productId=${id}`;
      }

     async function deleteProductItem(id){
            if(id){
                let response = await fetch(`https://fakestoreapi.com/products/${id}`,{method: 'delete'});
                let data = response.json();
                return data;
            }
      }

    function navigateToAddProduct(){
        window.location.href="add-product.html"
    }

   

    