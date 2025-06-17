// --- ELEMENTOS DO DOM ---
const gameBoard = document.getElementById('game-board');
const playersInfoContainer = document.getElementById('players-info');
const rollDiceBtn = document.getElementById('roll-dice-btn');
const diceResultEl = document.getElementById('dice-result');
const gameMessageEl = document.getElementById('game-message');
const currentPlayerNameEl = document.getElementById('current-player-name');
const cardModal = document.getElementById('card-modal');
const cardTypeEl = document.getElementById('card-type');
const cardDescriptionEl = document.getElementById('card-description');
const cardActionsEl = document.getElementById('card-actions');
const classSelectionModal = document.getElementById('class-selection-modal');
const startGameBtn = document.getElementById('start-game-btn');
const classSelectionGrid = document.getElementById('class-selection-grid');

// --- CONSTANTES E ESTADO DO JOGO ---
const boardSize = 50;
let players = [];
let currentPlayerIndex = 0;
let gameStarted = false;

const classes = [
    { id: "sucumbido", name: "Sucumbido", description: "Ganha bônus de movimento com reputação negativa." },
    { id: "coveiro", name: "Coveiro", description: "Pode guardar uma carta para usar em outro jogador." },
    { id: "comedia", name: "Comédia", description: "Pode alterar os números da sua rodada." },
    { id: "alma_gemea", name: "Alma Gêmea", description: "Pode chamar outro jogador para realizar um desafio junto." },
    { id: "pistoleira", name: "Pistoleira", description: "Pode roubar recompensas de alvos que falham." },
    { id: "carcereiro", name: "Carcereiro", description: "Pode prender jogadores e negar vantagens." },
    { id: "vampiro", name: "Vampiro da Seita", description: "Pode sugar casas ou Pecadômetro de outros." },
    { id: "arauto", name: "Arauto do Esterco", description: "Cria checkpoints próprios no tabuleiro." },
    { id: "nuloh", name: "Nuloh", description: "Pode usar a habilidade de qualquer outra classe." },
    { id: "empanado", name: "Empanado", description: "Inverte efeitos e o fluxo do tabuleiro." },
    { id: "milequth", name: "Milequth", description: "Pode propor pactos com outros jogadores." }
];

const provacaoCards = [
    { type: 'Provação', description: 'Faça 10 polichinelos em 30 segundos.', pecadometro: 2 },
    { type: 'Provação', description: 'Conte uma piada. Se ninguém rir, você falhou.', pecadometro: 1 },
    { type: 'Provação', description: 'Fale com um sotaque diferente até sua próxima rodada.', pecadometro: 3 },
    { type: 'Provação', description: 'Cante o refrão de uma música escolhida pelos outros.', pecadometro: 2 },
    { type: 'Provação', description: 'Equilibre uma colher no nariz por 10 segundos.', pecadometro: 2 },
];

const penitenciaCards = [
    { type: 'Penitência', description: 'Você não pode usar a letra "A" ao falar até sua próxima rodada. Perca 2 de Pecadômetro.', pecadometro: -2, duration: 1 },
    { type: 'Penitência', description: 'Jogue com uma mão nas costas na próxima rodada. Perca 1 de Pecadômetro.', pecadometro: -1, duration: 1 },
    { type: 'Penitência', description: 'Você está amaldiçoado! Ande uma casa a menos no próximo dado. Perca 1 de Pecadômetro.', pecadometro: -1, duration: 1 },
    { type: 'Penitência', description: 'Perca sua próxima vez de jogar. E 3 de Pecadômetro pela vergonha.', pecadometro: -3, duration: 1 },
];

// --- INICIALIZAÇÃO DO JOGO ---

function initializeBoard() {
    gameBoard.innerHTML = ''; // Limpa o tabuleiro para garantir
    for (let i = 1; i <= boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `cell-${i}`;
        cell.textContent = i;
        if (i === 1) cell.classList.add('start');
        if (i === boardSize) cell.classList.add('end');
        if (i === 15 || i === 35) {
             cell.classList.add('bazar');
             cell.textContent = 'B';
        }
        if (i === 25) {
            cell.classList.add('atalho');
            cell.textContent = 'A';
        }
        gameBoard.appendChild(cell);
    }
}

