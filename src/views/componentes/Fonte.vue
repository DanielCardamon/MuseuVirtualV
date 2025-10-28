<template>
  <div
    class="w-full max-w-6xl mx-auto bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-8 md:p-12 shadow-lg">
    <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
      <div>
        <img src="/images/componentes/PSU-Open.jpg"
          alt="Imagem de uma Fonte de alimentacao" class="w-full h-auto rounded-lg shadow-lg border border-white/10" />
        <p class="text-xs italic text-gray-300 mt-2">
          <a href="https://pt.wikipedia.org/wiki/Ficheiro:LGA_775_Socket_T.jpg"> por mboverload,This is a Power Supply Unit, or PSU, for an ATA computer. The top cover has been removed to show the internals</a>, domínio público, via Wikimedia Commons
        </p>
      </div>
      <div class="text-justify min-w-0">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">
          Fonte de alimentação do PC
        </h1>
        <p class="text-base md:text-lg leading-relaxed mb-4">
          A fonte de alimentação, ou PSU (Power Supply Unit), é o componente responsável por converter a energia da
          tomada (AC) em energia utilizável pelos componentes do computador (DC). Ela alimenta processador,
          placa-mãe, memória, placa de vídeo e discos, sendo essencial para o funcionamento seguro e estável do
          sistema. Sem essa conversão adequada, os componentes internos poderiam sofrer danos sérios devido à tensão
          inadequada.
        </p>
        <p class="text-xs italic text-gray-300 mt-2 break-all">
          Fonte: Intel - https://www.intel.com.br/content/www/br/pt/gaming/resources/power-supply.html
        </p>
      </div>
    </div>

    <hr class="my-8 md:my-12 border-white/20" />

    <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
      <div class="text-justify min-w-0">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">
          Cabos e conectores
        </h2>
        <p class="text-base md:text-lg leading-relaxed">
          As fontes de alimentação contam com diferentes conectores para distribuir energia. O principal é o cabo de
          24 pinos que conecta a placa-mãe, responsável por fornecer energia para o chipset e portas PCI. Há ainda o
          cabo de 4 ou 8 pinos que alimenta diretamente o processador (CPU), essencial para modelos mais potentes
          que exigem maior consumo energético.
        </p>
        <p class="text-base md:text-lg leading-relaxed">
          Outros conectores importantes são os de 6 ou 8 pinos PCIe, usados para alimentar placas de vídeo; o
          conector SATA, que alimenta HDs, SSDs e controladores RGB; e o antigo conector Molex, presente em
          computadores antigos.
        </p>
        <p class="text-xs italic text-gray-300 mt-2 break-all">
          Fonte: Intel - https://www.intel.com.br/content/www/br/pt/gaming/resources/power-supply.html
        </p>
      </div>
      <div>
        <img
          src="/images/componentes/conectores.png"
          alt="Exemplos de cabos e conectores" class="w-full h-auto rounded-lg shadow-lg border border-white/10" />
        <p class="text-xs italic text-gray-300 mt-2">
          Imagem retirada da internet: www.corsair.com
        </p>
      </div>
    </div>
  </div>
</template>