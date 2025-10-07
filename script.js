// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadContainer = document.getElementById('uploadContainer');
const activateCameraBtn = document.getElementById('activateCameraBtn');
const resultsSection = document.getElementById('resultsSection');
const previewImage = document.getElementById('previewImage');
const statusBadge = document.getElementById('statusBadge');
const diseaseName = document.getElementById('diseaseName');
const diseaseDescription = document.getElementById('diseaseDescription');
const confidenceValue = document.getElementById('confidenceValue');
const confidenceBar = document.getElementById('confidenceBar');
const diseaseDetails = document.getElementById('diseaseDetails');
const diseaseInfo = document.getElementById('diseaseInfo');
const resultCard = document.getElementById('resultCard');
const loadingIndicator = document.getElementById('loadingIndicator');
const modelStatus = document.getElementById('modelStatus');
const statusIcon = document.getElementById('statusIcon');
const statusText = document.getElementById('statusText');

// Camera Elements
const cameraView = document.getElementById('cameraView');
const webcamElement = document.getElementById('webcam');
const captureBtn = document.getElementById('captureBtn');

// Teachable Machine Model
const URL = "https://teachablemachine.withgoogle.com/models/wv7FAqivr/";
let model, webcam, labelContainer, maxPredictions;

// Initialize the model
async function initModel() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // Load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Update status
        statusIcon.className = "fas fa-check-circle text-green-600 mr-3";
        statusText.textContent = "AI model loaded successfully!";
        modelStatus.className = "max-w-3xl mx-auto mb-6";
        modelStatus.firstElementChild.className = "bg-green-50 border border-green-200 rounded-lg p-4";
        statusText.className = "text-green-800";

        // Enable upload functionality
        uploadContainer.style.pointerEvents = 'auto';
        uploadContainer.style.opacity = '1';
        activateCameraBtn.disabled = false; // Enable camera button

        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Error loading model:", error);
        statusIcon.className = "fas fa-exclamation-triangle text-red-600 mr-3";
        statusText.textContent = "Error loading AI model. Please refresh the page.";
        modelStatus.firstElementChild.className = "bg-red-50 border border-red-200 rounded-lg p-4";
        statusText.className = "text-red-800";
    }
}

async function setupWebcam() {
    try {
        // Hide upload section and show camera view
        uploadContainer.style.display = 'none';
        activateCameraBtn.style.display = 'none';
        cameraView.classList.remove('hidden');

        const constraints = { video: { width: 224, height: 224, facingMode: "environment"} };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        webcamElement.srcObject = stream;
        await webcamElement.play();

    } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Gagal mengakses kamera. Pastikan Anda memberikan izin akses kamera.");

        // Show upload section again
        uploadContainer.style.display = 'block';
        activateCameraBtn.style.display = 'block';
        cameraView.classList.add('hidden');
    }
}

