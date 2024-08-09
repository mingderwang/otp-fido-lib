import Transport from '@ledgerhq/hw-transport-node-hid';
import Eth from '@ledgerhq/hw-app-eth';
import { createPublicClient, http, parseEther, encodeTransaction, hexlify, concat, keccak256 } from 'viem';
import { mainnet } from 'viem/chains';
import { serializeTransaction, parseTransaction } from 'ethers/lib/utils';

const infuraProjectId = process.env.INFURA_API_KEY // Replace with your Infura project ID or other Ethereum provider URL

async function connectToLedger() {
  const transport = await Transport.create();
  const eth = new Eth(transport);
  const { address } = await eth.getAddress("44'/60'/0'/0/0");
  console.log(address)
  return { eth, address };
}

// Example usage to get balance using Ledger
async function getBalance() {
  try {
    const { address } = await connectToLedger();
    console.log(`address is ${address}`);

    // Create a client connected to the Ethereum mainnet
    const client = createPublicClient({
      chain: mainnet,
      transport: http(`https://mainnet.infura.io/v3/${infuraProjectId}`)
    });

    const balance = await client.getBalance({ address });
    console.log('Balance:', balance.toString());
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example usage to send transaction using Ledger
async function sendTransactionWithLedger() {
  try {
    const { eth, address } = await connectToLedger();

    // Create a client connected to the Ethereum mainnet
    const client = createPublicClient({
      chain: mainnet,
      transport: http(`https://mainnet.infura.io/v3/${infuraProjectId}`)
    });

    const nonce = await client.getTransactionCount({ address });
    const gasPrice = await client.getGasPrice();

    const tx = {
      to: '0xRecipientAddress', // Replace with the recipient address
      value: parseEther('0.1'), // Value in wei (0.1 ether in this case)
      gasLimit: 21000,
      gasPrice,
      nonce,
      chainId: 1, // Mainnet
    };

    // Serialize the transaction
    const unsignedTx = serializeTransaction(tx);

    // Get the transaction's raw data
    const { v, r, s } = await eth.signTransaction("44'/60'/0'/0/0", unsignedTx);
    const signedTx = serializeTransaction(tx, { v, r, s });

    // Send the signed transaction
    const txHash = await client.sendRawTransaction({ serializedTransaction: signedTx });
    console.log('Transaction sent:', txHash);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment the function you want to execute
console.log('starting...')
await getBalance();
// sendTransactionWithLedger();

const getAddress = async () => {
  console.log('Testing Ledger Hardware...');
  console.log('supported:', await Transport.isSupported());
  console.log('Devices:');
  console.log(await Transport.list());
  const transport = await Transport.create();
  const eth = new AppEth(transport);

  // note: this path matches MEWs: m/44'/60'/0'
  const result = await eth.getAddress("m/44'/60'/0'/0");
  console.log(result)
  return result;
};
getAddress().then(a => console.log(a));

