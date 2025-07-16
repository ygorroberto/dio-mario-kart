// array de todos os players disponíveis
const players = [
    {
        id: 1,
        name: "Mário",
        score: 0,
        power: 3,
        velocity: 4,
        maneuverability: 3
    },
    {
        id: 2,
        name: "Luigi",
        score: 0,
        power: 4,
        velocity: 3,
        maneuverability: 4
    },
    {
        id: 3,
        name: "Bowser",
        score: 0,
        power: 5,
        velocity: 5,
        maneuverability: 2
    },
    {
        id: 4,
        name: "Peach",
        score: 0,
        power: 2,
        velocity: 3,
        maneuverability: 4
    },
    {
        id: 5,
        name: "Yoshi",
        score: 0,
        power: 3,
        velocity: 2,
        maneuverability: 4
    },
    {
        id: 6,
        name: "Donkey Kong",
        score: 0,
        power: 5,
        velocity: 2,
        maneuverability: 2
    },
];

// array dos obstáculos
const race_track = ["CURVA", "RETA", "CONFRONTO"];

// array do dado
const dice = [1, 2, 3, 4, 5, 6];

// função para gerar números aleatórios do array do dado
async function rollDice() {
    return dice[Math.floor(Math.random() * dice.length)];
}

// função para gerar os obstáculos aleatórios
async function rollRaceTrack() {
    return race_track[Math.floor(Math.random() * race_track.length)];
}

// função para selecionar aleatoriamente 2 players
async function selectPlayers() {
    const randomIndex1 = Math.floor(Math.random() * players.length);
    let randomIndex2;
    do {
        randomIndex2 = Math.floor(Math.random() * players.length);
    } while (randomIndex2 === randomIndex1);

    const player1 = players[randomIndex1];
    const player2 = players[randomIndex2];

    return [player1, player2];
}

// função para gerar as rodadas e toda a tratativa para cuidar do placar
async function rounds() {
    const selectedPlayers = await selectPlayers();
    
    console.log('📢\t Conheçam nossos jogadores e façam suas apostas...');
    console.log(`🚗\t Nosso primeiro jogador está aquecendo seus motores. Digam 'Oi' a <${selectedPlayers[0].name}>`);
    console.log(`🚗\t Nosso segundo jogador vem logo atrás. Digam 'Oi' a <${selectedPlayers[1].name}>`);
    console.log('----------------------------------------------------------');

    for (let index = 1; index <= 5; index++) {
        let raceTrack = await rollRaceTrack();

        console.log(`Rodada: ${index}`);
        console.log(`Bloco: ${raceTrack}`);
        console.log('----------------------------------------------------------');

        // armazenando os resultados de ambos os players
        let results = await Promise.all(selectedPlayers.map(async player => {
            const diceResult = await rollDice();
            let total = 0;
            if (raceTrack == 'CURVA') {
                total = player.maneuverability + diceResult;
                console.log(`${player.name} | Atributo manobrabilidade: ${player.maneuverability} + ${diceResult} = ${total}`);
            } else if (raceTrack == 'RETA') {
                total = player.velocity + diceResult;
                console.log(`${player.name} | Atributo velocidade: ${player.velocity} + ${diceResult} = ${total}`);
            } else if (raceTrack == 'CONFRONTO') {
                total = player.power + diceResult;
                console.log(`${player.name} | Atributo poder: ${player.power} + ${diceResult} = ${total}`);
            }
            return { player, total };
        }));

        // determinando o ganhador da rodada
        if (results[0].total > results[1].total) {            
            if (raceTrack == 'CONFRONTO' && results[1].player.score > 0) {
                results[1].player.score -= 1;
            } else {
                results[0].player.score += 1;
            }
            console.log(`${results[0].player.name} vence a rodada!`);
        } else if (results[1].total > results[0].total) {
            if (raceTrack == 'CONFRONTO' && results[0].player.score > 0) {
                results[0].player.score -= 1;
            } else {
                results[1].player.score += 1;
            }
            console.log(`${results[1].player.name} vence a rodada!`);
        } else {
            console.log('Empate na rodada!');
        }

        // exibindo os scores
        console.log(`Placar: ${selectedPlayers[0].name} ${selectedPlayers[0].score} x ${selectedPlayers[1].score} ${selectedPlayers[1].name}`);
        console.log('==========================================================');
    }

    // resultado final
    if (selectedPlayers[0].score > selectedPlayers[1].score) {
        console.log(`🎖️\t Nosso vencedor tem nome e ele se chama <${selectedPlayers[0].name}> com placar de ${selectedPlayers[0].score} x ${selectedPlayers[1].score}.`);            
    } else if (selectedPlayers[1].score > selectedPlayers[0].score) {
        console.log(`🎖️\t Nosso vencedor tem nome e ele se chama <${selectedPlayers[1].name}> com placar de ${selectedPlayers[1].score} x ${selectedPlayers[0].score}.`);            
    } else {
        console.log('(In)felizmente tivemos um empate minha gente!');
    }
}

// função auto-invocada
(async function main() {    
    await rounds();
})()