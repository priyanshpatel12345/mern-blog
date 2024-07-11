import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [uploadFileProgress, setUploadFileProgress] = useState(null);
  const [uploadFileError, setUploadFileError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleImageUpload = async () => {
    try {
      setUploadFileError(null);
      if (!file) {
        setUploadFileError("Please Select an image");
        return;
      }
      setUploadFileProgress(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadFileProgress(progress.toFixed(0));
        },
        (error) => {
          setUploadFileError(
            "Could not upload Image (File Must be less than 2MB)"
          );
          setUploadFileProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadFileProgress(null);
            setUploadFileError(null);

            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setUploadFileError("upload Image failed");
      setUploadFileProgress(null);
      console.log(error);
    }
  };
  return (
    <div className=" p-5 max-w-3xl mx-auto min-h-screen ">
      <h1 className="text-center font-semibold text-3xl my-7 text-black dark:text-white ">
        Create a Post
      </h1>
      <form className="flex flex-col gap-4  ">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title "
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-dotted border-green-500 p-5">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            size="sm"
            outline
            onClick={handleImageUpload}
            disabled={uploadFileProgress}
          >
            {uploadFileProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={uploadFileProgress}
                  text={`${uploadFileProgress || 0} %`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {uploadFileError && <Alert color="failure">{uploadFileError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
        />

        <Button
          gradientDuoTone="purpleToPink"
          outline
          type="submit"
          className="w-full mt-5"
        >
          Publish
        </Button>
      </form>
    </div>
  );
}
