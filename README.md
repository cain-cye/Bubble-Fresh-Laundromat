# 🧼 Bubble Fresh | Premium Professional Laundry Hub

An interactive, responsive Single Page Application (SPA) designed to manage commercial laundromat workflows. Users can view live machinery fleet telemetry, dynamically calculate custom service pricing based on laundry weight parameters, and process transaction invoices seamlessly.

---

## 🔗 Live Links & Deliverables
* **Live Website URL:** [Insert Your GitHub Pages URL Here]

---

## 📌 Chosen Project Scenario & Justification
**Scenario:** Service-Based Professional Laundry Center

### Business Case:
Service laundromats encounter a persistent operational bottleneck: customer uncertainty regarding transparent weight calculations and live machine availability. 

**Bubble Fresh solves this by:**
1. Providing an open, web-accessible telemetry hub showing real-time hardware status counters.
2. Integrating a dynamic calculation matrix engine that maps service items directly to a programmatic cost structure.
3. Enabling clients to pre-allocate active hardware units from their device before dropping off materials to minimize wait times.

---

## ✨ System Features
* **Dynamic SPA Architecture:** Uses declarative container toggles (`.d-none`) for fast, clean section switching without redundant page reloads.
* **8-Unit Telemetry Fleet Monitor:** Tracks live countdown tracking buffers per unit using asynchronous loop intervals.
* **Calibrated Interactive Calculator:** Automatically computes line-item variables based on a 3KG operational weight base.
* **Conditional Add-On Elements:** Uses input mutation listeners to slide custom fields into view only when selected (e.g., Flat Ironing Add-on).
* **Multi-Route Checkout Gateway:** Renders dynamic modal overlays containing automatic transaction invoices and custom e-wallet QR placeholders.

---

## 🛠️ Built With
* **Structure & Layout:** Semantic HTML5 & Bootstrap 5.3.2 CDN
* **Aesthetics & Motion:** Custom CSS3 Theme Variables & Micro-Animations
* **Logic Framework:** Vanilla JavaScript (ES6 State Management)

---

## 🔬 Core JavaScript Function Spotlight (DOM Manipulation)

The backbone of this system's real-time interface updates relies on the function `render8UnitHardwareStatusDeck()`.

```javascript
function render8UnitHardwareStatusDeck() {
    const container = document.getElementById('machineryStatusGrid');
    if (!container) return;
    container.innerHTML = ''; // Flushes stale data nodes before loops

    hardwareFleetTelemetry.forEach(unit => {
        const itemRow = document.createElement('div');
        itemRow.className = "d-flex align-items-center justify-content-between p-3 mb-2 bg-white rounded border...";
        
        // Logical assertions determining dynamic HTML content allocations...
        if (unit.status === "In-Use") { /* Running loaders */ } 
        else if (unit.status === "Under Maintenance") { /* Locked elements */ } 
        else { /* Available components */ }

        itemRow.innerHTML = `...`; 
        container.appendChild(itemRow); // Injects node into live window viewport
    });
}
