const { ethers } = require("ethers");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
    res.send("Direct Mainnet MEV Bot is running!");
});
app.listen(PORT);

async function startDirectBot() {
    console.log("🚀 डायरेक्ट मेननेट MEV बॉट एक्टिव हो गया है...");
    
    const provider = new ethers.JsonRpcProvider("https://polygon-bor-rpc.publicnode.com", 137);
    
    if (!process.env.PRIVATE_KEY) {
        console.log("❌ एरर: Render में PRIVATE_KEY नहीं मिली!");
        return;
    }

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("✅ कनेक्टेड वॉलेट एड्रेस:", wallet.address);

    const QUICK_ROUTER_ADDRESS = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
    const ROUTER_ABI = [
        "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)",
        "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)"
    ];
    const quickRouter = new ethers.Contract(QUICK_ROUTER_ADDRESS, ROUTER_ABI, wallet);

    const WMATIC = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

    provider.on("block", async (blockNumber) => {
        console.log(`\n🔗 नया ब्लॉक: ${blockNumber} | मेननेट स्कैन जारी है...`);
        
        try {
            const amountIn = ethers.parseEther("0.1"); // 0.1 MATIC का टेस्ट ट्रेड
            const path = [WMATIC, USDC];
            
            const amounts = await quickRouter.getAmountsOut(amountIn, path);
            console.log(`📊 बाजार भाव आउटपुट: ${ethers.formatUnits(amounts[1], 6)} USDC`);

            const feeData = await provider.getFeeData();
            const gasGwei = parseFloat(ethers.formatUnits(feeData.gasPrice, "gwei"));
            console.log(`⛽ वर्तमान गैस: ${gasGwei.toFixed(2)} Gwei`);

            // सुरक्षा जांच: जब गैस नॉर्मल हो तभी ट्रेड ट्रिगर हो
            if (gasGwei < 300) {
                console.log("⚡ गैस अनुकूल है, मेननेट पर स्वैप आर्डर भेजा जा रहा है...");
                const deadline = Math.floor(Date.now() / 1000) + 60;
                
                const tx = await quickRouter.swapExactETHForTokens(0, path, wallet.address, deadline, {
                    value: amountIn,
                    gasLimit: 300000
                });
                
                console.log("🎉 शानदार! ट्रेड सफल हो गया। Tx Hash:", tx.hash);
            } else {
                console.log("⏳ गैस बहुत हाई है, फालतू फीस से बचने के लिए ट्रेड रोका गया है।");
            }

        } catch (err) {
            console.log("⚠️ नोटिस:", err.message);
        }
    });
}

startDirectBot();
