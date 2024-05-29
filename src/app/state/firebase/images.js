import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {storage} from "./init";

export async function saveImage(userId, selectedImage) {
  try {
    const assetUri = selectedImage.uri;
    const assetType = selectedImage.mediaType || "image";
    const filename = assetUri.substring(assetUri.lastIndexOf("/") + 1);
    const fileRef = ref(storage, `${userId}/${filename}`);

    const response = await fetch(assetUri);
    const blob = await response.blob();
    const file = new File([blob], filename, {type: assetType});

    const snapshot = await uploadBytes(fileRef, file);
    const data = snapshot.metadata;

    return {data, error: null};
  } catch (error) {
    console.error("Error saving image:", error);
    return {data: null, error};
  }
}

export async function getImages(userId) {
  const userRef = ref(storage, userId);

  try {
    const images = [];
    const imageRefs = await listAll(userRef);
    console.log(imageRefs);

    for (const imageRef of imageRefs.items) {
      const renderUrl = await getDownloadURL(ref(storage, imageRef.fullPath));
      const deleteUrl = imageRef.fullPath;
      images.push({renderUrl, deleteUrl});
    }

    return {images, error: null};
  } catch (error) {
    console.error("Error retrieving image URLs:", error);
    return {images: null, error};
  }
}

export async function deleteImage(userId, imageURL) {
  try {
    const filename = imageURL.substring(imageURL.lastIndexOf("/") + 1);
    const imageRef = ref(storage, `${userId}/${filename}`);
    await deleteObject(imageRef);
    return {success: true, error: null};
  } catch (error) {
    console.error("Error deleting image:", error);
    return {success: false, error};
  }
}
