
let selectedElement = null;
const canvas = document.getElementById("editorCanvas");

// Drag & Drop
function allowDrop(ev) { ev.preventDefault(); }

function drop(ev) {
  ev.preventDefault();
  const type = ev.dataTransfer.getData("text");
  if (!type) return;
  createComponent(type);
}

document.querySelectorAll('.element').forEach(el => {
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData("text", el.dataset.type);
  });
});

// Component Create
function createComponent(type) {
  let el = document.createElement('div');
  el.className = (type === "header" || type === "footer")? "builder-element" : "inline-element";
  el.dataset.type = type;
  el.style.height = 'auto';

  let delBtn = document.createElement('button');
  delBtn.className = "delete-btn";
  delBtn.innerHTML = "×";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    el.remove();
    selectedElement=null;
    clearProps();
  };
  el.appendChild(delBtn);

  if (type === "header") {
    el.innerHTML += `
      <div class="flex justify-between items-center header-inner w-full gap-10">
        <div class="flex items-center gap-3 logo-area">
          <img src="https://via.placeholder.com/40" class="w-10 h-10 rounded-full logo-img">
          <h2 class="font-bold text-2xl logo-text" style="color: #0f172a;">Your Logo</h2>
        </div>
        <nav class="flex gap-6 nav-links">
          <a href="#" style="color: #64748b; transition: 0.2s;" data-hover-color="#2563eb" onmouseover="this.style.color=this.getAttribute('data-hover-color')" onmouseout="this.style.color=this.getAttribute('data-normal-color') || '#64748b'">Home</a>
          <a href="#" style="color: #64748b; transition: 0.2s;" data-hover-color="#2563eb" onmouseover="this.style.color=this.getAttribute('data-hover-color')" onmouseout="this.style.color=this.getAttribute('data-normal-color') || '#64748b'">About</a>
          <a href="#" style="color: #64748b; transition: 0.2s;" data-hover-color="#2563eb" onmouseover="this.style.color=this.getAttribute('data-hover-color')" onmouseout="this.style.color=this.getAttribute('data-normal-color') || '#64748b'">Services</a>
        </nav>
      </div>
    `;
  }
  else if (type === "heading") {
    el.innerHTML += `<h1 class="text-5xl font-bold editable-text" style="color: #0f172a;">Amazing Heading Here</h1>`;
  }
  else if (type === "paragraph") {
    el.innerHTML += `<p class="editable-text text-lg" style="color: #475569;">This is your paragraph. Text ke hisab se width auto hai.</p>`;
  }
  else if (type === "button") {
    el.innerHTML += `<a href="#" class="btn-link">Click Me</a>`;
  }
  else if (type === "searchbar") {
    el.innerHTML += `
      <div class="search-bar">
        <i class="fa-solid fa-magnifying-glass text-gray-400"></i>
        <input type="text" placeholder="Search here..." class="search-input">
        <button><i class="fa-solid fa-arrow-right"></i></button>
      </div>
    `;
  }
  else if (type === "box") {
    el.innerHTML += `<p class="editable-text" style="color: #0f172a;">Box Content</p>`;
    el.style.minHeight = '80px';
  }
  else if (type === "footer") {
    el.classList.add('footer-component');
    el.innerHTML += `<p class="editable-text" style="color: #ffffff;">&copy; 2026 Your Website. All Rights Reserved.</p>`;
  }

  canvas.appendChild(el);
  el.addEventListener('click', (e) => {
    if(e.target.tagName!== 'BUTTON' && e.target.tagName!== 'I') selectElement(el);
  });
}

function selectElement(element) {
  document.querySelectorAll('.selected').forEach(e => {
    e.classList.remove('selected');
  });
  element.classList.add('selected');
  selectedElement = element;

  loadProps();
}