function initializeClassSelection() {
    const numPlayers = 4; // Fixo em 4 por enquanto
    classSelectionGrid.innerHTML = ''; // Limpa para garantir

    for (let i = 1; i <= numPlayers; i++) {
        const playerSelector = document.createElement('div');
        playerSelector.className = 'p-2 bg-gray-700 rounded';
        playerSelector.innerHTML = `
            <h3 class="font-bold text-lg text-white">Jogador ${i}</h3>
            <select id="player-${i}-class" class="w-full mt-2 p-2 rounded bg-gray-600 text-white border border-gray-500">
                <option value="">Selecione...</option>
                ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
        `;
        classSelectionGrid.appendChild(playerSelector);
    }
}

function setupPlayers(classIds) {
    playersInfoContainer.innerHTML = '';

    players = classIds.map((classId, index) => {
        const playerClass = classes.find(c => c.id === classId);
        return {
            id: index + 1,
            name: `Jogador ${index + 1}`,
            class: playerClass,
            position: 1,
            pecadometro: 0,
            penitencias: []
        };
    });
    
    players.forEach(player => {
        const playerInfoDiv = document.createElement('div');
        playerInfoDiv.id = `player-info-${player.id}`;
        playerInfoDiv.className = 'p-4 rounded-lg shadow-md transition-all duration-300 border-2 border-gray-600 bg-gray-800';
        playersInfoContainer.appendChild(playerInfoDiv);

        const token = document.createElement('div');
        token.id = `player-token-${player.id}`;
        token.className = `player-token player-${player.id}`;
        document.getElementById('cell-1').appendChild(token);
    });
}

// --- FLUXO DO JOGO ---

function startGame() {
    gameStarted = true;
    currentPlayerIndex = 0;
    updateUI();
    rollDiceBtn.disabled = false;
    gameMessageEl.textContent = `É a vez do Jogador ${players[0].id}.`;
}

function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateUI();
    rollDiceBtn.disabled = false;
    gameMessageEl.textContent = `É a vez do Jogador ${getCurrentPlayer().id}.`;
    diceResultEl.textContent = '-';
}

function getCurrentPlayer() {
    return players[currentPlayerIndex];
}

// --- ATUALIZAÇÕES DE UI ---

function updateUI() {
    if (!gameStarted) return;

    players.forEach(player => {
        const infoDiv = document.getElementById(`player-info-${player.id}`);
        infoDiv.innerHTML = `
            <h3 class="font-bold text-xl ${player.id === getCurrentPlayer().id ? 'text-yellow-400' : 'text-white'}">${player.name}</h3>
            <p class="text-sm text-gray-400">${player.class.name}</p>
            <p class="font-semibold mt-2">Pecadômetro: <span class="text-lg ${player.pecadometro > 0 ? 'text-green-400' : player.pecadometro < 0 ? 'text-red-400' : 'text-white'}">${player.pecadometro}</span></p>
        `;
        if(player.id === getCurrentPlayer().id){
            infoDiv.classList.add('border-yellow-400', 'scale-105');
            infoDiv.classList.remove('border-gray-600');
        } else {
            infoDiv.classList.remove('border-yellow-400', 'scale-105');
            infoDiv.classList.add('border-gray-600');
        }

        const token = document.getElementById(`player-token-${player.id}`);
        const cell = document.getElementById(`cell-${player.position}`);
        if (cell) {
           cell.appendChild(token);
        }
    });

    const currentPlayer = getCurrentPlayer();
    currentPlayerNameEl.textContent = currentPlayer.name;
    const colorClass = getPlayerColorClass(currentPlayer.id);
    currentPlayerNameEl.className = `text-2xl font-bold ${colorClass}`;
}

function getPlayerColorClass(id) {
    const colors = { 1: 'text-red-400', 2: 'text-blue-400', 3: 'text-green-400', 4: 'text-yellow-400' };
    return colors[id] || 'text-gray-400';
}

// --- AÇÕES DO JOGO ---

function rollDice() {
    if (!gameStarted) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    diceResultEl.textContent = roll;
    rollDiceBtn.disabled = true;
    gameMessageEl.textContent = `Você tirou ${roll}. Agora, puxe uma carta.`;
    
    setTimeout(() => drawCard(roll), 1000);
}

function movePlayer(player, steps) {
    player.position += steps;
    if (player.position > boardSize) {
        player.position = boardSize;
    }
    updateUI();
    
    if (player.position >= boardSize) {
        endGame(player);
    }
}

