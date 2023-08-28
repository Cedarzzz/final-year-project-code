var infecDisInfoAddress = '0x36F26a9170bF244ee553926fC4616121668DfE1e';
var infecDisInfoContract;
async function web3Connect() {
    try {
        // Check for MetaMask or other modern web3 providers
        if (typeof window.ethereum !== 'undefined') {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Listen for the 'disconnect' event to handle wallet disconnection
            window.ethereum.on('disconnect', (error) => {
                console.log("Wallet disconnected:", error);
                // Perform actions to handle disconnection, if needed
            });
        } else {
            // Fallback to localhost provider if no web3 provider is found
            web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
        }
        var web3;
        
        // Load the ABI from infecDisInfo.json using fetch
        const responseAbi = await fetch('./build/contracts/infecDisInfo.json');
        const dataAbi = await responseAbi.json();
        
        var abi = dataAbi.abi;
        //console.log(abi);

        //AgentContract = new web3.eth.Contract(abi, infecDisInfoAddress);
        infecDisInfoContract = new web3.eth.Contract(abi, infecDisInfoAddress);

        const result = await infecDisInfoContract.methods.contractTestGetNumber().call();
        //console.log("test1:" + result);
        
        web3.eth.defaultAccount = web3.currentProvider.selectedAddress;
        console.log("phase1: account:" + web3.eth.defaultAccount);
        return web3.currentProvider.selectedAddress;
    } catch (error) {
        console.error("Failed to connect web3:", error);
        return null;
    }
}

// Function to load the contract after the page is loaded
window.addEventListener('load', async () => {
    try {
        // Connect to web3
        const defaultAccount = await web3Connect();

        if (defaultAccount !== null) {
            //console.log("phase2: Web3 Connected:" + defaultAccount);
            const contractInstance = infecDisInfoContract;
            // Instantiate the contract instance
            //const contractInstance = await infecDisInfoContract.deployed();
            //console.log("Contract Instance:", infecDisInfoContract);
            //console.log("Contract Functions:", infecDisInfoContract.methods);
            // You can add your additional logic here after the connection is successful.
        } else {
            console.log("Failed to connect to web3.");
        }
    } catch (error) {
        console.error("errorCode:", error);
    }
});