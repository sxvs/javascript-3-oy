let products = [];
const productContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const categoryButtons = document.getElementById("category-buttons");
const loader = document.getElementById("loader");

async function fetchProducts() {
  loader.style.display = "block";
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();
    products.forEach((product) => {
      product.userPrice = "Narx kelitilmagan"; // Foydalanuvchi kiritadigan narx
    });
    displayProducts(products);
    populateCategories(products);
  } catch (error) {
    console.error("Xatolik yuklash jarayonida:", error);
  } finally {
    loader.style.display = "none";
  }
}

function displayProducts(filteredProducts) {
  productContainer.innerHTML = "";
  filteredProducts.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
                    <h3>${product.title}</h3>
                    <img src="${product.image}" alt="${product.title}" width="100">
                    <p>API narxi: ${product.price} $</p>
                    <p>Foydalanuvchi narxi: <span class="user-price">${product.userPrice}</span></p>
                    <input type="number" class="price-input" placeholder="Narx kiriting">
                    <button class="set-price">Saqlash</button>
                `;

    const priceInput = productDiv.querySelector(".price-input");
    const saveButton = productDiv.querySelector(".set-price");
    const userPriceDisplay = productDiv.querySelector(".user-price");

    saveButton.addEventListener("click", () => {
      const newPrice = priceInput.value;
      if (newPrice) {
        product.userPrice = newPrice + " so‘m";
        userPriceDisplay.textContent = product.userPrice;
      }
    });

    productContainer.appendChild(productDiv);
  });
}

function populateCategories(products) {
  const categories = [...new Set(products.map((p) => p.category))];
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("filter-btn");
    button.setAttribute("data-category", category);
    button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    button.addEventListener("click", () => filterByCategory(category));
    categoryButtons.appendChild(button);
  });
}

function filterByCategory(category) {
  if (category === "all") {
    displayProducts(products);
  } else {
    const filtered = products.filter(
      (product) => product.category === category
    );
    displayProducts(filtered);
  }
}

searchInput.addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();
  const filtered = products.filter((product) =>
    product.title.toLowerCase().includes(searchText)
  );
  displayProducts(filtered);
});

fetchProducts();