function loadProps() {
  const panel = document.getElementById('propsPanel');
  const type = selectedElement.dataset.type;

  let currentTextHex = "#000";
  let currentBgHex = "#ffffff";

  if(type === "button") {
    let btn = selectedElement.querySelector('.btn-link');
    currentTextHex = rgbToHex(window.getComputedStyle(btn).color) || "#ffffff";
    currentBgHex = rgbToHex(window.getComputedStyle(btn).backgroundColor) || "#2563eb";
  } else if (type === "heading" || type === "paragraph") {
    let txtNode = selectedElement.querySelector('.editable-text');
    currentTextHex = rgbToHex(window.getComputedStyle(txtNode).color) || "#000";
    currentBgHex = rgbToHex(window.getComputedStyle(selectedElement).backgroundColor) || "#ffffff";
  } else {
    currentTextHex = rgbToHex(window.getComputedStyle(selectedElement).color) || "#000";
    currentBgHex = rgbToHex(window.getComputedStyle(selectedElement).backgroundColor) || "#ffffff";
  }

  let html = `
    <div>
      <label class="block text-sm font-medium mb-2">Page Background</label>
      <input type="color" id="bgColor" class="w-full h-10 rounded-xl" onchange="applyBackground()">
      <input type="file" id="bgImage" accept="image/*" class="mt-3" onchange="applyBgImage(event)">
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label>Text / Button Color</label>
        <input type="color" id="textColor" value="${currentTextHex}" class="w-full h-10 rounded-xl" onchange="updateStyle()">
      </div>
      <div>
        <label>Component BG</label>
        <input type="color" id="bgElementColor" value="${currentBgHex}" class="w-full h-10 rounded-xl" onchange="updateStyle()">
      </div>
    </div>
    <div class="border-t pt-4">
      <label class="font-semibold">Padding</label>
      <div class="grid grid-cols-2 gap-2 mt-2">
        <div><label class="text-xs">Top</label><input type="range" min="0" max="100" value="24" id="paddingTop" oninput="updatePadding()"></div>
        <div><label class="text-xs">Right</label><input type="range" min="0" max="100" value="24" id="paddingRight" oninput="updatePadding()"></div>
        <div><label class="text-xs">Bottom</label><input type="range" min="0" max="100" value="24" id="paddingBottom" oninput="updatePadding()"></div>
        <div><label class="text-xs">Left</label><input type="range" min="0" max="100" value="24" id="paddingLeft" oninput="updatePadding()"></div>
      </div>
    </div>

    <div class="border-t pt-4">
      <label class="font-semibold">Margin</label>
      <div class="grid grid-cols-2 gap-2 mt-2">
        <div><label class="text-xs">Top</label><input type="range" min="0" max="200" value="0" id="marginTop" oninput="updateMargin()"></div>
        <div><label class="text-xs">Right</label><input type="range" min="0" max="200" value="0" id="marginRight" oninput="updateMargin()"></div>
        <div><label class="text-xs">Bottom</label><input type="range" min="0" max="200" value="0" id="marginBottom" oninput="updateMargin()"></div>
        <div><label class="text-xs">Left</label><input type="range" min="0" max="200" value="0" id="marginLeft" oninput="updateMargin()"></div>
      </div>
    </div>

    <div>
      <label>Border Radius</label>
      <input type="range" min="0" max="50" value="12" id="borderRadius" oninput="updateStyle()">
    </div>
  `;

  if(type === "header") {
    let logoTextNode = selectedElement.querySelector('.logo-text');
    let currentLogoColor = rgbToHex(window.getComputedStyle(logoTextNode).color) || "#000";

    html += `
      <div class="border-t pt-4">
        <h4 class="font-bold text-blue-600 mb-2">Logo Settings</h4>
        <label class="font-semibold">Logo Image Upload</label>
        <input type="file" accept="image/*" onchange="uploadDP(event)" class="mt-2 block w-full text-xs">
        <label class="font-semibold mt-2 block">Logo Text</label>
        <input type="text" id="logoText" class="property-input" oninput="updateLogoText()" value="${logoTextNode?.innerText || ''}">
        <label class="font-semibold mt-2 block">Logo Color</label>
        <input type="color" id="logoColor" value="${currentLogoColor}" class="w-full h-10 rounded-xl" onchange="updateLogoColor()">
      </div>
      <div class="border-t pt-4">
        <h4 class="font-bold text-blue-600 mb-2">Navigation Links</h4>
        <div id="navLinksEditor" class="space-y-3 mt-2"></div>
        <button onclick="addNavLink()" class="mt-3 px-3 py-1 bg-green-600 text-white rounded text-sm w-full">+ Add Link</button>
      </div>
    `;
    setTimeout(renderNavEditor, 100);
  }

  if(type === "heading") {
    const currentTag = selectedElement.querySelector('h1,h2,h3,h4,h5,h6')?.tagName || 'H1';
    html += `
      <div class="border-t pt-4">
        <label class="font-semibold">Heading Tag</label>
        <select id="headingTag" class="property-input" onchange="updateHeadingTag()">
          <option value="H1" ${currentTag==='H1'?'selected':''}>H1</option>
          <option value="H2" ${currentTag==='H2'?'selected':''}>H2</option>
          <option value="H3" ${currentTag==='H3'?'selected':''}>H3</option>
          <option value="H4" ${currentTag==='H4'?'selected':''}>H4</option>
          <option value="H5" ${currentTag==='H5'?'selected':''}>H5</option>
          <option value="H6" ${currentTag==='H6'?'selected':''}>H6</option>
        </select>
      </div>
    `;
  }

  if(type === "button") {
    html += `
      <div class="border-t pt-4">
        <label class="font-semibold">Button Text</label>
        <input type="text" id="btnText" class="property-input" oninput="updateBtnText()" value="${selectedElement.querySelector('.btn-link')?.innerText || ''}">
        <label class="font-semibold mt-3 block">Button Link URL</label>
        <input type="text" id="btnLink" class="property-input" placeholder="https://example.com" oninput="updateBtnLink()" value="${selectedElement.querySelector('.btn-link')?.getAttribute('href') || '#'}">
      </div>
    `;
  }

  if(selectedElement.querySelector('.editable-text') && type!== "searchbar") {
    html += `
      <div class="border-t pt-4">
        <label class="font-semibold">Text Content</label>
        <textarea id="textInput" class="property-input h-20" oninput="updateText()">${selectedElement.querySelector('.editable-text').innerText}</textarea>
      </div>
    `;
  }

  panel.innerHTML = html;
  updatePaddingUI();
  updateMarginUI();
}

