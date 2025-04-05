const sheetId = "1j-VRk5eeMA_r-YyAle0gKY41zcYe2mwUFKrqf214_As";
const apiKey = "AIzaSyAIztg6QnxD9Z6nMBd8dM2vQDeXOncdks8";
let rawData = [];

function updateDashboardTotals() {
    const ranges = ["Material in!A2:Z100", "Material Out!A2:Z100"];
    const urls = ranges.map(range => `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`);
  
    Promise.all(urls.map(url => fetch(url).then(res => res.json())))
      .then(([inData, outData]) => {
        let totalIn = 0, totalOut = 0; let totalPurchageAmount = 0; let totalSalesmount = 0 ;
        if (inData.values) {
          totalIn = inData.values.reduce((sum, row) => sum + (parseFloat(row[4]) || 0), 0);
          totalPurchageAmount = inData.values.reduce((sum, row) => sum + (parseFloat(row[7]) || 0), 0);
          
        }
  
        if (outData.values) {
          totalOut = outData.values.reduce((sum, row) => sum + (parseFloat(row[4]) || 0), 0);
          totalSalesmount= outData.values.reduce((sum, row) => sum + (parseFloat(row[6]) || 0), 0);
        }
  
        document.getElementById("totalMaterialIn").textContent = formatWeight(totalIn) ;
        document.getElementById("totalPurchaseAmount").textContent = formatMoney(`${totalPurchageAmount.toFixed(1)}`) ;
        document.getElementById("totalMaterialOut").textContent = formatWeight(totalOut) ;
        document.getElementById("totalSaleAmount").textContent =formatMoney(`${totalSalesmount.toFixed(2)}`);
      })
      .catch(error => console.error("Error fetching dashboard totals:", error));
  }
function showDashboard() {
  document.getElementById("dashboard-view").style.display = "block";
  document.getElementById("data-view").style.display = "none";
  document.getElementById("page-title").innerText = "Material In|Out";

  updateDashboardTotals()
  fetchMonthlyData()
}

function fetchMaterialOut() {
  document.getElementById("dashboard-view").style.display = "none";
  document.getElementById("data-view").style.display = "block";
  document.getElementById("page-title").innerText = "Material Out";
  const range = "Material Out!A2:Z100";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      rawData = data.values;
   console.log(rawData)
    loadTableData(rawData, 'out');
    })
    .catch(error => console.error("Error:", error));
}

function fetchMaterialIn() {
  document.getElementById("dashboard-view").style.display = "none";
  document.getElementById("data-view").style.display = "block";
  document.getElementById("page-title").innerText = "Material In";
  const range = "Material in!A2:Z100";
  console.log("Material")
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      rawData = data.values;
    loadTableData(rawData, 'in');
    })
    .catch(error => console.error("Error:", error));
}

function loadTableData(materialData, type) {
  const tableBody = document.querySelector("#tableBody");
  tableBody.innerHTML = "";
  let totalWeight = 0;
  let totalAmount = 0;
  materialData.forEach(row => {
    if (row.length < 7) return;
    if (type === "in"){
        let weight = parseFloat(row[4]) || 0;
        let amount = parseFloat(row[7]) || 0;
        totalWeight += weight;
        totalAmount += amount;
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${weight.toFixed(2)}</td><td>₹ ${row[5]}</td><td>₹ ${amount.toFixed(2)}</td>`;
        tableBody.appendChild(tr);
    }else{
        let weight = parseFloat(row[4]) || 0;
        let amount = parseFloat(row[6]) || 0;
        totalWeight += weight;
        totalAmount += amount;
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${weight.toFixed(2)}</td><td>₹ ${row[5]}</td><td>₹ ${amount.toFixed(2)}</td>`;
        tableBody.appendChild(tr);
    }
   
  });
  document.getElementById("totalWeight").textContent = `${totalWeight.toFixed(2)}`;
  document.getElementById("totalPurchase").textContent = `₹ ${totalAmount.toFixed(2)}`;

  if (type === 'in') {
    document.getElementById("purchageSale").textContent = `Purchase Amount (Rs)`;
    document.getElementById("vendorName").textContent = `Suppliers Name`;
    document.getElementById("totalMaterialIn").textContent = `${totalWeight.toFixed(2)}`;
    document.getElementById("totalPurchaseAmount").textContent = `₹ ${totalAmount.toFixed(2)}`;
    document.getElementById("openGoogleFormBtn").textContent = "Add Material";
    document.getElementById("googleFormIframe").setAttribute("href", "https://forms.gle/tTgv54ZEb4PBxwyy5");

    
  } else {
    document.getElementById("purchageSale").textContent = `Sale Amount (Rs)`;
    document.getElementById("vendorName").textContent = `Buyers Name`;
    document.getElementById("purchageText").textContent = `Total Sales Amount`;
    document.getElementById("totalMaterialOut").textContent = `${totalWeight.toFixed(2)}`;;
    document.getElementById("totalSaleAmount").textContent = `₹ ${totalAmount.toFixed(2)}`;
    document.getElementById("openGoogleFormBtn").textContent = "Out Material";
    document.getElementById("googleFormIframe").setAttribute("href", "https://forms.gle/A9kKYiPTXdRB7FJD7");

  }
}

