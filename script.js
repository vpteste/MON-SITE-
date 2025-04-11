// Fonction pour mettre à jour l'aperçu en temps réel
function updatePreview() {
    const previewContent = document.getElementById('preview-content');
    previewContent.innerHTML = `
        <h2>Profil Personnel</h2>
        <p>${document.getElementById('profil').value}</p>
        <h2>Coordonnées</h2>
        <p>${document.getElementById('coordonnees').value}</p>
        <h2>Compétences</h2>
        <p>${document.getElementById('competences').value}</p>
        <h2>Expérience</h2>
        <p>${document.getElementById('experience').value}</p>
        <h2>Formations</h2>
        <p>${document.getElementById('formations').value}</p>
        <h2>Hobbies</h2>
        <p>${document.getElementById('hobbies').value}</p>
    `;
}

// Écouteurs d'événements pour la mise à jour en temps réel
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', updatePreview);
});

// Initialisation de l'aperçu
updatePreview();


function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewContent = document.getElementById('preview-content');
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.borderRadius = '50%';
        previewContent.insertBefore(img, previewContent.firstChild);
    }
    reader.readAsDataURL(event.target.files[0]);
}

// Écouteurs d'événements pour la mise à jour en temps réel
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', updatePreview);
});

// Initialisation de l'aperçu
updatePreview();

function downloadCV() {
    requireLogin();
    const cvContent = document.getElementById('cv-editor').value;
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank'); // Ouvre dans une nouvelle fenêtre ou onglet
}
