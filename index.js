const { ethers } = require("ethers");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Render के फ्री सर्वर को ज़िंदा रखने के लिए
app.get("/", (req, res) => {
    res.send("MEV Bot is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function startBot() {
    console.log("🚀 MEV Bot फ्री वेब सर्विस पर शुरू हो गया है...");
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    
    provider.on("block", (blockNumber) => {
        console.log("🔗 नया ब्लॉक स्कैन हो रहा है:", blockNumber);
    });
}

startBot();
