import { Alert, Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import "react-circular-progressbar/dist/styles.css";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signOutSuccess,
} from "../app/user/userSlice";
import { Modal } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [imageFileUpload, setImageFileUpload] = useState(false);
  const [dataUpdateSuccess, setDataUpdateSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);

  // if (imageFile) {
  //   console.log(imageFile.name);
  // }

  // console.log(imageFileUploadProgress, imageUploadError);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUpload(true);
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError(
          "Could not upload Image (File Must be less than 2MB)",
          setImageFileUploadProgress(null),
          setImageFile(null),
          setImageFileURL(null),
          setImageFileUpload(false)
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUpload(false);
        });
      }
    );
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  // ****************
  // Update Data
  // ***************

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDataUpdateSuccess(null);
    setUpdateUserError(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No Change Found");
      return;
    }

    if (imageFileUpload) {
      setUpdateUserError("Please wait for image to Upload");
      return;
    }

    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        setDataUpdateSuccess("User's Profile Updated SuccessFully!!");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };
  // ****************
  // Delete Data
  // ***************

  const handleDelete = async (e) => {
    setShowModel(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess());
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleSignOut = async (req, res) => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-semibold text-3xl text-black dark:text-white">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative self-center w-32 h-32 cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileURL || currentUser.profilePicture}
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] cursor-pointer ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleInput}
        />

        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleInput}
        />

        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleInput}
        />

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUpload}
        >
          {loading ? "Loading..." : "Update"}
        </Button>

        <Link to={"/create-post"}>
          {currentUser.isAdmin && (
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          )}
        </Link>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span
          className="cursor-pointer hover:opacity-60"
          onClick={() => setShowModel(true)}
        >
          Delete Account
        </span>
        <span
          className="cursor-pointer hover:opacity-60"
          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>
      <div>
        {dataUpdateSuccess && (
          <Alert color="success" className="mt-5">
            {" "}
            {dataUpdateSuccess}
          </Alert>
        )}
      </div>

      <div>
        {updateUserError && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
      </div>

      <div>
        {error && (
          <Alert color="failure" className="mt-5">
            {error}
          </Alert>
        )}
      </div>

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="text-gray-500 dark:text-gray-400 mb-5 text-lg">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-5">
              <Button color="failure" onClick={handleDelete}>
                Yes I'm sure
              </Button>
              <Button color="failure" onClick={() => setShowModel(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
