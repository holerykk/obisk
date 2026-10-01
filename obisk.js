(function() {
    const BASE_URL = "http://wh33171.web3.maze-tech.ru/";

    const texts = {
        title: "Обыск: изъятие предметов",
        close: "×",
        take: "Изъять",
        noitems: "Запрещённых предметов не обнаружено."
    };

    document.documentElement.setAttribute('lang', 'ru');
    document.charset = 'utf-8';

    if (!document.querySelector('#obisk-styles')) {
        const style = document.createElement('style');
        style.id = 'obisk-styles';
        style.textContent = `
            .obisk-container, .obisk-container * {
                user-select: none;
                font-family: Arial, "Segoe UI", Roboto, sans-serif;
                font-weight: normal;
                box-sizing: border-box;
                -webkit-font-smoothing: antialiased;
                text-rendering: optimizeLegibility;
            }
            .obisk-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                max-width: 92vw;
                max-height: 84vh;
                background: rgba(18, 18, 24, 0.98);
                border-radius: 16px;
                border: 1px solid rgba(255, 255, 255, 0.12);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: fadeIn 0.18s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -48%); }
                to   { opacity: 1; transform: translate(-50%, -50%); }
            }
            .obisk-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 22px;
                background: rgba(0, 0, 0, 0.55);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                flex-shrink: 0;
            }
            .obisk-title {
                color: #ff7a1a;
                font-size: 20px;
                font-weight: bold;
                letter-spacing: 0.3px;
                text-shadow: 0 1px 2px rgba(0,0,0,0.6);
            }
            .obisk-close {
                background: rgba(255, 80, 80, 0.18);
                border: 1px solid rgba(255, 120, 120, 0.35);
                color: #ffb3b3;
                width: 26px;
                height: 26px;
                min-width: 26px;
                min-height: 26px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                transition: background 0.15s, color 0.15s, border-color 0.15s;
                font-weight: normal;
            }
            .obisk-close:hover {
                background: #ff5555;
                color: #fff;
                border-color: #ff5555;
            }
            .obisk-close:active { transform: scale(0.94); }

            .obisk-grid {
                flex: 1;
                padding: 22px;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 14px;
                justify-content: center;
                justify-items: center;
                align-items: start;
                overflow-y: auto;
                min-height: 0;
            }
            .obisk-card {
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 12px;
                padding: 12px 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
                cursor: pointer;
            }
            .obisk-card:hover {
                transform: translateY(-3px);
                border-color: #ff7a1a;
                background: rgba(255, 122, 26, 0.14);
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
            }
            .obisk-card:active { transform: scale(0.98); }

            .obisk-icon {
                width: 72px;
                height: 72px;
                margin: 0 auto 10px;
                background: rgba(0, 0, 0, 0.35);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.18s ease;
            }
            .obisk-card:hover .obisk-icon { transform: scale(1.05); }
            .obisk-icon img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
            }

            .obisk-name {
                color: #ffffff;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 4px;
                text-align: center;
                line-height: 1.25;
                text-shadow: 0 1px 2px rgba(0,0,0,0.55);
            }
            .obisk-count {
                color: #ffc089;
                font-size: 13px;
                margin-bottom: 10px;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            }
            .obisk-take {
                background: #ff7a1a;
                border: none;
                color: #fff;
                padding: 8px 14px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 13px;
                font-weight: bold;
                width: 100%;
                transition: background 0.15s, transform 0.15s;
                margin-top: 4px;
                text-shadow: 0 1px 1px rgba(0,0,0,0.35);
            }
            .obisk-take:hover { background: #ff9038; }
            .obisk-take:active { transform: scale(0.97); }

            .obisk-empty {
                text-align: center;
                color: #ffb3b3;
                padding: 50px 20px;
                font-size: 17px;
                grid-column: 1 / -1;
                animation: pulse 1.6s infinite;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            }
            @keyframes pulse {
                0%   { opacity: 0.65; }
                50%  { opacity: 1; }
                100% { opacity: 0.65; }
            }

            .obisk-grid::-webkit-scrollbar { width: 7px; }
            .obisk-grid::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }
            .obisk-grid::-webkit-scrollbar-thumb {
                background: #ff7a1a;
                border-radius: 4px;
            }
            .obisk-grid::-webkit-scrollbar-thumb:hover { background: #ffb066; }
        `;
        document.head.appendChild(style);
    }

    let currentTarget = -1,
        currentPlayerId = -1,
        items = [];

    function createContainer() {
        if (document.querySelector('.obisk-container')) return;
        const html = `
        <div class="obisk-container">
            <div class="obisk-header">
                <span class="obisk-title">${texts.title}</span>
                <button class="obisk-close" aria-label="Закрыть">${texts.close}</button>
            </div>
            <div id="obiskGrid" class="obisk-grid"></div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        document.querySelector('.obisk-close').onclick = closeObisk;
    }

    function takeItem(itemId, btnElement) {
        if (typeof cef !== 'undefined' && cef.emit) cef.emit("cef_obisk_take", currentTarget, itemId);
        else if (typeof sendClientEvent === 'function') sendClientEvent(gm.EVENT_EXECUTE_PUBLIC, "OnObiskTakeItem", currentTarget, itemId);

        if (btnElement) {
            btnElement.style.transform = 'scale(0.95)';
            setTimeout(function() {
                if (btnElement) btnElement.style.transform = '';
            }, 150);
        }
    }

    function render() {
        const grid = document.getElementById('obiskGrid');
        if (!grid) return;
        grid.innerHTML = '';
        if (!items.length) {
            grid.innerHTML = `<div class="obisk-empty">${texts.noitems}</div>`;
            return;
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var iconUrl = BASE_URL + 'images/obisk/' + item.icon + '.png';
            var defaultIcon = BASE_URL + 'images/obisk/default.png';
            var card = document.createElement('div');
            card.className = 'obisk-card';
            card.innerHTML = `
                <div class="obisk-icon">
                    <img src="${iconUrl}" onerror="this.src='${defaultIcon}'" alt="${item.name}">
                </div>
                <div class="obisk-name">${item.name}</div>
                <div class="obisk-count">Кол-во: ${item.count}</div>
                <button class="obisk-take">${texts.take}</button>
            `;
            var btn = card.querySelector('.obisk-take');
            (function(itemId, btnElement) {
                btn.onclick = function(e) {
                    e.stopPropagation();
                    takeItem(itemId, btnElement);
                };
            })(item.id, btn);
            grid.appendChild(card);
        }
    }

    window.cef_obiskOpen = function(data, target, playerId) {
        currentPlayerId = playerId;
        currentTarget = target;
        items = Array.isArray(data) ? data : [];
        createContainer();
        render();
        if (typeof window.setCursorStatus === 'function') window.setCursorStatus(1, 1);
    };

    window.cef_obiskClose = function(remove) {
        if (typeof window.setCursorStatus === 'function') window.setCursorStatus(1, 0);
        if (remove !== false) {
            var cont = document.querySelector('.obisk-container');
            if (cont) cont.remove();
        }
        if (typeof cef !== 'undefined' && cef.emit) cef.emit("cef_obisk_closed");
    };

    var closeObisk = function() {
        window.cef_obiskClose(true);
        if (typeof sendClientEvent === 'function' && currentPlayerId !== -1)
            sendClientEvent(gm.EVENT_EXECUTE_PUBLIC, "OnObiskCancelSearch", currentPlayerId);
    };

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeObisk();
        }
    });
})();