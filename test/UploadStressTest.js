const infecDisInfo = artifacts.require("infecDisInfo");

contract("Stress Test For Record Upload", accounts => {
  
    const userCounts = [10,50, 100,150, 200,250,300,350,400,450, 500];
    // const userCounts = [10];
    const iterations = 5;
    userCounts.forEach(userCount => {
        it(`tests contract with ${userCount} users`, async function() {
            
            this.timeout(60000000);
            const halfCount = userCount / 2;
            const testAccountsPatients = accounts.slice(0, halfCount);
            const testAccountsDoctors = accounts.slice(halfCount, userCount);
            
            const contract = await infecDisInfo.new();

            await registerUsers(contract, testAccountsPatients, testAccountsDoctors);
            await grantAccess(contract, testAccountsPatients, testAccountsDoctors);

            const results = await averageTestGasAndTime(contract, testAccountsPatients, testAccountsDoctors, iterations);
            console.log("Average Gas Usage for", userCount, "users:", results.avgGas);
            console.log("Average Execution Time for", userCount, "users:", results.avgTime);
        });
    });

});

async function registerUsers(contract, testAccountsPatients, testAccountsDoctors) {
    const registerPromises = [];
    for(let j = 0; j < testAccountsPatients.length; j++){
        registerPromises.push(contract.register("TestPatient" + j, 12345678, 0, "QmHashExample", {from: testAccountsPatients[j]}));
        registerPromises.push(contract.register("TestDoctor" + j, 12345678, 1, "QmHashExample", {from: testAccountsDoctors[j]}));
    }
    await Promise.all(registerPromises);
}

async function grantAccess(contract, testAccountsPatients, testAccountsDoctors) {
    const grantPromises = [];
    for(let j = 0; j < testAccountsPatients.length; j++){
        grantPromises.push(contract.accessPermitGrant(testAccountsDoctors[j], {from: testAccountsPatients[j]}));
    }
    await Promise.all(grantPromises);
}

async function testGasAndTime(contract, testAccountsPatients, testAccountsDoctors) {
    const idx = 0;
    const startTime = new Date().getTime();
    const receipt = await contract.recordUpload(testAccountsPatients[idx], "NewHash", {from: testAccountsDoctors[idx]});
    const endTime = new Date().getTime();

    const timeTaken = endTime - startTime;
    const gasUsed = receipt.receipt.gasUsed;

    return {gasUsed, timeTaken};
}

async function averageTestGasAndTime(contract, testAccountsPatients, testAccountsDoctors, iterations) {
    let totalGas = 0;
    let totalTime = 0;

    for (let i = 0; i < iterations; i++) {
        const result = await testGasAndTime(contract, testAccountsPatients, testAccountsDoctors);
        totalGas += result.gasUsed;
        totalTime += result.timeTaken;
    }

    const avgGas = totalGas / iterations;
    const avgTime = totalTime / iterations;

    return {avgGas, avgTime};
}
// Gas Usage for 10 users: 36453
// Execution Time for 10 users: 4131
//     √ tests contract with 10 users (49138ms)
// Gas Usage for 100 users: 36453
// Execution Time for 100 users: 3929
//     √ tests contract with 100 users (510024ms)
// Gas Usage for 200 users: 36453
// Execution Time for 200 users: 4376
//     √ tests contract with 200 users (1030944ms)
// Gas Usage for 500 users: 36453
// Execution Time for 500 users: 4376