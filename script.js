(function () {
  const toggle = document.getElementById('langToggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  let lang = 'en';

  function setLanguage(next) {
    lang = next;
    document.documentElement.lang = next;

    document.querySelectorAll('[data-en][data-id]').forEach(el => {
      const value = el.getAttribute('data-' + next);
      if (value !== null) el.innerHTML = value;
    });

    if (toggle) toggle.textContent = next === 'en' ? 'ID' : 'EN';
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      setLanguage(lang === 'en' ? 'id' : 'en');
    });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  document.querySelectorAll('#nav a').forEach(a => {
    a.addEventListener('click', () => nav?.classList.remove('open'));
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('inquiryForm');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const d = new FormData(this);
      const subject = encodeURIComponent(
        'Business Inquiry — AROS GLOBAL RESOURCE'
      );

      const body = encodeURIComponent(
        'Name / Company: ' + d.get('name') +
        '\nEmail: ' + d.get('email') +
        '\nRole: ' + d.get('role') +
        '\n\nRequirement details:\n' + d.get('details') +
        '\n\nSent from AROS GLOBAL RESOURCE website.'
      );

      window.location.href =
        'mailto:arosglobalresource@gmail.com?subject=' +
        subject + '&body=' + body;
    });
  }

  async function loadProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    try {
      const response = await fetch(
        'https://api.github.com/repos/arosglobalresource/aros-global-resource/contents/content/products?ref=main'
      );

      if (!response.ok) throw new Error('Gagal membaca produk GitHub');

      const files = await response.json();

      const productFiles = files.filter(file =>
        file.name.endsWith('.json')
      );

      const products = await Promise.all(
        productFiles.map(async file => {
          const res = await fetch(file.download_url);
          if (!res.ok) throw new Error('Gagal membaca data produk');

          return await res.json();
        })
      );

      grid.innerHTML = '';

      products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';

        const image = document.createElement('img');
        image.src = product.image || '';
        image.alt = product.name || 'AROS Product';
        image.loading = 'lazy';

        const content = document.createElement('div');
        content.className = 'product-content';

        content.innerHTML = `
          <span class="product-tag">AROS PRODUCT</span>
          <h3></h3>
          <p></p>
          <p></p>
          <p></p>
          <a href="#inquiry" class="text-link">
            Submit your requirement →
          </a>
        `;

        content.querySelector('h3').textContent = product.name || '';
        const paragraphs = content.querySelectorAll('p');

        paragraphs[0].textContent = product.description || '';
        paragraphs[1].textContent = product.specifications || '';
        paragraphs[2].textContent = product.packaging || '';

        card.appendChild(image);
        card.appendChild(content);
        grid.appendChild(card);
      });

    } catch (error) {
      console.error(error);
      grid.textContent = 'Product information is currently unavailable.';
    }
  }

  loadProducts();
})();
