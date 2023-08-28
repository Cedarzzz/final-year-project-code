const infecDisInfo = artifacts.require("infecDisInfo");

contract("Stress Test For Record Upload", accounts => {
  // let contract;
  const userCount = [50, 150, 200, 300, 350, 400, 450, 500];
  userCount.forEach(userCount => {
    it(`tests contract with ${userCount} users`, async function() {
      this.timeout(60000000);
      const contract = await infecDisInfo.new();
      const testAccountsPatients = accounts.slice(0, userCount);
      const testAccountsDoctors = [accounts[userCount]];
      await registerUsers(contract, testAccountsPatients, testAccountsDoctors);
      await grantAccess(contract, testAccountsPatients, testAccountsDoctors);
      const gasData = await testGasUsage(contract, accounts,userCount);
      console.log("Average Gas Usage:", gasData.avgGas);
      const timeData = await testExecutionTime(contract, accounts,userCount);
      console.log("Average Execution Time:", timeData.avgTime);
  });
});

async function registerUsers(contract, testAccountsPatients, testAccountsDoctors) {
    for(let j = 0; j < testAccountsPatients.length; j++){
      await contract.register("TestPatient" + j, 12345678, 0, "QmHashExample", { from: testAccountsPatients[j] });
    }
    await contract.register("TestDoctor", 12345678, 1, "QmHashExample", { from: testAccountsDoctors[0] });
  }
async function grantAccess(contract, testAccountsPatients, testAccountsDoctors) {
    const sampledAccounts = testAccountsPatients.slice(0, 10); 
    for(let j = 0; j < testAccountsPatients.length; j++){
        await contract.accessPermitGrant(testAccountsDoctors[0], {from: testAccountsPatients[j]});
    }
}
async function testGasUsage(contract, accounts, userCount) {
  let total = 0;
  const sampledAccounts = accounts.slice(0, 10);
  for(let i = 0; i < sampledAccounts.length; i++) {
    const receipt = await contract.setFileHash(sampledAccounts[i], "NewHash", {from: accounts[userCount]});
    total += receipt.receipt.gasUsed;
  }
  const avgGas = total / sampledAccounts.length;
  return {avgGas};
}

async function testExecutionTime(contract, accounts, userCount) {
  const startTime = new Date().getTime();
  const sampledAccounts = accounts.slice(0, 10); 
  for(let i = 0; i < sampledAccounts.length; i++) {
    await contract.setFileHash(sampledAccounts[i], "NewHash", {from: accounts[userCount]});
  }
  const endTime = new Date().getTime();
  const avgTime = (endTime - startTime) / sampledAccounts.length;
  return {avgTime};
}
});
// Average Gas Usage: 30058.8
// Average Execution Time: 4649.1
//     √ tests contract with 50 users (272744ms)
// Average Gas Usage: 30058.8
// Average Execution Time: 4865.7
//     √ tests contract with 100 users (474597ms)
// Average Gas Usage: 30058.8
// Average Execution Time: 4600.1
//     √ tests contract with 150 users (676815ms)
// Average Gas Usage: 30058.8
// Average Execution Time: 4655.2
//     √ tests contract with 200 users (861874ms)
// Average Gas Usage: 30058.8
// Average Execution Time: 4774.6
//     √ tests contract with 250 users (1065367ms)
// Average Gas Usage: 30058.8
// Average Execution Time: 4673.3
//     √ tests contract with 300 users (1252313ms)
// Average Gas Usage: 30058.8
// Average Execution Time: 4739.8
//     √ tests contract with 350 users (1464611ms)
// Average Gas Usage: 30058.8
// Average Execution Time: 4711.4
//     √ tests contract with 400 users (1464611ms)
// Average Gas Usage: 30058.8
// Average Execution Time: 4693.5
//     √ tests contract with 450 users (1464611ms)
// Average Gas Usage: 30058.8
// Average Execution Time: 4755.1
//     √ tests contract with 500 users (1464611ms)

