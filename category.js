let cateogiresList = [];
let productsByCategory = [];
let tableBody;
let headingRow;
let categoriesTable = document.getElementById("categories-table");
let productsByCategoryTable = document.getElementById("product-detail");
let categoryTableBody; 
let categoryTableHeadingRow;
tableBody = document.createElement("tbody");
let productHeadingList = [
    "Product Image",
    "Product Title",
    "Category",
    "Price",
  ];




initializeCategoriesTable();
getCategories().then((data)=>{
    console.log('data:', data)
    if(data && data.length > 0){
        cateogiresList = data;
        for(let i = 0; i<cateogiresList.length; i++){
            let obj = {
                name: cateogiresList[i],
                id:i+1
            }
            cateogiresList[i] = obj;
        }
        bindDataInTable(cateogiresList);
    }
}).catch(error=>{
    console.log("error",error);
})

function initializeCategoriesTable(){
     
    let tableHeading = document.createElement("thead");
     headingRow = document.createElement("tr");
    createTableHeading("Category Name", headingRow);
    createTableHeading("View Products", headingRow);
    tableHeading.appendChild(headingRow);
    categoriesTable.appendChild(tableHeading);
}

function initializeProductsByCategoriesTable(){
    document.getElementById("product-detail").deleteTHead();
    var tableHeaderRowCount = 1;
    var rowCount = productsByCategoryTable.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        productsByCategoryTable.deleteRow(tableHeaderRowCount);
    }
    categoryTableBody = document.createElement("tbody");
    let tableHeading = document.createElement("thead");
    categoryTableHeadingRow = document.createElement("tr");
    productHeadingList.forEach((category)=>{
        createTableHeading(category,categoryTableHeadingRow);
    });
    tableHeading.append(categoryTableHeadingRow);
    productsByCategoryTable.appendChild(tableHeading);
}

function createTableHeading(headingName, row){
    let th = document.createElement("th");
    let thText = document.createTextNode(headingName);
    th.appendChild(thText);
    row.appendChild(th);
}

async function getCategories(){
    let response = await fetch("https://fakestoreapi.com/products/categories");
    let responseData = await response.json();
    return responseData;
}

function bindDataInTable(data){

    data.forEach((dataItem)=>{

        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let text = document.createTextNode(dataItem.name);
        td.appendChild(text);
        tr.appendChild(td)

        let td2 = document.createElement("td");
        let link = document.createElement("a");
        link.text = "View";
        link.id = dataItem.id;
        link.setAttribute("href","javascript:void(0)");
        td2.appendChild(link);
        tr.appendChild(td2);

        tableBody.appendChild(tr);

    })
    categoriesTable.appendChild(tableBody);
}

document.addEventListener('click', function(event){
    console.log('event.target.text:', event.target.text)
    if(event && event.target.text && event.target.text.toLowerCase() == "view" && event.target.id){
        let findIndex =  cateogiresList.findIndex((obj) => obj.id == event.target.id);
        if (findIndex > -1) {
            
            getProductsByCategory(cateogiresList[findIndex].name).then((data)=>{
                console.log('data:', data)      
                if(data && data.length > 0){
                    productsByCategory = data;
                    initializeProductsByCategoriesTable();
                    bindProductByCategory();
                }                                                  
            }).catch(error => {
                console.log("error",error);
            })
        }
    }
})

async function getProductsByCategory(name){
    let response = await fetch(`https://fakestoreapi.com/products/category/${name}`);
    let responseData = await response.json();
    return responseData;
}

function bindProductByCategory(){
    if(productsByCategory && productsByCategory.length > 0){
        const createTdForCategoryTable = (textValue,isImage,imageSrc) =>{
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
        productsByCategory.forEach((product) =>{
            let tableRow = document.createElement("tr");
            let tableData = createTdForCategoryTable(null,true,product.image);
            tableRow.appendChild(tableData);
  
            // set product title
           let titleTd = createTdForCategoryTable(product.title, false,null);
            tableRow.appendChild(titleTd);
  
            // set category
            let categoryTd = createTdForCategoryTable(product.category, false, null);
            tableRow.appendChild(categoryTd);
  
            // set price
            let priceTd = createTdForCategoryTable(product.price, false, null);
            tableRow.appendChild(priceTd);
            categoryTableBody.appendChild(tableRow);
        })
        productsByCategoryTable.appendChild(categoryTableBody);
    }
}