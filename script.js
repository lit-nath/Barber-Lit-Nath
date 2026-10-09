let clients = JSON.parse(localStorage.getItem("barberLitNathClients")) || [];
let selectedClientId = null;

// ELEMENTOS
const addClientBtn = document.getElementById("addClientBtn");
const clientModal = document.getElementById("clientModal");
const detailsModal = document.getElementById("detailsModal");

const closeClientModal = document.getElementById("closeClientModal");
const closeDetailsModal = document.getElementById("closeDetailsModal");

const clientForm = document.getElementById("clientForm");
const clientsList = document.getElementById("clientsList");
const searchInput = document.getElementById("searchInput");

const totalClients = document.getElementById("totalClients");
const totalCuts = document.getElementById("totalCuts");
const totalBenefits = document.getElementById("totalBenefits");

const detailName = document.getElementById("detailName");
const detailPhone = document.getElementById("detailPhone");
const detailCuts = document.getElementById("detailCuts");
const detailAvatar = document.getElementById("detailAvatar");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const benefitBox = document.getElementById("benefitBox");
const benefitTitle = document.getElementById("benefitTitle");
const benefitDescription = document.getElementById("benefitDescription");

const registerCutBtn = document.getElementById("registerCutBtn");
const useBenefitBtn = document.getElementById("useBenefitBtn");
const deleteClientBtn = document.getElementById("deleteClientBtn");

const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

function saveClients() {
  localStorage.setItem("barberLitNathClients", JSON.stringify(clients));
}

function generateId() {
  return Date.now().toString();
}

function getBenefit(client) {
  if (client.cuts === 5 && client.discount5Used !== true) return "discount20";
  if (client.cuts === 10 && client.discount10Used !== true) return "discount50";
  if (client.cuts === 15) return "free";
  return null;
}

function showNotification(message) {
  notificationText.textContent = message;
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 2500);
}

function updateStats() {
  totalClients.textContent = clients.length;
  let cuts = 0;
  let benefits = 0;

  clients.forEach((client) => {
    cuts += client.cuts;
    if (getBenefit(client) !== null) benefits++;
  });

  totalCuts.textContent = cuts;
  totalBenefits.textContent = benefits;
}

// MOSTRAR CLIENTES (DISEÑO EXACTO A LA FOTO ORIGINAL)
function renderClients(search = "") {
  clientsList.innerHTML = "";
  const searchText = search.toLowerCase().trim();

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchText)
  );

  if (filteredClients.length === 0) {
    clientsList.innerHTML = `
      <div style="text-align: center; padding: 30px 20px; background: #0d0d12; border-radius: 18px; border: 1px dashed #1e1e28;">
        <div style="font-size: 32px; margin-bottom: 8px;">🔎</div>
        <h3 style="font-size: 15px; margin-bottom: 4px; color: #fff;">No hay clientes</h3>
        <p style="font-size: 12px; color: #8e8e93;">Agrega un cliente para comenzar.</p>
      </div>
    `;
    updateStats();
    return;
  }

  filteredClients.forEach((client) => {
    const card = document.createElement("div");
    card.className = "client-card";
    card.style.cssText = "background: #0d0d12; border: 1px solid #1e1e28; border-radius: 18px; padding: 16px; margin-bottom: 12px;";

    // Header de la tarjeta (Avatar + Info)
    const header = document.createElement("div");
    header.style.cssText = "display: flex; align-items: center; gap: 14px; margin-bottom: 14px;";

    // Avatar en círculo degradado
    const avatar = document.createElement("div");
    avatar.style.cssText = "width: 48px; height: 48px; background: linear-gradient(135deg, #4f46e5, #2575fc); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: #ffffff; flex-shrink: 0;";
    avatar.textContent = client.name.charAt(0).toUpperCase();

    // Información del cliente
    const info = document.createElement("div");
    info.style.cssText = "display: flex; flex-direction: column; gap: 2px;";

    const name = document.createElement("h3");
    name.style.cssText = "font-size: 16px; font-weight: 700; color: #ffffff; margin: 0;";
    name.textContent = client.name;

    const phone = document.createElement("p");
    phone.style.cssText = "font-size: 13px; color: #8e8e93; margin: 0;";
    phone.textContent = client.phone ? "📱 " + client.phone : "📱 Sin teléfono";

    const cuts = document.createElement("p");
    cuts.style.cssText = "font-size: 13px; color: #00d2ff; font-weight: 600; margin: 2px 0 0 0;";
    cuts.textContent = "✂️ " + client.cuts + " cortes";

    info.appendChild(name);
    info.appendChild(phone);
    info.appendChild(cuts);

    header.appendChild(avatar);
    header.appendChild(info);

    // Botón Ver Cliente grande con borde azul
    const viewBtn = document.createElement("button");
    viewBtn.style.cssText = "width: 100%; padding: 12px; background: transparent; border: 1px solid #2575fc; color: #00d2ff; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer;";
    viewBtn.textContent = "Ver cliente";
    viewBtn.addEventListener("click", () => openClientDetails(client.id));

    card.appendChild(header);
    card.appendChild(viewBtn);
    clientsList.appendChild(card);
  });

  updateStats();
}

addClientBtn.addEventListener("click", () => {
  clientModal.classList.add("active");
  document.getElementById("clientName").focus();
});

