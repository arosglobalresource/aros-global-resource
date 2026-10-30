(function () {
  const toggle = document.getElementById('langToggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  const grid = document.getElementById('productGrid');

  let lang = 'en';

  // LANGUAGE SWITCHER
  function setLanguage(next) {
    lang = next;
    document.documentElement.lang = next;

    document.querySelectorAll('[data-en][data-id]').forEach(el => {
      const value = el.getAttribute('data-' + next);
      if (value !== null) el.innerHTML = value;
    });

    if (toggle) {
      toggle.textContent = next === 'en' ? 'ID' : 'EN';
    }
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      setLanguage(lang === 'en' ? 'id' : 'en');
    });
  }

  // MOBILE MENU
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

  // AUTOMATIC YEAR
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // INQUIRY FORM
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

  // LOAD PRODUCTS FROM PAGES CMS / GITHUB
  async function loadProducts() {
    if (!grid) return;

    try {
      const response = await fetch(
        'https://api.github.com/repos/arosglobalresource/aros-global-resource/contents/content/products?ref=main'
      );

      if (!response.ok) {
        throw new Error('Cannot access product collection');
      }

      const files = await response.json();

      const jsonFiles = files.filter(file =>
        file.type === 'file' &&
        file.name.endsWith('.json')
      );

      const products = await Promise.all(
        jsonFiles.map(async file => {
          const result = await fetch(file.download_url);

          if (!result.ok) {
            throw new Error('Cannot read product: ' + file.name);
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
          imagePath = encodeURI(imagePath);
        }

        image.src = imagePath;
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
        link.className = 'text-link';
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

      // Existing HTML product cards remain visible if loading fails.
    }
  }

  loadProducts();

})();
