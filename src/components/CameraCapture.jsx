import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const captureImage = () => {
    const photo = webcamRef.current.getScreenshot();
    setImage(photo);
  };

  const handleCaptureAgain = () => {
    // Me-refresh halaman ketika tombol "Capture Again" diklik
    window.location.reload();
  };

  const handleDownload = () => {
    // Membuat canvas untuk memanipulasi gambar
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      // Membalik gambar di canvas (mirror)
      ctx.scale(-1, 1);  // Membalikkan gambar secara horizontal
      ctx.drawImage(img, -img.width, 0); // Menggambar gambar yang sudah dibalik
      // Mendapatkan URL dari gambar yang sudah dimanipulasi
      const mirroredImage = canvas.toDataURL('image/jpeg');
      const a = document.createElement('a');
      a.href = mirroredImage;
      a.download = 'captured-photo-mirror.jpg';  // Nama file yang akan diunduh
      a.click();
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-indigo-600">
      <div className="bg-white rounded-lg shadow-lg p-4">
        {image ? (
          <div className="flex flex-col items-center">
            <img
              src={image}
              alt="Captured"
              className="w-80 h-80 object-cover rounded-lg"
              style={{ transform: "scaleX(-1)" }} // Membalik gambar yang di-capture
            />
            <button
              onClick={handleDownload} // Fungsi untuk mendownload gambar yang sudah dimanipulasi
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-700"
            >
              Download Photo
            </button>
          </div>
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}  // Menetapkan kualitas tertinggi untuk gambar
            width="640"  // Menetapkan resolusi tinggi untuk live stream
            videoConstraints={{
              facingMode: "user"
            }}
            className="rounded-lg"
            style={{
              transform: "scaleX(-1)" // Membalik tampilan live kamera
            }}
          />
        )}
        <button
          onClick={image ? handleCaptureAgain : captureImage}  // Mengubah fungsi berdasarkan kondisi
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          {image ? 'Capture Again' : 'Start Capture :)'}
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
