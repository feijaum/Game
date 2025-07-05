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
        progressBox.fillRect(340, 270, 320, 50); // Ajustado para tela maior

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(350, 280, 300 * value, 30); // Ajustado
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
        });

        // --- INÍCIO DA ÁREA DE CARREGAMENTO DE RECURSOS ---

        // Carrega o arquivo JSON com os dados das cartas
        this.load.json('cardData', 'cartas.json');

        // --- CARREGAMENTO PARA O MAPA DO TILED ---
        // 1. Carregue a imagem do seu tileset (o conjunto de "azulejos" que você usa no Tiled)
        // this.load.image('tileset_inferno', 'assets/maps/tileset_inferno.png');

        // 2. Carregue o arquivo JSON exportado do Tiled
        // this.load.tilemapTiledJSON('mapa_inferno', 'assets/maps/mapa_inferno.json');


        // --- CARREGAMENTO DE OUTROS RECURSOS ---
        // Exemplo para as molduras das cartas
        // this.load.image('molduraProvacao', 'assets/ui/moldura_provacao.png');

        // Exemplo para os personagens
        // this.load.image('personagem1', 'assets/sprites/personagem_sucumbido.png');

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
        this.pathPoints = {}; // Objeto para guardar as coordenadas do caminho
    }

    create() {
        // Define uma cor de fundo para a cena
        this.cameras.main.setBackgroundColor('#2d2d2d');

        // --- AQUI COMEÇA A LÓGICA DO SEU JOGO ---

        // 1. CRIAR O MAPA A PARTIR DOS DADOS DO TILED
        // const map = this.make.tilemap({ key: 'mapa_inferno' });
        // const tileset = map.addTilesetImage('nome_do_tileset_no_tiled', 'tileset_inferno');
        
        // 2. RENDERIZAR AS CAMADAS DO MAPA
        // A ordem importa: desenhe o fundo primeiro!
        // map.createLayer('BackgroundLayer', tileset, 0, 0);
        // const pathLayer = map.createLayer('PathLayer', tileset, 0, 0);

        // 3. EXTRAIR OS PONTOS DO CAMINHO DO OBJECT LAYER
        // const objectLayer = map.getObjectLayer('ObjectLayer');
        // objectLayer.objects.forEach(obj => {
        //     // Armazena a posição de cada casa usando o nome que você deu no Tiled
        //     this.pathPoints[obj.name] = { x: obj.x, y: obj.y };
        // });
        // console.log("Pontos do caminho extraídos:", this.pathPoints);

        // Agora, para mover um jogador para a casa "inferno_casa_05", você faria:
        // let targetPosition = this.pathPoints['inferno_casa_05'];
        // jogador.setPosition(targetPosition.x, targetPosition.y);


        // 4. CRIAR OS JOGADORES
        // let jogador1 = this.add.sprite(0, 0, 'personagem1');
        // Posicione o jogador no início
        // let startPosition = this.pathPoints['inferno_casa_01'];
        // jogador1.setPosition(startPosition.x, startPosition.y);
        
        // Lembre-se do Depth Sorting para o 2.5D!
        // jogador1.setDepth(jogador1.y);
    }

    update() {
        // Loop do jogo, executado a cada frame.
    }
}


// =================================================================
// CONFIGURAÇÃO DO PHASER
// Define as configurações globais do jogo
// =================================================================
const config = {
    type: Phaser.AUTO,
    width: 1024, // Aumentei um pouco a resolução para mapas maiores
    height: 768,
    parent: 'game-container',
    scene: [PreloadScene, GameScene],
    physics: { // Habilitar a física pode ser útil no futuro
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Cria a instância do jogo
const game = new Phaser.Game(config);
