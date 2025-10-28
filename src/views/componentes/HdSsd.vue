<script setup>
import { useLazyImage } from "../../composables/useLazyImage.js";

const { vLazy, createResponsiveImageConfig } = useLazyImage();

const COMPONENT_IMAGE_SIZES =
    "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 40vw";

const ssdHdImage = createResponsiveImageConfig(
    "/images/componentes/ssdvhd.webp",
    COMPONENT_IMAGE_SIZES,
);
</script>

<template>
    <div
        class="w-full max-w-6xl mx-auto bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-8 md:p-12 shadow-lg"
    >
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
                <img
                    v-lazy="ssdHdImage"
                    alt="Ilustração de um HD e SSD abertos"
                    class="w-full h-auto rounded-lg shadow-lg border border-white/10"
                />
                <p class="text-xs italic text-gray-300 mt-2">
                    Imagem retirada da internet: techtudo.com.br
                </p>
            </div>
            <div class="text-justify min-w-0">
                <h1 class="text-3xl md:text-4xl font-bold mb-4">
                    Qual é a diferença entre uma SSD e um disco rígido?
                </h1>
                <p class="text-base md:text-lg leading-relaxed mb-4">
                    Unidades de estado sólido (SSD) e unidades de disco rígido
                    (HDD) são dispositivos de armazenamento de dados. As SSDs
                    armazenam dados na memória flash, enquanto as HDDs armazenam
                    dados em discos magnéticos. As SSDs são uma tecnologia mais
                    recente que usa as propriedades físicas e químicas do chip
                    para oferecer mais volume, velocidade e eficiência do
                    armazenamento. No entanto, as HDDs são uma opção econômica
                    se você precisar de acesso pouco frequente aos dados em
                    blocos de 1 MB ou mais por vez.
                </p>
                <p class="text-xs italic text-gray-300 mt-2">
                    Fonte: AMAZON -
                    https://aws.amazon.com/pt/compare/the-difference-between-ssd-hard-drive/
                </p>
            </div>
        </div>
    </div>
</template>
