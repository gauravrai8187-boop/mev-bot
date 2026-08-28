const { ethers } = require("ethers");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
    res.send("MEV Earning Bot is active!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function startTradingBot() {
    console.log("🚀 रियल अर्निंग MEV बॉट शुरू हो रहा है...");
    
    const provider = new ethers.JsonRpcProvider("https://polygon-bor-rpc.publicnode.com", 137);
    
    // अगर प्राइवेट की जोड़ी है तो वॉलेट एक्टिवेट होगा
    let wallet = null;
    if (process.env.PRIVATE_KEY) {
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log("✅ वॉलेट सफलतापूर्वक कनेक्ट हुआ:", wallet.address);
    } else {
        console.log("⚠️ चेतावनी: कोई प्राइवेट की नहीं है, बॉट सिर्फ रीड मोड (Scanning) में है।");
    }

    // पॉलीगॉन पर क्विकस्वैप राउटर का एड्रेस
    const QUICK_ROUTER = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
    
    provider.on("block", async (blockNumber) => {
        console.log(`\n🔗 नया ब्लॉक आया: ${blockNumber} - अपॉर्चुनिटी खोजी जा रही है...`);
        
        try {
            // यहाँ पर आप अपने टोकन पेयर के प्राइस चेक करने का लॉजिक लिख सकते हैं
            // उदाहरण के लिए गैस प्राइस चेक करना:
            const feeData = await provider.getFeeData();
            console.log(`⛽ वर्तमान गैस प्राइस: ${ethers.formatUnits(feeData.gasPrice, "gwei")} Gwei`);
        } catch (err) {
            console.log("❌ स्कैनिंग एरर:", err.message);
        }
    });
}

startTradingBot();
