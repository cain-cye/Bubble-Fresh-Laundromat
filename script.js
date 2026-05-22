// CORE COMPUTATIONAL LOGIC RULES (CALIBRATED ACCORDING TO 3KG ASSIGNMENT BASES)
let servicePricingMatrix = [
    { id: "all-in", name: "All-In Premium Care", rate: 60.00, desc: "Complete all-inclusive wash, dry, and scent finish processing rule." }, 
    { id: "wash-dry-fold", name: "Wash & Dry & Fold", rate: 23.3333, desc: "Standard cycle managing structural cleaning and fold output sequence smoothly." }, 
    { id: "linens-comforters", name: "Premium Linens & Comforters", rate: 40.00, desc: "Heavy-duty microprocessor cycles built to extract dirt from massive dense layers." }, 
    { id: "delicates-silk", name: "Delicates & Custom Silk Care", rate: 46.6667, desc: "Low-RPM moisture handling safeguarding fragile silk clothing fibers." } 
];

let hardwareFleetTelemetry = [
    { id: "Unit 101", profileId: "all-in", status: "In-Use", totalSecondsLeft: 22 * 60, customer: "Gabbi Elle" },
    { id: "Unit 102", profileId: null, status: "Available", totalSecondsLeft: 0, customer: null },
    { id: "Unit 103", profileId: "linens-comforters", status: "In-Use", totalSecondsLeft: 45 * 60, customer: "Ely Manuel" },
    { id: "Unit 104", profileId: null, status: "Available", totalSecondsLeft: 0, customer: null },
    { id: "Unit 105", profileId: null, status: "Available", totalSecondsLeft: 0, customer: null },
    { id: "Unit 106", profileId: "delicates-silk", status: "In-Use", totalSecondsLeft: 12 * 60, customer: "Lian Pauline" },
    { id: "Unit 107", profileId: null, status: "Available", totalSecondsLeft: 0, customer: null },
    { id: "Unit 108", profileId: null, status: "Under Maintenance", totalSecondsLeft: 0, customer: null }
];

// In-Memory Database Registry for Administrative Accounting Tracking
let transactedRevenueInvoicesHistory = [
    { client: "Gabbi Elle", machine: "Unit 101", payment: "GCash Gateway", totalAmount: 180.00 },
    { client: "Maria Clara", machine: "Unit 103", payment: "Cash Operation", totalAmount: 120.00 },
    { client: "Pedro Penduko", machine: "Unit 106", payment: "Card Terminal", totalAmount: 200.00 }
];

let activeSectionPage = "home";
let explicitlyLockedHardwareUnit = null;
let activeOrderSummaryCache = null;
let isAdminAuthenticatedMode = false;

// SPA NAVIGATIONAL ARCHITECTURE ROUTER & LIVE SYSTEM CLOCK TICK
document.addEventListener("DOMContentLoaded", () => {
    generateDynamicServicesGrid();
    populatePricingDropdownOptions();
    attachCalculatorStateListeners();
    initializeGlobalTelemetryCountdownTicker();
    switchSPAPage("home");
});

function initializeGlobalTelemetryCountdownTicker() {
    setInterval(() => {
        let valuesUpdated = false;

        hardwareFleetTelemetry.forEach(unit => {
            if (unit.status === "In-Use" && unit.totalSecondsLeft > 0) {
                unit.totalSecondsLeft--;
                valuesUpdated = true;

                if (unit.totalSecondsLeft === 0) {
                    unit.status = "Available";
                    unit.profileId = null;
                    unit.customer = null;
                }
            }
        });

        if (valuesUpdated) {
            if (activeSectionPage === "pricing") render8UnitHardwareStatusDeck();
            if (activeSectionPage === "admin") renderAdminControlCenterWorkspaces();
        }
    }, 1000);
}

