import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [images, setImages] = useState([]);  // Menyimpan array gambar
  const [collage, setCollage] = useState(null);  // Menyimpan gambar kolase
  const [capturedCount, setCapturedCount] = useState(0);  // Menghitung jumlah gambar yang diambil
  const [capturing, setCapturing] = useState(false);  // Menandakan apakah gambar sedang diambil otomatis
  const [startCapture, setStartCapture] = useState(false); // Menandakan apakah tombol sudah diklik
  const [timer, setTimer] = useState(3);  // Timer untuk countdown 3 detik
  const [blinking, setBlinking] = useState(false);  // Menandakan apakah efek berkedip aktif
  
  // Fungsi untuk mengambil gambar otomatis setiap 3 detik
  useEffect(() => {
    let intervalId;
    
    if (startCapture && capturedCount < 4) {
      intervalId = setInterval(() => {
        if (timer > 1) {
          setTimer((prevTimer) => prevTimer - 1);  // Mengurangi waktu timer setiap detik
        } else if (timer === 1) {
          captureImage();  // Ambil gambar langsung tanpa menunggu timer 0
          setTimer(3);  // Reset timer ke 3 detik
        }
      }, 1000);  // Setiap detik

      // Menghentikan interval setelah 4 gambar diambil
      if (capturedCount === 4) {
        clearInterval(intervalId);
      }

      return () => clearInterval(intervalId);  // Cleanup interval saat komponen di-unmount
    }

    return () => clearInterval(intervalId); // Cleanup jika komponen tidak sedang menangkap gambar
  }, [startCapture, capturedCount, timer]);

  const captureImage = () => {
    setBlinking(true);  // Aktifkan efek berkedip
    const photo = webcamRef.current.getScreenshot();
    setImages((prevImages) => [...prevImages, photo]);
    setCapturedCount(capturedCount + 1);

    setTimeout(() => {
      setBlinking(false);  // Nonaktifkan efek berkedip setelah 200ms
    }, 200);  // Durasi berkedip (200ms)
  };

  const createCollage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Menggambar gambar-gambar pada canvas untuk membuat kolase
    images.forEach((imgSrc, index) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        const xPos = (index % 2) * (width / 2);  // Posisi horizontal
        const yPos = Math.floor(index / 2) * (height / 2);  // Posisi vertikal
        ctx.drawImage(img, xPos, yPos, width / 2, height / 2);  // Gambar bagian kolase

        // Jika sudah semua gambar digabungkan, simpan hasilnya
        if (index === images.length - 1) {
          const collageUrl = canvas.toDataURL('image/jpeg', 1.0);

          // Menambahkan mirror (transformasi horizontal)
          const mirroredCanvas = document.createElement('canvas');
          const mirroredCtx = mirroredCanvas.getContext('2d');
          mirroredCanvas.width = canvas.width;
          mirroredCanvas.height = canvas.height;
          mirroredCtx.scale(-1, 1);  // Membalik gambar horizontal
          mirroredCtx.drawImage(canvas, -canvas.width, 0);  // Gambar dengan transformasi

          // Ambil URL dari canvas yang sudah dimirror
          const mirroredCollageUrl = mirroredCanvas.toDataURL('image/jpeg', 1.0);
          setCollage(mirroredCollageUrl);  // Menyimpan hasil kolase mirror
        }
      };
    });
  };

  useEffect(() => {
    if (images.length === 4) {
      createCollage();
    }
  }, [images]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-indigo-600">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-4/5 md:w-2/3 lg:w-1/2">
      <h1>Juju PhotoBox</h1>
        {collage ? (
          <div className="flex flex-col items-center">
            <img
              src={collage}
              alt="Collage"
              className="w-full h-full object-cover rounded-lg border-4 border-gray-300"
            />
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = collage;
                a.download = 'photo-collage.jpg';
                a.click();
              }}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              Download
            </button>
          </div>
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={1}
              width="1920"
              videoConstraints={{
                facingMode: "user",
                width: 1920,
                height: 1080,
              }}
              className={`rounded-lg ${blinking ? 'animate-blink' : ''}`}  // Menambahkan efek berkedip dengan animasi Tailwind
              style={{
                transform: "scaleX(-1)",
                filter: "brightness(1.2)",
              }}
            />
            {startCapture && (
              <div className="text-black text-5xl font-bold">
                {timer > 0 ? timer : ""} {/* Menghilangkan tulisan "Smile!" */}
              </div>
            )}
            <div className="text-black mt-4">
              <p>Taking photo {capturedCount} / 4...</p>
            </div>
          </>
        )}
        {/* Tombol untuk memulai pengambilan gambar otomatis */}
        {!startCapture && (
          <button
            onClick={() => setStartCapture(true)}  // Memulai pengambilan gambar otomatis
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Start Capture :)
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;