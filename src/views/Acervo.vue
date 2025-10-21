<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { acervoItems, categorias, categoriaCores } from "../data/acervo-data.js";

const selectedCategoria = ref("Todas");
const searchQuery = ref("");
const isModalOpen = ref(false);
const selectedItem = ref(null);
const modalState = ref("hidden");
const viewMode = ref("grid");
const toastMessage = ref("");
const toastType = ref("info");
const showToast = ref(false);

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const RESPONSIVE_WIDTHS = [480, 960, 1440];
const CARD_IMAGE_SIZES =
  "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw";
const MODAL_IMAGE_SIZES = "(max-width: 640px) 90vw, 65vw";

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

const getCategoriaColor = (categoria) => {
  return categoriaCores[categoria] || "bg-gray-500/80";
};

const displayToast = (message, type = "info") => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const openModal = (item) => {
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

const enrichedAcervoItems = computed(() =>
  acervoItems.map((item) => ({
    ...item,
    imagemConfig: createResponsiveImageConfig(item.imagem, CARD_IMAGE_SIZES),
    imagemModalConfig: createResponsiveImageConfig(item.imagem, MODAL_IMAGE_SIZES),
  }))
);

const filteredItems = computed(() => {
  let items = enrichedAcervoItems.value;

  if (selectedCategoria.value !== "Todas") {
    items = items.filter((item) => item.categoria === selectedCategoria.value);
  }

  if (searchQuery.value.trim() !== "") {
    const query = searchQuery.value.toLowerCase();
    items = items.filter((item) => {
      return (
        item.nome.toLowerCase().includes(query) ||
        item.descricao.toLowerCase().includes(query) ||
        item.categoria.toLowerCase().includes(query) ||
        (item.anoAproximado && item.anoAproximado.includes(query))
      );
    });
  }

  return items;
});

const categoriasComContagem = computed(() => {
  const contagem = {};

  contagem["Todas"] = enrichedAcervoItems.value.length;

  enrichedAcervoItems.value.forEach((item) => {
    if (item.categoria) {
      contagem[item.categoria] = (contagem[item.categoria] || 0) + 1;
    }
  });

  return contagem;
});

onMounted(() => {
  const handleKeydown = (e) => {
    if (e.key === "Escape" && isModalOpen.value) {
      closeModal();
      return;
    }

    if (
      isModalOpen.value ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "SELECT"
    ) {
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      document.getElementById("acervo-search-input")?.focus();
      displayToast("Campo de busca focado", "info");
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "l") {
      e.preventDefault();
      if (searchQuery.value || selectedCategoria.value !== "Todas") {
        searchQuery.value = "";
        selectedCategoria.value = "Todas";
        displayToast("Filtros limpos", "success");
      }
    }
  };

  window.addEventListener("keydown", handleKeydown);
  window._acervoKeyHandler = handleKeydown;
});

onUnmounted(() => {
  if (window._acervoKeyHandler) {
    window.removeEventListener("keydown", window._acervoKeyHandler);
    delete window._acervoKeyHandler;
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

    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Acervo do Museu</h1>
      <p class="text-gray-300 max-w-3xl mx-auto px-4">
        Explore os componentes de hardware disponíveis no Museu do Hardware da
        Fatec. Cada peça conta uma parte da história da computação.
      </p>
    </div>

    <div class="mb-8 flex flex-col gap-4 px-4">
      <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
        <div class="relative inline-block w-full max-w-xs">
          <label for="category-filter" class="block text-sm font-medium text-gray-200 mb-2 text-center">
            Filtrar por Categoria
          </label>
          <select id="category-filter" v-model="selectedCategoria"
            class="block w-full px-4 py-3 pr-10 text-base border border-white/20 rounded-xl bg-black/30 backdrop-blur-md text-white shadow-lg cursor-pointer transition-all duration-200 hover:border-white/40 hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 appearance-none">
            <option v-for="categoria in categorias" :key="categoria" :value="categoria" class="bg-gray-900 text-white">
              {{ categoria }} ({{ categoriasComContagem[categoria] || 0 }})
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white mt-8">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        <div class="relative inline-block w-full max-w-xs">
          <label for="acervo-search-input" class="block text-sm font-medium text-gray-200 mb-2 text-center">
            Pesquisar
          </label>
          <div class="relative">
            <input id="acervo-search-input" v-model="searchQuery" type="text"
              placeholder="Buscar por nome ou descrição..."
              class="block w-full px-4 py-3 pl-11 pr-10 text-base border border-white/20 rounded-xl bg-black/30 backdrop-blur-md text-white placeholder-gray-400 shadow-lg transition-all duration-200 hover:border-white/40 hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60" />
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <button v-if="searchQuery" @click="searchQuery = ''"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Limpar busca">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-center items-center gap-2">
        <span class="text-sm text-gray-300">Visualização:</span>
        <div class="inline-flex rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm p-1">
          <button @click="viewMode = 'grid'" :class="[
            'px-4 py-2 rounded-md transition-all duration-200',
            viewMode === 'grid'
              ? 'bg-white/20 text-white'
              : 'text-gray-400 hover:text-white',
          ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
              </path>
            </svg>
          </button>
          <button @click="viewMode = 'list'" :class="[
            'px-4 py-2 rounded-md transition-all duration-200',
            viewMode === 'list'
              ? 'bg-white/20 text-white'
              : 'text-gray-400 hover:text-white',
          ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="searchQuery || selectedCategoria !== 'Todas'" class="mb-6 text-center">
      <p class="text-sm text-gray-300">
        Mostrando
        <span class="font-bold text-white">{{ filteredItems.length }}</span>
        {{ filteredItems.length === 1 ? "componente" : "componentes" }}
        <span v-if="searchQuery"> para "{{ searchQuery }}"</span>
      </p>
    </div>

    <section class="mb-8">
      <div class="hidden md:flex justify-center">
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
            <div class="grid grid-cols-1 gap-3 text-xs text-gray-300">
              <div class="flex items-center gap-2">
                <kbd class="px-2 py-1 bg-gray-700/50 rounded border border-gray-600 font-mono">Esc</kbd>
                <span>Fechar modal</span>
              </div>
              <div class="flex items-center gap-2">
                <kbd class="px-2 py-1 bg-gray-700/50 rounded border border-gray-600 font-mono">Ctrl+K</kbd>
                <span>Focar na busca</span>
              </div>
              <div class="flex items-center gap-2">
                <kbd class="px-2 py-1 bg-gray-700/50 rounded border border-gray-600 font-mono">Ctrl+L</kbd>
                <span>Limpar todos os filtros</span>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>

    <div v-if="filteredItems.length === 0" class="text-center py-20 px-4">
      <svg class="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 class="text-2xl font-bold text-white mb-2">
        Nenhum componente encontrado
      </h3>
      <p class="text-gray-400 mb-6">
        <span v-if="searchQuery">Não encontramos resultados para "{{ searchQuery }}"</span>
        <span v-else>Não há componentes nesta categoria</span>
      </p>
      <button @click="
        searchQuery = '';
      selectedCategoria = 'Todas';
      "
        class="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white transition-all duration-200">
        Limpar filtros
      </button>
    </div>

    <div v-if="viewMode === 'grid' && filteredItems.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12">
      <button v-for="(item, index) in filteredItems" :key="index" @click="openModal(item)"
        class="group bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-2xl hover:border-white/40 hover:bg-black/30 transition-all duration-300 cursor-pointer text-left">
        <div class="aspect-square w-full mb-4 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
          <img v-lazy="item.imagemConfig" :alt="item.nome" loading="lazy" decoding="async"
            class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
        </div>

        <div class="flex items-center justify-between mb-3">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
            :class="getCategoriaColor(item.categoria)">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd" />
            </svg>
            {{ item.categoria }}
          </span>
          <span v-if="item.anoAproximado" class="text-xs font-medium text-gray-400">
            ~{{ item.anoAproximado }}
          </span>
        </div>

        <h3 class="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
          {{ item.nome }}
        </h3>
        <p class="text-sm text-gray-300 line-clamp-3">
          {{ item.descricao }}
        </p>

        <div class="mt-4 flex items-center text-blue-400 text-sm font-medium">
          <span>Ver detalhes</span>
          <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </button>
    </div>

    <div v-if="viewMode === 'list' && filteredItems.length > 0" class="max-w-4xl mx-auto space-y-4 px-4 pb-12">
      <button v-for="(item, index) in filteredItems" :key="index" @click="openModal(item)"
        class="group w-full bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-2xl hover:border-white/40 hover:bg-black/30 transition-all duration-300 cursor-pointer text-left">
        <div class="flex gap-6 items-start">
          <div class="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
            <img v-lazy="item.imagemConfig" :alt="item.nome" loading="lazy" decoding="async"
              class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-2 gap-4">
              <h3 class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                {{ item.nome }}
              </h3>
              <span v-if="item.anoAproximado" class="flex-shrink-0 text-sm font-medium text-gray-400">
                ~{{ item.anoAproximado }}
              </span>
            </div>

            <div class="mb-3">
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                :class="getCategoriaColor(item.categoria)">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd" />
                </svg>
                {{ item.categoria }}
              </span>
            </div>

            <p class="text-sm text-gray-300 mb-3 line-clamp-2">
              {{ item.descricao }}
            </p>

            <div class="flex items-center text-blue-400 text-sm font-medium">
              <span>Ver detalhes</span>
              <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </button>
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
        class="modal-content relative mx-4 my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/20 bg-gray-900/90 p-6 text-gray-300 shadow-2xl backdrop-blur-lg sm:p-8 transition-all duration-300">
        <button @click="closeModal"
          class="absolute right-4 top-4 z-20 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Fechar modal">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div class="pr-12 mb-4">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
            {{ selectedItem.nome }}
          </h2>
          <div class="flex items-center gap-3">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white shadow-sm"
              :class="getCategoriaColor(selectedItem.categoria)">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd" />
              </svg>
              {{ selectedItem.categoria }}
            </span>
            <span v-if="selectedItem.anoAproximado" class="text-sm font-medium text-gray-400">
              Ano aproximado: {{ selectedItem.anoAproximado }}
            </span>
          </div>
        </div>

        <div class="mb-6 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center p-8">
          <img v-lazy="selectedItem.imagemModalConfig" :alt="selectedItem.nome" loading="lazy" decoding="async"
            class="max-h-[60vh] w-auto max-w-full object-contain" />
        </div>

        <div class="prose prose-invert max-w-none">
          <h3 class="text-xl font-semibold text-white mb-3">Descrição</h3>
          <p class="text-gray-300 leading-relaxed">
            {{ selectedItem.descricao }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