function formatSecondsToDigitalClock(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function switchSPAPage(targetPageId) {
    if (targetPageId === "admin" && !isAdminAuthenticatedMode) {
        alert("Access Denied: Please use the footer authentication portal to initialize an admin session.");
        return;
    }

    activeSectionPage = targetPageId;

    document.querySelectorAll('.spa-section').forEach(section => section.classList.add('d-none'));
    const activeSection = document.getElementById(`page-${targetPageId}`);
    if (activeSection) activeSection.classList.remove('d-none');

    document.querySelectorAll('.custom-nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.getElementById(`nav-${targetPageId}`);
    if (activeLink) activeLink.classList.add('active');

    if (targetPageId === "pricing") render8UnitHardwareStatusDeck();
    if (targetPageId === "admin") renderAdminControlCenterWorkspaces();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateDynamicServicesGrid() {
    const container = document.getElementById('servicesGridContainer');
    if (!container) return;
    container.innerHTML = '';

    servicePricingMatrix.forEach(p => {
        const col = document.createElement('div');
        col.className = "col-md-6 col-lg-3";
        const calculatedBaseline3Kg = p.rate * 3;
        
        col.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4-cloud p-4 h-100 d-flex flex-column justify-content-between card-hover-effect">
                <div>
                    <span class="badge bg-dark text-info mb-3 font-monospace">₱${calculatedBaseline3Kg.toFixed(2)} / 3KG BASE</span>
                    <h5 class="fw-bold text-cloud-dark">${p.name}</h5>
                    <p class="text-muted small mb-4">${p.desc}</p>
                </div>
                <button class="btn btn-outline-info btn-sm w-100 fw-bold py-2 btn-hover-effect" onclick="selectServiceViaCard('${p.id}')">
                    Configure Order
                </button>
            </div>
        `;
        container.appendChild(col);
    });
}

function selectServiceViaCard(profileId) {
    switchSPAPage("pricing");
    const dropdown = document.getElementById('custServiceType');
    if (dropdown) {
        dropdown.value = profileId;
        processingCustomerInvoicePipeline();
    }
}

function render8UnitHardwareStatusDeck() {
    const container = document.getElementById('machineryStatusGrid');
    if (!container) return;
    container.innerHTML = '';

    hardwareFleetTelemetry.forEach(unit => {
        const itemRow = document.createElement('div');
        itemRow.className = "d-flex align-items-center justify-content-between p-3 mb-2 bg-white rounded border machine-status-row card-hover-effect";
        itemRow.style.cursor = unit.status === "Under Maintenance" ? "not-allowed" : "pointer";
        itemRow.setAttribute("onclick", `allocateHardwareToForm('${unit.id}')`);

        let runtimeDescriptionBlock = '';
        let visualizationIconBlock = '';
        let trackingStateMarkerBadge = '';

        if (unit.status === "In-Use") {
            const profile = servicePricingMatrix.find(p => p.id === unit.profileId);
            visualizationIconBlock = `<div class="machine-avatar bg-warning-subtle text-warning shadow-inner animate-float"><i class="fa-solid fa-spinner fa-spin fs-4"></i></div>`;
            runtimeDescriptionBlock = `
                <div>
                    <strong class="text-cloud-dark d-block font-monospace">${unit.id}</strong>
                    <span class="text-purple small fw-semibold"><i class="fa-solid fa-hourglass-start me-1"></i>Running: ${profile ? profile.name : 'Processing'}</span>
                    <small class="d-block text-muted-cloud mt-0.5" style="font-size: 0.72rem;">Client: ${unit.customer}</small>
                </div>
            `;
            trackingStateMarkerBadge = `<span class="badge bg-purple-cloud font-monospace py-1.5 px-2">${formatSecondsToDigitalClock(unit.totalSecondsLeft)} mins</span>`;
        } else if (unit.status === "Under Maintenance") {
            visualizationIconBlock = `<div class="machine-avatar bg-danger-subtle text-danger shadow-inner"><i class="fa-solid fa-triangle-exclamation fs-4"></i></div>`;
            runtimeDescriptionBlock = `
                <div>
                    <strong class="text-cloud-dark d-block font-monospace text-decoration-line-through">${unit.id}</strong>
                    <span class="text-danger small tracking-wide fw-bold text-uppercase"><i class="fa-solid fa-screwdriver-wrench me-1"></i>Offline Lockdown</span>
                </div>
            `;
            trackingStateMarkerBadge = `<span class="badge bg-danger text-white py-1.5 px-2">UNAVAILABLE</span>`;
        } else {
            visualizationIconBlock = `<div class="machine-avatar bg-success-subtle text-success shadow-inner"><i class="fa-solid fa-circle-check fs-4"></i></div>`;
            runtimeDescriptionBlock = `
                <div>
                    <strong class="text-cloud-dark d-block font-monospace">${unit.id}</strong>
                    <span class="text-success small tracking-wide fw-bold text-uppercase"><i class="fa-solid fa-sparkles me-1"></i>Choose your service</span>
                </div>
            `;
            trackingStateMarkerBadge = `<span class="badge bg-light border text-muted py-1.5 px-3">ALLOCATE</span>`;
        }

        itemRow.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                ${visualizationIconBlock}
                ${runtimeDescriptionBlock}
            </div>
            <div>
                ${trackingStateMarkerBadge}
            </div>
        `;
        container.appendChild(itemRow);
    });
}

function allocateHardwareToForm(unitId) {
    const target = hardwareFleetTelemetry.find(u => u.id === unitId);
    if (!target) return;

    if (target.status === "In-Use") {
        alert(`Core pipeline constraints: ${unitId} is actively bound to another client's wash rotation sequence.`);
        return;
    }
    if (target.status === "Under Maintenance") {
        alert(`System Offline Error: ${unitId} is structurally locked for diagnostics. Please allocate a completely operational node.`);
        return;
    }

    explicitlyLockedHardwareUnit = unitId;
    
    const indicatorBox = document.getElementById('machineLockIndicatorBox');
    const label = document.getElementById('lblLockedMachine');
    if (indicatorBox && label) {
        indicatorBox.classList.remove('d-none');
        label.textContent = unitId;
    }
    
    alert(`System allocation lock bound: ${unitId} successfully linked directly into your active order configuration.`);
}

// MATHEMATIC COMPILATION PIPELINES & FORM TRACKERS
function populatePricingDropdownOptions() {
    const select = document.getElementById('custServiceType');
    if (!select) return;
    select.innerHTML = '';
    servicePricingMatrix.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        const previewPrice = p.rate * 3;
        opt.textContent = `${p.name} (Calculated Base: ₱${previewPrice.toFixed(2)} per 3kg)`;
        select.appendChild(opt);
    });
}

function attachCalculatorStateListeners() {
    const triggers = ['custServiceType', 'custWeightInput', 'chkFlatIronAddon', 'txtIroningDetails', 'custOnlineProvider'];
    triggers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', processingCustomerInvoicePipeline);
    });

    const ironSwitch = document.getElementById('chkFlatIronAddon');
    if (ironSwitch) {
        ironSwitch.addEventListener('change', (e) => {
            const block = document.getElementById('ironingDetailsFormBlock');
            if (e.target.checked) block.classList.remove('d-none');
            else block.classList.add('d-none');
            processingCustomerInvoicePipeline();
        });
    }

    document.getElementsByName('radPaymentMethod').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const onlineBlock = document.getElementById('onlinePaymentSubBlock');
            if (e.target.value === "Online Payment") onlineBlock.classList.remove('d-none');
            else onlineBlock.classList.add('d-none');
            processingCustomerInvoicePipeline();
        });
    });

    const submitBtn = document.getElementById('btnCustomerBook');
    if (submitBtn) submitBtn.addEventListener('click', processBookingManifestExecution);
}