function drawCard(diceRoll) {
    const card = Math.random() < 0.65 
        ? {...provacaoCards[Math.floor(Math.random() * provacaoCards.length)]}
        : {...penitenciaCards[Math.floor(Math.random() * penitenciaCards.length)]};
    
    card.diceRoll = diceRoll;
    showCardModal(card);
}

function showCardModal(card) {
    cardTypeEl.textContent = card.type;
    cardDescriptionEl.textContent = card.description;
    cardActionsEl.innerHTML = '';

    if (card.type === 'Provação') {
        cardTypeEl.className = "text-3xl font-bold mb-4 font-creepster text-green-400";
        const encararBtn = document.createElement('button');
        encararBtn.textContent = 'Encarar!';
        encararBtn.className = 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded';
        encararBtn.onclick = () => resolveProvacao(card, true);
        cardActionsEl.appendChild(encararBtn);

        const arregarBtn = document.createElement('button');
        arregarBtn.textContent = 'Arregar...';
        arregarBtn.className = 'bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded';
        arregarBtn.onclick = () => resolveProvacao(card, false);
        cardActionsEl.appendChild(arregarBtn);
    } else { // Penitência
        cardTypeEl.className = "text-3xl font-bold mb-4 font-creepster text-red-500";
        const aceitarBtn = document.createElement('button');
        aceitarBtn.textContent = 'Ok...';
        aceitarBtn.className = 'bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded';
        aceitarBtn.onclick = () => resolvePenitencia(card);
        cardActionsEl.appendChild(aceitarBtn);
    }

    cardModal.classList.remove('hidden');
    cardModal.classList.add('flex');
}

function resolveProvacao(card, encarou) {
    const player = getCurrentPlayer();
    if (encarou) {
        gameMessageEl.textContent = `Cumpriu a provação! Ande ${card.diceRoll} casas e ganhe ${card.pecadometro} de Pecadômetro.`;
        movePlayer(player, card.diceRoll);
        player.pecadometro += card.pecadometro;
    } else {
        const halfRoll = Math.ceil(card.diceRoll / 2);
        gameMessageEl.textContent = `Você arregou! Ande ${halfRoll} casas e puxe uma Penitência.`;
        movePlayer(player, halfRoll);
        player.pecadometro -= 1; // Punição simplificada
    }
    closeCardModal();
    if (gameStarted) setTimeout(nextTurn, 1500);
}

function resolvePenitencia(card) {
    const player = getCurrentPlayer();
    gameMessageEl.textContent = `Você sofreu uma penitência! Perca ${Math.abs(card.pecadometro)} de Pecadômetro.`;
    player.pecadometro += card.pecadometro;
    closeCardModal();
    if (gameStarted) setTimeout(nextTurn, 1500);
}

function closeCardModal() {
    cardModal.classList.add('hidden');
    cardModal.classList.remove('flex');
}

function endGame(winner) {
    gameStarted = false;
    rollDiceBtn.disabled = true;
    const message = `Fim de jogo! ${winner.name} escapou com a alma (mais ou menos) intacta e ${winner.pecadometro} de Pecadômetro!`;
    gameMessageEl.textContent = message;

    cardTypeEl.textContent = "Fim da Linha!";
    cardTypeEl.className = "text-3xl font-bold mb-4 font-creepster text-yellow-400";
    cardDescriptionEl.textContent = message;
    cardActionsEl.innerHTML = `<button onclick="location.reload()" class="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded">Jogar Novamente</button>`;

    cardModal.classList.remove('hidden');
    cardModal.classList.add('flex');
}

// --- EVENT LISTENERS ---
startGameBtn.addEventListener('click', () => {
    const selections = [];
    let allSelected = true;
    for (let i = 1; i <= 4; i++) {
        const selection = document.getElementById(`player-${i}-class`).value;
        if (!selection) {
            allSelected = false;
            break;
        }
        selections.push(selection);
    }

    if (allSelected) {
        setupPlayers(selections);
        classSelectionModal.classList.add('hidden');
        startGame();
    } else {
        alert('Todos os jogadores devem selecionar uma classe!');
    }
});

rollDiceBtn.addEventListener('click', rollDice);

// --- EXECUÇÃO INICIAL ---
window.onload = () => {
    initializeBoard();
    initializeClassSelection();
};
