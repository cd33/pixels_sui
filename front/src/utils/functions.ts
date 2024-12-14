import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "ethos-connect";
import { ADMIN_CAP, BOARD, PACKAGE_ID } from "../deployed_addresses.json";

export const get_pause_status = async () => {
  const rpcUrl = getFullnodeUrl("devnet");
  const client = new SuiClient({ url: rpcUrl });
  const res = await client.getObject({
    id: BOARD,
    options: {
      showContent: true,
    },
  });

  const pausedStatus = (
    res?.data?.content as unknown as { fields: { paused: boolean } }
  )?.fields?.paused;
  return pausedStatus ?? false;
};

export const get_set_pixel_tx = (
  x: number,
  y: number,
  color: number
): TransactionBlock => {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::board::set_pixel`,
    arguments: [tx.object(BOARD), tx.pure(x), tx.pure(y), tx.pure(color)],
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