function processingCustomerInvoicePipeline() {
    const serviceId = document.getElementById('custServiceType').value;
    const weight = parseFloat(document.getElementById('custWeightInput').value) || 0;
    
    const profile = servicePricingMatrix.find(p => p.id === serviceId);
    let calculatedBaseTotal = (profile ? profile.rate : 0) * weight;

    let ironingFee = 0;
    const includeIroning = document.getElementById('chkFlatIronAddon').checked;
    if (includeIroning) ironingFee = 60.00;

    const grandTotal = calculatedBaseTotal + ironingFee;

    document.getElementById('lblBaseOut').textContent = `₱${calculatedBaseTotal.toFixed(2)}`;
    document.getElementById('lblIronOut').textContent = `₱${ironingFee.toFixed(2)}`;
    document.getElementById('lblGrandTotalOut').textContent = `₱${grandTotal.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`;

    const selectedPayMethod = document.querySelector('input[name="radPaymentMethod"]:checked').value;
    let finalPaymentString = selectedPayMethod;
    if (selectedPayMethod === "Online Payment") {
        finalPaymentString = document.getElementById('custOnlineProvider').value;
    }

    return { 
        client: document.getElementById('custNameInput').value, 
        phone: document.getElementById('custPhoneInput').value, 
        total: grandTotal,
        payment: finalPaymentString,
        rawMethod: selectedPayMethod,
        ironingActive: includeIroning,
        ironingTxt: document.getElementById('txtIroningDetails').value 
    };
}