function clearProps() {
  document.getElementById('propsPanel').innerHTML = '<p class="text-gray-500 text-sm">Select an element to edit</p>';
}

function rgbToHex(rgb) {
  if (!rgb) return "#ffffff";
  let rgbValues = rgb.match(/\d+/g);
  if (!rgbValues) return "#ffffff";
  return "#" + ((1 << 24) + (parseInt(rgbValues[0]) << 16) + (parseInt(rgbValues[1]) << 8) + parseInt(rgbValues[2])).toString(16).slice(1);
}

function updateText() {
  if (selectedElement) selectedElement.querySelector('.editable-text').innerText = document.getElementById('textInput').value;
}
function updateLogoText() {
  if (selectedElement) selectedElement.querySelector('.logo-text').innerText = document.getElementById('logoText').value;
}
function updateLogoColor() {
  if (selectedElement) selectedElement.querySelector('.logo-text').style.color = document.getElementById('logoColor').value;
}
function updateBtnText() {
  if (selectedElement) selectedElement.querySelector('.btn-link').innerText = document.getElementById('btnText').value;
}
function updateBtnLink() {
  if (selectedElement) selectedElement.querySelector('.btn-link').setAttribute('href', document.getElementById('btnLink').value);
}

function updateStyle() {
  if (!selectedElement) return;
  let txtColor = document.getElementById('textColor').value;
  let bgColor = document.getElementById('bgElementColor').value;
  let type = selectedElement.dataset.type;

  if(type === "button") {
    let btn = selectedElement.querySelector('.btn-link');
    btn.style.backgroundColor = bgColor;
    btn.style.color = txtColor;
  } else {
    selectedElement.style.backgroundColor = bgColor;
    let mainText = selectedElement.querySelector('.editable-text');
    if(mainText) mainText.style.color = txtColor;
  }
  selectedElement.style.borderRadius = document.getElementById('borderRadius').value + 'px';
}

