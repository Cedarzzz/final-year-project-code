pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;
//import "./InfoLib.sol";
contract infecDisInfo {

    event PatientRegistered(address indexed senderAddress, string name);
    event DocterRegistered(address indexed senderAddress, string name);
    event InstitutionRegistered(address indexed senderAddress, string name);
    event AccessGranted(address indexed senderAddress, address indexed destinationAddr);
    event AdminAccessRevoked(address indexed senderAddress, address indexed destinationAddr);
    event PatientRevokeAccess(address indexed senderAddress, address indexed destinationAddr);
    event RecordUploaded(address indexed senderAddress, string fileHash);
    event PatientRemoved(address indexed senderAddress, address indexed destinationAddr);
    event DocterRemoved(address indexed senderAddress, address indexed destinationAddr);
    event InstitutionRemoved(address indexed senderAddress, address indexed destinationAddr);
    event UserRemoveAccount(address indexed senderAddress);
    event UserRemoveInfoRecords(address indexed senderAddress);

    struct patientInfo{
        string name;
        uint contactNum;
        address[] docAccessList;
        string infecRecords;
    }
    struct docterInfo{
        string name;
        uint contactNum;
        address[] userAccessList;
    }
    struct institutionInfo{
        string name;
        uint contactNum;
        //address[] userAccessList;
    }

    mapping (address => string) private keys;
    mapping(address => patientInfo) patientInfoMap;
    mapping(address => docterInfo) docterInfoMap;
    address[] public patientList;
    address[] public docterList;
    mapping(address => institutionInfo) institutionInfoMap;
    address[] public institutionList;

    address[] private admins;
    mapping(address => bool) public isAdmin;
    mapping(address => bool) registeredAddresses;
    
    constructor() public {
        // // 将给定的地址添加到管理员列表中
        admins.push(0x4fe2F250C9E4e9e6aFbe310DD18F2B02df8caD88);
        isAdmin[0x4fe2F250C9E4e9e6aFbe310DD18F2B02df8caD88] = true;
    }

    function register(string memory _regisName, uint _regisContactNum, uint _regisType, string memory _fileHash) public{
        require(msg.sender != address(0), "Invalid address");
        require(!registeredAddresses[msg.sender], "Address already registered");
        
        if(_regisType == 0){
            addPatient(_regisName, _regisContactNum, _fileHash);
        }
        else if(_regisType == 1){
            addDocter(_regisName, _regisContactNum);
        }
        else if(_regisType == 2){
            addInstitution(_regisName, _regisContactNum);
        }
        else revert();
    }

    function addPatient (string memory _regisName, uint _regisContactNum, string memory _fileHash) public {
        address senderAddress = msg.sender;
        patientInfo memory patientData;
        patientData.name = _regisName;
        patientData.contactNum = _regisContactNum;
        patientData.infecRecords = _fileHash;
        patientInfoMap[senderAddress] = patientData;
        patientList.push(senderAddress);
        registeredAddresses[senderAddress] = true;
        emit PatientRegistered(senderAddress, _regisName);
    }

    function addDocter (string memory _regisName, uint _regisContactNum) public {
        address senderAddress = msg.sender;
        docterInfo memory docterData;
        docterData.name = _regisName;
        docterData.contactNum = _regisContactNum;
        docterInfoMap[senderAddress] = docterData;
        docterList.push(senderAddress);
        registeredAddresses[senderAddress] = true;
        emit DocterRegistered(senderAddress, _regisName);
    }

    function addInstitution(string memory _regisName, uint _regisContactNum) public {
        address senderAddress = msg.sender;
        institutionInfo memory institutionData;
        institutionData.name = _regisName;
        institutionData.contactNum = _regisContactNum;
        institutionInfoMap[senderAddress] = institutionData;
        institutionList.push(senderAddress);
        registeredAddresses[senderAddress] = true;
        emit InstitutionRegistered(senderAddress, _regisName);
    }

    function addAdmin(address senderAddress, address _addAdminAddress) public {
        require(isAddressAdmin(senderAddress), "Not an admin");
        // 将地址转换为小写
        //address lowerCaseAdmin = toLowerCase(_addAdminAddress);        
        // 将小写地址存入数组
        admins.push(_addAdminAddress);
        // 在映射表中存储小写地址
        isAdmin[_addAdminAddress] = true; 
        registeredAddresses[senderAddress] = true;
    }

    // 内部函数,将地址转换为小写
    function toLowerCase(address _addr) internal pure returns(address) {
        return address(uint160(uint(_addr))); 
    }

    function getPatientInfo(address patientAddr) public view returns(string memory, uint, string memory){//user get its own infomation
        require(patientAddr != address(0), "Invalid address");
        //return patientInfoMap[patientAddr];        
        return (patientInfoMap[patientAddr].name, patientInfoMap[patientAddr].contactNum, patientInfoMap[patientAddr].infecRecords);
    }

    function getPatientInfoDoc(address patientAddr) public view returns(string memory , uint, string memory){//docter get user information
        require(patientAddr != address(0), "Invalid address");
        bool permission = false;
        for (uint i = 0; i < docterInfoMap[patientAddr].userAccessList.length; i++){
            if (docterInfoMap[patientAddr].userAccessList[i] == patientAddr) permission = true;
        }
        if (permission == true){
            return (patientInfoMap[patientAddr].name, patientInfoMap[patientAddr].contactNum, patientInfoMap[patientAddr].infecRecords);
        }
        else revert();
    }

    function getDocterInfo(address docterAddr) public view returns(string memory , uint){//get docter information
        require(docterAddr != address(0), "Invalid address");
        return (docterInfoMap[docterAddr].name, docterInfoMap[docterAddr].contactNum);
    }

    function accessPermitGrant(address docterAddr) public{//grant docter access permission
        require(docterAddr != address(0), "Invalid address");
        docterInfoMap[docterAddr].userAccessList.push(msg.sender);
        patientInfoMap[msg.sender].docAccessList.push(docterAddr);
        emit AccessGranted(msg.sender, docterAddr);
    }

    function getPatientList() public view returns(address[] memory ){//检索所有患者地址的列表
    //返回对应的患者或医疗提供者地址列表
    //get all patient address
        return patientList;
    }

    function getDocterList() public view returns(address[] memory ){//检索所有医疗保健提供者地址的列表
    ////返回对应的患者或医疗提供者地址列表
    //get all docter address
        return docterList;
    }

    function recordUpload(address patientAddr, string memory _fileHash) public{//upload patient record
        require(patientAddr != address(0), "Invalid address");
        bool permission = false;
        for (uint i = 0; i < docterInfoMap[msg.sender].userAccessList.length; i++){
            if (docterInfoMap[msg.sender].userAccessList[i] == patientAddr) permission = true;
        }
        if (permission == true){
            emit RecordUploaded(patientAddr, _fileHash);
            setFileHash(patientAddr, _fileHash);
        }
        else revert();   
    }

    function getFileHash(address patientAddr) public view returns(string memory ){
    //get patient record hash
        return patientInfoMap[patientAddr].infecRecords;
        //return patientInfoMap[patientAddr].infecRecords;
    }

    function setFileHash(address patientAddr, string memory _filehash) public {
        patientInfoMap[patientAddr].infecRecords = _filehash;
        //patientInfo[patientAddr].infecRecords = _filehash;
    }

    function accessPermitRevoke(address patientAddr, address docterAddr) public{//revoke docter access permission
        require(patientAddr != address(0), "Invalid address");
        require(docterAddr != address(0), "Invalid address");
        accessPermitArrayCheck(docterInfoMap[docterAddr].userAccessList, patientAddr);
        accessPermitArrayCheck(patientInfoMap[patientAddr].docAccessList, docterAddr);
        emit AdminAccessRevoked(patientAddr, docterAddr);
    }

    function accessPermitRevokeForPatient(address docterAddr) public{
        require(msg.sender != address(0), "Invalid address");
        require(docterAddr != address(0), "Invalid address");
        accessPermitArrayCheck(docterInfoMap[docterAddr].userAccessList, msg.sender);
        accessPermitArrayCheck(patientInfoMap[msg.sender].docAccessList, docterAddr);
        emit PatientRevokeAccess(msg.sender, docterAddr);
    }

    function accessPermitArrayCheck(address[] storage accessList, address addr) internal returns(uint) {
        // 用于从地址数组中删除地址的内部实用程序函数
        // 调用内部函数来执行核心的数组操作
        bool check = false;
        uint del_index = 0;
        for (uint i = 0; i < accessList.length; i++) {
            if (accessList[i] == addr) {
                check = true;
                del_index = i;
            }
        }
        if (!check) revert();
        else {
            accessPermitRemoval(accessList, del_index);
        }
    }

    function accessPermitRemoval(address[] storage accessList, uint index) private {
        require(index < accessList.length, "Invalid index");
        if (accessList.length == 1) {
            delete accessList[index];
        } else {
            accessList[index] = accessList[accessList.length - 1];
            delete accessList[accessList.length - 1];
        }
        accessList.length--;
    }
    //检查用户的权限列表并返回地址
    
    function patientAccessPermitCheck(address patientAddr) public view returns (address[] memory )
    { //检索给定患者已授予访问权限的医疗保健提供者列表
    //从 patientInfo 映射中检索患者的医疗提供者访问列表
    //check weather got patient access permission
        address[] storage docAccessListAddr = patientInfoMap[patientAddr].docAccessList;
        return docAccessListAddr;
    }

    function docterAccessPermitCheck(address docterAddr) public view returns (address[] memory )
    { //检索给定医疗保健提供者已授予访问权限的患者列表
    //从 healthcareInfo 映射中检索医疗提供者的患者访问列表
        address[] storage userAccessListAddr = docterInfoMap[docterAddr].userAccessList;
        return userAccessListAddr;
    }

    //test function for js code
    function contractTestGetNumber() public view returns (uint256) {
        return 8;
    }

    function getAllPatientsRecordsForInstitution() public view returns (address[] memory, string[] memory) {
        //require(institutionInfoMap[msg.sender].contactNum != 0, "Only registered institutions can access this data");
        string[] memory hashes = new string[](patientList.length);
        for(uint i = 0; i < patientList.length; i++) {
            hashes[i] = patientInfoMap[patientList[i]].infecRecords;
        }
        return (patientList, hashes);
    }

    function getInstitutionList() public view returns(address[] memory) {
        return institutionList;
    }
    function getAdminsList() public view returns(address[] memory) {
        return admins;
    }
    function getInstitutionInfo(address institutionAddr) public view returns(string memory, uint) {
        require(institutionAddr != address(0), "Invalid address");
        return (institutionInfoMap[institutionAddr].name, institutionInfoMap[institutionAddr].contactNum);
    }
    
    function storeKey(address _senderAddr, string memory _key) public {
        require(_senderAddr != address(0), "Invalid address");
        keys[_senderAddr] = _key;
    }

    function retrieveKey(address _senderAddr, address _destinationAddr) public view returns (string memory) {
        require(checkAccessPermission(_senderAddr, _destinationAddr), "Access Denied");
        return keys[_destinationAddr];
    }

    function checkAccessPermission(address senderAddr, address destinationAddr) public view returns (bool) {
        require(destinationAddr != address(0), "Invalid destination address");
        require(senderAddr != address(0), "Invalid sender address");
        
        address[] memory docAccessList = patientInfoMap[destinationAddr].docAccessList;
        for (uint i = 0; i < docAccessList.length; i++) {
            if (docAccessList[i] == senderAddr) {
                return true;
            }
        }
        if (isAdmin[senderAddr]) {
            return true;
        }
        else if (senderAddr == destinationAddr) {
            return true;
        }
        return false;
    }

    modifier onlyAdmin() {
        address senderAddress = msg.sender;
        //address lowerSenderAddress = toLowerCase(senderAddress);

        require(senderAddress != address(0), "Invalid address");

        //require(isAdmin[lowerSenderAddress], "L:Not an admin");
        require(isAdmin[senderAddress], "Not an admin");
        _;
    }

    function getAllAccounts(address senderAddress) public returns (address[] memory patients, address[] memory doctors, address[] memory institutions) {
        require(isAddressAdmin(senderAddress), "Not an admin");
        return (patientList, docterList, institutionList);
    }
    
    function removePatient(address senderAddress, address patientAddr) public {
        require(isAddressAdmin(senderAddress), "Not an admin");
        require(patientInfoMap[patientAddr].contactNum != 0, "Patient not found");
        
        // Remove patient from patientList
        for(uint i = 0; i < patientList.length; i++) {
            if(patientList[i] == patientAddr) {
                if(i != patientList.length - 1) {
                    patientList[i] = patientList[patientList.length - 1];
                }
                patientList.length--;
                break;
            }
        }
        for(uint i = 0; i < docterList.length; i++) {
            address doctorAddr = docterList[i];
            // Iterate doctor's userAccessList
            for(uint j = 0; j < docterInfoMap[doctorAddr].userAccessList.length; j++) {
            if(docterInfoMap[doctorAddr].userAccessList[j] == patientAddr) {
                // Remove patientAddr from userAccessList
                accessPermitRevoke(patientAddr, doctorAddr);
            }
            }
        }
        delete patientInfoMap[patientAddr];
        emit PatientRemoved(senderAddress, patientAddr);
    }
    
    function removeDoctor(address senderAddress, address doctorAddr) public {
        require(isAddressAdmin(senderAddress), "Not an admin");
        require(docterInfoMap[doctorAddr].contactNum != 0, "Doctor not found");
        
        // Remove doctor from docterList
        for(uint i = 0; i < docterList.length; i++) {
            if(docterList[i] == doctorAddr) {
                if(i != docterList.length - 1) {
                    docterList[i] = docterList[docterList.length - 1];
                }
                docterList.length--;
                break;
            }
        }      
        delete docterInfoMap[doctorAddr];
        emit DocterRemoved(senderAddress, doctorAddr);
    }
    
    function removeInstitution(address senderAddress, address institutionAddr) public {
        require(isAddressAdmin(senderAddress), "Not an admin");
        require(institutionInfoMap[institutionAddr].contactNum != 0, "Institution not found");
        
        // Remove institution from institutionList
        for(uint i = 0; i < institutionList.length; i++) {
            if(institutionList[i] == institutionAddr) {
                if(i != institutionList.length - 1) {
                    institutionList[i] = institutionList[institutionList.length - 1];
                }
                institutionList.length--;
                break;
            }
        }        
        delete institutionInfoMap[institutionAddr];
        emit InstitutionRemoved(senderAddress, institutionAddr);
    }

    function getAdmins() public view returns(address[] memory) {
        return admins;
    }

    function isAddressAdmin(address userAddress) public view returns (bool) {
        return isAdmin[userAddress];
    }
    //user remove itself
    function removeSelf() public {
        require(patientInfoMap[msg.sender].contactNum != 0, "Patient not found");
        
        // Remove patient from patientList
        for(uint i = 0; i < patientList.length; i++) {
            if(patientList[i] == msg.sender) {
                if(i != patientList.length - 1) {
                    patientList[i] = patientList[patientList.length - 1];
                }
                patientList.length--;
                break;
            }
        }
        for(uint i = 0; i < docterList.length; i++) {
            address doctorAddr = docterList[i];
            // Iterate doctor's userAccessList
            for(uint j = 0; j < docterInfoMap[doctorAddr].userAccessList.length; j++) {
            if(docterInfoMap[doctorAddr].userAccessList[j] == msg.sender) {
                // Remove patientAddr from userAccessList
                accessPermitRevokeForPatient(doctorAddr);
            }
            }
        }
        delete patientInfoMap[msg.sender];
        emit UserRemoveAccount(msg.sender);
    }
    //user delete infoRecords
    function deleteInfoRecords() public {
        require(patientInfoMap[msg.sender].contactNum != 0, "Patient not found");
        patientInfoMap[msg.sender].infecRecords = "";
        emit UserRemoveInfoRecords(msg.sender);
    }
}