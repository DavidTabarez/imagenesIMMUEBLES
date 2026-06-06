// ============================================================
// admin.js — Panel de administración SubastaNet
// Los estados se guardan en localStorage bajo "estadosProductos"
// Estructura: { "id": "aprobado" | "rechazado" | "pendiente" }
// ============================================================

const STORAGE_KEY = "estadosProductos";

// ---- Leer estados guardados ----
function getEstados() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// ---- Guardar un estado ----
function setEstado(id, estado) {
  const estados = getEstados();
  estados[id] = estado;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estados));
}

// ---- Obtener estado actual de un producto ----
function estadoActual(id) {
  const estados = getEstados();
  return estados[id] || "pendiente";
}

// ---- Construir una card ----
function crearCard(producto) {
  const estado = estadoActual(producto.id);
  const card = document.createElement("div");
  card.className = "admin-card";
  card.id = "card-" + producto.id;

  let botonesHTML = "";
  if (estado === "pendiente") {
    botonesHTML = `
      <div class="admin-acciones">
        <button class="btn-aprobar"  onclick="aprobar(${producto.id})"> Aprobar</button>
        <button class="btn-rechazar" onclick="rechazar(${producto.id})"> Rechazar</button>
      </div>`;
  } else if (estado === "aprobado") {
    botonesHTML = `
      <div class="admin-acciones">
        <button class="btn-rechazar" onclick="rechazar(${producto.id})"> Rechazar</button>
        <button class="btn-revertir" onclick="revertir(${producto.id})">↩ Pendiente</button>
      </div>`;
  } else if (estado === "rechazado") {
    botonesHTML = `
      <div class="admin-acciones">
        <button class="btn-aprobar"  onclick="aprobar(${producto.id})"> Aprobar</button>
        <button class="btn-revertir" onclick="revertir(${producto.id})">↩ Pendiente</button>
      </div>`;
  }

  card.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.titulo}"
         onerror="this.src='https://via.placeholder.com/320x170?text=Sin+imagen'">
    <div class="admin-card-body">
      <span class="badge badge-${estado}">${estado}</span>
      <p class="admin-card-titulo">${producto.titulo}</p>
      <p class="admin-card-cat">${producto.categoria} · ${producto.condicion}</p>
      <p class="admin-card-precio">$${producto.precioInicial.toLocaleString("es-MX")} MXN</p>
      ${botonesHTML}
    </div>
  `;
  return card;
}

// ---- Renderizar los 3 grids ----
function renderizar() {
  const gridPend = document.getElementById("grid-pendientes");
  const gridApro = document.getElementById("grid-aprobados");
  const gridRech = document.getElementById("grid-rechazados");

  gridPend.innerHTML = "";
  gridApro.innerHTML = "";
  gridRech.innerHTML = "";

  let cntP = 0, cntA = 0, cntR = 0;

  productos.forEach(p => {
    const estado = estadoActual(p.id);
    const card = crearCard(p);
    if (estado === "pendiente") { gridPend.appendChild(card); cntP++; }
    else if (estado === "aprobado")  { gridApro.appendChild(card); cntA++; }
    else if (estado === "rechazado") { gridRech.appendChild(card); cntR++; }
  });

  document.getElementById("cnt-pendientes").textContent = cntP;
  document.getElementById("cnt-aprobados").textContent  = cntA;
  document.getElementById("cnt-rechazados").textContent = cntR;

  // Mensajes vacíos
  if (cntP === 0) gridPend.innerHTML = '<div class="empty-msg"><span>⏳</span>No hay productos pendientes</div>';
  if (cntA === 0) gridApro.innerHTML = '<div class="empty-msg"><span></span>No hay productos aprobados</div>';
  if (cntR === 0) gridRech.innerHTML = '<div class="empty-msg"><span></span>No hay productos rechazados</div>';
}

// ---- Acciones✅ ❌----
function aprobar(id) {
  setEstado(id, "aprobado");
  renderizar();
}

function rechazar(id) {
  setEstado(id, "rechazado");
  renderizar();
}

function revertir(id) {
  setEstado(id, "pendiente");
  renderizar();
}

// ---- Cambiar pestaña ----
function cambiarTab(nombre) {
  document.querySelectorAll(".tab-btn").forEach((btn, i) => {
    const nombres = ["pendientes", "aprobados", "rechazados"];
    btn.classList.toggle("activo", nombres[i] === nombre);
  });
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.toggle("activo", panel.id === "panel-" + nombre);
  });
}

// ---- Iniciar ----
renderizar();