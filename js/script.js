 
let cid = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100]
  ];
  const originalCid = JSON.parse(JSON.stringify(cid));
  
  const items = [
    { name: "Protein Bar", price: 19.5 },
    { name: "Shaker Bottle", price: 3.26 },
    { name: "Gym Gloves", price: 12.99 }
  ];
  
  const DENOMINATIONS = {
    'PENNY': 0.01,
    'NICKEL': 0.05,
    'DIME': 0.1,
    'QUARTER': 0.25,
    'ONE': 1,
    'FIVE': 5,
    'TEN': 10,
    'TWENTY': 20,
    'ONE HUNDRED': 100
  };
  
  let price = 0;
  
  const productDivs = document.querySelectorAll(".product"); //Selects all existing productDivs
  const selectedName = document.getElementById("selected-name");
  const selectedPrice = document.getElementById("selected-price");
  const input = document.getElementById("cash");
  const purchaseBtn = document.getElementById("purchase-btn");
  const changeDiv = document.getElementById("change-due");
  const resetBtn = document.getElementById("reset-btn");
  const cashInDrawer = document.getElementById("cash-in-drawer")
  
  const populateProducts = () => {
    items.forEach((item, index) => {
      if (index < productDivs.length) {
        const productDiv = productDivs[index]; //Get the current product div
  
        //Clear the existing content inside productDiv
        productDiv.innerHTML = ""; 
  
        //Adding the product's name 
         const nameDiv = document.createElement('div');
         nameDiv.textContent = `${item.name}`;
         nameDiv.classList.add('product-name');
  
         //Adding the product's price
         const priceDiv = document.createElement('div');
         priceDiv.textContent = `$${item.price}`;
         priceDiv.classList.add('product-price');
  
         // Add a button to select the product
         const selectButton = document.createElement('button');
         selectButton.textContent = 'Select';
         selectButton.classList.add('select-button'); 
           //Add the new elements into productDiv
           productDiv.appendChild(nameDiv);
           productDiv.appendChild(priceDiv);
           productDiv.appendChild(selectButton);
  
           selectButton.addEventListener("click", () => {
             updateSelectedItems(item.name, item.price)
             price = item.price;
           });
      }
    });
  };
  
  const updateSelectedItems = (name, itemPrice) => {
    selectedName.textContent = `Item: ${name}`;
    selectedPrice.textContent = `Price: $${itemPrice}`
  }
  
  const updateCashDrawerDisplay = (cid) => {
    cashInDrawer.innerHTML = "";
    cid.forEach(([name, amount]) => {
      const row = document.createElement("p");
      row.textContent = `${name}: $${amount.toFixed(2)}`;
       cashInDrawer.appendChild(row); 
    });
  }
  
  const calculateChange = (price, cash, cid) => {
    let changeDue = +(cash - price).toFixed(2); 
    const change = []; 
    let totalCid = 0; 
    const drawer = [...cid].reverse(); 
  
    // Calculate the total cash in the drawer
    cid.forEach(([_, amount]) => {
      totalCid += amount;
    });
    totalCid = +totalCid.toFixed(2); // Round total cash to 2 decimals
  
    // Check if total cash in the drawer matches the change due
   if (totalCid === changeDue) {
    const filtered = cid.filter(([_, amount]) => amount > 0);
    return { status: "CLOSED", change: filtered };
  }
  
    //Loop through each denomination in the drawer
    drawer.forEach(([name, amount]) => {
      const value = DENOMINATIONS[name]; 
      let used = 0; 
      totalCid += amount; 
  
      //While there's enough change due and enough denomination in the drawer
      while (changeDue >= value && amount - used >= value) {
        changeDue = +(changeDue - value).toFixed(2);
        used += value;
      }
      //If any of this denomination was used, add it to the change array
      if (used > 0) {
        change.push([name, +used.toFixed(2)]); 
         const index = cid.findIndex(([denomination]) => denomination === name);
    if (index !== -1) {
      cid[index][1] -= used; 
    }
  }
  });
    
    //Round total cash in drawer to 2decimal places.
    totalCid = +totalCid.toFixed(2);
  
    if (changeDue > 0) {
      return { status: "INSUFFICIENT_FUNDS", change: [] };
   }
  
    // Check if the drawer is empty after giving change
    const remainingCash = cid.reduce((sum, [_, amount]) => sum + amount, 0);
    if (remainingCash === 0) {
      return { status: "CLOSED", change: [...cid] };
    }
  
    // Otherwise, return OPEN with the calculated change
    return { status: "OPEN", change: change };
  }
  
  const updateChangeDiv = (result) => {
    changeDiv.innerHTML = "";
  
    const statusText = document.createElement('p');
    statusText.textContent = `Status: ${result.status}`;
    changeDiv.appendChild(statusText);
  
    if (result.change.length === 0) {
      return;
    }
  
     // Display the denominations in the change array
    result.change.forEach(([name, amount]) => {
      const changeRow = document.createElement('p');
      changeRow.textContent = `${name}: $${amount.toFixed(2)}`;
      changeDiv.appendChild(changeRow);
    });
  };
  
  purchaseBtn.addEventListener("click", () => {
  
    if(price === 0) {
      alert("Please select an item!")
      return;
    }
  
    const cash = +input.value; //Converting string to float values
    console.log(price)
  
  // Check for invalid input
    if (isNaN(cash)) {
      changeDiv.innerHTML = "<p>Please enter a valid cash amount.</p>";
      return;
    }
  
     // Case 1: Customer doesn’t have enough money
    if (cash < price) {
      alert("Customer does not have enough money to purchase the item");
      return;
    }
  
    // Case 2: Exact payment, no change due
    if (cash === price) {
      changeDiv.innerHTML = "No change due - customer paid with exact cash";
      return;
    }
  
    //Normal case: Calculate and show changes in ChangeDiv
    const result = calculateChange(price, cash, cid);
    updateChangeDiv(result);
  
    const changeContainer = document.querySelector('.change-container');  // Assuming this is the parent container
    if (changeContainer) {
      changeContainer.style.display = 'block';  // Make it visible when needed
    }
    updateCashDrawerDisplay(cid);
  })
  
  resetBtn.addEventListener("click", () => {
    price = 0;
    input.value = "";
    changeDiv.textContent = "";
    selectedName.textContent ="";
    selectedPrice.textContent = "";
  
  
  
    //Resetting CID
    for (let i = 0; i < cid.length; i++) {
    cid[i][1] = originalCid[i][1];
  }
  
  updateCashDrawerDisplay(cid);
  
  
  
  } )
  
  
  
  
  document.addEventListener("DOMContentLoaded", () => {
    populateProducts();
    updateCashDrawerDisplay(cid);
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
