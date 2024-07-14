import { Alert, Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  // console.log(comments);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Comment.length > 200) {
        return;
      }

      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      } else {
        setCommentError(data.message);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComment = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments/${postId}`);

        const data = await res.json();

        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getComment();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });

      const data = await res.json();

      if (res.ok) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3 ">
      {currentUser ? (
        <div className="flex items-center gap-2 my-5 text-gray-500 text-sm ">
          <p>Signed in as:</p>
          <img
            src={currentUser.profilePicture}
            alt=""
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-cyan-600 hover:underline "
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5 text-gray-500">
            <p>{200 - comment.length} character remaining </p>
            <Button outline gradientDuoTone="purpleToPink" type="submit">
              Submit
            </Button>
          </div>

          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No Comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center">
            <p className="mr-1">Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} />
          ))}
        </>
      )}
    </div>
  );
}
