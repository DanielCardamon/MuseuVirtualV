<script setup>
import { useLazyImage } from "../../composables/useLazyImage.js";

const { vLazy, createResponsiveImageConfig } = useLazyImage();

const COMPONENT_IMAGE_SIZES =
    "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 40vw";

const perifericosImage = createResponsiveImageConfig(
    "/images/componentes/perifericos.jpeg",
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
                    v-lazy="perifericosImage"
                    alt="Imagem de uma Fonte de alimentacao"
                    class="w-full h-auto rounded-lg shadow-lg border border-white/10"
                />
                <p class="text-xs italic text-gray-300 mt-2 break-all">
                    Imagem retirada da internet: wiki.sj.ifsc.edu.br
                </p>
            </div>
            <div class="text-justify min-w-0">
                <h1 class="text-3xl md:text-4xl font-bold mb-4">
                    O que é periférico de computador e por que é importante?
                </h1>
                <p class="text-base md:text-lg leading-relaxed mb-4">
                    Os dispositivos de entrada e saída (E/S) ou input/output (I
                    /O), ou ainda periféricos são aqueles que permitem a
                    interação entre processador e usuário, ou entre processador
                    e processador. Eles se enquadram dentro da denominada
                    Arquitetura de Von Neumann, que explica as principais partes
                    de um computador.
                </p>
                <p class="text-base md:text-lg leading-relaxed mb-4">
                    Desde o início da Informática, inúmeros dispositivos
                    periféricos foram desenvolvidos. E inúmeros não são mais
                    utilizados. Os dispositivos de entrada codificam a
                    informação que entra para o sistema binário, de forma que
                    possa ser processada pelo computador. Já os dispositivos de
                    saída decodificam os dados binários em informação que pode
                    ser compreendida pelo usuário, ou transmitida a outros
                    sistemas. Há dispositivos que funcionam tanto para entrada
                    como para saída de dados, como o fax-modem. Muitos autores
                    consideram memórias e drivers de memória também como
                    dispositivos de entrada e saída.
                </p>
                <p class="text-xs italic text-gray-300 mt-2 break-all">
                    Fonte: IFSC do Campus São José -
                    https://wiki.sj.ifsc.edu.br/index.php/MI1022806_2020_1_AULA10
                </p>
            </div>
        </div>

        <hr class="my-8 md:my-12 border-white/20" />

        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div class="text-justify min-w-0">
                <p class="text-base md:text-lg leading-relaxed">
                    Os dispositivos de entrada mais conhecidos são:
                </p>
                <ul
                    class="list-disc list-inside space-y-1 text-base md:text-lg mb-4"
                >
                    <li>teclado,</li>
                    <li>mouse,</li>
                    <li>microfone,</li>
                    <li>câmera digital,</li>
                    <li>webcam,</li>
                    <li>scanner,</li>
                    <li>joystick,</li>
                    <li>mesa digitalizadora,</li>
                    <li>leitor de código de barras,</li>
                    <li>sensores de movimento,</li>
                    <li>touchpad,</li>
                    <li>etc.</li>
                </ul>
            </div>
            <div class="text-justify min-w-0">
                <p class="text-base md:text-lg leading-relaxed">
                    Os dispositivos de saída mais conhecidos são:
                </p>
                <ul
                    class="list-disc list-inside space-y-1 text-base md:text-lg mb-4"
                >
                    <li>monitor,</li>
                    <li>alto-falantes,</li>
                    <li>impressora,</li>
                    <li>placa de vídeo,</li>
                    <li>placa de som,</li>
                    <li>plotter,</li>
                    <li>fax,</li>
                    <li>óculos para realidade virtual,</li>
                    <li>etc.</li>
                </ul>
                <p class="text-base md:text-lg leading-relaxed">
                    Outros dispositivos que permitem a interação com outras
                    máquinas:
                </p>
                <ul
                    class="list-disc list-inside space-y-1 text-base md:text-lg mb-4"
                >
                    <li>placa de rede,</li>
                    <li>entradas de USB,</li>
                    <li>roteador,</li>
                    <li>etc.</li>
                </ul>
                <p class="text-base md:text-lg leading-relaxed">
                    E existem periféricos muito menos conhecidos, normalmente
                    empregados em projetos de mais baixo nível, dedicados e/ou
                    microcontrolados:
                </p>
                <ul
                    class="list-disc list-inside space-y-1 text-base md:text-lg mb-4"
                >
                    <li>sensores para biomedicina,</li>
                    <li>atuadores para biomedicina,</li>
                    <li>Motores de Passo,</li>
                    <li>Fotocélulas,</li>
                    <li>Termostatos,</li>
                    <li>braços robóticos,</li>
                    <li>etc.</li>
                </ul>
            </div>
        </div>
    </div>
</template>
