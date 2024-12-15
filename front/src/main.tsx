import { Chain, EthosConnectProvider } from "ethos-connect";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const NETWORK_URL = import.meta.env.VITE_NETWORK_URL;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EthosConnectProvider
      ethosConfiguration={{
        chain:
          import.meta.env.VITE_NETWORK === "devnet"
            ? Chain.SUI_DEVNET
            : Chain.SUI_CUSTOM,
        network: NETWORK_URL,
      }}
    >
      <App />
    </EthosConnectProvider>
  </StrictMode>
);
