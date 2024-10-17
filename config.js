// Version: 1.3
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
                createYouTubePlayer(iframeElement);
            };
        } else {
            createYouTubePlayer(iframeElement);
        }
    }

    // Criar o player do YouTube e monitorar mudanças de estado
    function createYouTubePlayer(iframeElement) {
        const player = new YT.Player(iframeElement, {
            events: {
                onStateChange: onPlayerStateChange,
            },
        });
    }

    // Verificar o estado do player (detecta 'ended')
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
