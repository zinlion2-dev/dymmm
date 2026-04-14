  // ========= УПРАВЛЕНИЕ СВЕЧЕНИЕМ ЛОГОТИПА ПО РАСПИСАНИЮ =========
  const logoContainer = document.getElementById('logoContainer');
  let currentGlowState = null;
  let blinkTimeout = null;
  let isBlinking = false;

  function setGlowState(shouldGlow) {
    if (isBlinking) return;
    if (shouldGlow) {
      logoContainer.classList.remove('no-glow');
      logoContainer.classList.add('glow');
      currentGlowState = true;
    } else {
      logoContainer.classList.remove('glow');
      logoContainer.classList.add('no-glow');
      currentGlowState = false;
    }
  }

  function startBlinkAndSwitch(finalGlowState) {
    if (blinkTimeout) clearTimeout(blinkTimeout);
    if (isBlinking) {
      logoContainer.classList.remove('blinking-transition');
      isBlinking = false;
    }
    logoContainer.classList.remove('glow', 'no-glow');
    logoContainer.classList.add('blinking-transition');
    isBlinking = true;
    
    blinkTimeout = setTimeout(() => {
      logoContainer.classList.remove('blinking-transition');
      isBlinking = false;
      if (finalGlowState) {
        logoContainer.classList.remove('no-glow');
        logoContainer.classList.add('glow');
        currentGlowState = true;
      } else {
        logoContainer.classList.remove('glow');
        logoContainer.classList.add('no-glow');
        currentGlowState = false;
      }
    }, 5000);
  }

  function updateLogoSchedule() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinutes;
    const OFF_TIME = 23 * 60;
    const ON_TIME = 11 * 60;
    const shouldGlowNormally = currentTimeMinutes < OFF_TIME && currentTimeMinutes >= ON_TIME;
    const isExactlyOffMoment = (currentHour === 23 && currentMinutes === 0);
    const isExactlyOnMoment = (currentHour === 11 && currentMinutes === 0);
    
    if (isExactlyOffMoment && currentGlowState !== false && !isBlinking) {
      startBlinkAndSwitch(false);
    } 
    else if (isExactlyOnMoment && currentGlowState !== true && !isBlinking) {
      startBlinkAndSwitch(true);
    }
    else if (!isBlinking) {
      setGlowState(shouldGlowNormally);
    }
  }
  
  setInterval(updateLogoSchedule, 30000);
  setInterval(() => {
    const now = new Date();
    if (now.getMinutes() === 0 && (now.getHours() === 23 || now.getHours() === 11)) {
      updateLogoSchedule();
    }
  }, 60000);
  setTimeout(() => updateLogoSchedule(), 500);

  // ========= ДАННЫЕ ТОВАРОВ =========
  const productsData = {
    liquids: [
      { name: "Bjorn", brand: "Bjorn", img: "жидкости/joker.jpg" },
      { name: "Podonki", brand: "Podonki", img: "жидкости/joker.jpg" },
      { name: "Axylinet", brand: "Axylinet", img: "жидкости/joker.jpg" },
      { name: "Ачонет?", brand: "Ачонет?", img: "жидкости/joker.jpg" },
      { name: "Hotspot", brand: "Hotspot", img: "жидкости/joker.jpg" },
      { name: "Skala", brand: "Skala", img: "жидкости/joker.jpg" },
      { name: "Dual", brand: "Dual", img: "жидкости/joker.jpg" },
      { name: "DABBLER", brand: "Dabbler", img: "жидкости/joker.jpg" },
      { name: "Husky", brand: "Husky", img: "жидкости/joker.jpg" }
    ],
    pods: [
      { name: "Vaporesso XROS", brand: "Vaporesso", img: "Устройства/xros5.jpg" },
      { name: "Aegis", brand: "GeekVape", img: "Устройства/xros5.jpg" },
      { name: "Pasito", brand: "Smoant", img: "Устройства/xros5.jpg" },
      { name: "Minican", brand: "Vaporesso", img: "Устройства/xros5.jpg" },
      { name: "Charon", brand: "Smoant", img: "Устройства/xros5.jpg" },
      { name: "VOOPOO", brand: "VOOPOO", img: "Устройства/xros5.jpg" }
    ],
    disposables: [
      { name: "Bjorn One", brand: "Bjorn", img: "ОдноразовыеУстройства/lostmary.jpg" },
      { name: "Lost Mary", brand: "Lost Mary", img: "ОдноразовыеУстройства/lostmary.jpg" },
      { name: "Geek Bar", brand: "Geek Bar", img: "ОдноразовыеУстройства/lostmary.jpg" },
      { name: "Maskking", brand: "Maskking", img: "ОдноразовыеУстройства/lostmary.jpg" },
      { name: "Husky Bar", brand: "Husky", img: "ОдноразовыеУстройства/lostmary.jpg" },
      { name: "ICEBBERG", brand: "ICEBBERG", img: "ОдноразовыеУстройства/lostmary.jpg" },
      { name: "Puffmi", brand: "Puffmi", img: "ОдноразовыеУстройства/lostmary.jpg" }
    ],
    coils: [
      { name: "XROS Mesh", brand: "Vaporesso", img: "cartridges/xros.jpg" },
      { name: "Brusko Minikan", brand: "Brusko", img: "cartridges/brusko.jpg" },
      { name: "Pasito Coils", brand: "Smoant", img: "cartridges/pasito.jpg" },
      { name: "Charon Coils", brand: "Smoant", img: "cartridges/charon.jpg" },
      { name: "Aegis Boost", brand: "GeekVape", img: "cartridges/aegiscoil.jpg" }
    ]
  };

  let currentBrandFilter = null;

  function getGroupedBrands() {
    const groups = {
      liquids: { title: "Жидкости", brands: new Map() },
      pods: { title: "Устройства", brands: new Map() },
      disposables: { title: "Одноразки", brands: new Map() },
      coils: { title: "Картриджи", brands: new Map() }
    };
    for (let cat in productsData) {
      productsData[cat].forEach(product => {
        const brand = product.brand;
        if (brand && groups[cat]) {
          const count = groups[cat].brands.get(brand) || 0;
          groups[cat].brands.set(brand, count + 1);
        }
      });
    }
    return groups;
  }

  function renderBrandSidebar() {
    const groups = getGroupedBrands();
    const container = document.getElementById('brandGroupsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const allDiv = document.createElement('div');
    allDiv.className = 'brand-group';
    const allBtn = document.createElement('button');
    allBtn.className = `brand-item ${currentBrandFilter === null ? 'active-brand' : ''}`;
    allBtn.innerHTML = `<span>Все производители</span><span class="brand-counter">${Object.values(productsData).flat().length}</span>`;
    allBtn.onclick = () => {
      currentBrandFilter = null;
      renderBrandSidebar();
      applyFilters();
    };
    allDiv.appendChild(allBtn);
    container.appendChild(allDiv);
    
    for (let [catKey, group] of Object.entries(groups)) {
      if (group.brands.size === 0) continue;
      const groupDiv = document.createElement('div');
      groupDiv.className = 'brand-group';
      const titleSpan = document.createElement('div');
      titleSpan.className = 'brand-group-title';
      titleSpan.innerText = group.title;
      groupDiv.appendChild(titleSpan);
      
      const listDiv = document.createElement('div');
      listDiv.className = 'brand-list';
      const sortedBrands = Array.from(group.brands.entries()).sort((a,b) => a[0].localeCompare(b[0]));
      sortedBrands.forEach(([brand, count]) => {
        const btn = document.createElement('button');
        btn.className = `brand-item ${currentBrandFilter === brand ? 'active-brand' : ''}`;
        btn.innerHTML = `<span>${brand}</span><span class="brand-counter">${count}</span>`;
        btn.onclick = () => {
          currentBrandFilter = brand;
          renderBrandSidebar();
          applyFilters();
        };
        listDiv.appendChild(btn);
      });
      groupDiv.appendChild(listDiv);
      container.appendChild(groupDiv);
    }
  }

  function createProductCard(product) {
    const wrapper = document.createElement('div');
    wrapper.className = 'product-card-wrapper';
    wrapper.setAttribute('data-brand', product.brand);
    wrapper.setAttribute('data-name', product.name.toLowerCase());
    
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    const img = document.createElement('img');
    img.src = product.img;
    img.alt = product.name;
    img.onerror = function() { this.style.background = '#1a0a0a'; };
    const p = document.createElement('p');
    p.innerText = product.name;
    productDiv.appendChild(img);
    productDiv.appendChild(p);
    wrapper.appendChild(productDiv);
    return wrapper;
  }

  function renderAllProducts() {
    const grids = {
      gridLiquids: document.getElementById('gridLiquids'),
      gridPods: document.getElementById('gridPods'),
      gridDisposables: document.getElementById('gridDisposables'),
      gridCoils: document.getElementById('gridCoils')
    };
    for (let cat in productsData) {
      const gridId = `grid${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
      const gridEl = grids[gridId];
      if (gridEl) {
        gridEl.innerHTML = '';
        productsData[cat].forEach(product => {
          gridEl.appendChild(createProductCard(product));
        });
      }
    }
    applyFilters();
    attach3DEffect();
  }

  function applyFilters() {
    const searchValue = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const wrappers = document.querySelectorAll('.product-card-wrapper');
    wrappers.forEach(wrapper => {
      const brand = wrapper.getAttribute('data-brand');
      const name = wrapper.getAttribute('data-name');
      const matchBrand = !currentBrandFilter || currentBrandFilter === brand;
      const matchSearch = name.includes(searchValue) || (brand && brand.toLowerCase().includes(searchValue));
      if (matchBrand && matchSearch) {
        wrapper.classList.remove('hidden');
      } else {
        wrapper.classList.add('hidden');
      }
    });
    document.querySelectorAll('.section').forEach(section => {
      const grid = section.querySelector('.grid');
      if (grid) {
        const visible = grid.querySelectorAll('.product-card-wrapper:not(.hidden)').length;
        section.style.display = visible ? 'block' : 'none';
      }
    });
  }

  function attach3DEffect() {
    const cards = document.querySelectorAll('.product');
    cards.forEach(card => {
      if (card._move) card.removeEventListener('mousemove', card._move);
      if (card._leave) card.removeEventListener('mouseleave', card._leave);
      
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const xPercent = (x - 0.5) * 2;
        const yPercent = (y - 0.5) * 2;
        const maxRotate = 18;
        const rotateY = xPercent * maxRotate;
        const rotateX = yPercent * -maxRotate;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
        const shadowX = xPercent * 8;
        const shadowY = yPercent * 6;
        card.style.boxShadow = `${shadowX}px ${shadowY}px 18px rgba(200,60,40,0.3), 0 4px 12px rgba(0,0,0,0.4)`;
      };
      
      const onLeave = () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
      };
      
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      card._move = onMove;
      card._leave = onLeave;
    });
  }

  window.searchProducts = function() {
    applyFilters();
  };

  function vaporBirthEffect() {
    const vaporDiv = document.getElementById('vaporBirth');
    if (!vaporDiv) return;
    for (let i = 0; i < 35; i++) {
      const particle = document.createElement('div');
      particle.classList.add('mist-particle');
      particle.style.width = (Math.random() * 80 + 40) + 'px';
      particle.style.height = (Math.random() * 80 + 40) + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.bottom = Math.random() * 50 - 20 + 'px';
      particle.style.animationDelay = Math.random() * 1 + 's';
      vaporDiv.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove());
    }
    setTimeout(() => {
      vaporDiv.classList.add('fade-out');
      setTimeout(() => vaporDiv.remove(), 2200);
    }, 300);
  }

  function init() {
    renderAllProducts();
    renderBrandSidebar();
    vaporBirthEffect();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', () => window.searchProducts());
  }
  init();
