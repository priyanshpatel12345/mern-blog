import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  return (
    <div className=" p-5 max-w-3xl mx-auto min-h-screen ">
      <h1 className="text-center font-semibold text-3xl my-7 text-black ">
        Create a Post
      </h1>
      <form className="flex flex-col gap-4 ">
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
          <FileInput type="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            size="sm"
            outline
          >
            Upload image
          </Button>
        </div>
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
