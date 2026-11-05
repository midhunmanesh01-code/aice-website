import type { TeamMemberProfile } from "@/lib/team-members";
import { CARD_HEIGHT, CARD_WIDTH, svgNode } from "./card-ink";

export type MemberIdCard = Pick<
  TeamMemberProfile,
  "name" | "role" | "category" | "image"
>;

export const CARD_ASSETS = {
  paper: "/assets/team26-id/paper-background.webp",
  trim: "/assets/team26-id/trim.png",
};

interface CardArt {
  paper: HTMLImageElement | null;
  trim: HTMLImageElement | null;
  portrait: { image: HTMLImageElement; cutout: boolean } | null;
}

const categoryLabels = {
  faculty: "FACULTY",
  execom: "EXECOM",
  subExecom: "SUB-EXECOM",
};

const PORTRAIT_TOP = 250;
const portraitEdges = new WeakMap<HTMLImageElement, number[]>();

interface CutoutParams {
  sx?: number;
  sy?: number;
  sw?: number;
  sh?: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

function getCutoutParams(
  image: HTMLImageElement,
  cardWidth: number,
  cardHeight: number,
  portraitTop: number,
): CutoutParams {
  // If the cutout is Midhun Manesh's custom-edited portrait from the CDN (756x1004)
  // Matched exactly to his official physical ID card
  if (image.naturalWidth === 756 && image.naturalHeight === 1004) {
    return {
      dx: 141,
      dy: 7,
      dw: 831,
      dh: 1103,
    };
  }

  // Standard 960x1134 and other full-card cutouts
  return {
    dx: 0,
    dy: portraitTop,
    dw: cardWidth,
    dh: cardHeight - portraitTop,
  };
}


function getPortraitEdge(image: HTMLImageElement, top: number, bottom: number) {
  const step = 4;
  let edges = portraitEdges.get(image);
  if (!edges) {
    const sample = document.createElement("canvas");
    sample.width = Math.ceil(CARD_WIDTH / step);
    sample.height = Math.ceil((CARD_HEIGHT - PORTRAIT_TOP) / step);
    const ctx = sample.getContext("2d", { willReadFrequently: true });
    if (!ctx) return CARD_WIDTH;
    const p = getCutoutParams(image, CARD_WIDTH, CARD_HEIGHT, PORTRAIT_TOP);
    if (p.sx !== undefined) {
      ctx.drawImage(
        image,
        p.sx,
        p.sy!,
        p.sw!,
        p.sh!,
        p.dx / step,
        (p.dy - PORTRAIT_TOP) / step,
        p.dw / step,
        p.dh / step,
      );
    } else {
      ctx.drawImage(image, 0, 0, sample.width, sample.height);
    }
    const { data } = ctx.getImageData(0, 0, sample.width, sample.height);
    edges = Array.from({ length: sample.height }, (_, y) => {
      let x = 0;
      while (x < sample.width && data[(y * sample.width + x) * 4 + 3] < 192)
        x++;
      return x * step;
    });
    portraitEdges.set(image, edges);
  }

  const band = edges.slice(
    Math.max(0, Math.floor((top - PORTRAIT_TOP) / step)),
    Math.ceil((bottom - PORTRAIT_TOP) / step),
  );
  // Ignore isolated strands when deciding where the text can sit.
  return (
    band.sort((a, b) => a - b)[Math.floor(band.length * 0.1)] ?? CARD_WIDTH
  );
}

function fitLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  size: number,
  weight: number,
  minSingleLineSize: number,
  fontFamily: string,
) {
  const line = text.trim();
  for (
    let singleLineSize = size;
    singleLineSize >= minSingleLineSize;
    singleLineSize--
  ) {
    ctx.font = `${weight} ${singleLineSize}px ${fontFamily}`;
    if (ctx.measureText(line).width <= maxWidth) {
      return {
        lines: [line],
        size: singleLineSize,
        leading: singleLineSize * 1.08,
      };
    }
  }

  const words = line.split(/\s+/);
  for (;;) {
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    const lines = [words[0]];
    for (const word of words.slice(1)) {
      const last = lines.length - 1;
      const next = `${lines[last]} ${word}`;
      if (ctx.measureText(next).width <= maxWidth) lines[last] = next;
      else lines.push(word);
    }
    if (
      (lines.length <= 2 &&
        lines.every((part) => ctx.measureText(part).width <= maxWidth)) ||
      size <= 18
    ) {
      return { lines, size, leading: size * 1.08 };
    }
    size -= 1;
  }
}

