import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "ethos-connect";
import { ADMIN_CAP, BOARD, PACKAGE_ID } from "../deployed_addresses.json";

const NETWORK = import.meta.env.VITE_NETWORK;

export const get_datas = async () => {
  const rpcUrl = getFullnodeUrl(NETWORK);
  const client = new SuiClient({ url: rpcUrl });
  const res = await client.getObject({
    id: BOARD,
    options: {
      showContent: true,
    },
  });

  const fields = (
    res?.data?.content as unknown as {
      fields: { paused: boolean; price: number };
    }
  )?.fields;
  return { pause: fields.paused, price: fields.price };
};

export const get_set_pixel_tx = (
  x: number,
  y: number,
  color: number,
  price: number
): TransactionBlock => {
  const tx = new TransactionBlock();
  const [payment] = tx.splitCoins(tx.gas, [tx.pure(price)]);

  tx.moveCall({
    target: `${PACKAGE_ID}::board::set_pixel`,
    arguments: [
      tx.object(BOARD),
      tx.pure(x),
      tx.pure(y),
      tx.pure(color),
      payment,
    ],
  });
  return tx;
};

export const get_set_pause_tx = (): TransactionBlock => {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::board::set_pause`,
    arguments: [tx.object(ADMIN_CAP), tx.object(BOARD)],
  });
  return tx;
};

export const get_set_price_tx = (new_price: number): TransactionBlock => {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::board::set_price`,
    arguments: [tx.object(ADMIN_CAP), tx.object(BOARD), tx.pure(new_price)],
  });
  return tx;
};

export const get_set_receiver_tx = (new_receiver: string): TransactionBlock => {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::board::set_receiver`,
    arguments: [tx.object(ADMIN_CAP), tx.object(BOARD), tx.pure(new_receiver)],
  });
  return tx;
};
