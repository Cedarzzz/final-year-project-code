# final-year-project-code
description
- Dapp: This directory contains the front-end code for the decentralized application (Dapp) and some of the libraries used. It also contains the contract JSON files generated by Truffle when compiling smart contracts, due to the special settings of truffle-config.js.
- contracts: This directory contains all the Solidity Smart Contracts.sol files in the project.
- migrations: The files here are used to deploy smart contracts to the Ethereum network. These scripts ensure that contracts are deployed in the correct order and configuration.
- test: In this directory contains our test script code for testing your smart contract, the truffle test code used in Chapter 6.
- 1_deploy_contracts.js: This is a migration script that instructs Truffle how to deploy contracts. The number in front of the filename indicates the order of deployment.
- bs-config.json: Related to the configuration of the Lite-server for the development and testing of the Dapp's front-end code.
- package-lock.json & package.json: Related to npm package management. package.json lists the project's dependencies and other configuration information, while package-lock.json ensures version consistency of dependencies.
- truffle-config.js: This is Truffle's configuration file, which contains information on how to connect to our test Ethereum networks.

# To run the code, first install the following dependencies
Truffle
-solc: "0.5.16"
Node
Metamask as Browser extension.
Ganache-cli or Ganache-GUI for deployement of Contracts.

# Set Up
1.Please install the relevant dependency libraries according to the JSON file in the code.
2.Open a test ethereum blockchain with ganache, port use 7545.
3.Use the browser plugin metamask to connect to your account in the blockchain.
4.Deploy the smart contract to the blockchain using truffle migrate and paste the new contract address into the first line of app.js.
5.Start the littler server, you can access the Dapp page now, and you can use the test button to check whether the blockchain and Dapp are connected or not.
