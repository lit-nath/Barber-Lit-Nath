let clients = JSON.parse(
    localStorage.getItem("barberLitNathClients")
) || [];

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


// GUARDAR

function saveClients() {

    localStorage.setItem(
        "barberLitNathClients",
        JSON.stringify(clients)
    );

}


// ID

function generateId() {

    return Date.now().toString();

}


// BENEFICIO

function getBenefit(client) {

    if (
        client.cuts === 3 &&
        client.discountUsed !== true
    ) {

        return "discount";

    }


    if (client.cuts === 6) {

        return "free";

    }


    return null;

}


// TEXTO BENEFICIO

function getBenefitText(client) {

    const benefit =
        getBenefit(client);


    if (benefit === "discount") {

        return "💸 50% de descuento";

    }


    if (benefit === "free") {

        return "🎁 Corte gratis";

    }


    return "";

}


// NOTIFICACIÓN

function showNotification(message) {

    notificationText.textContent =
        message;

    notification.classList.add("show");


    setTimeout(function () {

        notification.classList.remove("show");

    }, 2500);

}


// ESTADÍSTICAS

function updateStats() {

    totalClients.textContent =
        clients.length;


    let cuts = 0;
    let benefits = 0;


    clients.forEach(function (client) {

        cuts += client.cuts;


        if (getBenefit(client) !== null) {

            benefits++;

        }

    });


    totalCuts.textContent =
        cuts;

    totalBenefits.textContent =
        benefits;

}


// MOSTRAR CLIENTES

function renderClients(search) {

    if (search === undefined) {

        search = "";

    }


    clientsList.innerHTML = "";


    const searchText =
        search.toLowerCase().trim();


    const filteredClients =
        clients.filter(function (client) {

            return client.name
                .toLowerCase()
                .includes(searchText);

        });


    if (filteredClients.length === 0) {

        const emptyMessage =
            document.createElement("div");

        emptyMessage.className =
            "empty-message";


        const icon =
            document.createElement("div");

        icon.className =
            "empty-icon";

        icon.textContent =
            "🔎";


        const title =
            document.createElement("h3");


        if (clients.length === 0) {

            title.textContent =
                "No tienes clientes registrados";

        } else {

            title.textContent =
                "Cliente no encontrado";

        }


        const description =
            document.createElement("p");


        if (clients.length === 0) {

            description.textContent =
                "Agrega tu primer cliente para comenzar.";

        } else {

            description.textContent =
                "Intenta buscar con otro nombre.";

        }


        emptyMessage.appendChild(icon);

        emptyMessage.appendChild(title);

        emptyMessage.appendChild(description);

        clientsList.appendChild(emptyMessage);


        updateStats();

        return;

    }


    filteredClients.forEach(function (client) {

        const card =
            document.createElement("div");

        card.className =
            "client-card";


        const clientInfo =
            document.createElement("div");

        clientInfo.className =
            "client-info";


        const avatar =
            document.createElement("div");

        avatar.className =
            "client-avatar-small";

        avatar.textContent =
            client.name
                .charAt(0)
                .toUpperCase();


        const clientText =
            document.createElement("div");

        clientText.className =
            "client-text";


        const name =
            document.createElement("h3");

        name.textContent =
            client.name;


        const phone =
            document.createElement("p");


        if (client.phone) {

            phone.textContent =
                "📱 " + client.phone;

        } else {

            phone.textContent =
                "📱 Sin teléfono";

        }


        const cuts =
            document.createElement("p");

        cuts.className =
            "client-cuts";

        cuts.textContent =
            "✂️ " + client.cuts + " cortes";


        const benefit =
            getBenefitText(client);


        clientText.appendChild(name);

        clientText.appendChild(phone);

        clientText.appendChild(cuts);


        if (benefit !== "") {

            const benefitElement =
                document.createElement("p");

            benefitElement.className =
                "client-benefit";

            benefitElement.textContent =
                benefit;

            clientText.appendChild(
                benefitElement
            );

        }


        clientInfo.appendChild(avatar);

        clientInfo.appendChild(clientText);


        const viewButton =
            document.createElement("button");

        viewButton.className =
            "view-button";

        viewButton.textContent =
            "Ver cliente";


        viewButton.addEventListener(
            "click",
            function () {

                openClientDetails(
                    client.id
                );

            }
        );


        card.appendChild(clientInfo);

        card.appendChild(viewButton);

        clientsList.appendChild(card);

    });


    updateStats();

}


