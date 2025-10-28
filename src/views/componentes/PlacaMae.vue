<script setup>
import { useLazyImage } from "../../composables/useLazyImage.js";

const { vLazy, createResponsiveImageConfig } = useLazyImage();

const COMPONENT_IMAGE_SIZES =
    "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 40vw";

const mainboardImage = createResponsiveImageConfig(
    "/images/componentes/mainboard_labeled.svg",
    COMPONENT_IMAGE_SIZES,
);

const socketImage = createResponsiveImageConfig(
    "/images/componentes/Socket.jpg",
    COMPONENT_IMAGE_SIZES,
);

const tpmImage = createResponsiveImageConfig(
    "/images/componentes/TPM.png",
    COMPONENT_IMAGE_SIZES,
);
</script>

<template>
    <div>
        <div
            class="w-full max-w-6xl mx-auto bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-8 md:p-12 shadow-lg"
        >
            <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div>
                    <img
                        v-lazy="mainboardImage"
                        alt="Diagrama de uma placa mãe com seus componentes"
                        class="w-full h-auto object-contain rounded-lg shadow-lg border border-white/10"
                    />
                    <p class="text-xs italic text-gray-300 mt-2 break-all">
                        <a
                            href="https://pt.wikipedia.org/wiki/Ficheiro:LGA_775_Socket_T.jpg"
                        >
                            por user:Moxfyre, labeled diagram of ASRock K7VT4A
                            Pro motherboard (labels in English)</a
                        >,
                        <a
                            href="https://creativecommons.org/licenses/by-sa/2.5/deed.en"
                            >CC BY-SA 2.5</a
                        >, via Wikimedia Commons
                    </p>
                </div>
                <div class="text-justify min-w-0">
                    <h1 class="text-3xl md:text-4xl font-bold mb-4">
                        O que é a Placa Mãe?
                    </h1>
                    <p class="text-base md:text-lg leading-relaxed mb-4">
                        Embora seja conhecida por vários nomes, como placa-mãe,
                        placa de sistema e, às vezes, carinhosamente, mobo,
                        placa-mãe é o termo mais comum para a placa de circuito
                        impresso que mantém todos os componentes do computador
                        em um só lugar, com sua principal função ser dar suporte
                        a todos os componentes que formam o computador. Além de
                        mantê-los, a placa-mãe permite que os componentes se
                        comuniquem e lhes dá vida ao encaminhar a energia da
                        unidade de fonte de alimentação (PSU). Algumas
                        placas-mãe também agregam valor com áudio, vídeo, WiFi,
                        LAN e outros recursos integrados.
                    </p>
                    <p class="text-xs italic text-gray-300 mt-2 break-all">
                        Fonte: Malwarebytes -
                        https://www.malwarebytes.com/pt-br/cybersecurity/computer/what-is-a-motherboard
                    </p>
                    <p class="text-base md:text-lg leading-relaxed mb-4">
                        Além disso, a placa mãe também gerencia a entrada e
                        saída de dados dos periféricos, como teclado, mouse,
                        monitor e portas USB, garantindo que todas as partes do
                        sistema funcionem em conjunto.
                    </p>
                    <p class="text-base md:text-lg leading-relaxed mb-2">
                        Os componentes presentes na placa mãe são diversos,
                        alguns exemplos são:
                    </p>
                    <ul
                        class="list-disc list-inside space-y-1 text-base md:text-lg mb-4"
                    >
                        <li>Socket do processador</li>
                        <li>
                            Chipset (Northbridge e Southbridge ou controladores
                            modernos)
                        </li>
                        <li>
                            Slots de expansão (PCI, PCIe, AGP em modelos
                            antigos)
                        </li>
                        <li>Conectores de energia (ATX e EPS)</li>
                        <li>Conectores SATA</li>
                        <li>BIOS/UEFI (chip de firmware)</li>
                    </ul>
                    <p class="text-base md:text-lg leading-relaxed">
                        Em resumo, a placa mãe é o "coração" do computador,
                        interligando cada peça para que o sistema funcione de
                        forma integrada.
                    </p>
                </div>
            </div>

            <hr class="my-8 md:my-12 border-white/20" />

            <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div class="text-justify min-w-0">
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">
                        Socket do processador
                    </h2>
                    <p class="text-base md:text-lg leading-relaxed">
                        O socket é o conector físico onde o processador (CPU) é
                        instalado. Ele contém centenas ou até milhares de pinos
                        ou contatos metálicos, responsáveis por transmitir
                        energia e dados entre a CPU e a placa-mãe. Existem
                        diferentes tipos de sockets (como LGA, PGA ou BGA), e
                        cada um é compatível apenas com determinados modelos de
                        processadores. O design do socket também garante a
                        correta dissipação de calor através do cooler.
                    </p>
                </div>
                <div>
                    <img
                        v-lazy="socketImage"
                        alt="Close-up de um socket de processador em uma placa-mãe"
                        class="w-full h-auto object-contain rounded-lg shadow-lg border border-white/10"
                    />
                    <p class="text-xs italic text-gray-300 mt-2 break-all">
                        <a
                            href="https://pt.wikipedia.org/wiki/Ficheiro:LGA_775_Socket_T.jpg"
                        >
                            por JulianVilla26, Socket 775 on a ASRock N73PV-S
                            motherboard</a
                        >,
                        <a
                            href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt"
                            >CC BY-SA 4.0</a
                        >, via Wikimedia Commons
                    </p>
                </div>
            </div>

            <hr class="my-8 md:my-12 border-white/20" />

            <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div>
                    <img
                        v-lazy="tpmImage"
                        alt="Close-up de um TPM"
                        class="w-full h-auto object-contain rounded-lg shadow-lg border border-white/10"
                    />
                    <p class="text-xs italic text-gray-300 mt-2 break-all">
                        Imagem retirada da internet: gigabyte.com
                    </p>
                </div>
                <div class="text-justify min-w-0">
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">
                        O que é TPM 2.0 em placas-mãe?
                    </h2>
                    <p class="text-base md:text-lg leading-relaxed">
                        Um TPM (Trusted Platform Module), ou módulo de
                        plataforma confiável, é uma tecnologia de segurança
                        física ou incorporada (microcontrolador) que reside na
                        placa-mãe de um computador ou em seu processador. Os
                        TPMs usam criptografia para ajudar a armazenar com
                        segurança informações essenciais e críticas em PCs para
                        permitir a autenticação de plataforma. Eles armazenam
                        uma variedade de informações confidenciais — como
                        credenciais de usuário, senhas, impressões digitais,
                        certificados, chaves de criptografia ou outra
                        documentação importante do consumidor — atrás de uma
                        barreira de hardware para mantê-las protegidas de
                        ataques externos.
                    </p>
                    <p class="text-base md:text-lg leading-relaxed">
                        As implementações do TPM são normalmente projetadas para
                        atender a um padrão internacional criado pelo Trusted
                        Computing Group (TCG) . O TCG é um consórcio da
                        indústria de computadores que criou o padrão TPM
                        original, que mais tarde foi adotado pela Organização
                        Internacional para Padronização (ISO) e pela Comissão
                        Eletrotécnica Internacional (IEC) e posteriormente
                        denominado ISO/IEC 11889 .
                    </p>
                    <p class="text-xs italic text-gray-300 mt-2 break-all">
                        Fonte: Intel -
                        https://www.intel.com/content/www/us/en/learn/what-is-a-trusted-platform-module.html
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