// Disease database - updated to match model classes
const diseases = {
    "Sehat": {
        name: "Tanaman Sehat",
        description: "Tanaman cabai Anda tampak dalam keadaan sehat dan tidak ada tanda-tanda penyakit.",
        badgeClass: "bg-green-100 text-green-800",
        cardClass: "border-green-200 bg-green-50",
        details: `
            <p class="mb-2">Tanaman cabai Anda tidak menunjukkan tanda-tanda penyakit. Pertahankan kerja bagus!</p>
            <p class="font-medium mb-1">Maintenance Tips:</p>
            <ul class="list-disc list-inside space-y-1">
                <li>Lanjutkan jadwal penyiraman secara teratur</li>
                <li>Pastikan sinar matahari 6-8 jam setiap hari</li>
                <li>Pupuk setiap 4-6 minggu</li>
                <li>Memantau hama</li>
            </ul>
        `
    },
    "cerospora": {
        name: "Bercak dau cerospora",
        description: "Small circular spots with gray centers and dark brown margins detected.",
        badgeClass: "bg-red-100 text-red-800",
        cardClass: "border-red-200 bg-red-50",
        details: `
            <p class="mb-2">Disebabkan oleh jamur<i>Cercospora capsici</i>, penyakit ini tumbuh subur pada kondisi hangat dan lembab.</p>
            <p class="font-medium mb-1">Symptoms:</p>
            <ul class="list-disc list-inside space-y-1 mb-2">
                <li>Bintik-bintik melingkar kecil diameter (2-10mm)</li>
                <li>Bagian tengah berwarna abu-abu dengan tepi berwarna coklat tua</li>
                <li><Lingkaran cahaya kuning di sekitar bintik-bintik/li>
                <li>Daun rontok sebelum waktunya pada kasus yang parah</li>
            </ul>
            <p class="font-medium mb-1">Treatment:</p>
            <ul class="list-disc list-inside space-y-1">
                <li>Buang dan musnahkan daun yang terinfeksi</li>
                <li>Menggunakan fungisida berbahan dasar tembaga</li>
                <li>Meningkatkan sirkulasi udara</li>
                <li>Hindari penyiraman di atas kepala</li>
            </ul>
        `
    },
    "layu": {
        name: "Layu Fusarium ",
        description: "Daun menguning dan layu terdeteksi, seringkali dimulai pada satu sisi.",
        badgeClass: "bg-orange-100 text-orange-800",
        cardClass: "border-orange-200 bg-orange-50",
        details: `
            <p class="mb-2">Disebabkan oleh <i>Ralstonia solanacearum</i>, bakteri tular tanah ini menyebabkan layu yang cepat.</p>
            <p class="font-medium mb-1">Gejala:</p>
            <ul class="list-disc list-inside space-y-1 mb-2">
                <li>Dedaunan layu secara tiba-tiba</li>
                <li>Dedaunan berbaring secara tiba-tiba</li>
                <li>Perubahan warna coklat pada jaringan pembuluh darah</li>
                <li>Kematian tanaman dalam beberapa hari</li>
            </ul>
            <p class="font-medium mb-1">Perlakuan:</p>
            <ul class="list-disc list-inside space-y-1">
                <li>membuang dan menghancurkan tanaman yang terinfeksi</li>
                <li>Solarisasi tanah sebelum penanaman kembali</li>
                <li>Gunakan varietas tahan</li>
                <li>
Berlatih rotasi tanaman(3-4 Tahun)</li>
            </ul>
        `
    },    
        // Sudah
    "tepung": {
        name: "Jamur Tepung",
        description: "Pertumbuhan jamur berbentuk tepung berwarna putih terdeteksi pada permukaan daun.",
        badgeClass: "bg-purple-100 text-purple-800",
        cardClass: "border-purple-200 bg-purple-50",
        details: `
            <p class="mb-2">Disebabkan oleh berbagai jamur dalam ordo Erysiphales, penyakit ini menyukai kelembapan yang tinggi.</p>
            <p class="font-medium mb-1">Gejala:</p>
            <ul class="list-disc list-inside space-y-1 mb-2">
                <li>Bintik-bintik putih berbentuk tepung pada daun dan batang</li>
                <li>Menguningnya daun yang terserang</li>
                <li>Daun melengkung dan menyimpang</li>
                <li>Mengurangi produksi buah</li>
            </ul>
            <p class="font-medium mb-1">Perlakuan:</p>
            <ul class="list-disc list-inside space-y-1">
                <li>Oleskan semprotan belerang atau kalium bikarbonat</li>
                <li>Gunakan minyak neem sebagai pengobatan organik</li>
                <li>Meningkatkan sirkulasi udara</li>
                <li>Kurangi pemupukan nitrogen</li>
            </ul>
        `
    },
    "antraknose": {
        name: "Anthracnose",      
        description: "Lesi cekung dan gelap terdeteksi pada daun dan mungkin buah.",
        badgeClass: "bg-amber-100 text-amber-800",
        cardClass: "border-amber-200 bg-amber-50",
        details: `
            <p class="mb-2">Disebabkan oleh spesies <i>Colletotrichum</i>, jamur ini menyebar dengan cepat dalam kondisi basah.</p>
            <p class="font-medium mb-1">Gejala:</p>
            <ul class="list-disc list-inside space-y-1 mb-2">
                <li>Bintik-bintik kecil, melingkar, dan cekung pada buah</li>
                <li>
Bintik coklat tidak beraturan pada daun</li>
                <li>
Lesi gelap dengan cincin konsentriss</li>
                <li>Busuk buah dalam stadium lanjut</li>
            </ul>
            <p class="font-medium mb-1">Perlakuan:</p>
            <ul class="list-disc list-inside space-y-1">
                <li>Buang dan musnahkan bagian tanaman yang terinfeksi</li>
                <li>Oleskan fungisida klorotalonil atau mancozeb</li>
                <li>
Hindari bekerja dengan tanaman basah</li>
                <li>Pastikan jarak tanam yang tepat</li>
            </ul>
        `
    }
};