function processBookingManifestExecution() {
    const name = document.getElementById('custNameInput').value.trim();
    const phone = document.getElementById('custPhoneInput').value.trim();
    const weightInput = document.getElementById('custWeightInput');
    const weight = parseFloat(weightInput.value) || 0;

    if (!name || !phone) {
        alert("Please register your validation metrics (Full Name & Contact Mobile).");
        return;
    }
    if (weight <= 0 || weight > 50) {
        weightInput.classList.add('is-invalid');
        alert("Validation constraints error: Load weights must scale safely between 1kg and 50kg.");
        return;
    }
    weightInput.classList.remove('is-invalid');

    if (explicitlyLockedHardwareUnit) {
        const checkUnitStatus = hardwareFleetTelemetry.find(u => u.id === explicitlyLockedHardwareUnit);
        if (checkUnitStatus && checkUnitStatus.status === "Under Maintenance") {
            alert("Error: The machine you locked has just been put down under maintenance. Please choose another fleet node.");
            dismissInvoiceReceipt();
            return;
        }
    }

    const pipeData = processingCustomerInvoicePipeline();
    activeOrderSummaryCache = pipeData;

    if (pipeData.ironingActive && !pipeData.ironingTxt.trim()) {
        alert("Please specify clothes description variables within the Flat Ironing instruction log box.");
        return;
    }

    const targetedMachineAllocation = explicitlyLockedHardwareUnit ? explicitlyLockedHardwareUnit : "Auto Allocation Fleet Unit";

    document.getElementById('invoiceAmountLabel').textContent = `₱${pipeData.total.toFixed(2)}`;
    document.getElementById('invClientName').textContent = name;
    document.getElementById('invClientPhone').textContent = phone;
    document.getElementById('invMachineUnit').textContent = targetedMachineAllocation;
    document.getElementById('invPaymentMethod').textContent = pipeData.payment;

    const ironingRow = document.getElementById('invIroningRow');
    if (pipeData.ironingActive) {
        ironingRow.classList.remove('d-none');
        document.getElementById('invIroningText').textContent = pipeData.ironingTxt;
    } else {
        ironingRow.classList.add('d-none');
    }

    const digitalPayBlock = document.getElementById('digitalPaymentDisplayBlock');
    if (pipeData.rawMethod === "Online Payment" || pipeData.rawMethod === "Card") {
        digitalPayBlock.classList.remove('d-none');
    } else {
        digitalPayBlock.classList.add('d-none');
    }

    document.getElementById('invoiceCoreFormView').classList.remove('d-none');
    document.getElementById('invoiceSuccessScreenView').classList.add('d-none');

    const modal = new bootstrap.Modal(document.getElementById('posInvoiceModal'));
    modal.show();
}

