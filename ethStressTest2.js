src="./Dapp/app.js"
const fetch = require('node-fetch');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")); // 更改为你的Ganache RPC端口号


const testContractPerformance = async () => {
    const contractABI = [
        {
          "inputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "doctorAddr",
              "type": "address"
            }
          ],
          "name": "AccessGranted",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "doctorAddr",
              "type": "address"
            }
          ],
          "name": "AccessRevoked",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "senderAddress",
              "type": "address"
            }
          ],
          "name": "DebugInfo",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "doctorAddr",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "DoctorRegistered",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "institutionAddr",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "InstitutionRegistered",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "PatientRegistered",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "fileHash",
              "type": "string"
            }
          ],
          "name": "RecordUploaded",
          "type": "event"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "docterList",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "institutionList",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "isAdmin",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "patientList",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "string",
              "name": "_regisName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_regisContactNum",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_regisType",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_fileHash",
              "type": "string"
            }
          ],
          "name": "register",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "string",
              "name": "_regisName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_regisContactNum",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_fileHash",
              "type": "string"
            }
          ],
          "name": "addPatient",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "string",
              "name": "_regisName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_regisContactNum",
              "type": "uint256"
            }
          ],
          "name": "addDocter",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "string",
              "name": "_regisName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_regisContactNum",
              "type": "uint256"
            }
          ],
          "name": "addInstitution",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "_admin",
              "type": "address"
            }
          ],
          "name": "addAdmin",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            }
          ],
          "name": "getPatientInfo",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            }
          ],
          "name": "getPatientInfoDoc",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "docterAddr",
              "type": "address"
            }
          ],
          "name": "getDocterInfo",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "docterAddr",
              "type": "address"
            }
          ],
          "name": "accessPermitGrant",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getPatientList",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getDocterList",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_fileHash",
              "type": "string"
            }
          ],
          "name": "recordUpload",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            }
          ],
          "name": "getFileHash",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_filehash",
              "type": "string"
            }
          ],
          "name": "setFileHash",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "docterAddr",
              "type": "address"
            }
          ],
          "name": "accessPermitRevoke",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "docterAddr",
              "type": "address"
            }
          ],
          "name": "accessPermitRevokeForPatient",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            }
          ],
          "name": "patientAccessPermitCheck",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "docterAddr",
              "type": "address"
            }
          ],
          "name": "docterAccessPermitCheck",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "contractTestGetNumber",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getAllPatientsRecordsForInstitution",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            },
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getInstitutionList",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "institutionAddr",
              "type": "address"
            }
          ],
          "name": "getInstitutionInfo",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "string",
              "name": "_key",
              "type": "string"
            }
          ],
          "name": "storeKey",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "_addr",
              "type": "address"
            }
          ],
          "name": "retrieveKey",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "doctorAddr",
              "type": "address"
            }
          ],
          "name": "checkAccessPermission",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "senderAddress",
              "type": "address"
            }
          ],
          "name": "getAllAccounts",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "patients",
              "type": "address[]"
            },
            {
              "internalType": "address[]",
              "name": "doctors",
              "type": "address[]"
            },
            {
              "internalType": "address[]",
              "name": "institutions",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "senderAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "patientAddr",
              "type": "address"
            }
          ],
          "name": "removePatient",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "senderAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "doctorAddr",
              "type": "address"
            }
          ],
          "name": "removeDoctor",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "senderAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "institutionAddr",
              "type": "address"
            }
          ],
          "name": "removeInstitution",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getAdmins",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            }
          ],
          "name": "isAddressAdmin",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ];
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    const testAccount = accounts[0];  // 选择一个账户用于测试

    const results = [];

    // 示例：执行一个函数并记录Gas使用情况
    const gasUsed = await contract.methods.contractTestGetNumber().estimateGas({ from: testAccount });
    results.push({
        function: 'contractTestGetNumber',
        gasUsed: gasUsed
    });

    // 添加更多的合约函数调用进行测试...

    return results;
};
const resultsToCSV = (results) => {
    let csvContent = "function,gasUsed\n";
    results.forEach(result => {
        csvContent += `${result.function},${result.gasUsed}\n`;
    });

    // 使用Blob和a标签将CSV内容保存为文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "performance_results.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
testContractPerformance().then(results => {
    resultsToCSV(results);
});
