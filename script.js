(function(){
 const toggle=document.getElementById('langToggle'); let lang='en';
 function setLanguage(next){lang=next;document.documentElement.lang=next;document.querySelectorAll('[data-en][data-id]').forEach(el=>{const value=el.getAttribute('data-'+next);if(value!==null)el.innerHTML=value;});toggle.textContent=next==='en'?'ID':'EN';}
 toggle.addEventListener('click',()=>setLanguage(lang==='en'?'id':'en'));
 document.querySelector('.menu-toggle').addEventListener('click',()=>document.getElementById('nav').classList.toggle('open'));
 document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('nav').classList.remove('open')));
 document.getElementById('year').textContent=new Date().getFullYear();
 document.getElementById('inquiryForm').addEventListener('submit',function(e){e.preventDefault();const d=new FormData(this);const subject=encodeURIComponent('Business Inquiry — AROS GLOBAL RESOURCE');const body=encodeURIComponent('Name / Company: '+d.get('name')+'\nEmail: '+d.get('email')+'\nRole: '+d.get('role')+'\n\nRequirement details:\n'+d.get('details')+'\n\nSent from AROS GLOBAL RESOURCE website.');window.location.href='mailto:arosglobalresource@gmail.com?subject='+subject+'&body='+body;});
})();async function loadProducts() {
  const grid = document.getElementById('productGrid');

  try {
    const response = await fetch('/content/products/');
    if (!response.ok) throw new Error('Products not found');

    const files = await fetch(
      'https://api.github.com/repos/arosglobalresource/aros-global-resource/contents/content/products'
    );

    const productFiles = await files.json();

    const products = await Promise.all(
      productFiles
        .filter(file => file.name.endsWith('.json'))
        .map(async file => {
          const res = await fetch(file.download_url);
          return await res.json();
        })
    );

    grid.innerHTML = products.map(product => `
      <article class="product-card">
        <img src="${product.image || ''}" alt="${product.name}" loading="lazy">
        <div class="product-content">
          <span class="product-tag">AROS PRODUCT</span>
          <h3>${product.name || ''}</h3>
          <p>${product.description || ''}</p>
          <p>${product.specifications || ''}</p>
          <p>${product.packaging || ''}</p>
          <a href="#inquiry" class="text-link">Submit your requirement →</a>
        </div>
      </article>
    `).join('');

  } catch (error) {
    grid.innerHTML = '<p>Product information is currently unavailable.</p>';
    console.error(error);
  }
}

loadProducts();
