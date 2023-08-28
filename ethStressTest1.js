const infecDisInfo = artifacts.require("infecDisInfo");

module.exports = async function(callback) {
    try {
        let instance = await infecDisInfo.deployed();

        // Simulating multiple transactions
        const transactionsCount = 100; // For example

        for(let i = 0; i < transactionsCount; i++) {
            console.log(`Sending transaction ${i}...`);
            
            // Example: Registering multiple patients
            await instance.register(`Patient ${i}`, i, 0, `hash${i}`);
        }

        console.log('Stress test completed.');
    } catch (error) {
        console.error('Error occurred:', error);
    }
    
    callback();
};
