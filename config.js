// Version: 1.0
function initTraining ({totalClicks, totalVideos}) {
  function sendMessageToWrapper(message) {
      if (window.parent) {
          window.parent.postMessage(message, '*');
      }
  }

  // Função que inicializa o processo, chamada pelo HTML
  function iniciarAtividade () {
      // Enviar a mensagem inicial para o wrapper com os valores definidos pelo HTML
      sendMessageToWrapper({
          type: 'activity',
          totalClicks,
          totalVideos
      });

      // Adicionar a função padrão a todos os botões
      let buttons = document.querySelectorAll('button');
      buttons.forEach(function(button) {
          button.addEventListener('click', function() {
              sendMessageToWrapper({
                  type: 'button',
                  id: button.id,
                  clicked: true
              });
          });
      });

      // Monitorar o vídeo (se necessário)
      monitorVideo();
  };

  // Função para monitorar o vídeo e enviar o estado ao wrapper (opcional)
  function monitorVideo() {
      // Verificar se há um vídeo diretamente na página
      let videoElement = document.querySelector('video');
      if (videoElement) {
          videoElement.addEventListener('ended', function() {
              sendMessageToWrapper({
                  type: 'video',
                  state: 'ended'
              });
          });
      } else {
          // Tentar buscar o vídeo dentro de um iframe (opcional)
          let iframeElement = document.querySelector('iframe');
          if (iframeElement) {
              iframeElement.onload = function() {
                  let iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow.document;
                  let iframeVideo = iframeDoc.querySelector('video');
                  if (iframeVideo) {
                      iframeVideo.addEventListener('ended', function() {
                          sendMessageToWrapper({
                              type: 'video',
                              state: 'ended'
                          });
                      });
                  }
              };
          }
      }
  }

  
  iniciarAtividade()
}

window.initTraining = initTraining
