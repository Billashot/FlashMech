// FLASHMECH EMERGENCY SOS SYSTEM

let currentStep = 1;

// SHOW THE CORRECT STEP
function showStep(step) {

    document.querySelectorAll(".form-step").forEach(section => {
        section.classList.remove("active");
    });

    document.querySelectorAll(".progress-step").forEach(progress => {
        progress.classList.remove("active");
    });

    document.getElementById("step" + step).classList.add("active");
    document.getElementById("progress" + step).classList.add("active");

    currentStep = step;
}

// STEP 1 → STEP 2
document.getElementById("next1").addEventListener("click", function () {

    const vehicle = document.getElementById("vehicleType");
    const problem = document.getElementById("problemType");

    if (!vehicle.checkValidity()) {
        vehicle.reportValidity();
        return;
    }

    if (!problem.checkValidity()) {
        problem.reportValidity();
        return;
    }

    showStep(2);
});

// STEP 2 → STEP 3
document.getElementById("next2").addEventListener("click", function () {

    const name = document.getElementById("userName");
    const phone = document.getElementById("userPhone");
    const location = document.getElementById("userLocation");

    for (const field of [name, phone, location]) {
        if (!field.checkValidity()) {
            field.reportValidity();
            return;
        }
    }

    // Display request summary safely
    const summary = document.getElementById("requestSummary");
    summary.replaceChildren();

    const details = [
        ["Vehicle", document.getElementById("vehicleType").value],
        ["Problem", document.getElementById("problemType").value],
        ["Name", name.value],
        ["Phone", phone.value],
        ["Location", location.value]
    ];

    details.forEach(([label, value]) => {
        const row = document.createElement("p");
        const bold = document.createElement("strong");

        bold.textContent = label + ": ";
        row.append(bold, document.createTextNode(value));
        summary.appendChild(row);
    });

    showStep(3);
});

// BACK BUTTONS
document.getElementById("back2").addEventListener("click", function () {
    showStep(1);
});

document.getElementById("back3").addEventListener("click", function () {
    showStep(2);
});

// GPS LOCATION DETECTION
document.getElementById("detectLocation").addEventListener("click", function () {

    const status = document.getElementById("locationStatus");

    if (!navigator.geolocation) {
        status.textContent = "GPS location is not supported by this browser.";
        return;
    }

    status.textContent = "Detecting your location...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            document.getElementById("userLocation").value =
                latitude.toFixed(6) + ", " + longitude.toFixed(6);

            status.textContent = "Location detected successfully!";
        },

        function (error) {
            status.textContent =
                "Unable to detect location. Please enter it manually.";
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
});

// SUBMIT REQUEST (DEMO ONLY)
document.getElementById("sosForm").addEventListener("submit", function (event) {

    event.preventDefault();

    // Validate all fields before accepting the demo request
    const fields = [
        "vehicleType",
        "problemType",
        "userName",
        "userPhone",
        "userLocation"
    ];

    for (const id of fields) {
        const field = document.getElementById(id);

        if (!field.checkValidity()) {
            showStep(id === "vehicleType" || id === "problemType" ? 1 : 2);
            field.reportValidity();
            return;
        }
    }

    const requestId = "FM-" + Date.now().toString().slice(-8);

    document.getElementById("sosForm").style.display = "none";
    document.querySelector(".progress-container").style.display = "none";

    const success = document.getElementById("successMessage");

    success.hidden = false;

    const heading = document.createElement("h2");
    heading.textContent = "✅ Demo Request Created!";

    const idText = document.createElement("p");
    idText.textContent = "Request ID: " + requestId;

    const note = document.createElement("p");
    note.textContent =
        "This is a demonstration only. No mechanic has been dispatched.";

    success.replaceChildren(heading, idText, note);
});