const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const RESPONSIVE_WIDTHS = [480, 960, 1440];

let lazyObserver = null;
const lazyTargets = new WeakMap();

const appendSuffix = (path, suffix, ext) => {
  const lastDot = path.lastIndexOf(".");
  if (lastDot === -1) {
    return `${path}${suffix}${ext ?? ""}`;
  }
  const base = path.slice(0, lastDot);
  const originalExt = path.slice(lastDot);
  return `${base}${suffix}${ext ?? originalExt}`;
};

export const createResponsiveImageConfig = (input, sizes) => {
  if (!input) return null;

  if (typeof input === "object" && input.src) {
    return {
      placeholder: input.placeholder ?? TRANSPARENT_PIXEL,
      src: input.src,
      srcset: input.srcset,
      sizes: input.sizes ?? sizes,
    };
  }

  if (typeof input !== "string") {
    return null;
  }

  const lower = input.toLowerCase();
  if (lower.endsWith(".svg")) {
    return {
      placeholder: TRANSPARENT_PIXEL,
      src: input,
      srcset: input,
      sizes,
    };
  }

  const variantEntries = RESPONSIVE_WIDTHS.map((width) => ({
    width,
    path: appendSuffix(input, `-${width}w`, ".webp"),
  }));

  const srcset = [
    ...variantEntries.map(({ width, path }) => `${path} ${width}w`),
    `${input} 2048w`,
  ].join(", ");

  return {
    placeholder: appendSuffix(input, "-placeholder", ".webp"),
    src: input,
    srcset,
    sizes,
  };
};

const ensureLazyObserver = () => {
  if (lazyObserver || typeof window === "undefined") {
    return lazyObserver;
  }

  if (!("IntersectionObserver" in window)) {
    lazyObserver = null;
    return null;
  }

  lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          lazyObserver?.unobserve(el);
          const value = lazyTargets.get(el);
          if (value) {
            assignImageSource(el, value);
          }
        }
      });
    },
    { rootMargin: "200px 0px", threshold: 0.1 },
  );

  return lazyObserver;
};

const normalizeLazyValue = (value) => {
  if (typeof value === "string") {
    return { src: value, placeholder: TRANSPARENT_PIXEL };
  }
  if (value && typeof value === "object") {
    return {
      placeholder: value.placeholder ?? TRANSPARENT_PIXEL,
      src: value.src,
      srcset: value.srcset,
      sizes: value.sizes,
    };
  }
  return { placeholder: TRANSPARENT_PIXEL };
};

const assignImageSource = (el, value) => {
  if (!value?.src) {
    return;
  }

  if (value.srcset) {
    el.setAttribute("srcset", value.srcset);
  } else {
    el.removeAttribute("srcset");
  }

  if (value.sizes) {
    el.setAttribute("sizes", value.sizes);
  } else {
    el.removeAttribute("sizes");
  }

  const markLoaded = () => {
    el.dataset.lazyLoaded = "true";
    el.classList.add("lazy-image-loaded");
    el.removeEventListener("load", markLoaded);
  };

  el.addEventListener("load", markLoaded);
  el.src = value.src;

  if (el.complete && el.naturalWidth > 0) {
    markLoaded();
  }
};

export const vLazy = {
  mounted(el, binding) {
    const normalized = normalizeLazyValue(binding.value);
    lazyTargets.set(el, normalized);

    el.classList.add("lazy-image");
    el.dataset.lazyLoaded = "false";

    if (normalized.placeholder) {
      el.src = normalized.placeholder;
    }
    el.removeAttribute("srcset");
    el.removeAttribute("sizes");

    const observer = ensureLazyObserver();
    if (observer) {
      observer.observe(el);
    } else {
      assignImageSource(el, normalized);
    }
  },

  updated(el, binding) {
    if (binding.value === binding.oldValue) {
      return;
    }

    const normalized = normalizeLazyValue(binding.value);
    lazyTargets.set(el, normalized);

    if (el.dataset.lazyLoaded === "true") {
      assignImageSource(el, normalized);
    } else {
      if (normalized.placeholder) {
        el.src = normalized.placeholder;
      }
    }
  },

  unmounted(el) {
    lazyTargets.delete(el);
    if (lazyObserver) {
      lazyObserver.unobserve(el);
    }
  },
};

export function useLazyImage() {
  return {
    vLazy,
    createResponsiveImageConfig,
    appendSuffix,
  };
}
