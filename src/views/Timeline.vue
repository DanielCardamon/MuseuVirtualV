<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { timelineItems } from "../data/timeline-data.js";

const isModalOpen = ref(false);
const selectedItem = ref(null);
const modalState = ref("hidden");
const isFontesModalOpen = ref(false);
const fontesModalState = ref("hidden");
const activeYear = ref(null);
const yearNavEl = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const selectedCategory = ref("Todas");
const searchQuery = ref("");
const toastMessage = ref("");
const toastType = ref("info");
const showToast = ref(false);

let scrollShadowRaf = null;
let yearObserver = null;
const NAV_VISIBILITY_PADDING = 16;
const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

let lazyObserver = null;
const lazyTargets = new WeakMap();
const RESPONSIVE_WIDTHS = [480, 960, 1440];
const CARD_IMAGE_SIZES =
  "(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 33vw";
const MODAL_IMAGE_SIZES = "(max-width: 640px) 90vw, 65vw";

const categoryColors = {
  Computadores: "bg-blue-500/80",
  Hardware: "bg-purple-500/80",
  Software: "bg-green-500/80",
  Empresas: "bg-orange-500/80",
  Redes: "bg-cyan-500/80",
  "Inteligência Artificial": "bg-pink-500/80",
  Smartphones: "bg-yellow-500/80",
};

const getCategoryColor = (category) => {
  return categoryColors[category] || "bg-gray-500/80";
};

const getItemCategories = (item) => {
  if (!item.category) return [];
  return Array.isArray(item.category) ? item.category : [item.category];
};

const hasCategory = (item, category) => {
  const categories = getItemCategories(item);
  return categories.includes(category);
};

const appendSuffix = (path, suffix, ext) => {
  const lastDot = path.lastIndexOf(".");
  if (lastDot === -1) {
    return `${path}${suffix}${ext ?? ""}`;
  }
  const base = path.slice(0, lastDot);
  const originalExt = path.slice(lastDot);
  return `${base}${suffix}${ext ?? originalExt}`;
};

const createResponsiveImageConfig = (input, sizes) => {
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
    { rootMargin: "200px 0px", threshold: 0.1 }
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

const vLazy = {
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
    const previous = lazyTargets.get(el);
    const normalized = normalizeLazyValue(binding.value);

    const hasNewSource =
      normalized.src !== previous?.src ||
      normalized.srcset !== previous?.srcset ||
      normalized.sizes !== previous?.sizes;

    lazyTargets.set(el, normalized);

    if (!hasNewSource) {
      return;
    }

    el.classList.remove("lazy-image-loaded");
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
  beforeUnmount(el) {
    lazyObserver?.unobserve(el);
    lazyTargets.delete(el);
  },
};

const openModal = (event, item) => {
  if (event.target.closest("a")) {
    return;
  }
  selectedItem.value = item;
  isModalOpen.value = true;
  modalState.value = "entering";
  setTimeout(() => {
    modalState.value = "visible";
  }, 10);
};

const closeModal = () => {
  modalState.value = "leaving";
  setTimeout(() => {
    isModalOpen.value = false;
    selectedItem.value = null;
    modalState.value = "hidden";
  }, 200);
};

const openFontesModal = () => {
  isFontesModalOpen.value = true;
  fontesModalState.value = "entering";
  setTimeout(() => {
    fontesModalState.value = "visible";
  }, 10);
};

const closeFontesModal = () => {
  fontesModalState.value = "leaving";
  setTimeout(() => {
    isFontesModalOpen.value = false;
    fontesModalState.value = "hidden";
  }, 200);
};

const displayToast = (message, type = "info") => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const getModalSource = (item) => {
  if (!item) return "";
  return item.sourceModal || item.source || "";
};

const getCardSource = (item) => {
  return item.sourceCard || item.source || "";
};

const formattedDescription = computed(() => {
  if (!selectedItem.value) return "";
  return selectedItem.value.longDescription
    .split("\n")
    .filter((p) => p.trim() !== "")
    .map((p) => `<p class="mb-4">${p.trim()}</p>`)
    .join("");
});

const enrichedTimelineItems = computed(() =>
  timelineItems.map((item) => ({
    ...item,
    imageCard: createResponsiveImageConfig(item.imageCard, CARD_IMAGE_SIZES),
    imageModal: createResponsiveImageConfig(item.imageModal, MODAL_IMAGE_SIZES),
  }))
);

const filteredTimelineItems = computed(() => {
  let items = enrichedTimelineItems.value;

  if (selectedCategory.value !== "Todas") {
    items = items.filter((item) => hasCategory(item, selectedCategory.value));
  }

  if (searchQuery.value.trim() !== "") {
    const query = searchQuery.value.toLowerCase();
    items = items.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.shortDescription.toLowerCase().includes(query) ||
        item.longDescription.toLowerCase().includes(query) ||
        item.year.includes(query)
      );
    });
  }

  return items;
});

