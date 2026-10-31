(function () {
  const toggle = document.getElementById('langToggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  const grid = document.getElementById('productGrid');

  let lang = 'en';

  const API_URL =
    'https://api.github.com/repos/arosglobalresource/aros-global-resource/contents/content/products?ref=main';

  const RAW_URL =
    'https://raw.githubusercontent.com/arosglobalresource/aros-global-resource/main';

  function setLanguage(next) {
    lang = next;
    document.documentElement.lang = next;

    document.querySelectorAll('[data-en][data-id]').forEach(el => {
      const value = el.getAttribute('data-' + next);
      if (value !== null) el.innerHTML = value;
    });

    if (toggle) toggle.textContent = next === 'en' ? 'ID' : 'EN';

    document.querySelectorAll('.product-inquiry-link').forEach(link => {
      link.textContent = next === 'en'
        ? 'Submit your requirement →'
        : 'Kirim kebutuhan Anda →';
    });
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

  document.querySelectorAll('#nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav) nav.classList.remove('open');
    });
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
    if (!grid) return;

    try {
      const response = await fetch(API_URL + '&cache=' + Date.now());

      if (!response.ok) {
        throw new Error('GitHub product list unavailable');
      }

      const files = await response.json();

      const jsonFiles = files.filter(file =>
        file.type === 'file' &&
        file.name.endsWith('.json')
      );

      const products = await Promise.all(
        jsonFiles.map(async file => {
          const result = await fetch(
            RAW_URL + '/content/products/' +
            encodeURIComponent(file.name) +
            '?v=' + Date.now()
          );

          if (!result.ok) {
            throw new Error('Cannot read ' + file.name);
          }

          return await result.json();
        })
      );

      if (!products.length) {
        throw new Error('No products found');
      }

      grid.innerHTML = '';

      products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';

        const image = document.createElement('img');

        let imagePath = product.image || '';

        if (imagePath.startsWith('/')) {
          imagePath = RAW_URL + imagePath;
        }

        image.src = imagePath + '?v=' + Date.now();
        image.alt = product.name || 'AROS Product';
        image.loading = 'lazy';

        const content = document.createElement('div');
        content.className = 'product-content';

        const tag = document.createElement('span');
        tag.className = 'product-tag';
        tag.textContent = 'AROS PRODUCT';

        const title = document.createElement('h3');
        title.textContent = product.name || '';

        const description = document.createElement('p');
        description.textContent = product.description || '';

        const specifications = document.createElement('p');
        specifications.textContent = product.specifications || '';

        const packaging = document.createElement('p');
        packaging.textContent = product.packaging || '';

        const link = document.createElement('a');
        link.href = '#inquiry';
        link.className = 'text-link product-inquiry-link';
        link.textContent = lang === 'en'
          ? 'Submit your requirement →'
          : 'Kirim kebutuhan Anda →';

        content.appendChild(tag);
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(specifications);
        content.appendChild(packaging);
        content.appendChild(link);

        card.appendChild(image);
        card.appendChild(content);

        grid.appendChild(card);
      });

    } catch (error) {
      console.error('AROS Products:', error);
    }
  }

  loadProducts();
})();