function paintPortrait(
  ctx: CanvasRenderingContext2D,
  portrait: CardArt["portrait"],
  offset: number,
) {
  if (!portrait) return;
  const { image, cutout } = portrait;

  if (cutout) {
    // Cutouts are composed from the original Execom photos in the card's coordinate space.
    const p = getCutoutParams(image, CARD_WIDTH, CARD_HEIGHT, PORTRAIT_TOP);
    if (p.sx !== undefined) {
      ctx.drawImage(
        image,
        p.sx,
        p.sy!,
        p.sw!,
        p.sh!,
        p.dx + offset,
        p.dy,
        p.dw,
        p.dh,
      );
    } else {
      ctx.drawImage(
        image,
        p.dx + offset,
        p.dy,
        p.dw,
        p.dh,
      );
    }
    return;
  }

  // Use a framed photo while a new roster portrait is awaiting a cutout.
  const w = 376;
  const h = 640;
  const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const cropW = w / scale;
  const cropH = h / scale;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(299, 307, w, h, 12);
  ctx.clip();
  ctx.filter = "grayscale(1)";
  ctx.drawImage(
    image,
    (image.naturalWidth - cropW) / 2,
    (image.naturalHeight - cropH) * 0.2,
    cropW,
    cropH,
    299,
    307,
    w,
    h,
  );
  ctx.restore();
}

function paintWordmark() {
  const wordmark = svgNode("g", {});
  wordmark.append(
    svgNode("image", {
      href: "/assets/team26-id/aice-mark.webp",
      x: 50,
      y: 96,
      width: 42,
      height: 38,
    }),
    svgNode("path", { d: "M103.51 95.66h5.17564v36.2296h-5.17564z" }),
    svgNode("path", {
      transform: "translate(127.2 95.33)",
      d: "M19.1499 37.0577C16.3895 37.0577 13.8362 36.6092 11.4899 35.712C9.17814 34.7804 7.15963 33.4865 5.43442 31.8303C3.74371 30.1396 2.4153 28.1728 1.44918 25.93C0.483059 23.6873 0 21.2202 0 18.5289C0 15.8375 0.483059 13.3704 1.44918 11.1277C2.4153 8.88488 3.76096 6.93538 5.48618 5.27917C7.21139 3.58845 9.22989 2.29454 11.5417 1.39743C13.888 0.465809 16.4413 0 19.2016 0C21.9965 0 24.567 0.483061 26.9133 1.44918C29.2941 2.3808 31.3126 3.77823 32.9688 5.64147L29.6047 8.90213C28.2245 7.45295 26.6718 6.38331 24.9466 5.69322C23.2214 4.96863 21.3754 4.60634 19.4086 4.60634C17.3729 4.60634 15.4752 4.95138 13.7154 5.64147C11.9902 6.33155 10.4893 7.29767 9.21264 8.53983C7.93598 9.78199 6.93536 11.2657 6.21077 12.9909C5.52068 14.6816 5.17564 16.5276 5.17564 18.5289C5.17564 20.5301 5.52068 22.3933 6.21077 24.1186C6.93536 25.8093 7.93598 27.2757 9.21264 28.5179C10.4893 29.76 11.9902 30.7262 13.7154 31.4162C15.4752 32.1063 17.3729 32.4514 19.4086 32.4514C21.3754 32.4514 23.2214 32.1063 24.9466 31.4162C26.6718 30.6917 28.2245 29.5875 29.6047 28.1038L32.9688 31.3645C31.3126 33.2277 29.2941 34.6424 26.9133 35.6085C24.567 36.5747 21.9792 37.0577 19.1499 37.0577Z",
    }),
    svgNode("path", {
      transform: "translate(177.4 95.77)",
      d: "M0 36.2296V0H25.5676V4.50282H5.17564V31.7268H26.2922V36.2296H0ZM4.70983 20.0298V15.6305H23.3421V20.0298H4.70983Z",
    }),
  );
  return wordmark;
}

function inkText(value: string, attributes: Record<string, string | number>) {
  const text = svgNode("text", attributes);
  text.textContent = value;
  return text;
}

