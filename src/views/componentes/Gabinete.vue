<script setup>
import { useLazyImage } from "../../composables/useLazyImage.js";

const { vLazy, createResponsiveImageConfig } = useLazyImage();

const COMPONENT_IMAGE_SIZES =
    "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 40vw";

const gabineteImage = createResponsiveImageConfig(
    "/images/componentes/gabinete.jpg",
    COMPONENT_IMAGE_SIZES,
);
</script>

<template>
    <div
        class="w-full max-w-6xl mx-auto bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-8 md:p-12 shadow-lg"
    >
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div class="min-w-0">
                <img
                    v-lazy="gabineteImage"
                    alt="Imagem de gabinetes"
                    class="w-full h-auto object-contain rounded-lg shadow-lg border border-white/10"
                />
                <p class="text-xs italic text-gray-300 mt-2 break-all">
                    Imagem retirada da internet: intel.com.br
                </p>
            </div>
            <div class="text-justify min-w-0">
                <h1 class="text-3xl md:text-4xl font-bold mb-4">Gabinete</h1>
                <p class="text-base md:text-lg leading-relaxed mb-4">
                    Um gabinete de computador, também conhecido como case,
                    caixa, chassis ou carcaça, é o compartimento que contém a
                    maioria dos componentes de um computador. O gabinete pode
                    ser de 2 modelos, de acordo com a sua posição. Torre, são os
                    que ficam na posição vertical e mesa, os que ficam na
                    horizontal. A função do Gabinete é proteger os componentes
                    de sujeira e umidade, e também evitar superaquecimento dos
                    componentes.
                </p>
                <p class="text-xs italic text-gray-300 mt-2 break-all">
                    Fonte: Câmara Municipal de Laranjeiras do Sul -
                    https://cmls.pr.gov.br/upload_indicacoes/8e9eb15d2f5366bb42184b05007cbbae.pdf
                </p>
            </div>
        </div>
    </div>
</template>
