const infecDisInfo = artifacts.require("infecDisInfo");

contract("GetInfoStressTest", accounts => {
  // User counts to test 
  // const userCounts = [10, 100, 200, 500];
  const userCounts = [10,50, 100,150, 200,250,300,350,400,450, 500];
  beforeEach(async () => {
    contract = await infecDisInfo.new();
  });
  for(let i = 0; i < userCounts.length; i++) {

    it(`tests getPatientInfo with ${userCounts[i]} users`, async function() {
      this.timeout(60000000);
      
      // Generate test accounts
      const testAccounts = accounts.slice(0, userCounts[i]);
      // Register test accounts
      for(let j = 0; j < testAccounts.length; j++) {
        await contract.register("TestUser", 12345, 0, "QmHash", {from: testAccounts[j]});
      }
      // Test execution time
      const timeData = await testExecutionTime(contract, testAccounts);
      console.log("Average Execution Time:", timeData.avgTime);
    });
  }
});

// Test gas usage
async function testGasUsage(contract, accounts) {
  let total = 0;
  for(let i = 0; i < accounts.length; i++) {
    const receipt = await contract.getPatientInfo(accounts[i], {from: accounts[0]});
    total += receipt.receipt.gasUsed;
  }
  const avgGas = total / accounts.length;
  return {avgGas};
}

// Test execution time
async function testExecutionTime(contract, accounts) {
  const startTime = new Date().getTime();

  for(let i = 0; i < accounts.length; i++) {
    await contract.getPatientInfo(accounts[i], {from: accounts[0]});
  }

  const endTime = new Date().getTime();
  const avgTime = (endTime - startTime) / accounts.length;
  return {avgTime};
}
// Contract: GetInfoStressTest
// Average Execution Time: 142.7
//     √ tests getPatientInfo with 10 users (13294ms)
// Average Execution Time: 152.04
//     √ tests getPatientInfo with 50 users (94076ms)
// Average Execution Time: 193.79
//     √ tests getPatientInfo with 100 users (214122ms)
// Average Execution Time: 171.56666666666666
//     √ tests getPatientInfo with 150 users (311112ms)
// Average Execution Time: 176.545
//     √ tests getPatientInfo with 200 users (430337ms)
// Average Execution Time: 190.376
//     √ tests getPatientInfo with 250 users (549242ms)
// Average Execution Time: 173.43666666666667
//     √ tests getPatientInfo with 300 users (654404ms)
// Average Execution Time: 178.46
//     √ tests getPatientInfo with 350 users (768954ms)
// Average Execution Time: 179.655
//     √ tests getPatientInfo with 400 users (888368ms)
// Average Execution Time: 175.9622222222222
//     √ tests getPatientInfo with 450 users (1012008ms)
// Average Execution Time: 181.18
//     √ tests getPatientInfo with 500 users (1128657ms)