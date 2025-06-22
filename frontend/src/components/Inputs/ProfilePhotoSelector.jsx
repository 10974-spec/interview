import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {

const  inputRef = useRef(null);
const [previewUrl, setPreviewUrl] = useState(null);

const handleImageChange = (event) => {
    const file = event.target.files[0]
    if(file){
        // ****UPDATE THE IMAGE STATE****//
        setImage(file);

        // ****GENERATE PREVIEW URL FROM THE FILE ****//

        const preview = URL.createObjectURL(file);
        if(setPreview){
            setPreview(preview);
        }
        setPreviewUrl(preview)
    }
};

const handleRemoveImage = () => {
    setImage(null)
    setPreviewUrl(null)

    if(setPreview){
        setPreview(null)
    }

};

const onChooseFile = () => {
    inputRef.current.click();
}


  return <div>ProfilePhotoSelector</div>;
};

export default ProfilePhotoSelector;
