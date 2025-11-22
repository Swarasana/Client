const compressImage = (file: File, quality = 0.7): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx?.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (!blob) return reject("Compression failed");

                    resolve(
                        new File([blob], file.name.replace(/\.(.*)$/, ".jpg"), {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                        })
                    );
                },
                "image/jpeg",
                quality
            );
        };

        img.onerror = reject;
    });
};

export default compressImage;
