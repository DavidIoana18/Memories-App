export async function uploadToCloudinary(file, uploadPreset, folder =''){
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset); 
    
    if (folder) {
        formData.append('folder', folder);
    }

    try{
        const response = await fetch('https://api.cloudinary.com/v1_1/dki5xequi/image/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data.secure_url; // return the URL of the uploaded image

    }catch(err){
        console.error('Error uploading image to Cloudinary:', err);
    }
}