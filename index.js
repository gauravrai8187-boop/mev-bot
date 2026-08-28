const { ethers } = require("ethers");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
    res.send("MEV Arbitrage Bot is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function startTradingBot() {
    console.log("🚀 एडवांस्ड MEV आर्बिट्रेज बॉट शुरू हो गया है...");
    
    const provider = new ethers.JsonRpcProvider("https://polygon-bor-rpc.publicnode.com", 137);
    
    // वॉलेट सेटअप (अगर प्राइवेट की डाली होगी तो यह एक्टिव हो जाएगा)
    let wallet = null;
    if (process.env.PRIVATE_KEY) {
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log("✅ वॉलेट कनेक्टेड:", wallet.address);
    } else {
        console.log("👀 मोड: मार्केट स्कैनिंग और अपॉर्चुनिटी हंटिंग चालू है...");
    }

    // QuickSwap V2 Router एड्रेस और ABI (प्राइस चेक करने के लिए)
    const QUICK_ROUTER_ADDRESS = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
    const ROUTER_ABI = [
        "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)"
    ];
    const quickRouter = new ethers.Contract(QUICK_ROUTER_ADDRESS, ROUTER_ABI, provider);

    // टोकन एड्रेस (Polygon पर WMATIC और USDC)
    const WMATIC = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

    provider.on("block", async (blockNumber) => {
        console.log(`\n🔗 नया ब्लॉक: ${blockNumber} | प्राइस स्कैन हो रहा है...`);
        
        try {
            // चेक करते हैं कि 1 WMATIC के बदले कितने USDC मिल रहे हैं
            const amountIn = ethers.parseEther("1.0"); // 1 MATIC
            const amounts = await quickRouter.getAmountsOut(amountIn, [WMATIC, USDC]);
            const priceInUSDC = ethers.formatUnits(amounts[1], 6);
            
            console.log(`📊 QuickSwap पर 1 MATIC का भाव: $${priceInUSDC} USDC`);
            
            // गैस फीस चेक करना ताकि लॉस न हो
            const feeData = await provider.getFeeData();
            console.log(`⛽ गैस प्राइस: ${ethers.formatUnits(feeData.gasPrice, "gwei")} Gwei`);

        } catch (err) {
            console.log("⚠️ स्कैनिंग नोट:", err.message);
        }
    });
}

startTradingBot();
