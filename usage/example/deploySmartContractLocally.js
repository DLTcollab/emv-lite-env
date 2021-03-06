const { EVMLC } = require('evm-lite-lib');
const { DataDirectory } = require('evm-lite-lib');

const solc = require('solc');
const fs = require('fs');

// Default from address
const from = '';

// EVMLC object
const evmlc = new EVMLC('127.0.0.1', 8080, {
  from,
  gas: 1000000,
  gasPrice: 0,
});

// Keystore object
const dataDirectory = new DataDirectory('');
const password = '';

// Contract Object
const rawContractName = '';
const contractPath = '';

// Get keystore object from the keystore directory
// For the from address so we can decrypt and sign
const accountDecrypt = async () => {
  const account = await dataDirectory.keystore.decryptAccount(evmlc.defaultFrom, password);
  return account;
};

// Generate contract object with ABI and data
const loadContract = async () => {
  const contractFile = fs.readFileSync(contractPath, 'utf8');
  const contractName = `:${rawContractName}`;
  const compiledOutput = solc.compile(contractFile, 1);
  const bytecode = compiledOutput.contracts[`:${contractName}`].bytecode;
  const ABI = JSON.parse(compiledOutput.contracts[`:${contractName}`].interface);
  const contract = await evmlc.contracts.load(ABI, {
    data: bytecode,
  });
  return contract;
};

const deployContract = async () => {
  const account = await accountDecrypt();
  const contract = await loadContract();
  const response = await contract.deploy(account);
  return response;
};

deployContract()
  .then(res => console.log(res))
  .catch(error => console.log(error));