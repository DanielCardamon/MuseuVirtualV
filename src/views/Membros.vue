<script setup>
import { computed } from "vue";

const members = [
  {
    name: "Daniel V. Cardamoni",
    role: "Cargo",
    image: "/images/daniel_profile.png",
    accent: "from-cyan-400/40 via-transparent to-emerald-500/10",
    socials: {
      github: "https://github.com/DanielCardamon",
      linkedin: "",
    },
  },
  {
    name: "Guilherme F. Santos",
    role: "Cargo",
    image: "https://placehold.co/400x400/e2e8f0/2d3748?text=G.S.",
    accent: "from-blue-400/40 via-transparent to-indigo-500/10",
    socials: {
      github: "",
      linkedin: "",
    },
  },
  {
    name: "Matheus A. Marti",
    role: "Cargo",
    image: "/images/matheus_profile.png",
    accent: "from-amber-400/40 via-transparent to-orange-500/10",
    socials: {
      github: "https://github.com/Matheus-Marti1",
      linkedin: "https://www.linkedin.com/in/matheusmarti",
    },
  },
  {
    name: "Jiulius Cesar P.B.S.",
    role: "Cargo",
    image: "/images/jiulius_profile.png",
    accent: "from-rose-400/40 via-transparent to-purple-500/10",
    socials: {
      github: "",
      linkedin: "",
    },
  },
  {
    name: "Luiz Guilherme B. Vergani",
    role: "Cargo",
    image: "/images/luiz_profile.png",
    accent: "from-teal-400/40 via-transparent to-sky-500/10",
    socials: {
      github: "",
      linkedin: "",
    },
  },
];

const supervisor = {
  name: "Luciano Francisco",
  role: "Supervisor de Projeto",
  image: "/images/luciano_profile.png",
  socials: {
    linkedin: "",
    lattes: "",
  },
};

const socialPlatforms = {
  github: {
    label: "GitHub",
    viewBox: "0 0 24 24",
    path: "M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.11.79-.25.79-.56v-2c-3.22.7-3.9-1.55-3.9-1.55-.53-1.35-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.8 2.74 1.28 3.41.98.11-.76.41-1.28.74-1.57-2.57-.3-5.28-1.3-5.28-5.77 0-1.28.46-2.33 1.21-3.15-.12-.3-.53-1.52.12-3.17 0 0 1-.33 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.53 3.3-1.2 3.3-1.2.65 1.65.24 2.87.12 3.17.76.82 1.21 1.87 1.21 3.15 0 4.48-2.71 5.47-5.3 5.76.42.37.79 1.1.79 2.22v3.29c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z",
  },
  linkedin: {
    label: "LinkedIn",
    viewBox: "0 0 24 24",
    path: "M20.45 20.45h-3.55v-5.3c0-1.27-.03-2.9-1.76-2.9-1.77 0-2.04 1.38-2.04 2.8v5.4H9.55V9h3.4v1.56h.05c.47-.9 1.6-1.85 3.29-1.85 3.53 0 4.18 2.32 4.18 5.34v6.4ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z",
  },
  lattes: {
    label: "Lattes",
    viewBox: "0 0 24 24",
    path: "M12 14l9-5-9-5-9 5 9 5zm7-2.24v3.81a2 2 0 01-1.02 1.76l-5 2.67a2 2 0 01-1.96 0l-5-2.67A2 2 0 015 15.57v-3.81l7 3.89 7-3.89z",
  },
};

const getSocialEntries = (socials = {}) =>
  Object.entries(socials)
    .filter(([key, url]) => Boolean(url) && Boolean(socialPlatforms[key]))
    .map(([key, url]) => ({ key, url, icon: socialPlatforms[key] }));

const supervisorSocialEntries = computed(() =>
  getSocialEntries(supervisor.socials)
);
</script>

<template>
  <div class="space-y-16">
    <section class="text-center max-w-3xl mx-auto space-y-4">
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight">Membros</h1>
      <p class="text-gray-300/90 text-lg">
        Conheça as pessoas por trás do Museu do Hardware.
      </p>
    </section>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
      <article
        v-for="member in members"
        :key="member.name"
        class="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-lg shadow-black/20 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl"
        :class="`bg-gradient-to-br ${member.accent}`">
        <div
          class="relative mb-5 h-36 w-36 overflow-hidden rounded-full border border-white/20 bg-black/30 shadow-lg shadow-black/40">
          <img
            :src="member.image"
            :alt="`Foto de ${member.name}`"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover" />
          <div
            class="absolute inset-0 rounded-full ring-4 ring-white/10 transition-all duration-500 group-hover:ring-white/40"></div>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-white">{{ member.name }}</h3>
          <p class="text-sm uppercase tracking-[0.2em] text-gray-300/80">
            {{ member.role }}
          </p>
        </div>

        <div class="mt-5 flex items-center justify-center gap-4 text-white/90">
          <a
            v-for="entry in getSocialEntries(member.socials)"
            :key="`${member.name}-${entry.key}`"
            :href="entry.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 transition duration-300 hover:border-white/40 hover:bg-white/20">
            <span class="sr-only">{{ member.name }} no {{ entry.icon.label }}</span>
            <svg
              :viewBox="entry.icon.viewBox"
              class="h-5 w-5"
              fill="currentColor"
              aria-hidden="true">
              <path :d="entry.icon.path"></path>
            </svg>
          </a>
        </div>
      </article>
    </div>

    <section class="pt-4">
      <div
        class="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-lg shadow-black/20 backdrop-blur-xl">
        <img
          :src="supervisor.image"
          :alt="`Foto de ${supervisor.name}`"
          loading="lazy"
          decoding="async"
          class="mx-auto h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-lg" />
        <h3 class="mt-6 text-2xl font-semibold text-white">
          {{ supervisor.name }}
        </h3>
        <p class="mt-2 text-sm uppercase tracking-[0.3em] text-gray-300/70">
          {{ supervisor.role }}
        </p>
        <div
          v-if="supervisorSocialEntries.length"
          class="mt-6 flex items-center justify-center gap-4 text-white/90">
          <a
            v-for="entry in supervisorSocialEntries"
            :key="`supervisor-${entry.key}`"
            :href="entry.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 transition duration-300 hover:border-white/40 hover:bg-white/20">
            <span class="sr-only">
              {{ supervisor.name }} no {{ entry.icon.label }}
            </span>
            <svg
              :viewBox="entry.icon.viewBox"
              class="h-5 w-5"
              fill="currentColor"
              aria-hidden="true">
              <path :d="entry.icon.path"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
