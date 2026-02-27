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

    if (btnWhatsapp && btnSms) {
        function getMessageDetails() {
            const phoneInput = document.getElementById('cliente-tel');
            const itemsInput = document.getElementById('artigos-falta');

            let phone = phoneInput.value.trim();
            const items = itemsInput.value.trim();

            if (!phone) {
                alert('Por favor, insira o número de telemóvel do cliente.');
                return null;
            }

            if (!items) {
                alert('Por favor, liste os artigos em falta.');
                return null;
            }

            // Simple check for country code, defaulting to PT (+351) if missing and looks like a local number (9 digits)
            if (phone.length === 9 && /^\d+$/.test(phone)) {
                phone = '351' + phone;
            }

            const message = `Boa tarde, sou o responsável pela sua encomenda feita através do Pingo Doce Online. Devido à falta de stock dos seguintes artigos: ${items}, peço que contacte-me dentro dos próximos 5 min de forma a conseguir alinhar consigo as substituições.`;

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
