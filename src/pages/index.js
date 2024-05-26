import { useEffect, useState } from "react"; // Import useEffect and useState hooks from React
import { checkConnection, retrievePublicKey } from "./freighter"; // Import functions from freighter module
import Vote from "./Vote"; // Import Vote component
import BgImage from "./BgImage"; // Import BgImage component

// Home component that manages connection state and renders the appropriate components
export default function Home() {
  const [connected, setConnected] = useState(false); // State to track if the user is connected
  const [publicKey, setPublicKey] = useState(null); // State to store the public key
  const [isConnecting, setIsConnecting] = useState(false); // State to track if the connection is in progress

  // Function to handle connection to Freighter
  async function connect() {
    setIsConnecting(true); // Set isConnecting to true when connection process starts
    try {
      // Check if connection to Freighter is established
      if (await checkConnection()) {
        // Retrieve public key from Freighter
        const publicKey = await retrievePublicKey();
        if (publicKey) {
          setPublicKey(publicKey); // Set the retrieved public key
          setConnected(true); // Set connected state to true
        }
      }
    } catch (error) {
      console.error("Error connecting to Freighter:", error); // Log any errors during the connection process
    } finally {
      setIsConnecting(false); // Set isConnecting to false when connection process ends
    }
  }

  return (
    <main>
      <BgImage /> {/* Render background image */}
      {connected ? ( // Check if the user is connected
        <Vote publicKey={publicKey} /> // If connected, render the Vote component and pass the public key as a prop
      ) : (
        <div className="page-container">
          <button
            onClick={connect} // Call the connect function when the button is clicked
            className="connectButton"
            disabled={isConnecting} // Disable the button if the connection is in progress
          >
            {isConnecting ? "Connecting..." : "Connect to Freighter"} {/* Show appropriate button text based on isConnecting state */}
          </button>
        </div>
      )}
    </main>
  );
}
