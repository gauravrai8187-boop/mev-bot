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
    console.log("🚀 MEV Bot नए RPC से कनेक्ट हो रहा है...");
    
    // 1rpc का स्टेबल और फ्री पॉलीगॉन एंडपॉइंट
    const provider = new ethers.JsonRpcProvider("https://1rpc.io/matic", 137);
    
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
