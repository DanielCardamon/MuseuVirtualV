<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
import { RouterLink, useRoute } from "vue-router";

const isComponentesDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isMobileComponentesExpanded = ref(false);
const route = useRoute();
const componentesMenuRef = ref(null);
const componentesButtonRef = ref(null);
const isScrolled = ref(false);
const dropdownPosition = ref({ top: 0, right: 0 });

const handleClickOutside = (event) => {
  if (
    isComponentesDropdownOpen.value &&
    componentesMenuRef.value &&
    !componentesMenuRef.value.contains(event.target)
  ) {
    isComponentesDropdownOpen.value = false;
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
  if (isComponentesDropdownOpen.value) {
    updateDropdownPosition();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", updateDropdownPosition, { passive: true });
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", updateDropdownPosition);
});

const isComponentesActive = computed(() => {
  return route.path.startsWith("/componentes/");
});

const updateDropdownPosition = () => {
  if (componentesButtonRef.value) {
    const rect = componentesButtonRef.value.getBoundingClientRect();
    dropdownPosition.value = {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    };
  }
};

const toggleComponentesDropdown = () => {
  isComponentesDropdownOpen.value = !isComponentesDropdownOpen.value;
  if (isComponentesDropdownOpen.value) {
    nextTick(updateDropdownPosition);
  }
};

const closeComponentesDropdown = () => {
  isComponentesDropdownOpen.value = false;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  isMobileComponentesExpanded.value = false;
};

const toggleMobileComponentes = () => {
  isMobileComponentesExpanded.value = !isMobileComponentesExpanded.value;
};
</script>

<template>
  <header
    class="header-with-blur-bleed fixed top-0 left-0 right-0 w-full py-4 px-6 md:px-14 z-50 transition-all duration-300"
    :class="
      isScrolled
        ? 'bg-black/50 backdrop-blur-lg header-scrolled'
        : 'bg-transparent'
    ">
    <nav class="flex justify-between items-center">
      <div class="flex items-center">
        <router-link to="/">
          <img
            src="/images/logo_fatec.png"
            alt="Logo da Fatec"
            class="h-12 md:h-14 w-auto" />
        </router-link>
      </div>

      <ul class="hidden md:flex items-center space-x-8 text-lg">
        <li>
          <router-link
            to="/timeline"
            class="nav-link px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm"
            active-class="bg-white/20 backdrop-blur-md font-semibold border border-white/30">
            Linha do Tempo
          </router-link>
        </li>
        <li class="relative" ref="componentesMenuRef">
          <button
            ref="componentesButtonRef"
            @click="toggleComponentesDropdown"
            :class="{
              'bg-white/20 backdrop-blur-md font-semibold border border-white/30':
                isComponentesActive,
            }"
            class="nav-link px-4 py-2 rounded-lg hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-300 flex items-center gap-1.5 cursor-pointer">
            Componentes
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transition-transform duration-200"
              :class="{ 'rotate-180': isComponentesDropdownOpen }"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </li>
        <li>
          <router-link
            to="/acervo"
            class="nav-link px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm"
            active-class="bg-white/20 backdrop-blur-md font-semibold border border-white/30">
            Acervo
          </router-link>
        </li>
        <li>
          <router-link
            to="/membros"
            class="nav-link px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm"
            active-class="bg-white/20 backdrop-blur-md font-semibold border border-white/30">
            Membros
          </router-link>
        </li>
      </ul>

      <button
        @click="isMobileMenuOpen = true"
        class="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-white/10 transition-all duration-300">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </nav>
  </header>

  <transition name="overlay-fade">
    <div
      v-if="isMobileMenuOpen"
      @click="closeMobileMenu"
      class="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"></div>
  </transition>

  <transition name="drawer-slide">
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-black/90 backdrop-blur-xl border-l border-white/20 z-[70] shadow-2xl overflow-y-auto">
      <div class="flex flex-col h-full">
        <div
          class="flex items-center justify-between p-6 border-b border-white/20">
          <h2 class="text-xl font-bold text-white">Menu</h2>
          <button
            @click="closeMobileMenu"
            class="text-white focus:outline-none p-2 rounded-lg hover:bg-white/10 transition-all duration-300">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav class="flex-1 p-4 space-y-2">
          <router-link
            to="/timeline"
            @click="closeMobileMenu"
            class="block px-4 py-3 rounded-lg text-white transition-all duration-300 hover:bg-white/10"
            active-class="bg-white/20 font-semibold border border-white/30">
            <div class="flex items-center gap-3">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Linha do Tempo</span>
            </div>
          </router-link>

          <div class="space-y-1">
            <button
              @click="toggleMobileComponentes"
              :class="{
                'bg-white/20 font-semibold border border-white/30':
                  isComponentesActive,
              }"
              class="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 hover:bg-white/10 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <span>Componentes</span>
              </div>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isMobileComponentesExpanded }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="accordion-slide">
              <div v-if="isMobileComponentesExpanded" class="pl-4 space-y-1">
                <router-link
                  to="/componentes/placa-mae"
                  @click="closeMobileMenu"
                  active-class="bg-white/20 font-medium"
                  class="block px-4 py-2 rounded-lg text-white text-sm transition-all duration-200 hover:bg-white/10 border-l-2 border-white/20">
                  Placa-Mãe
                </router-link>
                <router-link
                  to="/componentes/processador"
                  @click="closeMobileMenu"
                  active-class="bg-white/20 font-medium"
                  class="block px-4 py-2 rounded-lg text-white text-sm transition-all duration-200 hover:bg-white/10 border-l-2 border-white/20">
                  Processador
                </router-link>
                <router-link
                  to="/componentes/ram"
                  @click="closeMobileMenu"
                  active-class="bg-white/20 font-medium"
                  class="block px-4 py-2 rounded-lg text-white text-sm transition-all duration-200 hover:bg-white/10 border-l-2 border-white/20">
                  RAM
                </router-link>
                <router-link
                  to="/componentes/hd-ssd"
                  @click="closeMobileMenu"
                  active-class="bg-white/20 font-medium"
                  class="block px-4 py-2 rounded-lg text-white text-sm transition-all duration-200 hover:bg-white/10 border-l-2 border-white/20">
                  HDD/SSD
                </router-link>
                <router-link
                  to="/componentes/fonte"
                  @click="closeMobileMenu"
                  active-class="bg-white/20 font-medium"
                  class="block px-4 py-2 rounded-lg text-white text-sm transition-all duration-200 hover:bg-white/10 border-l-2 border-white/20">
                  Fonte
                </router-link>
                <router-link
                  to="/componentes/gabinete"
                  @click="closeMobileMenu"
                  active-class="bg-white/20 font-medium"
                  class="block px-4 py-2 rounded-lg text-white text-sm transition-all duration-200 hover:bg-white/10 border-l-2 border-white/20">
                  Gabinete
                </router-link>
                <router-link
                  to="/componentes/midia"
                  @click="closeMobileMenu"
                  active-class="bg-white/20 font-medium"
                  class="block px-4 py-2 rounded-lg text-white text-sm transition-all duration-200 hover:bg-white/10 border-l-2 border-white/20">
                  Mídias
                </router-link>
                <router-link
                  to="/componentes/perifericos"
                  @click="closeMobileMenu"
                  active-class="bg-white/20 font-medium"
                  class="block px-4 py-2 rounded-lg text-white text-sm transition-all duration-200 hover:bg-white/10 border-l-2 border-white/20">
                  Periféricos
                </router-link>
              </div>
            </transition>
          </div>

          <router-link
            to="/acervo"
            @click="closeMobileMenu"
            class="block px-4 py-3 rounded-lg text-white transition-all duration-300 hover:bg-white/10"
            active-class="bg-white/20 font-semibold border border-white/30">
            <div class="flex items-center gap-3">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Acervo</span>
            </div>
          </router-link>

          <router-link
            to="/membros"
            @click="closeMobileMenu"
            class="block px-4 py-3 rounded-lg text-white transition-all duration-300 hover:bg-white/10"
            active-class="bg-white/20 font-semibold border border-white/30">
            <div class="flex items-center gap-3">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Membros</span>
            </div>
          </router-link>
        </nav>
      </div>
    </div>
  </transition>

  <teleport to="body">
    <transition name="dropdown-fade">
      <div
        v-if="isComponentesDropdownOpen"
        id="componentesDropdown"
        class="fixed bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl w-56 shadow-2xl overflow-hidden z-[60]"
        :style="{
          top: `${dropdownPosition.top}px`,
          right: `${dropdownPosition.right}px`,
        }">
        <ul class="text-base">
          <li>
            <router-link
              to="/componentes/placa-mae"
              @click="closeComponentesDropdown"
              active-class="bg-white/20 font-medium"
              class="nav-component-link block py-2.5 px-4 hover:bg-white/10 transition-all duration-200 border-b border-white/5 last:border-0">
              Placa-Mãe
            </router-link>
          </li>
          <li>
            <router-link
              to="/componentes/processador"
              @click="closeComponentesDropdown"
              active-class="bg-white/20 font-medium"
              class="nav-component-link block py-2.5 px-4 hover:bg-white/10 transition-all duration-200 border-b border-white/5 last:border-0">
              Processador
            </router-link>
          </li>
          <li>
            <router-link
              to="/componentes/ram"
              @click="closeComponentesDropdown"
              active-class="bg-white/20 font-medium"
              class="nav-component-link block py-2.5 px-4 hover:bg-white/10 transition-all duration-200 border-b border-white/5 last:border-0">
              RAM
            </router-link>
          </li>
          <li>
            <router-link
              to="/componentes/hd-ssd"
              @click="closeComponentesDropdown"
              active-class="bg-white/20 font-medium"
              class="nav-component-link block py-2.5 px-4 hover:bg-white/10 transition-all duration-200 border-b border-white/5 last:border-0">
              HDD/SSD
            </router-link>
          </li>
          <li>
            <router-link
              to="/componentes/fonte"
              @click="closeComponentesDropdown"
              active-class="bg-white/20 font-medium"
              class="nav-component-link block py-2.5 px-4 hover:bg-white/10 transition-all duration-200 border-b border-white/5 last:border-0">
              Fonte
            </router-link>
          </li>
          <li>
            <router-link
              to="/componentes/gabinete"
              @click="closeComponentesDropdown"
              active-class="bg-white/20 font-medium"
              class="nav-component-link block py-2.5 px-4 hover:bg-white/10 transition-all duration-200 border-b border-white/5 last:border-0">
              Gabinete
            </router-link>
          </li>
          <li>
            <router-link
              to="/componentes/midia"
              @click="closeComponentesDropdown"
              active-class="bg-white/20 font-medium"
              class="nav-component-link block py-2.5 px-4 hover:bg-white/10 transition-all duration-200 border-b border-white/5 last:border-0">
              Mídias
            </router-link>
          </li>
          <li>
            <router-link
              to="/componentes/perifericos"
              @click="closeComponentesDropdown"
              active-class="bg-white/20 font-medium"
              class="nav-component-link block py-2.5 px-4 hover:bg-white/10 transition-all duration-200">
              Periféricos
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </teleport>
</template>
