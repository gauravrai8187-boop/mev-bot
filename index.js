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
    console.log("🚀 MEV Bot ब्लॉकचेन से कनेक्ट हो रहा है...");
    
    // ज़्यादा स्टेबल और तेज़ फ्री RPC लिंक
    const provider = new ethers.JsonRpcProvider("https://polygon.llamarpc.com");
    
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
