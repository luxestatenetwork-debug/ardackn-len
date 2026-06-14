// lib/imageUtils.js

/**
 * Sıkıştırılmış bir resmi Base64 formatına dönüştürür.
 * @param {File} file - Dönüştürülecek resim dosyası
 * @param {number} maxWidth - Maksimum genişlik (piksel)
 * @param {number} maxHeight - Maksimum yükseklik (piksel)
 * @param {number} quality - Kalite oranı (0.1 ile 1.0 arası)
 * @returns {Promise<string>} Sıkıştırılmış Base64 Data URL
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    // Sunucu tarafında (SSR) çalışıyorsa doğrudan çöz
    if (typeof window === 'undefined') {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Boyut oranlarını koruyarak maksimum genişlik ve yüksekliği sınırla
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context could not be created'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // JPEG formatında sıkıştırılmış olarak Base64 çıktısı al
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Herhangi bir dosyayı (PDF vb.) doğrudan Base64 formatına dönüştürür.
 * @param {File} file - Dönüştürülecek dosya
 * @returns {Promise<string>} Base64 Data URL
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