// Event Listeners
uploadContainer.addEventListener('click', () => {
    if (model) {
        fileInput.click();
    } else {
        alert('Harap tunggu hingga model AI dimuat terlebih dahulu.');
    }
});

uploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (model) {
        uploadContainer.classList.add('dragover');
    }
});

uploadContainer.addEventListener('dragleave', () => {
    uploadContainer.classList.remove('dragover');
});

uploadContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadContainer.classList.remove('dragover');
    if (e.dataTransfer.files.length && model) {
        fileInput.files = e.dataTransfer.files;
        handleFileUpload(fileInput.files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length && model) {
        handleFileUpload(fileInput.files[0]);
    }
});

activateCameraBtn.addEventListener('click', () => {
    if (!model) {
        alert('Harap tunggu hingga model AI dimuat terlebih dahulu.');
        return;
    }
    setupWebcam();
});

captureBtn.addEventListener('click', () => {
    if (webcamElement.srcObject) {
        const canvas = document.createElement('canvas');
        canvas.width = webcamElement.videoWidth;
        canvas.height = webcamElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to a data URL and set as preview
        previewImage.src = canvas.toDataURL('image/jpeg');
        previewImage.onload = () => {
            // Stop camera stream
            const tracks = webcamElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            webcamElement.srcObject = null;

            // Hide camera view and show results
            cameraView.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });

            processImage();
        };
    }
});

// Functions
function handleFileUpload(file) {
    if (!file.type.match('image.*')) {
        alert('upload file foto');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file melebihi batas 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewImage.onload = function() {
            processImage();
        };
    };
    reader.readAsDataURL(file);
}

async function processImage() {
    // Show results section and loading indicator
    resultsSection.classList.remove('hidden');
    loadingIndicator.classList.remove('hidden');
    resultCard.classList.add('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    try {
        // Create a canvas element to resize the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match model input requirements (usually 224x224)
        canvas.width = 224;
        canvas.height = 224;
        
        // Draw and resize the image
        ctx.drawImage(previewImage, 0, 0, 224, 224);
        
        // Get predictions from the model
        const predictions = await model.predict(canvas);
        
        // Find the prediction with the highest confidence
        let maxConfidence = 0;
        let predictedClass = '';
        
        for (let i = 0; i < predictions.length; i++) {
            if (predictions[i].probability > maxConfidence) {
                maxConfidence = predictions[i].probability;
                predictedClass = predictions[i].className;
            }
        }
        
        // Convert confidence to percentage
        const confidencePercentage = Math.round(maxConfidence * 100);
        
        // Hide loading indicator and show results
        loadingIndicator.classList.add('hidden');
        resultCard.classList.remove('hidden');
        
        // Update UI with results
        updateResults(predictedClass, confidencePercentage);
        
    } catch (error) {
        console.error('Kesalahan dalam memproses gambar', error);
        loadingIndicator.classList.add('hidden');
        resultCard.classList.remove('hidden');
        
        // Show error message
        diseaseName.textContent = 'Error';
        diseaseDescription.textContent = 'tidak bisa memproses gambar harap coba lagi.';
        statusBadge.textContent = 'Error';
        statusBadge.className = 'px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800';
        confidenceValue.textContent = '0%';
        confidenceBar.style.width = '0%';
        diseaseDetails.innerHTML = '<p class="text-red-600">tolong upload gambar yang berbeda </p>';
    }
}

