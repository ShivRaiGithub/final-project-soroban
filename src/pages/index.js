import { useState, useEffect } from "react";
import { checkConnection, retrievePublicpublicKey } from "./freighter";
import Vote from "./Vote";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  // async function connect() {
  //   if (await checkConnection()) {
  //     let publicKey = await retrievePublicKey();
  //     setPublicKey(publicKey);
  //     setConnected(true);
  //   }
  // }

  async function connect() {
    setPublicKey("123445");
    setConnected(true);
  }


  return (
    <main>
      {connected ? (
        <Vote publicKey={publicKey} />
      ) : (
        <button onClick={connect}>Connect to Freighter</button>
      )}
    </main>
  );
}
