// Fonction pour mettre à jour l'aperçu en temps réel
function updatePreview() {
    const previewContent = document.getElementById('preview-content');
    previewContent.innerHTML = `
        <h2>Profil Personnel</h2>
        <p>${document.getElementById('profil').value}</p>
        <div class="sub-menu">
            <button class="subnavbtn" onclick="openModal('coordonneesModal')">Coordonnées <i class="fa fa-caret-down"></i></button>
            <div id="coordonneesModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="closeModal('coordonneesModal')">&times;</span>
                    <h2>Coordonnées</h2>
                    <div class="contact-info">
                        <i class="fa fa-phone"></i> <span>${document.getElementById('telephone').value}</span>
                    </div>
                    <div class="contact-info">
                        <i class="fa fa-envelope"></i> <span>${document.getElementById('email').value}</span>
                    </div>
                    <div class="contact-info">
                        <i class="fa fa-map-marker"></i> <span>${document.getElementById('localisation').value}</span>
                    </div>
                </div>
            </div>
        </div>
        <h2>Compétences</h2>
        <p>${document.getElementById('competences').value}</p>
        <h2>Expérience</h2>
        <p>${document.getElementById('experience').value}</p>
        <h2>Formations</h2>
        <p>${document.getElementById('formations').value}</p>
        <h2>Hobbies</h2>
        <p>${document.getElementById('hobbies').value}</p>
    `;
    const photo = document.getElementById('photo').files[0];
    if (photo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const existingImage = previewContent.querySelector('img');
            if (existingImage) {
                existingImage.src = e.target.result;
            } else {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.borderRadius = '50%';
                previewContent.insertBefore(img, previewContent.firstChild);
            }
        }
        reader.readAsDataURL(photo);
    }
}

// Rendre la palette déplaçable
const panel = document.getElementById('customization-panel');
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

panel.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === panel || e.target.parentNode === panel) {
        isDragging = true;
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, panel);
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

// Fonctions de personnalisation
function updateTextColor(color) {
    document.getElementById('preview-content').style.color = color;
}

function updateHeaderColor(color) {
    const headers = document.querySelectorAll('#preview-content h2');
    headers.forEach(header => header.style.color = color);
}

function updateHeaderBgColor(color) {
    const headers = document.querySelectorAll('#preview-content h2');
    headers.forEach(header => header.style.backgroundColor = color);
}

function updateFontSize(size) {
    document.getElementById('preview-content').style.fontSize = size;
}

function updateFont(font) {
    document.getElementById('preview-content').style.fontFamily = font;
}


// Fonction pour gérer les retours à la ligne et les dates en gras
function handleNewLine(textarea) {
    const lines = textarea.value.split('\n');
    let newText = '';
    for (let i = 0; i < lines.length; i++) {
        if (i > 0) {
            newText += '<br>';
        }
        // Vérifie si la ligne commence par une date (format simple)
        if (/^\d{2}\/\d{2}\/\d{4}/.test(lines[i])) {
            newText += `<strong>${lines[i]}</strong>`;
        } else {
            newText += lines[i];
        }
    }
    textarea.value = newText;
    updatePreview();
}

// Récupération de la modale
const modal = document.getElementById("coordonneesModal");

// Fonction pour ouvrir la modale
function openModal() {
    modal.style.display = "block";
}

// Fonction pour fermer la modale
function closeModal() {
    modal.style.display = "none";
}

// Fermer la modale si on clique en dehors
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}



// Fonction pour sauvegarder les coordonnées
function saveCoordonnees() {
    const telephone = document.getElementById('telephone').value;
    const email = document.getElementById('email').value;
    const localisation = document.getElementById('localisation').value;
    
    // Mise à jour de l'aperçu
    updatePreview();
    
    // Fermer la modale
    closeModal();
}

// Fonction pour télécharger le CV en PDF
function downloadPDF() {
    const cvContent = document.getElementById('cv-editor').value;
    const doc = new jsPDF();
    doc.html(document.getElementById('preview-content'), {
        callback: function(doc) {
            doc.save('mon_cv.pdf');
        },
        x: 15,
        y: 15,
        width: 170,
        windowWidth: 650
    });
}


// Fonction pour télécharger le CV en Word (nécessite un serveur pour générer le fichier)
function downloadWord() {
    const cvContent = document.getElementById('cv-editor').value;
    // Ici, vous devez envoyer le contenu du CV à un serveur pour qu'il génère un fichier Word
    // et le renvoie à l'utilisateur pour téléchargement. Voici un exemple de comment cela pourrait être fait :
    fetch('/generate-word', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: cvContent }),
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mon_cv.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Erreur lors de la génération du fichier Word:', error));
}

// Fonction pour afficher l'effet de chargement
function showLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay show';
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingOverlay);
    setTimeout(() => {
        loadingOverlay.className = 'loading-overlay';
        setTimeout(() => {
            document.body.removeChild(loadingOverlay);
        }, 500);
    }, 1000); // Simule un délai de chargement
}

// Écouteurs d'événements pour les boutons de téléchargement
document.getElementById('downloadPDF').addEventListener('click', downloadPDF);
document.getElementById('downloadWord').addEventListener('click', downloadWord);

// Écouteurs d'événements pour la mise à jour en temps réel
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', updatePreview);
});

// Initialisation de l'aperçu
updatePreview();

// Ajoutez ces fonctions à la fin de votre fichier app.js existant

// Fonction pour générer le PDF
function generatePDF() {
    const element = document.getElementById('preview-content');
    const opt = {
        margin: [10, 10, 10, 10], // Marge en mm pour haut, droite, bas, gauche,
        filename: 'mon_cv.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        putOnlyUsedFonts: true
    },
    pagebreak: { mode: ['avoid-all', 'css'] }    
    };

    // Génération du PDF
    html2pdf().set(opt).from(element).save();
}

// Fonction pour générer le document Word
function generateWord() {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + document.getElementById('preview-content').innerHTML + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'mon_cv.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
}

// Ajoutez également les écouteurs d'événements pour les boutons
document.addEventListener('DOMContentLoaded', function() {
    const pdfButton = document.querySelector('.download-button[onclick="generatePDF()"]');
    const wordButton = document.querySelector('.download-button[onclick="generateWord()"]');
    
    if(pdfButton) pdfButton.addEventListener('click', generatePDF);
    if(wordButton) wordButton.addEventListener('click', generateWord);
});

