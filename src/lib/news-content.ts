export type NewsContentBlock =
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "paragraph"; text: string; emphasis?: boolean }
  | { type: "subheading"; text: string };

export interface ParsedNewsContent {
  blocks: NewsContentBlock[];
  previewImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
}

interface ParseNewsContentOptions {
  maxBlocks?: number;
  maxImages?: number;
}

const DEFAULT_MAX_BLOCKS = 8;
const DEFAULT_MAX_IMAGES = 3;

function normalizeText(value: string | null | undefined): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

function isValidHttpUrl(value: string | null | undefined): value is string {
  return Boolean(value && /^https?:\/\//i.test(value));
}

function buildImageBlock(
  src: string | null | undefined,
  alt: string | null | undefined,
  caption?: string | null
): Extract<NewsContentBlock, { type: "image" }> | null {
  if (!isValidHttpUrl(src)) {
    return null;
  }

  const normalizedAlt = normalizeText(alt) || "Imagem da notícia";
  const normalizedCaption = normalizeText(caption);

  return {
    type: "image",
    src,
    alt: normalizedAlt,
    caption: normalizedCaption || undefined,
  };
}

function parseParagraph(element: Element): NewsContentBlock | null {
  const text = normalizeText(element.textContent);

  if (!text) {
    return null;
  }

  const strongOnlyChild =
    element.children.length === 1 &&
    ["STRONG", "B"].includes(element.children[0]?.tagName || "") &&
    normalizeText(element.children[0]?.textContent) === text;

  if (strongOnlyChild && text.length <= 140) {
    return { type: "subheading", text };
  }

  return {
    type: "paragraph",
    text,
    emphasis: element.querySelector("strong, b, em, i") !== null,
  };
}

export function parseNewsContent(
  html: string,
  options: ParseNewsContentOptions = {}
): ParsedNewsContent {
  if (typeof window === "undefined" || typeof DOMParser === "undefined" || !html) {
    return { blocks: [] };
  }

  const maxBlocks = options.maxBlocks ?? DEFAULT_MAX_BLOCKS;
  const maxImages = options.maxImages ?? DEFAULT_MAX_IMAGES;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks: NewsContentBlock[] = [];
  let imageCount = 0;
  let previewImage: ParsedNewsContent["previewImage"];

  const pushBlock = (block: NewsContentBlock | null) => {
    if (!block || blocks.length >= maxBlocks) {
      return;
    }

    if (block.type === "image") {
      if (imageCount >= maxImages) {
        return;
      }

      imageCount += 1;
    }

    blocks.push(block);
  };

  const elements = Array.from(doc.body.children);

  for (const element of elements) {
    const tagName = element.tagName.toUpperCase();

    if (["SCRIPT", "STYLE", "IFRAME", "NOSCRIPT"].includes(tagName)) {
      continue;
    }

    if (tagName === "FIGURE") {
      const image = element.querySelector("img");
      const caption = element.querySelector("figcaption");
      const imageBlock = buildImageBlock(
        image?.getAttribute("src"),
        image?.getAttribute("alt"),
        caption?.textContent
      );

      if (imageBlock && !previewImage) {
        previewImage = {
          src: imageBlock.src,
          alt: imageBlock.alt,
          caption: imageBlock.caption,
        };
      }

      pushBlock(imageBlock);
      continue;
    }

    if (tagName === "IMG") {
      const imageBlock = buildImageBlock(
        element.getAttribute("src"),
        element.getAttribute("alt")
      );

      if (imageBlock && !previewImage) {
        previewImage = {
          src: imageBlock.src,
          alt: imageBlock.alt,
          caption: imageBlock.caption,
        };
      }

      pushBlock(imageBlock);
      continue;
    }

    if (tagName === "P") {
      pushBlock(parseParagraph(element));
      continue;
    }

    if (["H2", "H3", "H4"].includes(tagName)) {
      const text = normalizeText(element.textContent);
      if (text) {
        pushBlock({ type: "subheading", text });
      }
    }
  }

  return {
    blocks,
    previewImage,
  };
}
