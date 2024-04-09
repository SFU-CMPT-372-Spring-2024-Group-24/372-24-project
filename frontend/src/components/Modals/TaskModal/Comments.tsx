// Icons
import { IoSend } from "react-icons/io5";
// Models
import { Task, Comment } from "../../../models/Task";
// Libraries
import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// API
import { api } from "../../../api";
// Hooks
import { useUser } from "../../../hooks/UserContext";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
import { FiEdit2 } from "react-icons/fi";
import { IoMdTrash } from "react-icons/io";

interface Props {
  task: Task;
}

const Comments = ({ task }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(3);
  const { user } = useUser();
  const [newComment, setNewComment] = useState<string>("");

  // Fetch comments from server
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/${task.id}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [task.id]);

  // Add a comment
  const handleAddComment = async () => {
    if (!newComment) return;

    try {
      const response = await api.post("/comments", {
        userId: user?.id,
        taskId: task.id,
        comment: newComment,
      });

      setComments([...comments, response.data]);
      setNewComment("");
      setDisplayCount(3);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));

      toast("Comment deleted.");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Edit a comment
  const handleEditComment = async (commentId: number) => {
    const editedComment = prompt("Edit your comment:");

    if (editedComment) {
      try {
        const response = await api.put(`/comments/${commentId}`, {
          comment: editedComment,
        });

        setComments(
          comments.map((comment) =>
            comment.id === commentId ? response.data : comment
          )
        );
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    }
  };

  return (
    <div className="comments">
      <h4>Comments</h4>

      {comments.length > displayCount && (
        <button
          className="btn-view-more-comments"
          onClick={() => setDisplayCount((prev) => prev + 3)}
        >
          View more comments
        </button>
      )}

      {comments.slice(-displayCount).map((comment) => (
        <div className="comment" key={comment.id}>
          <Link to={`/profile/${comment.User.username}`}>
            <img
              src={comment.User.profilePicture || defaultProfilePicture}
              alt="User Avatar"
            />
          </Link>

          <div className="comment-details">
            <div className="comment-header">
              <div className="">
                <Link to={`/profile/${comment.User.username}`}>
                  <span className="comment-name">{comment.User.name}</span>
                </Link>

                <span className="comment-time">
                  {moment(comment.createdAt).fromNow()}
                </span>

                {comment.isEdited && (
                  <span className="comment-isEdited">Edited</span>
                )}
              </div>

              <div className="button-group">
                {user?.id === comment.User.id && (
                  <>
                    <button
                      className="btn-icon"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      <FiEdit2 size={12} />
                    </button>

                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <IoMdTrash size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="comment-content">{comment.comment}</p>
          </div>
        </div>
      ))}

      <div className="add-comment">
        <textarea
          name="comment"
          id="comment"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) handleAddComment();
          }}
        ></textarea>
        <button className="btn-icon" onClick={handleAddComment}>
          <IoSend size={16} />
        </button>
      </div>
    </div>
  );
};

export default Comments;
