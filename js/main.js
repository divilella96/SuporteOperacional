document.addEventListener('DOMContentLoaded', () => {
    const hours = new Date().getHours();
    let greeting = 'Bem-vindo';

    if (hours < 12) {
        greeting = 'Bom dia';
    } else if (hours < 18) {
        greeting = 'Boa tarde';
    } else {
        greeting = 'Boa noite';
    }

    console.log(`${greeting}! Portal Operacional carregado.`);
});