// Margin & Padding
function updateMargin() {
  if (!selectedElement) return;
  const mt = document.getElementById('marginTop').value;
  const mr = document.getElementById('marginRight').value;
  const mb = document.getElementById('marginBottom').value;
  const ml = document.getElementById('marginLeft').value;
  selectedElement.style.margin = `${mt}px ${mr}px ${mb}px ${ml}px`;
}

function updateMarginUI() {
  if (!selectedElement) return;
  const style = window.getComputedStyle(selectedElement);
  document.getElementById('marginTop').value = parseInt(style.marginTop) || 0;
  document.getElementById('marginRight').value = parseInt(style.marginRight) || 0;
  document.getElementById('marginBottom').value = parseInt(style.marginBottom) || 0;
  document.getElementById('marginLeft').value = parseInt(style.marginLeft) || 0;
}

function updatePadding() {
  if (!selectedElement) return;
  const pt = document.getElementById('paddingTop').value;
  const pr = document.getElementById('paddingRight').value;
  const pb = document.getElementById('paddingBottom').value;
  const pl = document.getElementById('paddingLeft').value;
  selectedElement.style.padding = `${pt}px ${pr}px ${pb}px ${pl}px`;
}

function updatePaddingUI() {
  if (!selectedElement) return;
  const style = window.getComputedStyle(selectedElement);
  document.getElementById('paddingTop').value = parseInt(style.paddingTop) || 24;
  document.getElementById('paddingRight').value = parseInt(style.paddingRight) || 24;
  document.getElementById('paddingBottom').value = parseInt(style.paddingBottom) || 24;
  document.getElementById('paddingLeft').value = parseInt(style.paddingLeft) || 24;
}

function renderNavEditor() {
  const nav = selectedElement.querySelector('.nav-links');
  const editor = document.getElementById('navLinksEditor');
  if(!editor) return;
  editor.innerHTML = '';

  nav.querySelectorAll('a').forEach((a, i) => {
    let linkColor = rgbToHex(a.style.color) || "#64748b";
    let hoverColor = a.getAttribute('data-hover-color') || "#2563eb";

    let linkBox = document.createElement('div');
    linkBox.className = "p-3 border rounded-xl bg-gray-50 space-y-2";
    linkBox.innerHTML = `
      <div class="flex gap-2 items-center justify-between">
        <span class="text-xs font-bold text-gray-700">Link #${i+1}</span>
        <button onclick="removeNavLink(${i})" class="px-2 py-0.5 bg-red-500 text-white rounded text-xs">Delete</button>
      </div>
      <input type="text" placeholder="Text" value="${a.innerText}" class="property-input text-xs" oninput="updateNavLink(${i}, 'text', this.value)">
      <input type="text" placeholder="URL" value="${a.getAttribute('href')}" class="property-input text-xs" oninput="updateNavLink(${i}, 'href', this.value)">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text- block font-semibold">Normal</label>
          <input type="color" value="${linkColor}" class="w-full h-8 rounded" onchange="updateNavLink(${i}, 'color', this.value)">
        </div>
        <div>
          <label class="text- block font-semibold">Hover</label>
          <input type="color" value="${hoverColor}" class="w-full h-8 rounded" onchange="updateNavLink(${i}, 'color', this.value)">
        </div>
      </div>
    `;
    editor.appendChild(linkBox);
  });
}