const categoriesWithCount = computed(() => {
  const categoryCounts = {};

  const totalCount = enrichedTimelineItems.value.length;
  categoryCounts["Todas"] = totalCount;

  enrichedTimelineItems.value.forEach((item) => {
    const categories = getItemCategories(item);
    categories.forEach((category) => {
      if (category && category.trim() !== "") {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
  });

  return categoryCounts;
});

const categories = computed(() => {
  const uniqueCategories = new Set();

  timelineItems.forEach((item) => {
    const categories = getItemCategories(item);
    categories.forEach((category) => {
      if (category && category.trim() !== "") {
        uniqueCategories.add(category);
      }
    });
  });

  return ["Todas", ...Array.from(uniqueCategories).sort()];
});

const groupedTimelineItems = computed(() => {
  const grouped = {};

  filteredTimelineItems.value.forEach((item) => {
    if (!grouped[item.year]) {
      grouped[item.year] = {
        year: item.year,
        items: [],
      };
    }
    grouped[item.year].items.push(item);
  });

  return Object.values(grouped).sort(
    (a, b) => parseInt(a.year) - parseInt(b.year)
  );
});

const years = computed(() => {
  const yearSet = new Set(filteredTimelineItems.value.map((item) => item.year));
  return Array.from(yearSet).sort((a, b) => parseInt(a) - parseInt(b));
});

const scrollToYear = (year) => {
  const el = document.getElementById(`year-${year}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    centerActiveYear("smooth", { force: true });
  }
};

const scrollNav = (direction) => {
  if (yearNavEl.value) {
    const amount = yearNavEl.value.clientWidth * 0.8 * direction;
    yearNavEl.value.scrollBy({ left: amount, behavior: "smooth" });
  }
};

const applyScrollShadows = () => {
  const el = yearNavEl.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 2;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
};

const scheduleScrollShadowUpdate = () => {
  if (scrollShadowRaf !== null) return;
  scrollShadowRaf = requestAnimationFrame(() => {
    scrollShadowRaf = null;
    applyScrollShadows();
  });
};

const centerActiveYear = (behavior = "auto", { force = false } = {}) => {
  const container = yearNavEl.value;
  if (!container || !activeYear.value) return;

  const activeButton = container.querySelector(
    `[data-year="${activeYear.value}"]`
  );
  if (!activeButton) return;

  const buttonLeft = activeButton.offsetLeft;
  const buttonRight = buttonLeft + activeButton.offsetWidth;
  const containerLeft = container.scrollLeft;
  const containerRight = containerLeft + container.clientWidth;

  if (
    !force &&
    buttonLeft >= containerLeft + NAV_VISIBILITY_PADDING &&
    buttonRight <= containerRight - NAV_VISIBILITY_PADDING
  ) {
    return;
  }

  const offset =
    buttonLeft - (container.clientWidth / 2 - activeButton.clientWidth / 2);

  container.scrollTo({ left: Math.max(0, offset), behavior });
};

onMounted(() => {
  yearNavEl.value?.addEventListener("scroll", scheduleScrollShadowUpdate, {
    passive: true,
  });
  window.addEventListener("resize", scheduleScrollShadowUpdate);
  applyScrollShadows();

  yearObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const newYear = entry.target.id.replace("year-", "");
          if (activeYear.value !== newYear) {
            activeYear.value = newYear;
          }
        }
      });
    },
    { rootMargin: "-60% 0px -35% 0px" }
  );

  document
    .querySelectorAll(".year-anchor")
    .forEach((el) => yearObserver?.observe(el));

  const handleKeydown = (e) => {
    if (e.key === "Escape" && isModalOpen.value) {
      closeModal();
      return;
    }

    if (e.key === "Escape" && isFontesModalOpen.value) {
      closeFontesModal();
      return;
    }

    if (
      isModalOpen.value ||
      isFontesModalOpen.value ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "SELECT"
    ) {
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const currentIndex = years.value.indexOf(activeYear.value);
      if (currentIndex > 0) {
        const previousYear = years.value[currentIndex - 1];
        scrollToYear(previousYear);
      }
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const currentIndex = years.value.indexOf(activeYear.value);
      if (currentIndex < years.value.length - 1) {
        const nextYear = years.value[currentIndex + 1];
        scrollToYear(nextYear);
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      document.getElementById("search-input")?.focus();
      displayToast("Campo de busca focado", "info");
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "l") {
      e.preventDefault();
      if (searchQuery.value || selectedCategory.value !== "Todas") {
        searchQuery.value = "";
        selectedCategory.value = "Todas";
        displayToast("Filtros limpos", "success");
      }
    }
  };

  window.addEventListener("keydown", handleKeydown);

  window._timelineKeyHandler = handleKeydown;
});

onUnmounted(() => {
  yearNavEl.value?.removeEventListener("scroll", scheduleScrollShadowUpdate);
  window.removeEventListener("resize", scheduleScrollShadowUpdate);
  if (scrollShadowRaf !== null) {
    cancelAnimationFrame(scrollShadowRaf);
    scrollShadowRaf = null;
  }
  yearObserver?.disconnect();
  yearObserver = null;

  if (window._timelineKeyHandler) {
    window.removeEventListener("keydown", window._timelineKeyHandler);
    delete window._timelineKeyHandler;
  }
});

watch(activeYear, () => {
  centerActiveYear();
});

watch(selectedCategory, () => {
  if (years.value.length > 0) {
    activeYear.value = years.value[0];
  }
  displayToast(`Filtrado por: ${selectedCategory.value}`, "success");
});

watch(searchQuery, () => {
  if (years.value.length > 0) {
    activeYear.value = years.value[0];
  }
});
</script>

<template>
  <div>
    <Transition name="toast">
      <div v-if="showToast"
        class="fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border max-w-sm"
        :class="{
          'bg-blue-500/90 border-blue-400/50 text-white': toastType === 'info',
          'bg-green-500/90 border-green-400/50 text-white':
            toastType === 'success',
          'bg-red-500/90 border-red-400/50 text-white': toastType === 'error',
        }">
        <svg v-if="toastType === 'info'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-if="toastType === 'success'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-if="toastType === 'error'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-medium">{{ toastMessage }}</span>
      </div>
    </Transition>

    <h1 class="text-4xl md:text-5xl font-bold text-center mb-12">
      Linha do Tempo
    </h1>

    <div class="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center px-4">
      <div class="relative inline-block w-full max-w-xs">
        <label for="category-filter" class="block text-sm font-medium text-gray-200 mb-2 text-center">
          Filtrar por Categoria
        </label>
        <select id="category-filter" v-model="selectedCategory"
          class="block w-full px-4 py-3 pr-10 text-base border border-white/20 rounded-xl bg-black/30 backdrop-blur-md text-white shadow-lg cursor-pointer transition-all duration-200 hover:border-white/40 hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 appearance-none">
          <option v-for="category in categories" :key="category" :value="category" class="bg-gray-900 text-white">
            {{ category }} ({{ categoriesWithCount[category] || 0 }})
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white mt-8">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      <div class="relative inline-block w-full max-w-xs">
        <label for="search-input" class="block text-sm font-medium text-gray-200 mb-2 text-center">
          Pesquisar
        </label>
        <div class="relative">
          <input id="search-input" v-model="searchQuery" type="text" placeholder="Buscar por título ou ano..."
            class="block w-full px-4 py-3 pl-11 pr-10 text-base border border-white/20 rounded-xl bg-black/30 backdrop-blur-md text-white placeholder-gray-400 shadow-lg transition-all duration-200 hover:border-white/40 hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60" />
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button v-if="searchQuery" @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Limpar busca">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="searchQuery || selectedCategory !== 'Todas'" class="mb-6 text-center">
      <p class="text-sm text-gray-300">
        Mostrando
        <span class="font-bold text-white">{{
          filteredTimelineItems.length
        }}</span>
        {{ filteredTimelineItems.length === 1 ? "item" : "itens" }}
        <span v-if="searchQuery"> para "{{ searchQuery }}"</span>
      </p>
    </div>

    <nav aria-label="Navegação por anos" class="mb-10 year-nav-sticky">
      <div ref="yearNavWrapperEl"
        class="year-nav-wrapper relative border border-white/10 bg-white/5 backdrop-blur-md rounded-xl">
        <button
          class="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-1 z-10 items-center justify-center w-9 h-9 rounded-full backdrop-blur-md border border-white/25 bg-white/10 text-white transition hover:scale-105 hover:bg-white/20 hover:border-white/40 cursor-pointer"
          type="button" aria-label="Rolar anos para a esquerda" v-show="canScrollLeft" @click="scrollNav(-1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div ref="yearNavEl"
          class="year-nav overflow-x-auto scroll-smooth cursor-grab flex gap-3 md:gap-4 items-center py-2 pl-10 pr-10 md:pl-12 md:pr-12"
          :class="{
            'pl-12 md:pl-16': !canScrollLeft,
            'pr-12 md:pr-16': !canScrollRight,
          }">
          <button v-for="year in years" :key="'nav-' + year" type="button" @click="scrollToYear(year)"
            class="whitespace-nowrap cursor-pointer border border-white/25 bg-white/10 text-white rounded-full px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base shadow-sm transition transform hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/40"
            :data-year="year" :class="{
              'bg-white/30 border-white/60 text-gray-900 font-bold':
                activeYear === year,
            }">
            {{ year }}
          </button>
        </div>

        <button
          class="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-1 z-10 items-center justify-center w-9 h-9 rounded-full backdrop-blur-md border border-white/25 bg-white/10 text-white transition hover:scale-105 hover:bg-white/20 hover:border-white/40 cursor-pointer"
          type="button" aria-label="Rolar anos para a direita" v-show="canScrollRight" @click="scrollNav(1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div
          class="absolute inset-y-0 left-0 w-12 pointer-events-none transition-opacity bg-gradient-to-r from-black/70 to-transparent"
          :class="{ hidden: !canScrollLeft }"></div>
        <div
          class="absolute inset-y-0 right-0 w-12 pointer-events-none transition-opacity bg-gradient-to-l from-black/70 to-transparent"
          :class="{ hidden: !canScrollRight }"></div>
      </div>
    </nav>

    <section class="mb-12">
      <p class="timeline-disclaimer mx-auto max-w-3xl text-center text-sm text-gray-200 opacity-90 leading-relaxed">
        <button @click="openFontesModal"
          class="text-[#fcd34d] hover:text-[#fde68a] cursor-pointer transition-colors underline">
          Todo o conteúdo apresentado nesse site tem fins educacionais e de arquivamento.<br>
          As imagens utilizadas são meramente ilustrativas e foram obtidas da internet.<br>
          Os textos exibidos foram adaptados das Fontes utilizadas.
        </button>
      </p>

      <div class="mt-6 hidden md:flex justify-center">
        <details class="group cursor-pointer">
          <summary
            class="text-xs text-gray-400 hover:text-gray-300 transition-colors list-none flex items-center gap-2">
            <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Atalhos de teclado disponíveis</span>
          </summary>
          <div class="mt-3 p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
              <div class="flex items-center gap-2">
                <kbd class="px-2 py-1 bg-gray-700/50 rounded border border-gray-600 font-mono">←</kbd>
                <span>Navegar anos anteriores</span>
              </div>
              <div class="flex items-center gap-2">
                <kbd class="px-2 py-1 bg-gray-700/50 rounded border border-gray-600 font-mono">→</kbd>
                <span>Navegar próximos anos</span>
              </div>
              <div class="flex items-center gap-2">
                <kbd class="px-2 py-1 bg-gray-700/50 rounded border border-gray-600 font-mono">Esc</kbd>
                <span>Fechar modal</span>
              </div>
              <div class="flex items-center gap-2">
                <kbd class="px-2 py-1 bg-gray-700/50 rounded border border-gray-600 font-mono">Ctrl+K</kbd>
                <span>Focar na busca</span>
              </div>
              <div class="flex items-center gap-2 md:col-span-2">
                <kbd class="px-2 py-1 bg-gray-700/50 rounded border border-gray-600 font-mono">Ctrl+L</kbd>
                <span>Limpar todos os filtros</span>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>

    <div class="relative mx-auto max-w-5xl px-4 sm:px-6">
      <div v-if="groupedTimelineItems.length === 0" class="text-center py-20">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-2xl font-bold text-white mb-2">
          Nenhum item encontrado
        </h3>
        <p class="text-gray-400 mb-6">
          <span v-if="searchQuery">Não encontramos resultados para "{{ searchQuery }}"</span>
          <span v-else>Não há itens nesta categoria</span>
        </p>
        <button @click="
          searchQuery = '';
        selectedCategory = 'Todas';
        "
          class="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white transition-all duration-200">
          Limpar filtros
        </button>
      </div>

      <div class="absolute left-1/2 top-0 -ml-px h-full w-0.5 bg-white/20" aria-hidden="true"
        v-if="groupedTimelineItems.length > 0"></div>

      <div v-for="(yearGroup, yearIndex) in groupedTimelineItems" :key="yearGroup.year" class="relative year-anchor"
        :id="'year-' + yearGroup.year">
        <div class="z-20 flex items-center" :class="[yearIndex % 2 === 0 ? 'justify-start' : 'md:justify-end']">
          <h2
            class="w-20 rounded-full border border-white/30 bg-gray-900/80 px-4 py-2 text-center text-sm font-semibold text-white backdrop-blur-sm">
            {{ yearGroup.year }}
          </h2>
        </div>

        <div class="mt-6 md:mt-8">
          <div v-for="item in yearGroup.items" :key="item.title"
            class="relative mb-12 flex items-start transition-transform duration-[800ms] ease-out" :class="[
              yearIndex % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
            ]">
            <button @click="openModal($event, item)"
              class="modal-trigger group w-full cursor-pointer rounded-xl border border-white/10 bg-black/20 p-4 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-black/30 hover:shadow-2xl md:w-[calc(50%-2.5rem)]">
              <img v-lazy="item.imageCard" :alt="'Imagem de ' + item.title" loading="lazy" decoding="async"
                class="w-full max-h-[250px] object-contain rounded-lg mb-3" />

              <div class="mb-3 flex items-center justify-between flex-wrap gap-2">
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="category in getItemCategories(item)" :key="category"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                    :class="getCategoryColor(category)">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                        clip-rule="evenodd" />
                    </svg>
                    {{ category }}
                  </span>
                </div>
                <span class="text-xs font-medium text-gray-400">{{
                  item.year
                }}</span>
              </div>

              <p class="mb-3 text-right text-xs italic text-gray-400" v-html="'Fonte: ' + getCardSource(item)"></p>
              <h3 class="mb-1 text-lg font-bold text-white">
                {{ item.title }}
              </h3>
              <p class="text-sm text-gray-200">
                {{ item.shortDescription }}
              </p>
            </button>

            <div
              class="absolute top-8 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 ring-4 ring-gray-900/80"
              :class="[
                yearIndex % 2 === 0
                  ? 'right-full mr-4 md:left-1/2 md:-ml-2.5 md:mr-0'
                  : 'right-full mr-4 md:right-auto md:left-1/2 md:-ml-2.5',
              ]">
              <div class="h-2 w-2 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" @click.self="closeModal"
      class="fixed inset-0 bg-black/70 flex justify-center items-center z-[100] p-4 pointer-events-none opacity-0 transition-opacity duration-300"
      :class="{
        'modal-entering': modalState === 'entering',
        'modal-visible': modalState === 'visible',
        'modal-leaving': modalState === 'leaving',
        '!opacity-100 !pointer-events-auto': modalState !== 'hidden',
      }">
      <div v-if="selectedItem"
        class="modal-content relative mx-4 my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/20 bg-gray-900/80 p-6 text-gray-300 shadow-2xl backdrop-blur-lg sm:p-8 transition-all duration-300">
        <button @click="closeModal"
          class="absolute right-4 top-4 z-20 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Fechar modal">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div class="pr-12 mb-2">
          <h2 class="text-2xl font-bold text-white sm:text-3xl">
            {{ selectedItem.title }}
            <span class="text-xl font-semibold text-gray-400">({{ selectedItem.year }})</span>
          </h2>
        </div>
        <img v-lazy="selectedItem.imageModal" :alt="'Imagem detalhada de ' + selectedItem.title" loading="lazy"
          decoding="async" class="max-h-[70vh] w-auto max-w-full object-contain mx-auto block my-4 rounded-lg" />
        <p class="mb-4 text-right text-xs italic text-gray-400" v-html="'Fonte: ' + getModalSource(selectedItem)"></p>
        <div class="prose prose-invert max-w-none text-gray-300" v-html="formattedDescription"></div>
      </div>
    </div>

    <div v-if="isFontesModalOpen" @click.self="closeFontesModal"
      class="fixed inset-0 bg-black/70 flex justify-center items-center z-[100] p-4 pointer-events-none opacity-0 transition-opacity duration-300"
      :class="{
        'modal-entering': fontesModalState === 'entering',
        'modal-visible': fontesModalState === 'visible',
        'modal-leaving': fontesModalState === 'leaving',
        '!opacity-100 !pointer-events-auto': fontesModalState !== 'hidden',
      }">
      <div
        class="modal-content relative mx-4 my-8 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-white/20 bg-gray-900/90 p-6 text-gray-300 shadow-2xl backdrop-blur-lg sm:p-8 transition-all duration-300">
        <button @click="closeFontesModal"
          class="absolute right-4 top-4 z-20 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Fechar modal">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div class="pr-12">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-6">
            Fontes Utilizadas
          </h2>

          <div class="space-y-8">
            <div>
              <h3 class="text-xl md:text-2xl font-semibold text-white mb-4">
                Sites de museus com acervos e exibições online:
              </h3>
              <div class="space-y-2 text-base leading-relaxed">
                <p><a href="https://www.computerhistory.org/timeline/computers/" target="_blank"
                    rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors">Computer
                    History Museum</a></p>
                <p><a href="https://www.computinghistory.org.uk/cgi/computing-timeline.pl" target="_blank"
                    rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors">Centre for
                    Computing History</a></p>
                <p><a href="https://www.ithistory.org/hardware" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">IT History Society</a></p>
                <p><a href="https://museum.ipsj.or.jp/en/index.html" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">IPSJ Computer Museum</a></p>
                <p><a href="https://computermuseum.nexon.com/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Nexon Computer Museum</a></p>
                <p><a href="https://mraths.org.uk/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Malvern Radar and Technology History
                    Society</a></p>
                <p><a href="https://distributedmuseum.illinois.edu/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Illinois Distributed Museum</a></p>
                <p><a href="https://www.homecomputermuseum.nl/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Home Computer Museum</a></p>
                <p><a href="https://museucapixaba.com.br/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Museu Capixaba do Computador</a></p>
                <p><a href="https://ethw.org/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Engineering and Technology History Wiki
                    (ETHW)</a></p>
                <p><a href="https://obsoletemedia.org/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Museum of Obsolete Media</a></p>
                <p><a href="https://museum.syssrc.com/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Computer Museum @ System Source</a></p>
              </div>
            </div>

            <hr class="border-white/20" />

            <div>
              <h3 class="text-xl md:text-2xl font-semibold text-white mb-4">
                Sites com linha do tempo ou história de empresas:
              </h3>
              <div class="space-y-2 text-base leading-relaxed">
                <p><a href="https://www.ibm.com/history/advancing-humanity" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">IBM History</a></p>
                <p><a href="https://www.intel.com/content/www/us/en/history/virtual-vault.html" target="_blank"
                    rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors">Intel
                    History</a></p>
                <p><a href="http://zuse.zib.de/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Konrad Zuse Internet Archive</a></p>
                <p><a href="https://news.microsoft.com/facts-about-microsoft/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Microsoft History</a></p>
                <p><a href="https://www.apple-history.com/" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Apple History 1976 a 2015</a></p>
                <p><a href="https://www.hp.com/gb-en/shop/tech-takes/history-of-hp" target="_blank"
                    rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors">HP History</a>
                </p>
                <p><a href="https://newsroom.arm.com/blog/arm-official-history" target="_blank"
                    rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors">ARM
                    History</a></p>
                <p><a href="https://www.sony.com/en/SonyInfo/CorporateInfo/History/" target="_blank"
                    rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors">Sony
                    History</a></p>
                <p><a href="https://www.global.toshiba/ww/outline/corporate/history.html" target="_blank"
                    rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors">Toshiba
                    History</a></p>
                <p><a href="https://www.cam.ac.uk/stories/raspberrypi" target="_blank" rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition-colors">Raspberry Pi Foundation</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
