import { EthosConnectStatus, SignInButton, ethos } from "ethos-connect";
import { useEffect, useState } from "react";
import { CompactPicker } from "react-color";
import "./App.css";
import Board from "./components/Board";
import pixelsLogo from "./logo.svg";
import {
  get_datas,
  get_set_pause_tx,
  get_set_price_tx,
  get_set_receiver_tx,
} from "./utils/functions";

const ADMIN_WALLET_ADDRESS = import.meta.env.VITE_ADMIN_WALLET_ADDRESS;

function App() {
  const { status, wallet } = ethos.useWallet();
  const [color, set_color] = useState("#000");
  const [paused, setPaused] = useState<boolean | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newReceiver, setNewReceiver] = useState<string>("");
  const idAdmin = wallet?.address === ADMIN_WALLET_ADDRESS;

  useEffect(() => {
    const fetchPauseStatus = async () => {
      try {
        const res = await get_datas();
        setPaused(res.pause);
        setPrice(res.price);
      } catch (error) {
        console.error("Error fetching pause status:", error);
      }
    };

    fetchPauseStatus();
  }, []);

  return (
    <div className="container">
      <div className="picker">
        <a href="https://github.com/cd33" target="_blank" rel="noreferrer">
          <img src={pixelsLogo} className="logo react" alt="Pixels logo" />
        </a>
        <h1>Pixels</h1>
        <p style={{ marginTop: "4rem", marginBottom: "4rem" }}>
          Select a color then click to place the pixel in the window.
          {price && (
            <>
              <br />
              <br />
              Placing a pixel costs {price / 1000000000} SUI.
            </>
          )}
        </p>
        <CompactPicker
          color={color}
          onChangeComplete={(new_color) => set_color(new_color.hex)}
        />
        {status === EthosConnectStatus.NoConnection && (
          <div
            style={{
              margin: "1rem",
              justifyContent: "center",
            }}
          >
            <SignInButton
              style={{ padding: "1rem", marginTop: "5rem" }}
              children={<h1>Connect Sui Wallet</h1>}
            />
          </div>
        )}
        {status === EthosConnectStatus.Loading && (
          <div style={{ marginTop: "4rem" }}>
            <h1>Loading Wallet...</h1>
          </div>
        )}
        <a
          href="https://www.youtube.com/@matthewjurenka"
          target="_blank"
          rel="noreferrer"
          style={{ marginTop: "4rem" }}
        >
          <p>Thanks mattjurenka for your tuto</p>
        </a>
        {idAdmin && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 style={{ marginTop: "1rem" }}>ADMIN</h2>
            <button
              onClick={() =>
                wallet?.signAndExecuteTransactionBlock({
                  transactionBlock: get_set_pause_tx(),
                })
              }
            >
              Set Pause
            </button>
            <div>
              <input
                type="number"
                placeholder="New Price"
                onChange={(e) => setNewPrice(parseInt(e.target.value))}
              />
              <button
                style={{ marginTop: "1rem" }}
                onClick={() =>
                  wallet?.signAndExecuteTransactionBlock({
                    transactionBlock: get_set_price_tx(newPrice),
                  })
                }
              >
                Set Price
              </button>
            </div>
            <div>
              <input
                type="text"
                placeholder="New Receiver"
                onChange={(e) => setNewReceiver(e.target.value)}
              />
              <button
                style={{ marginTop: "1rem" }}
                onClick={() =>
                  wallet?.signAndExecuteTransactionBlock({
                    transactionBlock: get_set_receiver_tx(newReceiver),
                  })
                }
              >
                Set Receiver
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="board">
        {paused ? (
          <div className="paused_canvas">
            <h1>Paused</h1>
            <p>Pixel placement is currently paused. Please try again later.</p>
          </div>
        ) : (
          <Board color={color} price={price ?? 0} />
        )}
      </div>
    </div>
  );
}

export default App;
