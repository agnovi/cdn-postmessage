# CDN PostMessage

Este repositório contém o código necessário para comunicação entre iframes utilizando `postMessage`. Para utilizar o código, basta adicionar o seguinte script no seu HTML:

```html
<script
  defer
  async
  onload="initTraining({totalClicks: 5, totalVideos: 2})"
  src="https://cdn.jsdelivr.net/gh/agnovi/cdn-postmessage/config.js"
></script>