closeClientModal.addEventListener("click", () => clientModal.classList.remove("active"));
closeDetailsModal.addEventListener("click", () => detailsModal.classList.remove("active"));

clientForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("clientName").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();

  if (!name) return;

  const newClient = {
    id: generateId(),
    name: name,
    phone: phone,
    cuts: 0,
    discount5Used: false,
    discount10Used: false
  };

  clients.push(newClient);
  saveClients();
  renderClients();
  clientForm.reset();
  clientModal.classList.remove("active");
  showNotification("✅ Cliente registrado correctamente");
});

function openClientDetails(id) {
  const client = clients.find((item) => item.id === id);
  if (!client) return;

  selectedClientId = id;
  updateClientDetails(client);
  detailsModal.classList.add("active");
}

function updateClientDetails(client) {
  detailName.textContent = client.name;
  detailPhone.textContent = client.phone ? "📱 " + client.phone : "📱 Sin teléfono";
  detailCuts.textContent = client.cuts;
  detailAvatar.textContent = client.name.charAt(0).toUpperCase();

  let progress = (client.cuts / 15) * 100;
  if (progress > 100) progress = 100;
  progressFill.style.width = progress + "%";

  if (client.cuts === 0) {
    progressText.textContent = "Empieza registrando el primer corte.";
  } else if (client.cuts < 5) {
    progressText.textContent = "Corte " + client.cuts + " registrado. Falta(n) " + (5 - client.cuts) + " para el 20% de descuento.";
  } else if (client.cuts === 5) {
    progressText.textContent = client.discount5Used ? "Descuento del 20% utilizado." : "💸 Corte 5: 20% de descuento disponible.";
  } else if (client.cuts < 10) {
    progressText.textContent = "Corte " + client.cuts + " registrado. Falta(n) " + (10 - client.cuts) + " para el 50% de descuento.";
  } else if (client.cuts === 10) {
    progressText.textContent = client.discount10Used ? "Descuento del 50% utilizado." : "💸 Corte 10: 50% de descuento disponible.";
  } else if (client.cuts < 15) {
    progressText.textContent = "Corte " + client.cuts + " registrado. Falta(n) " + (15 - client.cuts) + " para el corte GRATIS.";
  } else if (client.cuts === 15) {
    progressText.textContent = "🎁 Corte 15: COMPLETAMENTE GRATIS.";
  }

  const benefit = getBenefit(client);

  if (benefit === "discount20") {
    benefitTitle.textContent = "💸 20% de descuento";
    benefitDescription.textContent = "El corte número 5 tiene 20% de descuento.";
    useBenefitBtn.style.display = "block";
  } else if (benefit === "discount50") {
    benefitTitle.textContent = "💸 50% de descuento";
    benefitDescription.textContent = "El corte número 10 tiene 50% de descuento.";
    useBenefitBtn.style.display = "block";
  } else if (benefit === "free") {
    benefitTitle.textContent = "🎁 Corte gratis";
    benefitDescription.textContent = "El corte número 15 es completamente gratis.";
    useBenefitBtn.style.display = "block";
  } else {
    benefitTitle.textContent = "✂️ Corte normal";
    benefitDescription.textContent = "Este corte tiene precio normal.";
    useBenefitBtn.style.display = "none";
  }
}

registerCutBtn.addEventListener("click", () => {
  const client = clients.find((item) => item.id === selectedClientId);
  if (!client) return;

  if (client.cuts >= 15) {
    showNotification("⚠️ Primero debes utilizar el corte gratis.");
    return;
  }

  client.cuts += 1;
  saveClients();
  renderClients(searchInput.value);
  updateClientDetails(client);
  showNotification("✂️ Corte registrado.");
});

useBenefitBtn.addEventListener("click", () => {
  const client = clients.find((item) => item.id === selectedClientId);
  if (!client) return;

  const benefit = getBenefit(client);

  if (benefit === "discount20") {
    client.discount5Used = true;
  } else if (benefit === "discount50") {
    client.discount10Used = true;
  } else if (benefit === "free") {
    client.cuts = 0;
    client.discount5Used = false;
    client.discount10Used = false;
  }

  saveClients();
  renderClients(searchInput.value);
  updateClientDetails(client);
  showNotification("🎁 Beneficio aplicado.");
});

deleteClientBtn.addEventListener("click", () => {
  const client = clients.find((item) => item.id === selectedClientId);
  if (!client) return;

  if (confirm("¿Eliminar a " + client.name + "?")) {
    clients = clients.filter((item) => item.id !== selectedClientId);
    saveClients();
    renderClients(searchInput.value);
    detailsModal.classList.remove("active");
    showNotification("🗑 Cliente eliminado");
  }
});

searchInput.addEventListener("input", () => renderClients(searchInput.value));

if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    if (clients.length === 0) return alert("No hay clientes para guardar.");
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clients));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "barber_lit_nath_backup.json";
    a.click();
    showNotification("📥 Copia guardada");
  });
}

if (importBtn && importFile) {
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          clients = imported;
          saveClients();
          renderClients();
          showNotification("📤 Clientes restaurados");
        }
      } catch (err) {
        alert("Archivo inválido.");
      }
    };
    reader.readAsText(file);
  });
}

renderClients();
