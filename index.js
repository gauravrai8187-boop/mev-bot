const { ethers } = require("ethers");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
    res.send("MEV Bot is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function startBot() {
    console.log("🚀 MEV Bot पब्लिक नोड से कनेक्ट हो रहा है...");
    
    // यह आरपीसी बिना किसी एपीआई की के फ्री और डायरेक्ट काम करता है
    const provider = new ethers.JsonRpcProvider("https://polygon-bor-rpc.publicnode.com", 137);
    
    try {
        const currentBlock = await provider.getBlockNumber();
        console.log("✅ ब्लॉकचेन से कनेक्शन सफल! करंट ब्लॉक:", currentBlock);
    } catch (err) {
        console.log("⚠️ कनेक्शन में दिक्कत:", err.message);
    }

    provider.on("block", (blockNumber) => {
        console.log("🔗 नया ब्लॉक स्कैन हो रहा है:", blockNumber);
    });
}

startBot();
