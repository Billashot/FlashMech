
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname)));

// FLASH AI LOCAL DEMO ENGINE
function getDemoReply(message) {
    const q = message.toLowerCase();

    if (q.includes("not starting") || q.includes("won't start") || q.includes("start nahi")) {
        return "🚗 Your vehicle may have a weak battery, a starter issue, or a fuel-system problem. Check whether the dashboard lights turn on and whether you hear a clicking sound. Avoid repeated starting attempts. A qualified mechanic can diagnose the cause. (FLASH AI Demo Mode)";
    }

    if (q.includes("battery") || q.includes("dead battery")) {
        return "🔋 A weak or discharged battery could be the issue. Warning signs include dim lights, slow engine cranking and electrical problems. Get the battery and charging system checked by a mechanic. (FLASH AI Demo Mode)";
    }

    if (q.includes("overheat") || q.includes("temperature") || q.includes("heating")) {
        return "🌡️ Your engine may be overheating due to a cooling-system problem. Stop driving safely, switch off the engine and allow it to cool. Never open a hot radiator cap. Contact a qualified mechanic. (FLASH AI Demo Mode)";
    }

    if (q.includes("tyre") || q.includes("tire") || q.includes("puncture")) {
        return "🛞 You may have a punctured or damaged tyre. Reduce speed gradually, pull over somewhere safe and switch on hazard lights. Avoid driving on a damaged tyre. Contact roadside assistance. (FLASH AI Demo Mode)";
    }

    if (q.includes("petrol") || q.includes("fuel") || q.includes("diesel")) {
        return "⛽ Your vehicle may have run out of fuel or have a fuel-delivery issue. Check the fuel gauge and arrange roadside fuel assistance if needed. Never attempt to handle leaking fuel yourself. (FLASH AI Demo Mode)";
    }

    if (q.includes("ev") || q.includes("electric car") || q.includes("electric vehicle") || q.includes("charging")) {
        return "⚡ EV assistance: Check your vehicle's charging status and dashboard warnings. If charging fails, check the charging station and cable for visible damage. Never touch exposed electrical components. Contact a qualified EV technician. (FLASH AI Demo Mode)";
    }

    if (q.includes("brake")) {
        return "🛑 Brake problems are safety-critical. If your brakes feel unusual or a brake warning appears, stop driving safely and arrange professional inspection or towing. Do not attempt to continue your journey. (FLASH AI Demo Mode)";
    }

    if (q.includes("engine") || q.includes("noise") || q.includes("sound")) {
        return "🔧 Unusual engine noises can have several causes, including loose components or mechanical problems. Note when the noise occurs and check for dashboard warning lights. Have a qualified mechanic inspect it. (FLASH AI Demo Mode)";
    }

    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
        return "Hello! 👋 I'm FLASH AI, your FlashMech vehicle assistance demo assistant. I can help with basic questions about cars, batteries, tyres, engines, fuel and EV charging. What's happening with your vehicle? (FLASH AI Demo Mode)";
    }

    if (q.includes("help")) {
        return "Of course! 🚗 Tell me what is happening with your vehicle. Is it a starting problem, battery issue, flat tyre, engine problem, fuel issue or EV charging problem? I'll suggest some safe next steps. (FLASH AI Demo Mode)";
    }

    return "🤖 Thanks for contacting FLASH AI! I can help with common vehicle problems involving batteries, engines, tyres, brakes, fuel and electric vehicles. Please describe your vehicle problem in a little more detail. This is a local demonstration assistant, not a live AI diagnostic service.";
}

// FLASH AI CHAT ENDPOINT
app.post("/api/chat", (req, res) => {
    const { message } = req.body;

    if (
        typeof message !== "string" ||
        !message.trim() ||
        message.length > 500
    ) {
        return res.status(400).json({
            error: "Please enter a valid message."
        });
    }

    const reply = getDemoReply(message);

    res.json({
        reply,
        mode: "demo"
    });
});

// START SERVER
app.listen(PORT, "127.0.0.1", () => {
    console.log("--------------------------------");
    console.log("FLASHMECH SERVER IS RUNNING!");
    console.log(`http://localhost:${PORT}`);
    console.log("FLASH AI LOCAL DEMO MODE ACTIVE");
    console.log("--------------------------------");
});
