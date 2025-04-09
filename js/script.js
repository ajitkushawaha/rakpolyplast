import productData from './productData.js';

// slider
document.addEventListener("DOMContentLoaded", function () {
    new Swiper(".swiper-container", {
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      slidesPerView: 3,
      spaceBetween: 20,
      breakpoints: {
        768: { slidesPerView: 4 },
        180: { slidesPerView: 1 },
      },
    });
  });


  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
  
    if (productData[productId]) {
      const product = productData[productId];
  
      // Update product details
      document.getElementById('productName').textContent = product.name;
      document.getElementById('productPrice').textContent = product.price;
      document.getElementById('productDescription').textContent = product.description;
  
      // Display specifications
      const specsElement = document.getElementById('productSpecifications');
      const referButton = document.getElementById('indiamartbtn');
      referButton.href = product.link;
       referButton.textContent = "Refer on IndiaMART";

      specsElement.innerHTML = Object.entries(product.specifications)
        .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
        .join('');
  
      // Update images
      const thumbnails = document.querySelector('.thumbnails');
      thumbnails.innerHTML = product.images
        .map((src) => `<img src="${src}" alt="Thumbnail" onclick="changeImage('${src}')">`)
        .join('');
  
      // Set main image
      changeImage(product.images[0]);
    }
  });
  
  function changeImage(src) {
    document.getElementById('mainImage').src = src;
  }
  window.changeImage = changeImage;


//   modal

document.getElementById('interested-btn').addEventListener('click', function () {
    const dialog = document.getElementById('dialogBox');
    dialog.showModal(); // Opens the dialog as a modal
  });

  const dialog = document.getElementById('dialogBox');
  dialog.addEventListener('close', () => {
    console.log('Dialog closed');
  });

const sheetId = "1j-VRk5eeMA_r-YyAle0gKY41zcYe2mwUFKrqf214_As";
const apiKey = "AIzaSyAIztg6QnxD9Z6nMBd8dM2vQDeXOncdks8"; 
const range = "Sheet1"; // Adjust based on your sheet data
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

const FetchData = ()=>{
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("data",data.values); // Prints all sheet data as an array
    })
    .catch(error => console.error("Error fetching data:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signbtn");
  
  if (signInBtn) {
    signInBtn.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent form submission
      console.log("Click detected!");

      const username = document.getElementById("inputText").value.trim();
      const password = document.getElementById("inputSigninPassword").value.trim();

      if (!username || !password) {
        alert("Please enter both username and password!");
        return;
      }

      if (username === "sales" && password === "12345") {
        alert("Login successful!");
        localStorage.setItem("token", "fake-token"); // Store token
        window.location.href = "materieal-dashbord.html"; // Redirect user
      } else {
        alert("Invalid credentials. Please try again.");
      }
    });
  } else {
    console.error("Sign-in button not found!");
  }
});