// ABRIR AGREGAR CLIENTE

addClientBtn.addEventListener(
    "click",
    function () {

        clientModal.classList.add(
            "active"
        );


        document
            .getElementById("clientName")
            .focus();

    }
);


// CERRAR AGREGAR CLIENTE

closeClientModal.addEventListener(
    "click",
    function () {

        clientModal.classList.remove(
            "active"
        );

    }
);


// REGISTRAR CLIENTE

clientForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("clientName")
                .value
                .trim();


        const phone =
            document
                .getElementById("clientPhone")
                .value
                .trim();


        if (name === "") {

            alert(
                "Escribe el nombre del cliente."
            );

            return;

        }


        const newClient = {

            id: generateId(),

            name: name,

            phone: phone,

            cuts: 0,

            discountUsed: false

        };


        clients.push(newClient);


        saveClients();


        renderClients();


        clientForm.reset();


        clientModal.classList.remove(
            "active"
        );


        showNotification(
            "✅ Cliente registrado correctamente"
        );

    }
);


// ABRIR DETALLES

function openClientDetails(id) {

    const client =
        clients.find(function (item) {

            return item.id === id;

        });


    if (!client) {

        return;

    }


    selectedClientId =
        id;


    updateClientDetails(
        client
    );


    detailsModal.classList.add(
        "active"
    );

}


// ACTUALIZAR DETALLES

function updateClientDetails(client) {

    detailName.textContent =
        client.name;


    if (client.phone) {

        detailPhone.textContent =
            "📱 " + client.phone;

    } else {

        detailPhone.textContent =
            "📱 Sin teléfono";

    }


    detailCuts.textContent =
        client.cuts;


    detailAvatar.textContent =
        client.name
            .charAt(0)
            .toUpperCase();


    let progress =
        (client.cuts / 6) * 100;


    if (progress > 100) {

        progress = 100;

    }


    progressFill.style.width =
        progress + "%";


    if (client.cuts === 0) {

        progressText.textContent =
            "Empieza registrando el primer corte.";

    }


    else if (client.cuts === 1) {

        progressText.textContent =
            "Corte 1 registrado. Faltan 2 para el descuento.";

    }


    else if (client.cuts === 2) {

        progressText.textContent =
            "Falta 1 corte para obtener el 50% de descuento.";

    }


    else if (client.cuts === 3) {

        if (client.discountUsed === true) {

            progressText.textContent =
                "Descuento utilizado. El próximo corte es normal.";

        } else {

            progressText.textContent =
                "💸 Corte 3: 50% de descuento.";

        }

    }


    else if (client.cuts === 4) {

        progressText.textContent =
            "✂️ Corte 4: precio normal. Faltan 2 para el gratis.";

    }


    else if (client.cuts === 5) {

        progressText.textContent =
            "✂️ Corte 5: precio normal. Falta 1 para el gratis.";

    }


    else if (client.cuts === 6) {

        progressText.textContent =
            "🎁 Corte 6: GRATIS.";

    }


    const benefit =
        getBenefit(client);


    if (benefit === "discount") {

        benefitBox.className =
            "benefit-box available";


        benefitTitle.textContent =
            "💸 50% de descuento";


        benefitDescription.textContent =
            "El corte número 3 tiene 50% de descuento.";


        useBenefitBtn.style.display =
            "block";


        registerCutBtn.style.display =
            "block";

    }


    else if (benefit === "free") {

        benefitBox.className =
            "benefit-box available";


        benefitTitle.textContent =
            "🎁 Corte gratis";


        benefitDescription.textContent =
            "El corte número 6 es completamente gratis.";


        useBenefitBtn.style.display =
            "block";


        registerCutBtn.style.display =
            "none";

    }


    else {

        benefitBox.className =
            "benefit-box no-benefit";


        benefitTitle.textContent =
            "✂️ Corte normal";


        benefitDescription.textContent =
            "Este corte tiene precio normal.";


        useBenefitBtn.style.display =
            "none";


        registerCutBtn.style.display =
            "block";

    }

}


