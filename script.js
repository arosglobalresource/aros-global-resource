(function () {
  "use strict";

  // ==========================================
  // AROS GLOBAL RESOURCE - WEBSITE SCRIPT
  // ==========================================

  const GITHUB_API =
    "https://api.github.com/repos/arosglobalresource/aros-global-resource/contents/content/products?ref=main";

  const GITHUB_RAW =
    "https://raw.githubusercontent.com/arosglobalresource/aros-global-resource/main";

  let currentLanguage = "en";

  // ==========================================
  // LANGUAGE SWITCHER
  // ==========================================

  const languageButton = document.getElementById("langToggle");

  function setLanguage(language) {
    currentLanguage = language;

    document.documentElement.lang = language;

    document.querySelectorAll("[data-en][data-id]").forEach(element => {
      const value = element.getAttribute("data-" + language);

      if (value !== null) {
        element.innerHTML = value;
      }
    });

    if (languageButton) {
      languageButton.textContent =
        language === "en" ? "ID" : "EN";
    }

    // Update tombol produk yang dibuat secara dinamis
    document.querySelectorAll(".cms-product-link").forEach(link => {
      link.textContent =
        language === "en"
          ? "Submit your requirement →"
          : "Kirim kebutuhan Anda →";
    });
  }

  if (languageButton) {
    languageButton.addEventListener("click", function () {
      setLanguage(currentLanguage === "en" ? "id" : "en");
    });
  }

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      navigation.classList.toggle("open");
    });

    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", function () {
        navigation.classList.remove("open");
      });
    });
  }

  // ==========================================
  // FOOTER YEAR
  // ==========================================

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ==========================================
  // INQUIRY FORM
  // ==========================================

  const inquiryForm = document.getElementById("inquiryForm");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(this);

      const name = formData.get("name");
      const email = formData.get("email");
      const role = formData.get("role");
      const details = formData.get("details");

      const subject = encodeURIComponent(
        "Business Inquiry — AROS GLOBAL RESOURCE"
      );

      const body = encodeURIComponent(
        "Name / Company: " + name +
        "\nEmail: " + email +
        "\nRole: " + role +
        "\n\nRequirement Details:\n" + details +
        "\n\nSent from AROS GLOBAL RESOURCE website."
      );

      window.location.href =
        "mailto:arosglobalresource@gmail.com?subject=" +
        subject +
        "&body=" +
        body;
    });
  }

  // ==========================================
  // PRODUCT IMAGE URL
  // ==========================================

  function getProductImage(imagePath) {
    if (!imagePath) {
      return "";
    }

    // Jika URL gambar sudah lengkap
    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }

    // Rapikan path gambar dari CMS
    let cleanPath = imagePath.trim();

    if (!cleanPath.startsWith("/")) {
      cleanPath = "/" + cleanPath;
    }

    // Ambil gambar langsung dari GitHub Raw
    return GITHUB_RAW +
      encodeURI(cleanPath) +
      "?v=" +
      Date.now();
  }

  // ==========================================
  // CREATE PRODUCT CARD
  // ==========================================

  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    // Product image
    const image = document.createElement("img");

    image.src = getProductImage(product.image);
    image.alt = product.name || "AROS Product";
    image.loading = "lazy";

    image.onerror = function () {
      this.style.display = "none";
    };

    // Product content
    const content = document.createElement("div");
    content.className = "product-content";

    // Product tag
    const tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent = "AROS PRODUCT";

    // Product name
    const title = document.createElement("h3");
    title.textContent = product.name || "";

    // Product description
    const description = document.createElement("p");
    description.textContent = product.description || "";

    // Product specifications
    const specifications = document.createElement("p");
    specifications.textContent = product.specifications || "";

    // Product packaging
    const packaging = document.createElement("p");
    packaging.textContent = product.packaging || "";

    // Inquiry link
    const link = document.createElement("a");

    link.href = "#inquiry";
    link.className = "text-link cms-product-link";

    link.textContent =
      currentLanguage === "en"
        ? "Submit your requirement →"
        : "Kirim kebutuhan Anda →";

    // Assemble card
    content.appendChild(tag);
    content.appendChild(title);
    content.appendChild(description);

    if (product.specifications) {
      content.appendChild(specifications);
    }

    if (product.packaging) {
      content.appendChild(packaging);
    }

    content.appendChild(link);

    card.appendChild(image);
    card.appendChild(content);

    return card;
  }

  // ==========================================
  // LOAD PRODUCTS FROM GITHUB / PAGES CMS
  // ==========================================

  async function loadProducts() {
    const productGrid = document.getElementById("productGrid");

    if (!productGrid) {
      console.error("AROS: productGrid tidak ditemukan.");
      return;
    }

    try {
      // Ambil daftar file produk
      const response = await fetch(GITHUB_API, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(
          "GitHub API error: " + response.status
        );
      }

      const files = await response.json();

      // Ambil hanya file JSON
      const productFiles = files.filter(file =>
        file.type === "file" &&
        file.name.toLowerCase().endsWith(".json")
      );

      if (productFiles.length === 0) {
        throw new Error("Belum ada produk JSON.");
      }

      // Ambil isi seluruh file produk
      const products = await Promise.all(
        productFiles.map(async function (file) {
          const response = await fetch(
            file.download_url + "?v=" + Date.now(),
            {
              cache: "no-store"
            }
          );

          if (!response.ok) {
            throw new Error(
              "Gagal membaca produk: " + file.name
            );
          }

          return await response.json();
        })
      );

      // Kosongkan produk lama setelah data CMS berhasil dibaca
      productGrid.innerHTML = "";

      // Tampilkan semua produk CMS
      products.forEach(function (product) {
        productGrid.appendChild(
          createProductCard(product)
        );
      });

      console.log(
        "AROS: " + products.length +
        " produk berhasil dimuat dari GitHub."
      );

    } catch (error) {
      console.error(
        "AROS Product Loading Error:",
        error
      );

      // Jika gagal, kartu produk HTML lama tetap ditampilkan.
    }
  }

  // ==========================================
  // START WEBSITE
  // ==========================================

  loadProducts();

})();
