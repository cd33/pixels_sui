import { EthosConnectStatus, SignInButton, ethos } from "ethos-connect";
import "./App.css";
// import Board from "./components/Board";
import { useState } from "react";
import { CompactPicker } from "react-color";
import pixelsLogo from "./logo.svg";

function App() {
  const { status } = ethos.useWallet();
  const [color, set_color] = useState("#000");

  if (status == EthosConnectStatus.Connected) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}
      >
        {/* <Board color={color} /> */}
        <div
          style={{
            margin: "4rem",
            width: "512px",
            lineHeight: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <img src={pixelsLogo} className="logo react" alt="Pixels logo" />
          <h1>Pixels</h1>
          <p style={{ marginTop: "4rem", marginBottom: "4rem" }}>
            Select a color then ctrl+click to place the pixel in the left
            window.
          </p>
          <div style={{ marginBottom: "4rem" }}>
            <CompactPicker
              color={color}
              onChangeComplete={(new_color) => set_color(new_color.hex)}
            />
          </div>
        </div>
      </div>
    );
  } else if (status == EthosConnectStatus.Loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1 style={{ marginTop: "16rem" }}>Loading Wallet...</h1>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          textAlign: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            margin: "12rem",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <img src={pixelsLogo} className="logo react" alt="Pixels logo" />
          <h1>Pixels</h1>
          <SignInButton
            style={{ padding: "1rem", marginTop: "5rem" }}
            children={<h1>Connect Sui Wallet</h1>}
          />
        </div>
      </div>
    );
  }
}

export default App;