// REGISTRAR CORTE

registerCutBtn.addEventListener(
    "click",
    function () {

        const client =
            clients.find(function (item) {

                return item.id === selectedClientId;

            });


        if (!client) {

            return;

        }


        if (client.cuts >= 6) {

            showNotification(
                "⚠️ Primero debes utilizar el corte gratis."
            );

            return;

        }


        client.cuts =
            client.cuts + 1;


        saveClients();


        renderClients(
            searchInput.value
        );


        updateClientDetails(
            client
        );


        if (client.cuts === 3) {

            showNotification(
                "💸 ¡Corte 3! Tiene 50% de descuento."
            );

        }


        else if (client.cuts === 6) {

            showNotification(
                "🎁 ¡Corte 6! Es completamente GRATIS."
            );

        }


        else {

            showNotification(
                "✂️ Corte registrado. Precio normal."
            );

        }

    }
);


// USAR BENEFICIO

useBenefitBtn.addEventListener(
    "click",
    function () {

        const client =
            clients.find(function (item) {

                return item.id === selectedClientId;

            });


        if (!client) {

            return;

        }


        const benefit =
            getBenefit(client);


        // DESCUENTO

        if (benefit === "discount") {

            client.discountUsed =
                true;


            saveClients();


            renderClients(
                searchInput.value
            );


            updateClientDetails(
                client
            );


            showNotification(
                "💸 50% de descuento aplicado."
            );


            return;

        }


        // CORTE GRATIS

        if (benefit === "free") {

            client.cuts = 0;

            client.discountUsed =
                false;


            saveClients();


            renderClients(
                searchInput.value
            );


            updateClientDetails(
                client
            );


            showNotification(
                "🎁 Corte gratis utilizado. ¡Nuevo ciclo!"
            );

        }

    }
);


// ELIMINAR CLIENTE

deleteClientBtn.addEventListener(
    "click",
    function () {

        const client =
            clients.find(function (item) {

                return item.id === selectedClientId;

            });


        if (!client) {

            return;

        }


        const confirmation =
            confirm(
                "¿Seguro que quieres eliminar a " +
                client.name +
                "?"
            );


        if (!confirmation) {

            return;

        }


        clients =
            clients.filter(function (item) {

                return item.id !== selectedClientId;

            });


        saveClients();


        renderClients(
            searchInput.value
        );


        detailsModal.classList.remove(
            "active"
        );


        showNotification(
            "🗑 Cliente eliminado"
        );

    }
);


// BUSCADOR

searchInput.addEventListener(
    "input",
    function () {

        renderClients(
            searchInput.value
        );

    }
);


// CERRAR DETALLES

closeDetailsModal.addEventListener(
    "click",
    function () {

        detailsModal.classList.remove(
            "active"
        );

    }
);


// CERRAR MODAL AL TOCAR AFUERA

clientModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === clientModal
        ) {

            clientModal.classList.remove(
                "active"
            );

        }

    }
);


detailsModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === detailsModal
        ) {

            detailsModal.classList.remove(
                "active"
            );

        }

    }
);


// ESCAPE

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            clientModal.classList.remove(
                "active"
            );

            detailsModal.classList.remove(
                "active"
            );

        }

    }
);


// INICIAR

renderClients();

updateStats();