function filterData() { }

function fetchMonthlyData() {
    const ranges = ["Material in!A2:Z100", "Material Out!A2:Z100"];
    const urls = ranges.map(range => `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`);
  
    Promise.all(urls.map(url => fetch(url).then(res => res.json())))
      .then(([inData, outData]) => {
        let inRecords = inData.values || [];
        let outRecords = outData.values || [];
  
        let monthlyIn = {}, monthlyOut = {};
        let totalInYearly = 0, totalOutYearly = 0; // Initialize total yearly values
  
        inRecords.forEach(row => {
          if (row.length > 1) { // Ensure row has data
            let dateStr = row[1];
            let date = new Date(dateStr);
            
            if (isNaN(date)) { // Handle invalid date formats
              console.warn("Invalid date:", dateStr);
              return;
            }
  
            let key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            let amount = parseFloat(row[7]) || 0;
            monthlyIn[key] = (monthlyIn[key] || 0) + amount;
            totalInYearly += amount; // Accumulate total yearly in amount
          }
        });
  
        outRecords.forEach(row => {
          if (row.length > 1) { // Ensure row has data
            let dateStr = row[1];
            let date = new Date(dateStr);
            
            if (isNaN(date)) { // Handle invalid date formats
              console.warn("Invalid date:", dateStr);
              return;
            }
  
            let key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            let amount = parseFloat(row[6]) || 0;
            monthlyOut[key] = (monthlyOut[key] || 0) + amount;
            totalInYearly += amount; // Accumulate total yearly in amount
          }
        });
  
       
       
        drawChart(monthlyIn, monthlyOut);
      })
      .catch(error => console.error("Error fetching monthly data:", error));
  }
  
  let chartInstance = null; // Store chart instance
  
  function drawChart(monthlyIn, monthlyOut) {
    let labels = Object.keys({ ...monthlyIn, ...monthlyOut }).sort();
    let inValues = labels.map(label => monthlyIn[label] || 0);
    let outValues = labels.map(label => monthlyOut[label] || 0);
  
    let ctx = document.getElementById("monthlyChart").getContext("2d");
  
    if (chartInstance) {
      chartInstance.destroy(); // Destroy old chart instance if it exists
    }
  
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Material In",
            data: inValues,
            borderColor: "green",
            backgroundColor: "lightgreen",
            fill: true
          },
          {
            label: "Material Out",
            data: outValues,
            borderColor: "red",
            backgroundColor: "lightcoral",
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  function formatMoney(amount, locale = 'en-US', currency = 'INR') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
function formatWeight(weight, unit = 'kg', decimals = 2) {
  return `${weight.toFixed(decimals)} ${unit}`;
}
showDashboard();


document.addEventListener("DOMContentLoaded", function () {
  const openFormBtn = document.getElementById("openGoogleFormBtn");
  const popup = document.getElementById("googleFormModal");
  const closeBtn = document.querySelector(".close-btn");

  openFormBtn.addEventListener("click", function () {
      popup.style.display = "flex";
  });

  closeBtn.addEventListener("click", function () {
      popup.style.display = "none";
      fetchMaterialIn()
  });

  // Close popup if user clicks outside the modal content
  window.addEventListener("click", function (event) {
      if (event.target === popup) {
          popup.style.display = "none";
      }
  });
});

let addOutbtn = document.getElementById("openGoogleFormBtn")
 addOutbtn.addEventListener("click", function (){
  let addMt = document.getElementById("openGoogleFormBtn").textContent;
  console.log("Open", addMt);
   if(addMt === "Add Material"){
    openGoogleForm("https://forms.gle/A9kKYiPTXdRB7FJD7 ");

 } else {
   openGoogleForm("https://forms.gle/tTgv54ZEb4PBxwyy5");
 }
});
 
function openGoogleForm(formUrl) {
  // Set the iframe src
  window.open(formUrl, "_blank");
 
}


function setActiveTab(button) {
  const buttons = document.querySelectorAll(".mobile-tab-bar button");
  buttons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}
// Example usage inside click:
document.querySelectorAll(".mobile-tab-bar button").forEach((btn) => {
  btn.addEventListener("click", function () {
    setActiveTab(this);
  });
});


function logoutAlert() {
  var userConfirmed = confirm("Are you sure you want Logout?");
  if (userConfirmed) {
      // Proceed with deletion
      alert("Logout successfully.");
      window.location.href = "index.html"; // Redirect to login page
  } 
}
