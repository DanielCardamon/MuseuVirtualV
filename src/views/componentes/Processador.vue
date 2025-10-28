<script setup>
import { useLazyImage } from "../../composables/useLazyImage.js";

const { vLazy, createResponsiveImageConfig } = useLazyImage();

const COMPONENT_IMAGE_SIZES =
    "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 40vw";

const processadorImage = createResponsiveImageConfig(
    "/images/componentes/processador.png",
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
                    v-lazy="processadorImage"
                    alt="Ilustração de uma CPU"
                    class="w-full h-auto rounded-lg shadow-lg border border-white/10"
                />
                <p class="text-xs italic text-gray-300 mt-2">
                    Imagem retirada da internet: hardware.com.br
                </p>
            </div>
            <div class="text-justify min-w-0">
                <h1 class="text-3xl md:text-4xl font-bold mb-4">
                    O que é o processador?
                </h1>
                <p class="text-base md:text-lg leading-relaxed mb-4">
                    Os processadores são um dos principais componentes de um
                    computador, ou qualquer outro dispositivo eletrônico e são
                    definidos por suas propriedades, incluindo litografia,
                    quantidade de núcleos, velocidade do clock, arquitetura e
                    conjunto de instruções. A seguir, entenda mais sobre os
                    principais tipos de processadores presentes em eletrônicos
                    de consumo, os atributos em comum e suas respectivas
                    funções.
                </p>
                <p class="text-base md:text-lg leading-relaxed mb-4">
                    Processadores servem para controlar funções e executar
                    operações em smartphones, PCs, câmeras e outros eletrônicos.
                    Chips especializados, como GPUs e NPUs, podem realizar
                    cálculos, processar gráficos, treinar inteligências
                    artificiais, entre outras tarefas, enquanto uma CPU é um
                    processador de uso geral.
                </p>
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    Quais são os principais tipos de processadores?
                </h2>
                <p class="text-base md:text-lg leading-relaxed mb-2">
                    CPU (Unidade Central de Processamento), GPU (Unidade de
                    Processamento Gráfico), NPU (Unidade de Processamento
                    Neural) e ISP (Processador de Sinal de Imagem) são alguns
                    dos principais tipos de processadores encontrados em
                    celulares, câmeras e computadores.
                </p>
                <p class="text-xs italic text-gray-300 mt-2 break-all">
                    Fonte: IBM -
                    https://www.ibm.com/br-pt/think/topics/central-processing-unit
                </p>
            </div>
        </div>
    </div>
</template>
