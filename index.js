const { ethers } = require("ethers");

async function startBot() {
    console.log("🚀 MEV Bot Background Worker शुरू हो गया है...");
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    
    provider.on("block", (blockNumber) => {
        console.log("🔗 नया ब्लॉक स्कैन हो रहा है:", blockNumber);
    });
}

startBot();
