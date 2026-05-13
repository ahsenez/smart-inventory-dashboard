let products = JSON.parse(localStorage.getItem("products")) || [];
let totalRevenue = Number(localStorage.getItem("totalRevenue")) || 0;

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateSummary();
  updateSaleOptions();
});

function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("totalRevenue", totalRevenue);
}

function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const stock = Number(document.getElementById("productStock").value);
  const price = Number(document.getElementById("productPrice").value);

  if (!name || stock <= 0 || price <= 0) {
    alert("Lütfen tüm alanları doğru şekilde doldurun.");
    return;
  }

  products.push({
    name,
    stock,
    price,
    sold: 0
  });

  saveData();
  renderProducts();
  updateSummary();
  updateSaleOptions();

  document.getElementById("productName").value = "";
  document.getElementById("productStock").value = "";
  document.getElementById("productPrice").value = "";
}

function renderProducts() {
  const list = document.getElementById("productList");

  if (products.length === 0) {
    list.innerHTML = "<p>Henüz ürün yok.</p>";
    return;
  }

  list.innerHTML = "";

  products.forEach((product, index) => {
    const div = document.createElement("div");
    div.className = "product-item";

    const lowStockText =
      product.stock <= 5
        ? '<span class="low">⚠ Düşük stok</span>'
        : "";

    div.innerHTML = `
      <strong>${product.name}</strong><br>
      Stok: ${product.stock} adet<br>
      Fiyat: ${product.price}₺<br>
      Satılan: ${product.sold} adet<br>
      ${lowStockText}
      <button onclick="deleteProduct(${index})">Ürünü Sil</button>
    `;

    list.appendChild(div);
  });
}

function deleteProduct(index) {
  products.splice(index, 1);
  saveData();
  renderProducts();
  updateSummary();
  updateSaleOptions();
}

function updateSaleOptions() {
  const select = document.getElementById("saleProduct");
  select.innerHTML = "";

  products.forEach((product, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${product.name} (${product.stock} adet)`;
    select.appendChild(option);
  });
}

function makeSale() {
  const index = Number(document.getElementById("saleProduct").value);
  const quantity = Number(document.getElementById("saleQuantity").value);

  if (products.length === 0) {
    alert("Önce ürün eklemelisin.");
    return;
  }

  if (!quantity || quantity <= 0) {
    alert("Geçerli bir satış adedi gir.");
    return;
  }

  const product = products[index];

  if (quantity > product.stock) {
    alert("Yeterli stok yok.");
    return;
  }

  product.stock -= quantity;
  product.sold += quantity;
  totalRevenue += quantity * product.price;

  saveData();
  renderProducts();
  updateSummary();
  updateSaleOptions();

  document.getElementById("saleQuantity").value = "";
}

function updateSummary() {
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock <= 5).length;

  document.getElementById("totalProducts").innerText = totalProducts;
  document.getElementById("totalRevenue").innerText = totalRevenue + "₺";
  document.getElementById("lowStock").innerText = lowStock;
}

function analyzeStock() {
  const aiText = document.getElementById("aiText");

  if (products.length === 0) {
    aiText.innerText = "Analiz için ürün bulunmuyor.";
    return;
  }

  const lowStockProducts = products.filter(p => p.stock <= 5);
  const topSeller = [...products].sort((a, b) => b.sold - a.sold)[0];

  let analysis = `Toplam ${products.length} ürün analiz edildi.\n\n`;

  if (lowStockProducts.length > 0) {
    analysis += `⚠ Düşük stoklu ürün sayısı: ${lowStockProducts.length}\n`;
  } else {
    analysis += "✅ Kritik seviyede stok bulunmuyor.\n";
  }


  if (topSeller && topSeller.sold > 0) {
    analysis += `🏆 En çok satan ürün: ${topSeller.name}\n`;
  }

  analysis += "\nÖneri:\nStok seviyesi düşük ürünler için yeniden sipariş planlaması yap.";

  aiText.innerText = analysis;
}
