(function(){
 const toggle=document.getElementById('langToggle'); let lang='en';
 function setLanguage(next){lang=next;document.documentElement.lang=next;document.querySelectorAll('[data-en][data-id]').forEach(el=>{const value=el.getAttribute('data-'+next);if(value!==null)el.innerHTML=value;});toggle.textContent=next==='en'?'ID':'EN';}
 toggle.addEventListener('click',()=>setLanguage(lang==='en'?'id':'en'));
 document.querySelector('.menu-toggle').addEventListener('click',()=>document.getElementById('nav').classList.toggle('open'));
 document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('nav').classList.remove('open')));
 document.getElementById('year').textContent=new Date().getFullYear();
 document.getElementById('inquiryForm').addEventListener('submit',function(e){e.preventDefault();const d=new FormData(this);const subject=encodeURIComponent('Business Inquiry — AROS GLOBAL RESOURCE');const body=encodeURIComponent('Name / Company: '+d.get('name')+'\nEmail: '+d.get('email')+'\nRole: '+d.get('role')+'\n\nRequirement details:\n'+d.get('details')+'\n\nSent from AROS GLOBAL RESOURCE website.');window.location.href='mailto:arosglobalresource@gmail.com?subject='+subject+'&body='+body;});
})();