function updateResults(predictedClass, confidence) {
    const disease = diseases[predictedClass];
    
    if (!disease) {
        // Handle unknown class
        diseaseName.textContent = 'Unknown';
        diseaseDescription.textContent = 'Model AI tidak dapat mengidentifikasi kondisi ini.';
        statusBadge.textContent = 'Unknown';
        statusBadge.className = 'px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800';
        diseaseDetails.innerHTML = '<p>Silakan coba upload gambar yang lebih jelas atau konsultasikan dengan ahli tanaman.</p>';
        resultCard.className = 'disease-card p-4 rounded-lg border border-gray-200 bg-gray-50';
    } else {
        // Update UI with disease information
        statusBadge.textContent = predictedClass === 'Sehat' ? 'Sehat' : 'penyakit terdeteksi';
        statusBadge.className = `px-3 py-1 rounded-full text-sm font-medium ${disease.badgeClass}`;
        
        diseaseName.textContent = disease.name;
        diseaseDescription.textContent = disease.description;
        
        diseaseDetails.innerHTML = disease.details;
        diseaseInfo.className = `bg-gray-50 rounded-lg p-4 ${
            predictedClass === 'Sehat' ? 'border border-green-200' : 'border border-red-200'
        }`;
        
        resultCard.className = `disease-card p-4 rounded-lg border ${disease.cardClass}`;
    }
    
    // Update confidence meter
    confidenceValue.textContent = `${confidence}%`;
    confidenceBar.style.width = `${confidence}%`;
    confidenceBar.className = `h-2.5 rounded-full ${
        predictedClass === 'Sehat' ? 'bg-green-600' : 'bg-red-600'
    }`;
    
    // Special handling for Cercospora disease
    if (predictedClass === 'cerospora') {
        const existingAlert = resultCard.querySelector('.bg-red-50');
        if (!existingAlert) {
            const cercosporaAlert = document.createElement('div');
            cercosporaAlert.className = 'mt-4 p-3 bg-red-50 border border-red-200 rounded-lg';
            cercosporaAlert.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    <span class="text-red-800 font-medium">Diperlukan Tindakan Segera</span>
                </div>
                <p class="text-red-700 text-sm mt-1">
                    Cercospora menyebar dengan cepat dalam kondisi lembab. Buang segera daun yang terserang dan gunakan pengobatan fungisida.
                </p>
            `;
            resultCard.appendChild(cercosporaAlert);
        }
        
        // Update disease info with emergency treatment
        diseaseInfo.innerHTML = `
            <div class="flex items-center mb-3">
                <i class="fas fa-disease text-red-600 mr-2"></i>
                <h3 class="text-lg font-medium text-red-700">Emergency Treatment for Cercospora</h3>
            </div>
            <div class="bg-red-50 p-4 rounded-lg mb-4">
                <h4 class="font-bold text-red-800 mb-2">Langkah segera(lakukan hari ini):</h4>
                <ol class="list-decimal list-inside space-y-1 text-red-700 mb-3">
                    <li>Buang semua daun yang terinfeksi dan buang jauh dari kebun</li>
                    <li>Disinfeksi alat pemangkas dengan alkohol 70% di sela-sela pemotongan</li>
                    <li>Oleskan fungisida berbahan dasar tembaga pada sisa dedaunan yang sehat</li>
                    <li>Meningkatkan sirkulasi udara di sekitar tanaman</li>
                </ol>
            </div>
            <div class="text-gray-700">
                <p class="mb-2">Disebabkan oleh jamur <i>Cercospora capsici</i>, penyakit ini tumbuh subur di kondisi hangat dan lembab dan dapat merusak tanaman cabai jika tidak ditangani.</p>
                <p class="font-medium mb-1">Detailed Symptoms:</p>
                <ul class="list-disc list-inside space-y-1 mb-3">
                    <li>Bintik melingkar kecil (diameter 2-10 mm) dengan batas jelas</li>
                    <li>Bagian tengah berwarna abu-abu atau cokelat dengan tepi berwarna coklat tua hingga hitam</li>
                    <li>Lingkaran cahaya kuning di sekitar bintik (klorosis)</li>
                    <li>Bercak dapat bergabung membentuk area nekrotik yang luas</li>
                    <li>Daun rontok sebelum waktunya pada kasus yang parah</li>
                    <li>Mengurangi produksi dan kualitas buah</li>
                </ul>
                <p class="font-medium mb-1">Manajemen Jangka Panjang:</p>
                <ul class="list-disc list-inside space-y-1 mb-3">
                    <li>Aplikasi fungisida mingguan selama cuaca lembab</li>
                    <li>Hindari penyiraman di atas kepala - gunakan irigasi tetes</li>
                    <li>Ruang tanaman cukup untuk sirkulasi udara</li>
                    <li>Singkirkan sisa-sisa tanaman dari kebun</li>
                    <li>Pertimbangkan varietas tahan untuk penanaman di masa depan</li>
                </ul>
                <p class="font-medium mb-1">Prevention for Next Season:</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>Rotasi tanaman - hindari menanam paprika di lokasi yang sama selama 2-3 tahun</li>
                    <li>Pilih benih bersertifikat bebas penyakit</li>
                    <li>Terapkan perawatan fungisida preventif di awal musim</li>
                    <li>Pantau kondisi cuaca - tingkatkan kewaspadaan selama periode lembab</li>
                </ul>
            </div>
        `;
    }else if (predictedClass === 'layu') {
        // Add additional visual indicators for layu
        const existingAlert = resultCard.querySelector('.bg-red-50');
        if (!existingAlert) {
            const layuAlert = document.createElement('div');
            layuAlert.className = 'mt-4 p-3 bg-red-50 border border-red-200 rounded-lg';
            layuAlert.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    <span class="text-red-800 font-medium">Tindakan Segera Diperlukan</span>
                </div>
                <p class="text-red-700 text-sm mt-1">
                    Layu fusarium dapat menyebar dengan cepat melalui tanah. Buang tanaman yang terinfeksi dan terapkan manajemen tanah yang tepat.
                </p>
            `;
            resultCard.appendChild(layuAlert);
        }
        
        // Update disease info with emergency treatment
        diseaseInfo.innerHTML = `
            <div class="flex items-center mb-3">
                <i class="fas fa-disease text-red-600 mr-2"></i>
                <h3 class="text-lg font-medium text-red-700">Perlakuan Darurat untuk Layu Fusarium</h3>
            </div>
            <div class="bg-red-50 p-4 rounded-lg mb-4">
                <h4 class="font-bold text-red-800 mb-2">Langkah Segera (Lakukan Hari Ini):</h4>
                <ol class="list-decimal list-inside space-y-1 text-red-700 mb-3">
                    <li>Buang dan musnahkan semua tanaman yang terinfeksi dari area tanam.</li>
                    <li>Jangan tanam cabai atau tanaman solanaceous lainnya di lokasi yang sama.</li>
                    <li>Disinfeksi semua peralatan yang digunakan dengan larutan pemutih 10%.</li>
                    <li>Periksa tanaman terdekat untuk tanda-tanda penyakit.</li>
                </ol>
            </div>
            <div class="text-gray-700">
                <p class="mb-2">Disebabkan oleh bakteri <i>Ralstonia solanacearum</i>, penyakit ini menyebabkan tanaman layu dengan cepat dan seringkali mematikan.</p>
                <p class="font-medium mb-1">Gejala Rinci:</p>
                <ul class="list-disc list-inside space-y-1 mb-3">
                    <li>Layu mendadak pada dedaunan tanpa menguning terlebih dahulu.</li>
                    <li>Saat batang dipotong, mungkin terlihat perubahan warna coklat pada jaringan pembuluh darah.</li>
                    <li>Tes gelombang bakteri: potong batang dan celupkan ke dalam air bersih. Aliran bakteri putih akan keluar.</li>
                    <li>Kematian tanaman dalam beberapa hari setelah gejala pertama muncul.</li>
                </ul>
                <p class="font-medium mb-1">Manajemen Jangka Panjang:</p>
                <ul class="list-disc list-inside space-y-1 mb-3">
                    <li>Rotasi tanaman secara ketat (3-4 tahun) dengan tanaman non-solanaceous.</li>
                    <li>Gunakan varietas cabai yang tahan terhadap penyakit layu fusarium.</li>
                    <li>Tingkatkan drainase tanah untuk mengurangi kondisi lembab.</li>
                    <li>Solasisasi tanah (menutup tanah dengan plastik bening di bawah sinar matahari) untuk membunuh patogen.</li>
                </ul>
                <p class="font-medium mb-1">Pencegahan untuk Musim Tanam Berikutnya:</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>Gunakan benih atau bibit bersertifikat bebas penyakit.</li>
                    <li>Tanam di lokasi dengan riwayat penyakit yang bersih.</li>
                    <li>Hindari merusak akar tanaman saat budidaya.</li>
                </ul>
            </div>
        `;
    } else if (predictedClass === 'tepung') {
        // Add additional visual indicators for tepung
        const existingAlert = resultCard.querySelector('.bg-red-50');
        if (!existingAlert) {
            const tepungAlert = document.createElement('div');
            tepungAlert.className = 'mt-4 p-3 bg-red-50 border border-red-200 rounded-lg';
            tepungAlert.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    <span class="text-red-800 font-medium">Tindakan Segera Diperlukan</span>
                </div>
                <p class="text-red-700 text-sm mt-1">
                    Jamur tepung dapat menyebar dengan cepat. Gunakan fungisida yang sesuai dan tingkatkan sirkulasi udara.
                </p>
            `;
            resultCard.appendChild(tepungAlert);
        }
        
        // Update disease info with emergency treatment
        diseaseInfo.innerHTML = `
            <div class="flex items-center mb-3">
                <i class="fas fa-disease text-red-600 mr-2"></i>
                <h3 class="text-lg font-medium text-red-700">Perlakuan Darurat untuk Jamur Tepung</h3>
            </div>
            <div class="bg-red-50 p-4 rounded-lg mb-4">
                <h4 class="font-bold text-red-800 mb-2">Langkah Segera (Lakukan Hari Ini):</h4>
                <ol class="list-decimal list-inside space-y-1 text-red-700 mb-3">
                    <li>Buang dan musnahkan daun yang sangat terinfeksi untuk mencegah penyebaran.</li>
                    <li>Oleskan semprotan fungisida seperti kalium bikarbonat, sulfur, atau minyak neem.</li>
                    <li>Hindari penyiraman di atas kepala untuk menjaga daun tetap kering.</li>
                    <li>Tingkatkan sirkulasi udara di sekitar tanaman.</li>
                </ol>
            </div>
            <div class="text-gray-700">
                <p class="mb-2">Disebabkan oleh berbagai jenis jamur, penyakit ini menyukai kondisi kelembaban tinggi dan suhu sedang.</p>
                <p class="font-medium mb-1">Gejala Rinci:</p>
                <ul class="list-disc list-inside space-y-1 mb-3">
                    <li>Bintik-bintik putih berbentuk tepung pada permukaan atas daun.</li>
                    <li>Daun yang terinfeksi dapat menguning, melengkung, atau rontok.</li>
                    <li>Pertumbuhan tanaman terhambat dan hasil buah berkurang.</li>
                    <li>Pada kasus parah, seluruh tanaman tampak tertutup bubuk putih.</li>
                </ul>
                <p class="font-medium mb-1">Manajemen Jangka Panjang:</p>
                <ul class="list-disc list-inside space-y-1 mb-3">
                    <li>Gunakan varietas tanaman cabai yang tahan terhadap jamur tepung.</li>
                    <li>Pangkas tanaman secara teratur untuk meningkatkan aliran udara.</li>
                    <li>Hindari kelebihan pupuk nitrogen, yang dapat mendorong pertumbuhan daun yang rentan.</li>
                </ul>
                <p class="font-medium mb-1">Pencegahan untuk Musim Tanam Berikutnya:</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>Tanam di area dengan sinar matahari yang cukup.</li>
                    <li>Bersihkan puing-puing tanaman dari musim sebelumnya.</li>
                </ul>
            </div>
        `;
    } else if (predictedClass === 'antraknose') {
        // Add additional visual indicators for antraknose
        const existingAlert = resultCard.querySelector('.bg-red-50');
        if (!existingAlert) {
            const antraknoseAlert = document.createElement('div');
            antraknoseAlert.className = 'mt-4 p-3 bg-red-50 border border-red-200 rounded-lg';
            antraknoseAlert.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    <span class="text-red-800 font-medium">Tindakan Segera Diperlukan</span>
                </div>
                <p class="text-red-700 text-sm mt-1">
                    Antraknosa menyebar dengan cepat dalam kondisi basah. Buang bagian tanaman yang terinfeksi dan terapkan fungisida.
                </p>
            `;
            resultCard.appendChild(antraknoseAlert);
        }
        
        // Update disease info with emergency treatment
        diseaseInfo.innerHTML = `
            <div class="flex items-center mb-3">
                <i class="fas fa-disease text-red-600 mr-2"></i>
                <h3 class="text-lg font-medium text-red-700">Perlakuan Darurat untuk Antraknosa</h3>
            </div>
            <div class="bg-red-50 p-4 rounded-lg mb-4">
                <h4 class="font-bold text-red-800 mb-2">Langkah Segera (Lakukan Hari Ini):</h4>
                <ol class="list-decimal list-inside space-y-1 text-red-700 mb-3">
                    <li>Buang dan musnahkan semua daun dan buah yang terinfeksi.</li>
                    <li>Oleskan fungisida yang mengandung tembaga atau mancozeb.</li>
                    <li>Hindari bekerja dengan tanaman saat basah untuk mencegah penyebaran.</li>
                    <li>Pastikan tanaman memiliki jarak yang cukup untuk sirkulasi udara yang baik.</li>
                </ol>
            </div>
            <div class="text-gray-700">
                <p class="mb-2">Disebabkan oleh jamur <i>Colletotrichum</i>, antraknosa menyebar dengan cepat dalam kondisi basah dan dapat merusak hasil panen.</p>
                <p class="font-medium mb-1">Gejala Rinci:</p>
                <ul class="list-disc list-inside space-y-1 mb-3">
                    <li>Bintik-bintik cekung, melingkar, dan gelap pada buah.</li>
                    <li>Bintik coklat tidak beraturan pada daun.</li>
                    <li>Lesi gelap dengan cincin konsentris.</li>
                    <li>Pembusukan buah pada tahap lanjut.</li>
                </ul>
                <p class="font-medium mb-1">Manajemen Jangka Panjang:</p>
                <ul class="list-disc list-inside space-y-1 mb-3">
                    <li>Lakukan rotasi tanaman dengan hati-hati.</li>
                    <li>Tingkatkan drainase tanah dan hindari genangan air.</li>
                    <li>Gunakan mulsa untuk mencegah spora jamur memantul dari tanah ke daun.</li>
                </ul>
                <p class="font-medium mb-1">Pencegahan untuk Musim Tanam Berikutnya:</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>Pilih varietas yang tahan penyakit.</li>
                    <li>Bersihkan dan buang semua sisa-sisa tanaman setelah panen.</li>
                </ul>
            </div>
        `;
    }
}
// Initialize the model when the page loads
window.addEventListener('load', initModel);