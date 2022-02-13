let productListTable = document.getElementById("productlist-table");
let productHeadingList = [
  "Product Image",
  "Product Title",
  "Category",
  "Price",
  "Actions",
];
let tableBody = document.createElement("tbody");
let productList = [];
let sortOrder = "";
initializeProductsTable();

function initializeProductsTable(){
    
    if (productHeadingList && productHeadingList.length > 0) {
      if (productListTable) {
          // create table heading
        let tableHeading = document.createElement("thead");
        let headingRow = document.createElement("tr");
        productHeadingList.forEach((heading) => {
          let th = document.createElement("th");
          if(heading.toLowerCase() == "product title"){
            th.classList.add("cursor-pointer");
          }
          let thText = document.createTextNode(heading);
          th.appendChild(thText);
          headingRow.appendChild(th);
        });
        tableHeading.appendChild(headingRow);
        productListTable.appendChild(tableHeading);
    
        //   get Product list
        document.getElementById("loader").style.visibility = "visible";
        document.getElementById("productlist-table").style.visibility = "hidden";
        getProductList().then((data) => {
          if (data && data.length > 0) {
            productList = data;
            bindTableRecords(data, "default");
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
              }else if(event.target.textContent.toLowerCase() == "product title"){
                if(sortOrder == "asc") {
                  sortOrder = "desc";
                  bindTableRecords(productList, "desc");
                }else{
                  sortOrder = "asc";
                  bindTableRecords(productList, "asc");
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

    function bindTableRecords(data, _sorting){
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
          if(_sorting == "asc"){
            data.sort((a, b) => {
              let fa = a.title.toLowerCase(),
                  fb = b.title.toLowerCase();
          
              if (fa < fb) {
                  return -1;
              }
              if (fa > fb) {
                  return 1;
              }
              return 0;
          });
          var tableHeaderRowCount = 1;
          var rowCount = productListTable.rows.length;
          for (var i = tableHeaderRowCount; i < rowCount; i++) {
              productListTable.deleteRow(tableHeaderRowCount);
          }
          }else if(_sorting == "desc"){
            data.sort((a, b) => {
              let fa = a.title.toLowerCase(),
                  fb = b.title.toLowerCase();
          
              if (fa > fb) {
                  return -1;
              }
              if (fa < fb) {
                  return 1;
              }
              return 0;
          });
          var tableHeaderRowCount = 1;
          var rowCount = productListTable.rows.length;
          for (var i = tableHeaderRowCount; i < rowCount; i++) {
              productListTable.deleteRow(tableHeaderRowCount);
          }
          }
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

   

    