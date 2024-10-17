// Version: 1.2
function initTraining({ totalClicks, totalVideos }) {
    function sendMessageToWrapper(message) {
      if (window.parent) {
        window.parent.postMessage(message, '*');
      }
    }
  
    // Função que inicializa o processo, chamada pelo HTML
    function iniciarAtividade() {
      // Enviar a mensagem inicial para o wrapper com os valores definidos pelo HTML
      sendMessageToWrapper({
        type: 'activity',
        totalClicks,
        totalVideos,
      });
  
      // Adicionar a função padrão a todos os botões
      let buttons = document.querySelectorAll('button');
      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          sendMessageToWrapper({
            type: 'button',
            id: button.id,
            clicked: true,
          });
        });
      });
  
      // Monitorar o vídeo (se necessário)
      monitorVideo();
      monitorYoutubeVideo();
    }
  
    // Função para monitorar o vídeo e enviar o estado ao wrapper (opcional)
    function monitorVideo() {
      // Verificar se há um vídeo diretamente na página
      let videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.addEventListener('ended', function () {
          sendMessageToWrapper({
            type: 'video',
            state: 'ended',
          });
        });
      }
    }
  
    // Função para monitorar vídeos do YouTube dentro de um iframe
    function monitorYoutubeVideo() {
      let iframeElement = document.querySelector('iframe');
      if (iframeElement && iframeElement.src.includes('youtube.com')) {
        iframeElement.onload = function () {
          // Carregar a API do YouTube se o iframe for um vídeo do YouTube
          loadYouTubeAPI();
        };
      }
    }
  
    function loadYouTubeAPI() {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
        window.onYouTubeIframeAPIReady = function () {
          const iframeElement = document.querySelector('iframe');
          if (iframeElement) {
            const player = new YT.Player(iframeElement, {
              events: {
                onStateChange: onPlayerStateChange,
              },
            });
          }
        };
      }
    }
  
    function onPlayerStateChange(event) {
      if (event.data === YT.PlayerState.ENDED) {
        sendMessageToWrapper({
          type: 'video',
          state: 'ended',
        });
      }
    }
  
    iniciarAtividade();
  }
  
  window.initTraining = initTraining;
  