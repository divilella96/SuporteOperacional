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
            const qtdValue = parseInt(document.getElementById('artigo-qtd').value) || 1;

            let phone = phoneInput.value.replace(/\s/g, '').trim(); // Remove spaces
            const itemName = nameInput.value.trim();

            if (!phone) {
                alert('Por favor, insira o número de telemóvel do cliente.');
                return null;
            }

            // Determine message path based on description presence
            let message = '';

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

            if (itemName === '') {
                // Path 1: Description Empty -> Use Quantity
                message = `Boa tarde, sou o responsável pela sua encomenda feita através do Pingo Doce Online. Devido à falta de stock de ${qtdValue} artigo(s), peço que contacte-me dentro dos próximos 5 min de forma a conseguir alinhar consigo as substituições.`;
            } else {
                // Path 2: Description Filled -> Use Free Text (Ignore Quantity)
                message = `Boa tarde, sou o responsável pela sua encomenda feita através do Pingo Doce Online. Devido à falta de stock dos seguintes artigos: ${itemName}, peço que contacte-me dentro dos próximos 5 min de forma a conseguir alinhar consigo as substituições.`;
            }

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

    // Slot Validator Logic
    const imageUpload = document.getElementById('slot-image-upload');
    const resultContainer = document.getElementById('slot-validation-result');
    const loadingMessage = document.getElementById('loading-message');
    const resultContent = document.getElementById('result-content');
    const orderNumberSpan = document.getElementById('encomenda-numero');
    const orderSlotSpan = document.getElementById('encomenda-slot');
    const btnCopiarSlot = document.getElementById('btn-copiar-slot');

    if (btnCopiarSlot) {
        btnCopiarSlot.addEventListener('click', () => {
            const numero = orderNumberSpan.textContent;
            const slot = orderSlotSpan.textContent;
            const textoCopiar = `Encomenda: ${numero}\nSlot: ${slot}`;

            navigator.clipboard.writeText(textoCopiar).then(() => {
                alert("Dados copiados com sucesso!");
            }).catch(err => {
                console.error('Erro ao copiar texto: ', err);
                alert("Erro ao copiar dados.");
            });
        });
    }

    if (imageUpload) {
        imageUpload.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Display loading
            resultContainer.style.display = 'block';
            loadingMessage.style.display = 'block';
            resultContent.style.display = 'none';

            try {
                // Read image file as URL
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const imageUrl = e.target.result;

                    try {
                        const { data: { text } } = await Tesseract.recognize(
                            imageUrl,
                            'por',
                            { logger: m => console.log(m) }
                        );

                        console.log("OCR Result:", text);

                        // Extract Order Number (last 6 digits of sequence)
                        const orderMatches = text.match(/(?<!\d)(\d{6})(?!\d)/g);
                        const orderNumber = orderMatches ? orderMatches[orderMatches.length - 1] : "Não encontrado";

                        // Extract Time
                        const timeMatches = text.match(/(?<!\d)(\d{2}:\d{2})(?!\d)/g);
                        let deliveryTime = "Não encontrado";
                        let slot = "Não encontrado";

                        if (timeMatches && timeMatches.length > 0) {
                            // Find the time that matches our slots, usually the last one
                            deliveryTime = timeMatches[timeMatches.length - 1];
                            const timeParts = deliveryTime.split(':');
                            const hour = parseInt(timeParts[0], 10);
                            const minute = parseInt(timeParts[1], 10);
                            const timeInMinutes = hour * 60 + minute;

                            // Determine Store
                            const storeSelected = document.querySelector('input[name="loja"]:checked').value;

                            // Determine Slot
                            if (storeSelected === 'sao-bento') {
                                if (timeInMinutes >= 10 * 60 && timeInMinutes <= 13 * 60) {
                                    slot = "10:00 - 13:00";
                                } else if (timeInMinutes >= 14 * 60 && timeInMinutes <= 17 * 60) {
                                    slot = "14:00 - 17:00";
                                } else if (timeInMinutes >= 17 * 60 && timeInMinutes <= 20 * 60) {
                                    slot = "17:00 - 20:00";
                                } else {
                                    slot = `Tempo ${deliveryTime} fora dos slots (São Bento)`;
                                }
                            } else if (storeSelected === 'rato') {
                                if (timeInMinutes >= 9 * 60 && timeInMinutes <= 12 * 60) {
                                    slot = "09:00 - 12:00";
                                } else if (timeInMinutes >= 12 * 60 && timeInMinutes <= 15 * 60) {
                                    slot = "12:00 - 15:00";
                                } else if (timeInMinutes >= 14 * 60 && timeInMinutes <= 17 * 60) {
                                    slot = "14:00 - 17:00";
                                } else if (timeInMinutes >= 17 * 60 && timeInMinutes <= 20 * 60) {
                                    slot = "17:00 - 20:00";
                                } else {
                                    slot = `Tempo ${deliveryTime} fora dos slots (Largo do Rato)`;
                                }
                            }
                        }

                        // Display result
                        orderNumberSpan.textContent = orderNumber;
                        orderSlotSpan.textContent = slot;

                        loadingMessage.style.display = 'none';
                        resultContent.style.display = 'block';
                    } catch (error) {
                        console.error("Tesseract error:", error);
                        loadingMessage.style.display = 'none';
                        alert("Erro ao processar imagem.");
                    }
                };
                reader.readAsDataURL(file);
            } catch (err) {
                console.error("Error reading file:", err);
                loadingMessage.style.display = 'none';
                alert("Erro ao ler arquivo.");
            }
        });
    }
});
