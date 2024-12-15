import { SuiObjectData } from "@mysten/sui.js/client";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { QUADRANT_ADDRESSES } from "../deployed_addresses.json";
import { useQuadrantResponses } from "../utils/hooks";
import Quadrant from "./Quadrant";
import "./components.css";

const Board = ({ color, price }: { color: string; price: number }) => {
  const quadrant_responses = useQuadrantResponses(QUADRANT_ADDRESSES, 5);
  if (quadrant_responses.length === 0 || !quadrant_responses.every((x) => x)) {
    return (
      <div
        className="loading_canvas"
        style={{
          border: "1px solid black",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginTop: "16rem" }}>Loading Content...</h1>
      </div>
    );
  }

  const quadrants = (quadrant_responses as SuiObjectData[]).map((response) => {
    if (response.content?.dataType === "moveObject") {
      return [
        (response.content.fields as { board: number[][] })["board"],
        response.digest,
      ] as [number[][], string];
    }
  }) as [number[][], string][];

  return (
    <TransformWrapper>
      <div style={{ border: "1px solid black", width: "fit-content" }}>
        <TransformComponent>
          <Quadrant quadrants={quadrants} color={color} price={price} />
        </TransformComponent>
      </div>
    </TransformWrapper>
  );
};

export default Board;
