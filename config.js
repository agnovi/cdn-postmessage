// Version: 1.4
function initTraining({ totalClicks, totalVideos }) {
    function sendMessageToWrapper(message) {
        if (window.parent) {
            window.parent.postMessage(message, '*');
        }
    }

    // Função que inicializa o processo, chamada pelo HTML
    function iniciarAtividade() {
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

        // Monitorar vídeos
        monitorVideo();
        monitorYoutubeVideos();
    }

    // Função para monitorar vídeos HTML <video>
    function monitorVideo() {
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

    // Função para monitorar vídeos do YouTube dentro de iframes
    function monitorYoutubeVideos() {
        let iframeElements = document.querySelectorAll('iframe[src*="youtube.com"]');
        iframeElements.forEach(function (iframeElement) {
            iframeElement.onload = function () {
                loadYouTubeAPI(iframeElement);
            };
        });
    }

    // Carregar a API do YouTube (uma vez)
    function loadYouTubeAPI(iframeElement) {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = function () {
                createYouTubePlayers();
            };
        } else {
            createYouTubePlayers();
        }
    }

    // Criar todos os players do YouTube e monitorar mudanças de estado
    function createYouTubePlayers() {
        let iframeElements = document.querySelectorAll('iframe[src*="youtube.com"]');
        iframeElements.forEach(function (iframeElement) {
            const player = new YT.Player(iframeElement.id, {
                height: '315',
                width: '560',
                videoId: iframeElement.dataset.videoId,
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
            });
        });
    }

    // Função chamada quando o player está pronto
    function onPlayerReady(event) {
        console.log("O vídeo está pronto para ser reproduzido.");
    }

    // Função chamada quando o estado do player muda
    function onPlayerStateChange(event) {
        // Verifica se o estado é 0 (final do vídeo)
        if (event.data === YT.PlayerState.ENDED) {
            sendMessageToWrapper({
                type: 'video',
                state: 'ended',
                videoId: event.target.getIframe().id // Adiciona o ID do iframe ao enviar a mensagem
            });
        }
    }

    iniciarAtividade();
}

window.initTraining = initTraining;
