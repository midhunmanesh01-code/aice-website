import { Matrix4, Vector3, type Mesh, type PerspectiveCamera } from "three";

export const CARD_WIDTH = 709;
export const CARD_HEIGHT = 1087;

const SVG_NS = "http://www.w3.org/2000/svg";

export function svgNode<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attributes: Record<string, string | number>,
) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  return element;
}

export function createCardInk() {
  const ink = svgNode("svg", {
    class: "lanyard-card-ink",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    viewBox: `0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`,
    "aria-hidden": "true",
    focusable: "false",
  });
  ink.style.visibility = "hidden";

  const normal = new Vector3();
  const toCamera = new Vector3();
  const inkToFace = new Matrix4();
  const clipToScreen = new Matrix4();
  const projection = new Matrix4();

  return {
    ink,
    project(
      camera: PerspectiveCamera,
      front: Mesh,
      back: Mesh,
      layout: { width: number; height: number },
      view: { width: number; height: number },
    ) {
      normal.set(0, 0, 1).transformDirection(front.matrixWorld);
      toCamera
        .setFromMatrixPosition(front.matrixWorld)
        .sub(camera.position)
        .negate();
      const facing = normal.dot(toCamera);
      if (Math.abs(facing) < 0.02) {
        ink.style.visibility = "hidden";
        return;
      }

      // Map SVG units to the visible mesh face, then map its clip coordinates to CSS pixels.
      inkToFace.makeScale(
        layout.width / CARD_WIDTH,
        -layout.height / CARD_HEIGHT,
        1,
      );
      inkToFace.setPosition(-layout.width / 2, layout.height / 2, 0);
      const halfWidth = view.width / 2;
      const halfHeight = view.height / 2;
      clipToScreen.set(
        halfWidth,
        0,
        0,
        halfWidth,
        0,
        -halfHeight,
        0,
        halfHeight,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      );
      projection
        .copy(clipToScreen)
        .multiply(camera.projectionMatrix)
        .multiply(camera.matrixWorldInverse)
        .multiply(facing > 0 ? front.matrixWorld : back.matrixWorld)
        .multiply(inkToFace);

      const depth = projection.elements[15];
      if (depth <= 0) {
        ink.style.visibility = "hidden";
        return;
      }
      projection.multiplyScalar(1 / depth);
      ink.style.transform = `matrix3d(${projection.elements.join(",")})`;
      ink.style.visibility = "visible";
    },
  };
}
