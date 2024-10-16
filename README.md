# CDN PostMessage

Este repositório contém uma biblioteca JavaScript para comunicação entre a página principal e um iframe utilizando o método `postMessage`. A biblioteca foi projetada para ser carregada via CDN, permitindo a integração fácil com qualquer site que utilize iframes e precise enviar/receber dados de forma segura e eficiente.

## Como usar

Para utilizar a biblioteca, adicione o seguinte código no seu HTML:

```html
<script
  defer
  async
  onload="initTraining({totalClicks: 5, totalVideos: 2})"
  src="https://cdn.jsdelivr.net/gh/agnovi/cdn-postmessage/config.js"
></script>
