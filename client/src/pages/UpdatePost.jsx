import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [uploadFileProgress, setUploadFileProgress] = useState(null);
  const [uploadFileError, setUploadFileError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();

  console.log(formData);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/post/getposts?postId=${postId}`);

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        console.log(data.message);
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        setFormData(data.posts[0]);
      }
    };

    fetchPost();
  }, [postId]);

  const handleImageUpload = async () => {
    try {
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

  // *******************************
  // handle submit
  // *******************************

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPublishError("Something went Wrong");
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }

      if (data.success === false) {
        setPublishError(data.message);
        return;
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };
  return (
    <div className=" p-5 max-w-3xl mx-auto min-h-screen ">
      <h1 className="text-center font-semibold text-3xl my-7 text-black dark:text-white ">
        Update a Post
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            value={formData.title}
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
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
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          value={formData.content}
        />

        <Button
          gradientDuoTone="purpleToPink"
          outline
          type="submit"
          className="w-full mt-5"
        >
          Update Post
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