function triggerExecutionCommit() {
    if (!activeOrderSummaryCache) return;
    
    document.getElementById('invoiceCoreFormView').classList.add('d-none');
    const successView = document.getElementById('invoiceSuccessScreenView');
    successView.classList.remove('d-none');

    document.getElementById('lblSuccessAmountValue').textContent = `₱${activeOrderSummaryCache.total.toFixed(2)}`;
    document.getElementById('lblSuccessTransactionContext').textContent = `${activeOrderSummaryCache.payment} payment confirmed successfully`;

    let activeHardwareLockId = explicitlyLockedHardwareUnit;
    if (!activeHardwareLockId) {
        const alternativeFreeUnit = hardwareFleetTelemetry.find(u => u.status === "Available");
        if (alternativeFreeUnit) activeHardwareLockId = alternativeFreeUnit.id;
    }

    if (activeHardwareLockId) {
        const fleetIndex = hardwareFleetTelemetry.findIndex(u => u.id === activeHardwareLockId);
        if (fleetIndex !== -1) {
            hardwareFleetTelemetry[fleetIndex].status = "In-Use";
            hardwareFleetTelemetry[fleetIndex].totalSecondsLeft = 45 * 60; 
            hardwareFleetTelemetry[fleetIndex].customer = activeOrderSummaryCache.client;
            hardwareFleetTelemetry[fleetIndex].profileId = document.getElementById('custServiceType').value;

            transactedRevenueInvoicesHistory.push({
                client: activeOrderSummaryCache.client,
                machine: activeHardwareLockId,
                payment: activeOrderSummaryCache.payment,
                totalAmount: activeOrderSummaryCache.total
            });
        }
    }
}

function completeAndResetWorkflow() {
    bootstrap.Modal.getInstance(document.getElementById('posInvoiceModal')).hide();
    document.getElementById('bookingCalculatorForm').reset();
    document.getElementById('ironingDetailsFormBlock').classList.add('d-none');
    document.getElementById('machineLockIndicatorBox').classList.add('d-none');
    document.getElementById('onlinePaymentSubBlock').classList.add('d-none');
    explicitlyLockedHardwareUnit = null;
    activeOrderSummaryCache = null;
    
    processingCustomerInvoicePipeline();
    render8UnitHardwareStatusDeck();
    switchSPAPage("home");
}

function dismissInvoiceReceipt() {
    bootstrap.Modal.getInstance(document.getElementById('posInvoiceModal')).hide();
    explicitlyLockedHardwareUnit = null;
    activeOrderSummaryCache = null;
    document.getElementById('machineLockIndicatorBox').classList.add('d-none');
}

// ADMINISTRATIVE PORTAL CORE WORKFLOW LOGIC
function requestAdminConsoleAuthentication() {
    const accessKey = prompt("Enter Administrative Verification Access Credentials Code:", "admin123");
    if (accessKey === "admin123") {
        isAdminAuthenticatedMode = true;
        document.getElementById('nav-admin').classList.remove('d-none');
        alert("Session initialized. Administrative options are now unlocked in navigation maps.");
        switchSPAPage("admin");
    } else {
        alert("Authentication signature failed: Access key reject mismatch.");
    }
}

function exitAdminSession() {
    isAdminAuthenticatedMode = false;
    document.getElementById('nav-admin').classList.add('d-none');
    alert("Admin workspace context destroyed securely. Returning back to public homepage view.");
    switchSPAPage("home");
}

