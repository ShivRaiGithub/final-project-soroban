import {
  requestAccess, // Function to request access to the user's Stellar account
  signTransaction, // Function to sign a transaction using Freighter
  setAllowed, // Function to check if the Freighter extension is allowed
} from "@stellar/freighter-api";

// Function to check if the connection to Freighter is allowed
async function checkConnection() {
  const isAllowed = await setAllowed(); // Check if Freighter is allowed
  if (isAllowed) {
    return true; // Return true if connection is allowed
  }
  return false; // Return false if connection is not allowed
}

// Function to retrieve the public key of the user's Stellar account
const retrievePublicKey = async () => {
  let publicKey = "";
  let error = "";
  try {
    publicKey = await requestAccess(); // Request access and retrieve the public key
  } catch (e) {
    error = e; // Catch any errors that occur during the request
  }
  if (error) {
    return error; // Return the error if one occurred
  }
  return publicKey; // Return the retrieved public key
};

// Function to sign a transaction using Freighter
const userSignTransaction = async (xdr, network, signWith) => {
  let signedTransaction = "";
  let error = "";
  try {
    signedTransaction = await signTransaction(xdr, { // Sign the transaction with the given parameters
      network, // Network to use (e.g., "testnet", "public")
      accountToSign: signWith, // Account to sign the transaction with
    });
  } catch (e) {
    error = e; // Catch any errors that occur during the signing process
  }
  if (error) {
    return error; // Return the error if one occurred
  }
  return signedTransaction; // Return the signed transaction
};

// Export the functions for use in other parts of the application
export { retrievePublicKey, checkConnection, userSignTransaction };
