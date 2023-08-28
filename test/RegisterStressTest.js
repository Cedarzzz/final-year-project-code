const infecDisInfo = artifacts.require("infecDisInfo");

contract("Stress Test For Register", accounts => {

    // 用户数量
    const userCounts = [10,50, 100,150, 200,250,300,350,400,450, 500];
    // const userCounts = [10];
    for(let i = 0; i < userCounts.length; i++) {
  
      it(`tests contract with ${userCounts[i]} users`, async function() {
        this.timeout(60000000);
        // 生成测试账号 
        //const testAccounts = generateTestAccounts(userCounts[i]);
        const testAccounts = accounts.slice(0, userCounts[i]);
        // 部署测试合约
        const contract = await infecDisInfo.new();
  
        // 测试gas usage
        const { avgGas, avgTime } = await testGasAndExecutionTime(contract, testAccounts);
        console.log("Average Gas Usage:", avgGas);
        console.log("Average Execution Time:", avgTime);
      });
  
    }
  
  });
  
  async function testGasAndExecutionTime(contract, accounts) {
      let totalGas = 0;
      const startTime = new Date().getTime();

      for (const account of accounts) {
          const receipt = await contract.register("TestName", 12345678, 0, "QmHashExample", { from: account });
          totalGas += receipt.receipt.gasUsed;
      }

      const endTime = new Date().getTime();

      const avgGas = totalGas / accounts.length;
      const avgTime = (endTime - startTime) / accounts.length;

      return { avgGas, avgTime };
  }
  
    // 测试gas usage
    async function testGasUsage(contract, accounts) {

    let total = 0;
    for(const account of accounts) {
      const receipt = await contract.register("TestName", 12345678, 0, "QmHashExample", {from: account});
      total += receipt.receipt.gasUsed;
    }
  
    const avgGas = total / accounts.length;
    return {avgGas};
  
  }
  
  // 测试执行时间
  async function testExecutionTime(contract, accounts) {
  
    const startTime = new Date().getTime();
    
    for(const account of accounts) {
      await contract.register("TestName", 12345678, 0, "QmHashExample", {from: account});
    }  
  
    const endTime = new Date().getTime();
    const avgTime = (endTime - startTime) / accounts.length;
  
    return {avgTime};
  
  }
// Average Gas Usage: 119447
// Average Execution Time: 1278.7
// ✔ tests contract with 10 users (23046ms)
// Average Gas Usage: 118097
// Average Execution Time: 1762.84
// ✔ tests contract with 100 users (342669ms)
// Average Gas Usage: 118022
// Average Execution Time: 1873.075
// ✔ tests contract with 200 users (727713ms)
// Average Gas Usage: 117977
// Average Execution Time: 1928.17
// ✔ tests contract with 500 users (1864563ms)

// Average Gas Usage: 141349
// Average Execution Time: 1386.3
//     √ tests contract with 10 users (14683ms)
// Average Gas Usage: 140149
// Average Execution Time: 1975.12
//     √ tests contract with 50 users (99737ms)
// Average Gas Usage: 139999
// Average Execution Time: 2072.77
//     √ tests contract with 100 users (208546ms)
// Average Gas Usage: 139949
// Average Execution Time: 2087.786666666667
//     √ tests contract with 150 users (314423ms)
// Average Gas Usage: 139924
// Average Execution Time: 2034.78
//     √ tests contract with 200 users (408044ms)
// Average Gas Usage: 139909
// Average Execution Time: 2032.188
//     √ tests contract with 250 users (509484ms)
// Average Gas Usage: 139899
// Average Execution Time: 1939.94
//     √ tests contract with 300 users (582988ms)
// Average Gas Usage: 139891.85714285713
// Average Execution Time: 2000.702857142857
//     √ tests contract with 350 users (701302ms)
// Average Gas Usage: 139886.5
// Average Execution Time: 2029.775
//     √ tests contract with 400 users (812894ms)
// Average Gas Usage: 139882.33333333334
// Average Execution Time: 1974.9666666666667
//     √ tests contract with 450 users (889682ms)
// Average Gas Usage: 139879
// Average Execution Time: 2100.298
//     √ tests contract with 500 users (1051235ms)