export function paintMemberIdCard(
  canvas: HTMLCanvasElement,
  ink: SVGSVGElement,
  member: MemberIdCard,
  art: CardArt,
  fontFamily: string,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.save();
  ctx.scale(canvas.width / CARD_WIDTH, canvas.height / CARD_HEIGHT);
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  if (art.paper) ctx.drawImage(art.paper, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  const nameY = 627;
  const roleY = 690;
  const nameSingleLineMin = member.name.length <= 12 ? 36 : 42;
  let nameWidth = 271;
  let roleWidth = 252;
  let offset = 0;
  let outlineName = false;
  let outlineRole = false;

  if (art.portrait?.cutout) {
    const image = art.portrait.image;
    const name = fitLines(
      ctx,
      member.name,
      nameWidth,
      57,
      700,
      nameSingleLineMin,
      fontFamily,
    );
    const nameInkWidth = Math.max(
      ...name.lines.map((line) => ctx.measureText(line).width),
    );
    const nameEdge = getPortraitEdge(
      image,
      nameY - name.lines.length * name.leading,
      nameY + 8,
    );
    ctx.letterSpacing = "1.35px";
    const role = fitLines(ctx, member.role, roleWidth, 27, 600, 22, fontFamily);
    const roleInkWidth = Math.max(
      ...role.lines.map((line) => ctx.measureText(line).width),
    );
    const roleEdge = getPortraitEdge(
      image,
      roleY - 26,
      roleY + (role.lines.length - 1) * role.leading + 6,
    );
    offset = Math.min(
      66,
      Math.max(0, 34 + nameInkWidth - nameEdge, 34 + roleInkWidth - roleEdge),
    );
    nameWidth = Math.min(nameWidth, Math.max(188, nameEdge + offset - 34));
    roleWidth = Math.min(roleWidth, Math.max(169, roleEdge + offset - 34));
    outlineName = nameWidth > nameEdge + offset - 34;
    outlineRole = roleWidth > roleEdge + offset - 34;
  }

  paintPortrait(ctx, art.portrait, offset);
  if (art.trim) ctx.drawImage(art.trim, 0, 1044.5, 706.5, 45.5);

  const print = svgNode("g", { fill: "#080808", "font-family": fontFamily });
  const tagline = svgNode("g", {
    "font-size": 13,
    "font-weight": 600,
    "letter-spacing": 2.05,
  });
  tagline.append(
    inkText("AI INNOVATION COMMUNITY", { x: 50.6, y: 154 }),
    inkText("FOR EXCELLENCE", { x: 50.6, y: 172 }),
  );
  const division = svgNode("g", {
    "font-size": 14,
    "font-weight": 700,
    "letter-spacing": 1.8,
    "text-anchor": "end",
  });
  division.append(
    inkText(categoryLabels[member.category], { x: 668, y: 232 }),
    inkText("2026", { x: 668, y: 248 }),
  );
  print.append(
    paintWordmark(),
    tagline,
    division,
    svgNode("rect", { x: 50.6, y: 186, width: 61, height: 1.4 }),
    svgNode("rect", { x: 682, y: 205, width: 1.4, height: 60 }),
  );

  const addLines = (
    text: ReturnType<typeof fitLines>,
    x: number,
    firstY: number,
    maxWidth: number,
    weight: number,
    letterSpacing: number,
    outlineWidth: number,
  ) => {
    for (const [index, line] of text.lines.entries()) {
      const label = inkText(line, {
        x,
        y: firstY + index * text.leading,
        "font-size": text.size,
        "font-weight": weight,
        "letter-spacing": letterSpacing,
      });
      if (ctx.measureText(line).width > maxWidth) {
        label.setAttribute("textLength", String(maxWidth));
        label.setAttribute("lengthAdjust", "spacingAndGlyphs");
      }
      if (outlineWidth) {
        label.setAttribute("stroke", "white");
        label.setAttribute("stroke-width", String(outlineWidth));
        label.setAttribute("stroke-linejoin", "round");
        label.setAttribute("paint-order", "stroke fill");
      }
      print.append(label);
    }
  };

  ctx.letterSpacing = "0px";
  const name = fitLines(
    ctx,
    member.name,
    nameWidth,
    57,
    700,
    nameSingleLineMin,
    fontFamily,
  );
  addLines(
    name,
    22,
    nameY - (name.lines.length - 1) * name.leading,
    nameWidth,
    700,
    0,
    outlineName ? 4 : 0,
  );

  ctx.letterSpacing = "1.35px";
  const role = fitLines(ctx, member.role, roleWidth, 27, 600, 22, fontFamily);
  addLines(role, 23, roleY, roleWidth, 600, 1.35, outlineRole ? 2.5 : 0);
  const ruleTop = 707.5 + (role.lines.length - 1) * role.leading;
  print.append(svgNode("rect", { x: 27, y: ruleTop, width: 75, height: 1.4 }));

  ink.replaceChildren(print);
  ctx.restore();
}
