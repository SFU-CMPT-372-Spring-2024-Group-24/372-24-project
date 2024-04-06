// Hook
import { useState } from "react";
// Components
import Modal from "react-bootstrap/Modal";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "react-toastify";
// Model
import { FileModel } from "../../../models/FileModel";
// Icons & styles
import { IoMdDownload, IoMdTrash } from "react-icons/io";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "./PreviewFileModal.scss";
// API
import { api, AxiosError } from "../../../api";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";

// Set pdf.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  showPreviewFileModal: boolean;
  setShowPreviewFileModal: (show: boolean) => void;
  selectedFile: FileModel | undefined;
}

const PreviewFileModal = ({
  showPreviewFileModal,
  setShowPreviewFileModal,
  selectedFile,
}: Props) => {
  const { project, projectFiles, setProjectFiles, userCanPerform } = useTasks();
  const [numPages, setNumPages] = useState<number>(0);
  const {handleApiError} = useApiErrorHandler();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  async function handleDeleteFile() {
    if (selectedFile) {
      try {
        const response = await api.delete(
          `/projects/${project.id}/files/${selectedFile.id}`
        );
        if (response.status === 200) {
          setProjectFiles(
            projectFiles.filter((file) => file.id !== selectedFile.id)
          );
          setShowPreviewFileModal(false);
          toast.success(response.data.message);
        }
      } catch (error) {
        handleApiError(error as AxiosError);
      }
    }
  }

  let content;
  if (selectedFile?.type === "pdf") {
    content = (
      <Document file={selectedFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    );
  } else if (["jpeg", "png", "gif", "jpg"].includes(selectedFile?.type ?? "")) {
    content = <img src={selectedFile?.url} alt={selectedFile?.name} />;
  } else {
    content = <p>Unsupported file type</p>;
  }

  return (
    <Modal
      show={showPreviewFileModal}
      onHide={() => setShowPreviewFileModal(false)}
      dialogClassName="file-preview-modal"
      centered
    >
      <Modal.Header closeButton>
        <div className="modal-header-content">
          <Modal.Title>{selectedFile?.name}</Modal.Title>
          <div className="buttons">
            <div>
              <a href={selectedFile?.url} target="_blank">
                <IoMdDownload size={20} /> Download
              </a>
            </div>
            <div>
              {userCanPerform("manageFiles") && (
                <button
                  type="button"
                  className="delete-file"
                  onClick={handleDeleteFile}
                >
                  <IoMdTrash size={20} /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>{content}</Modal.Body>
    </Modal>
  );
};

export default PreviewFileModal;
