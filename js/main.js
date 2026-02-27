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

    // Logic for Stock Communication Module
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const btnSms = document.getElementById('btn-sms');
    const qtdMinus = document.getElementById('qtd-minus');
    const qtdPlus = document.getElementById('qtd-plus');
    const qtdInput = document.getElementById('artigo-qtd');

    if (btnWhatsapp && btnSms) {
        // Quantity Selector Logic
        if (qtdMinus && qtdPlus && qtdInput) {
            qtdMinus.addEventListener('click', () => {
                let currentValue = parseInt(qtdInput.value) || 1;
                if (currentValue > 1) {
                    qtdInput.value = currentValue - 1;
                }
            });

            qtdPlus.addEventListener('click', () => {
                let currentValue = parseInt(qtdInput.value) || 1;
                qtdInput.value = currentValue + 1;
            });
        }

        function getMessageDetails() {
            const phoneInput = document.getElementById('cliente-tel');
            const nameInput = document.getElementById('artigo-nome');
            const qtdValue = document.getElementById('artigo-qtd').value;

            let phone = phoneInput.value.replace(/\s/g, '').trim(); // Remove spaces
            const itemName = nameInput.value.trim();

            if (!phone) {
                alert('Por favor, insira o número de telemóvel do cliente.');
                return null;
            }

            if (!itemName) {
                alert('Por favor, insira o nome do artigo em falta.');
                return null;
            }

            // Phone Validation: Ensure it starts with + or 00, or add default +351
            if (!phone.startsWith('+') && !phone.startsWith('00')) {
                // If it's a 9 digit number, assume PT
                if (phone.length === 9 && /^\d+$/.test(phone)) {
                    phone = '+351' + phone;
                } else {
                    alert('Por favor, verifique o número de telemóvel. Certifique-se que inclui o indicativo (ex: +351).');
                    return null;
                }
            } else if (phone.startsWith('00')) {
                 // Replace 00 with + for consistency in links
                 phone = '+' + phone.substring(2);
            }

            const message = `Boa tarde, sou o responsável pela sua encomenda feita através do Pingo Doce Online. Devido à falta de stock dos seguintes artigos: ${qtdValue} unidades de ${itemName}, peço que contacte-me dentro dos próximos 5 min de forma a conseguir alinhar consigo as substituições.`;

            return { phone, message };
        }

        btnWhatsapp.addEventListener('click', () => {
            const details = getMessageDetails();
            if (details) {
                const encodedMessage = encodeURIComponent(details.message);
                window.open(`https://wa.me/${details.phone}?text=${encodedMessage}`, '_blank');
            }
        });

        btnSms.addEventListener('click', () => {
            const details = getMessageDetails();
            if (details) {
                const encodedMessage = encodeURIComponent(details.message);
                // SMS link format varies slightly by device, but this is standard
                // Note: 'body' parameter support is inconsistent across OS versions, but standard for most.
                window.location.href = `sms:${details.phone}?body=${encodedMessage}`;
            }
        });
    }
});
