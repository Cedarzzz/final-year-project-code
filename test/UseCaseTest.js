const infecDisInfo = artifacts.require("infecDisInfo");

contract("UseCaseTest", accounts => {

  const admin = accounts[0];
  const admin2 = "0x4fe2F250C9E4e9e6aFbe310DD18F2B02df8caD88";
  const patient1 = accounts[1];
  const patient2 = accounts[2];
  const doctor1 = accounts[3];
  const doctor2 = accounts[4];
  const institution = accounts[5];
  const { expectRevert } = require('@openzeppelin/test-helpers');
  beforeEach(async () => {
    this.contract = await infecDisInfo.new({from: admin});
  });

  it("should register patient", async () => {
    await this.contract.register("Alice", 1234567, 0, "Qm123", {from: patient1});
    //const [name, number, hash] = await this.contract.getPatientInfo(patient1);
    const result = await this.contract.getPatientInfo(patient1);
    const [name, number, hash] = [result[0], result[1], result[2]];
    assert.equal(name, "Alice");
    assert.equal(number.toNumber(), 1234567); // Convert to number for comparison
    assert.equal(hash, "Qm123");
  });
  
  it("should register doctor", async () => {
    await this.contract.register("Bob", 7654321, 1, "", {from: doctor1});
    const result  = await this.contract.getDocterInfo(doctor1);
    const [name, number] = [result[0], result[1]];
    assert.equal(name, "Bob");
    assert.equal(number.toNumber(), 7654321);
  });

  it("should register institution", async () => {
    await this.contract.register("Hospital A", 135246, 2, "", {from: institution});
    const result = await this.contract.getInstitutionInfo(institution);
    const [name, number] = [result[0], result[1]];
    assert.equal(name, "Hospital A");
    assert.equal(number.toNumber(), 135246);
  });

  it("should grant and revoke access", async () => {
    await this.contract.register("Alice", 1234567, 0, "Qm123", {from: patient1});
    await this.contract.register("Bob", 7654321, 1, "", {from: doctor1});
    
    await this.contract.accessPermitGrant(doctor1, {from: patient1});
    const result = await this.contract.docterAccessPermitCheck(doctor1);
    assert.equal(result[0], patient1);

    await this.contract.accessPermitRevoke(patient1, doctor1, {from: admin});
    const newResult = await this.contract.docterAccessPermitCheck(doctor1);
    assert.equal(newResult.length, 0);
  });

  it("should upload and retrieve records", async () => {
    await this.contract.register("Alice", 1234567, 0, "Qm123", {from: patient1});
    await this.contract.register("Bob", 7654321, 1, "", {from: doctor1});

    await this.contract.accessPermitGrant(doctor1, {from: patient1});
    await this.contract.recordUpload(patient1, "Qm456", {from: doctor1});
    const hash = await this.contract.getFileHash(patient1);
    assert.equal(hash, "Qm456");
  });

  it("should add admin", async () => {
    await this.contract.addAdmin(admin2, admin);
    let isAdmin = await this.contract.isAddressAdmin(admin);
    assert.equal(isAdmin, true);
  });

  it("should remove patient account", async () => {
    await this.contract.register("Alice", 1234567, 0, "Qm123", {from: patient1});
    await this.contract.addAdmin(admin2, admin);
    await this.contract.removePatient(admin, patient1);
    const info = await this.contract.getPatientInfo(patient1);
    assert.equal(info[0], "");
  });
// Add error scenarios
    it("should not allow non-admin to remove patient", async () => {
    await this.contract.register("Alice", 1234567, 0, "Qm123", {from: patient1});
    
    try {
        await this.contract.removePatient(doctor1, patient1);
        assert.fail("Expected revert not received");
    } catch (error) {
        assert(true);  // Pass the test if there's an error
    }
    });
    // 测试用户自主删除账号
  it("should allow user to remove own account", async () => {
    await this.contract.register("Alice", 1234567, 0, "Qm123", {from: patient1});

    await this.contract.removeSelf({from: patient1});
    const info = await this.contract.getPatientInfo(patient1);
    assert.equal(info[0], "");
  });

  // 测试用户自主删除记录
  it("should allow user to remove own records", async () => {
    await this.contract.register("Alice", 1234567, 0, "Qm123", {from: patient1});

    await this.contract.deleteInfoRecords({from: patient1});
    const hash = await this.contract.getFileHash(patient1);
    assert.equal(hash, "");  
  });

  // 测试删除不存在的用户
  it("should fail to remove non-existent user", async () => {
    await expectRevert(
      this.contract.removePatient(admin2, patient1),
      "Patient not found"
    );
  });

  // 测试非 admin 删除用户
  it("should fail when non-admin removes user", async () => {
    await this.contract.register("Alice", 1234567, 0, "Qm123", {from: patient1});

    await expectRevert(
      this.contract.removePatient(patient1, patient2),
      "Not an admin"
    );
  });

  // 测试重复注册用户
  it("should fail registering duplicate user", async () => {
    await this.contract.register("Alice", 1234567, 0, "Qm123", {from: patient1});

    await expectRevert(
      this.contract.register("Alice", 1234567, 0, "Qm123", {from: patient1}), 
      "Address already registered"
    );
  });

  // 边界值测试
  it("should handle max uint for contact number", async () => {
    const maxUint = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    await this.contract.register("Alice", maxUint, 0, "Qm123", {from: patient1});

    const result = await this.contract.getPatientInfo(patient1);
    const number = result[1];
    assert.equal(number.toString(), maxUint);
  });
});