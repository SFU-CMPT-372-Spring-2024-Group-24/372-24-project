// Icons
import { IoSend } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import { IoMdTrash } from "react-icons/io";
// Models
import { Task, Comment } from "../../../models/Task";
// Libraries
import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// API
import { api, AxiosError } from "../../../api";
// Hooks
import { useUser } from "../../../hooks/UserContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
import { useEffect, useRef, useState } from "react";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// Components
import ConfirmationModal from "../../Modals/ConfirmationModal/ConfirmationModal";

interface Props {
  task: Task;
}
const Comments = ({ task }: Props) => {
  // User
  const { user } = useUser();
  // Comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(3);
  // New comment
  const [newComment, setNewComment] = useState<string>("");
  // Comment editing
  const [editingCommentId, setEditingCommentId] = useState<number>(-1);
  const [editedComment, setEditedComment] = useState<string>("");
  // Textarea reference
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // Error handling
  const { handleApiError } = useApiErrorHandler();
  // Confirmation modal for deleting a comment
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number>(-1);

  // Fetch comments from server
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/${task.id}`);
        setComments(response.data);
      } catch (error) {
        handleApiError(error as AxiosError);
      }
    };

    fetchComments();
  }, [task.id]);

  // Add a comment
  const handleAddComment = async () => {
    if (!newComment) return;

    try {
      const response = await api.post("/comments", {
        taskId: task.id,
        comment: newComment,
      });

      setComments([...comments, response.data]);
      setNewComment("");
      setDisplayCount(3);
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted.");
    } catch (error) {
      handleApiError(error as AxiosError);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  // Focus and make cursor appear at the end of the textarea when editing a comment
  useEffect(() => {
    if (editingCommentId !== -1 && textAreaRef.current) {
      const textarea = textAreaRef.current;
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, [editingCommentId]);

  // Edit a comment
  const handleEditComment = async (commentId: number) => {
    const trimmedComment = editedComment.trim();
    if (!trimmedComment) {
      handleDeleteComment(commentId);
      setEditingCommentId(-1);
      return;
    }

    try {
      await api.put(`/comments/${commentId}`, {
        comment: trimmedComment,
      });

      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, comment: trimmedComment, isEdited: true }
            : comment
        )
      );

      setEditingCommentId(-1);
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Cancel editing a comment
  const handleCancelEditComment = () => {
    setEditedComment("");
    setEditingCommentId(-1);
  };

  return (
    <>
      <div className="comments">
        <h4>Comments</h4>

        {/* View more comments button */}
        {comments.length > displayCount && (
          <button
            className="btn-view-more-comments"
            onClick={() => setDisplayCount((prev) => prev + 3)}
          >
            View more comments
          </button>
        )}

        {/* Display all comments */}
        {comments.slice(-displayCount).map((comment) => (
          <div className="comment" key={comment.id}>
            <Link to={`/profile/${comment.User.username}`}>
              <img
                src={comment.User.profilePicture || defaultProfilePicture}
                alt="User Avatar"
              />
            </Link>

            <div className="comment-details">
              {/* Comment header: name, time, edit and delete buttons */}
              <div className="comment-header">
                <div>
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
                  {/* If the user is the author of the comment, display edit and delete buttons */}
                  {user?.id === comment.User.id && (
                    <>
                      {editingCommentId === comment.id ? (
                        <button
                          className="btn-icon"
                          onClick={handleCancelEditComment}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setEditedComment(comment.comment);
                            setEditingCommentId(comment.id);
                          }}
                        >
                          <FiEdit2 size={12} />
                        </button>
                      )}

                      <button
                        className="btn-icon"
                        onClick={() => {
                          setDeletingCommentId(comment.id);
                          setShowConfirmationModal(true);
                        }}
                      >
                        <IoMdTrash size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* If the comment is being edited, display a textarea, otherwise display the comment */}
              {editingCommentId === comment.id ? (
                <div className="editing-comment">
                  <textarea
                    ref={textAreaRef}
                    name="editedComment"
                    id="editedComment"
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey)
                        handleEditComment(comment.id);
                    }}
                  ></textarea>
                  <button
                    className="btn-icon btn-edit-comment"
                    onClick={() => handleEditComment(comment.id)}
                  >
                    <IoSend size={15} />
                  </button>
                </div>
              ) : (
                <p className="comment-content">{comment.comment}</p>
              )}
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

      {/* Confirmation modal when deleting a comment */}
      <ConfirmationModal
        show={showConfirmationModal}
        message="Are you sure you want to delete this comment?"
        confirmText="Delete my comment"
        onConfirm={() => handleDeleteComment(deletingCommentId)}
        onCancel={() => setShowConfirmationModal(false)}
      />
    </>
  );
};

export default Comments;
