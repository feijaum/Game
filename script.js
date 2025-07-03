// =================================================================
// CENA DE PRÉ-CARREGAMENTO (PRELOAD)
// Responsável por carregar todos os recursos do jogo (imagens, sons, dados)
// =================================================================
class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Mostra uma barra de progresso enquanto carrega
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x333333, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
        });

        // --- INÍCIO DA ÁREA DE CARREGAMENTO DE RECURSOS ---

        // Carrega o arquivo JSON com os dados das cartas
        // Coloque o arquivo 'cartas.json' na mesma pasta que este HTML por enquanto
        this.load.json('cardData', 'cartas.json');

        // Carrega as imagens (substitua 'caminho/para/...' pelos nomes dos seus arquivos)
        // É uma boa prática criar uma pasta 'assets' para organizar suas imagens

        // Exemplo para o tabuleiro
        // this.load.image('tabuleiro', 'assets/tabuleiro_isometrico.png');

        // Exemplo para as molduras das cartas
        // this.load.image('molduraProvacao', 'assets/moldura_provacao.png');
        // this.load.image('molduraPenitencia', 'assets/moldura_penitencia.png');

        // Exemplo para os personagens (spritesheets são melhores para animações)
        // this.load.image('personagem1', 'assets/personagem_sucumbido.png');
        // this.load.image('personagem2', 'assets/personagem_coveiro.png');

        // Exemplo para o dado
        // this.load.spritesheet('dado', 'assets/dado_spritesheet.png', { frameWidth: 100, frameHeight: 100 });

        // --- FIM DA ÁREA DE CARREGAMENTO DE RECURSOS ---
    }

    create() {
        // Após carregar tudo, inicia a cena principal do jogo
        this.scene.start('GameScene');
    }
}


// =================================================================
// CENA PRINCIPAL DO JOGO (GAME)
// Onde toda a lógica e a jogabilidade acontecerão
// =================================================================
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Define uma cor de fundo para a cena
        this.cameras.main.setBackgroundColor('#2d2d2d');

        // Adiciona um texto de boas-vindas
        this.add.text(400, 50, 'Pecado ou Fuga - MVP', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Acessa os dados das cartas que foram carregados
        const cardData = this.cache.json.get('cardData');
        console.log("Dados das cartas carregados:", cardData.cartas);

        // --- AQUI COMEÇA A LÓGICA DO SEU JOGO ---

        // 1. RENDERIZAR O TABULEIRO
        // Ex: this.add.image(400, 300, 'tabuleiro');

        // 2. CRIAR OS JOGADORES
        // Ex: let jogador1 = this.add.sprite(100, 100, 'personagem1');

        // 3. DEFINIR O CAMINHO NO TABULEIRO
        // Crie um array de coordenadas (x, y) para cada casa do tabuleiro.
        // Isso será essencial para mover os peões.
        // Ex: const caminhoInferno = [ {x: 150, y: 200}, {x: 200, y: 220}, ... ];

        // 4. IMPLEMENTAR O SISTEMA DE TURNOS
        // Crie variáveis para controlar de quem é a vez.

        // 5. CRIAR O DADO E A LÓGICA DE ROLAGEM

        // 6. CRIAR A LÓGICA PARA PUXAR E EXIBIR AS CARTAS
        // Use os dados do `cardData` para preencher as molduras com os textos.
    }

    update() {
        // Loop do jogo, executado a cada frame.
        // Útil para animações e verificar interações contínuas.
    }
}


// =================================================================
// CONFIGURAÇÃO DO PHASER
// Define as configurações globais do jogo
// =================================================================
const config = {
    type: Phaser.AUTO, // Phaser decide se usa WebGL ou Canvas
    width: 800,
    height: 600,
    parent: 'game-container', // ID do container no HTML
    scene: [PreloadScene, GameScene] // Lista de cenas do jogo
};

// Cria a instância do jogo
const game = new Phaser.Game(config);