function updateNavLink(i, prop, val) {
  const nav = selectedElement.querySelector('.nav-links');
  const a = nav.querySelectorAll('a')[i];
  if(!a) return;

  if(prop === 'text') a.innerText = val;
  if(prop === 'href') a.setAttribute('href', val);
  if(prop === 'color') {
    a.style.color = val;
    a.setAttribute('data-normal-color', val);
  }
  if(prop === 'hover') {
    a.setAttribute('data-hover-color', val);
  }
}

function addNavLink() {
  const nav = selectedElement.querySelector('.nav-links');
  const a = document.createElement('a');
  a.setAttribute('href', '#');
  a.style.cssText = "color: #64748b; transition: 0.2s;";
  a.setAttribute('data-hover-color', '#2563eb');
  a.setAttribute('onmouseover', "this.style.color=this.getAttribute('data-hover-color')");
  a.setAttribute('onmouseout', "this.style.color=this.getAttribute('data-normal-color') || '#64748b'");
  a.innerText = 'New Link';
  nav.appendChild(a);
  renderNavEditor();
}

function removeNavLink(i) {
  const nav = selectedElement.querySelector('.nav-links');
  nav.querySelectorAll('a')[i].remove();
  renderNavEditor();
}

function updateHeadingTag() {
  if (!selectedElement) return;
  const newTag = document.getElementById('headingTag').value;
  const oldEl = selectedElement.querySelector('h1,h2,h3,h4,h5,h6');
  const text = oldEl.innerText;
  const currentInlineColor = oldEl.style.color;
  const newEl = document.createElement(newTag.toLowerCase());
  newEl.className = oldEl.className;
  newEl.classList.add('editable-text');
  newEl.style.color = currentInlineColor;
  newEl.innerText = text;
  oldEl.replaceWith(newEl);
}

function applyBackground() {
  canvas.style.backgroundColor = document.getElementById('bgColor').value;
}
function applyBgImage(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(ev) { canvas.style.backgroundImage = `url('${ev.target.result}')`; };
    reader.readAsDataURL(file);
  }
}

function uploadDP(e) {
  const file = e.target.files[0];
  if(file && selectedElement) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      selectedElement.querySelector('.logo-img').src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
}



function openExport() {
  // 1. Delete buttons aur selected class hatao
  const clone = canvas.cloneNode(true);
  clone.querySelectorAll('.delete-btn').forEach(btn => btn.remove());
  clone.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

  // 2. HTML - Sirf structure, koi CSS nahi
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="editorCanvas">
    ${clone.innerHTML}
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  // 3. CSS - Sirf custom CSS jo tu ne likha hai + builder elements
  let customCSS = '';
  document.querySelectorAll('#editorCanvas [style]').forEach(el => {
    const style = el.getAttribute('style');
    if(style) {
      const type = el.dataset.type || 'custom';
      customCSS += `\n[data-type="${type}"] { ${style} }\n`;
    }
  });

  const css = `/* Generated by ProBuilder X */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 40px;
  background: #f8fafc;
}

#editorCanvas {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.builder-element,
.inline-element {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.builder-element[data-type="header"] {
  width: 100%;
  padding: 30px 40px;
}

.logo-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  transition: 0.3s;
}

.btn-link {
  display: inline-block;
  padding: 14px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.footer-component {
  width: 100%;
  text-align: center;
  padding: 60px 40px;
  border-radius: 20px;
  margin-top: 60px;
}

/* User ke diye hue inline styles */
${customCSS}`;

  // 4. JS - Khali, sirf console log
  const js = `console.log("Website Generated by ProBuilder X");`;

  document.getElementById("htmlCode").textContent = html;
  document.getElementById("cssCode").textContent = css;
  document.getElementById("jsCode").textContent = js;

  document.getElementById("exportModal").classList.add("show");
}