import 'dotenv/config'; // Importing environment configuration
import {
    Contract, SorobanRpc,
    TransactionBuilder,
    Networks,
    BASE_FEE,
    nativeToScVal, Address
} from "@stellar/stellar-sdk"; // Importing necessary functions and classes from the Stellar SDK
import { userSignTransaction } from './freighter'; // Importing userSignTransaction function from the freighter module
import { getPublicKey } from '@stellar/freighter-api'; // Importing getPublicKey function from the freighter API

// RPC URL for the Soroban testnet
let rpcUrl = "https://soroban-testnet.stellar.org";

// Address of the contract
let contractAddress = 'CDLLGJEFRBEEDSCSCDASDC3NUXSQIENASKQVM3XVEMDUO4XOB43LDPZD';

// Function to convert a string to a symbol type compatible with Soroban
const stringToSymbol = (value) => {
    return nativeToScVal(value, { type: "symbol" });
};

// Function to convert an account to a Soroban-compatible value
const accountToScVal = (account) => new Address(account).toScVal();

// Transaction parameters for the Soroban network
let params = {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
};

// Function to interact with the contract
async function contractInt(caller, functName, values) {
    // Creating a new RPC provider for the Soroban network
    const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
    // Creating a new contract instance with the contract address
    const contract = new Contract(contractAddress);
    // Fetching the source account details
    const sourceAccount = await provider.getAccount(caller);

    // Building the transaction
    let buildTx;
    if (values == null) {
        buildTx = new TransactionBuilder(sourceAccount, params)
            .addOperation(contract.call(functName))
            .setTimeout(30).build();
    } else {
        buildTx = new TransactionBuilder(sourceAccount, params)
            .addOperation(contract.call(functName, ...values))
            .setTimeout(30).build();
    }

    // Preparing the transaction
    let _buildTx = await provider.prepareTransaction(buildTx);
    let prepareTx = _buildTx.toXDR();

    // Signing the transaction
    let signedTx;
    try {
        signedTx = await userSignTransaction(prepareTx, "TESTNET", caller);
    } catch (err) {
        console.error("Error signing transaction:", err);
        throw err;
    }

    // Converting the signed XDR back to a Transaction object
    let tx;
    try {
        tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);
    } catch (err) {
        console.error("Error converting signed XDR to Transaction:", err);
        throw err;
    }

    // Sending the transaction
    try {
        let sendTx = await provider.sendTransaction(tx).catch(function (err) {
            return err;
        });
        if (sendTx.errorResult) {
            throw new Error("Unable to submit transaction");
        }
        if (sendTx.status === "PENDING") {
            let txResponse = await provider.getTransaction(sendTx.hash);
            while (txResponse.status === "NOT_FOUND") {
                txResponse = await provider.getTransaction(sendTx.hash);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            if (txResponse.status === "SUCCESS") {
                let result = txResponse.returnValue;
                return result;
            }
        }
    } catch (err) {
        console.error("Error sending transaction:", err);
        return err;
    }
}

// Function to fetch poll data
async function fetchPoll() {
    let caller = await getPublicKey(); // Getting the public key of the caller
    let result = await contractInt(caller, 'view_poll', null); // Fetching poll data from the contract
    let no = (result._value[1]._attributes.val._value).toString(); // Extracting 'no' votes
    let total = (result._value[3]._attributes.val._value).toString(); // Extracting total votes
    let yes = (result._value[4]._attributes.val._value).toString(); // Extracting 'yes' votes
    return [no, total, yes]; // Returning the poll data
}

// Function to fetch voter information
async function fetchVoter() {
    let caller = await getPublicKey(); // Getting the public key of the caller
    let voter = accountToScVal(caller); // Converting the caller's account to a Soroban-compatible value
    let result = await contractInt(caller, 'view_voter', [voter]); // Fetching voter data from the contract
    let selected = (result._value[0]._attributes.val._value).toString(); // Extracting selected vote
    let time = (result._value[1]._attributes.val._value).toString(); // Extracting voting time
    let votes = (result._value[2]._attributes.val._value).toString(); // Extracting number of votes
    return [selected, time, votes]; // Returning the voter data
}

// Function to cast a vote
async function vote(value) {
    let caller = await getPublicKey(); // Getting the public key of the caller
    let selected = stringToSymbol(value); // Converting the vote value to a Soroban-compatible symbol
    let voter = accountToScVal(caller); // Converting the caller's account to a Soroban-compatible value
    let values = [voter, selected]; // Creating the values array for the contract call
    let result = await contractInt(caller, 'record_votes', values); // Recording the vote on the contract
    return result; // Returning the result of the contract call
}

export { fetchPoll, fetchVoter, vote }; // Exporting the functions for use in other modules