function renderAdminControlCenterWorkspaces() {
    let currentAggregateGross = 0;
    transactedRevenueInvoicesHistory.forEach(inv => currentAggregateGross += inv.totalAmount);
    
    let maintenanceFleetCount = 0;
    hardwareFleetTelemetry.forEach(u => { if (unitIsOfflineLocked(u)) maintenanceFleetCount++; });

    document.getElementById('lblAdminGrossRevenue').textContent = `₱${currentAggregateGross.toFixed(2)}`;
    document.getElementById('lblAdminTotalTransactions').textContent = `${transactedRevenueInvoicesHistory.length} Invoices`;
    document.getElementById('lblAdminMaintenanceCount').textContent = `${maintenanceFleetCount} Fleet Units`;

    const pricingDeck = document.getElementById('adminServiceRatesControlsDeck');
    pricingDeck.innerHTML = '';
    servicePricingMatrix.forEach(srv => {
        const wrapper = document.createElement('div');
        wrapper.className = "p-3 mb-2 bg-light rounded border border-light-subtle";
        wrapper.innerHTML = `
            <label class="form-label font-sans fw-bold small text-cloud-dark mb-1">${srv.name}</label>
            <div class="input-group input-group-sm">
                <span class="input-group-text bg-white fw-bold font-monospace small">₱</span>
                <input type="number" step="0.01" class="form-control font-monospace fw-bold text-info shadow-none" 
                    id="inpAdminRate-${srv.id}" value="${srv.rate.toFixed(4)}" oninput="updatePricingMatrixRateRuntime('${srv.id}', this.value)">
                <span class="input-group-text bg-white small text-muted">per KG</span>
            </div>
            <small class="text-muted d-block mt-1" style="font-size:0.75rem;">Active 3KG cost context basis: ₱${(srv.rate * 3).toFixed(2)}</small>
        `;
        pricingDeck.appendChild(wrapper);
    });

    const fleetDeck = document.getElementById('adminFleetControlsDeck');
    fleetDeck.innerHTML = '';
    hardwareFleetTelemetry.forEach(unit => {
        const block = document.createElement('div');
        block.className = "d-flex align-items-center justify-content-between p-2 mb-2 rounded border border-light-subtle small bg-light";
        
        let badgingStateDisplay = '';
        let managementActionToggleBtn = '';

        if (unit.status === "In-Use") {
            badgingStateDisplay = `<span class="badge bg-purple-cloud font-monospace">ACTIVE [${formatSecondsToDigitalClock(unit.totalSecondsLeft)}]</span>`;
            managementActionToggleBtn = `<button class="btn btn-xs btn-outline-secondary font-sans small fw-bold" disabled>Unit Busy</button>`;
        } else if (unit.status === "Under Maintenance") {
            badgingStateDisplay = `<span class="badge bg-danger text-white">MAINTENANCE</span>`;
            managementActionToggleBtn = `<button class="btn btn-xs btn-success font-sans text-white small fw-bold" onclick="toggleMachineServiceState('${unit.id}', 'Available')">Set Available</button>`;
        } else {
            badgingStateDisplay = `<span class="badge bg-success text-white">READY</span>`;
            managementActionToggleBtn = `<button class="btn btn-xs btn-warning font-sans text-dark small fw-bold" onclick="toggleMachineServiceState('${unit.id}', 'Under Maintenance')">Put Offline</button>`;
        }

        block.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <strong class="font-monospace text-cloud-dark">${unit.id}</strong>
                ${badgingStateDisplay}
            </div>
            <div>${managementActionToggleBtn}</div>
        `;
        fleetDeck.appendChild(block);
    });

    const historyTableBody = document.getElementById('adminTransactionHistoryTableBody');
    historyTableBody.innerHTML = '';
    if (transactedRevenueInvoicesHistory.length === 0) {
        historyTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No completed transaction payloads indexed.</td></tr>`;
    } else {
        for (let idx = transactedRevenueInvoicesHistory.length - 1; idx >= 0; idx--) {
            const audit = transactedRevenueInvoicesHistory[idx];
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
                <td class="fw-semibold text-cloud-dark">${audit.client}</td>
                <td class="font-monospace text-muted">${audit.machine}</td>
                <td><span class="badge bg-light text-dark border">${audit.payment}</span></td>
                <td class="text-end font-monospace fw-bold text-success">₱${audit.totalAmount.toFixed(2)}</td>
            `;
            historyTableBody.appendChild(tableRow);
        }
    }
}

function updatePricingMatrixRateRuntime(serviceId, stringNumericValue) {
    const rawVal = parseFloat(stringNumericValue) || 0;
    const itemIndex = servicePricingMatrix.findIndex(p => p.id === serviceId);
    if (itemIndex !== -1) {
        servicePricingMatrix[itemIndex].rate = rawVal;
        
        generateDynamicServicesGrid();
        populatePricingDropdownOptions();
        processingCustomerInvoicePipeline();
    }
}

function toggleMachineServiceState(unitId, absoluteTargetStateStr) {
    const assetIdx = hardwareFleetTelemetry.findIndex(u => u.id === unitId);
    if (assetIdx !== -1) {
        hardwareFleetTelemetry[assetIdx].status = absoluteTargetStateStr;
        
        renderAdminControlCenterWorkspaces();
        render8UnitHardwareStatusDeck();
    }
}

function unitIsOfflineLocked(unitObj) {
    return unitObj.status === "Under Maintenance";
}
