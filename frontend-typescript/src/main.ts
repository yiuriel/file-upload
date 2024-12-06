import "./style.css";
import { throttle } from "./throttle";

async function main() {
  const downloadProgressCallback = throttle((event: ProgressEvent) => {
    const progress = event.loaded / event.total;

    const downloadProgressNumber = document.querySelector<HTMLDivElement>(
      ".download-progress-number"
    );
    if (downloadProgressNumber) {
      downloadProgressNumber.innerText = `${Math.round(progress * 100)}%`;
    }

    const uploadProgress =
      document.querySelector<HTMLDivElement>(".upload-progress");
    if (uploadProgress) {
      uploadProgress.style.display = "none";
    }

    const downloadProgress =
      document.querySelector<HTMLDivElement>(".download-progress");
    if (downloadProgress) {
      downloadProgress.style.setProperty(
        "--blue-color-percentage",
        `${progress * 100}%`
      );

      downloadProgress.style.setProperty(
        "--red-color-percentage",
        `${progress < 1 ? progress * (100 * progress) : 100}%`
      );
    }
  }, 50);

  const uploadProgressCallback = throttle((event: ProgressEvent) => {
    const progress = event.loaded / event.total;

    const uploadProgressNumber = document.querySelector<HTMLDivElement>(
      ".upload-progress-number"
    );
    if (uploadProgressNumber) {
      uploadProgressNumber.innerText = `${Math.round(progress * 100)}%`;
    }

    const uploadProgress =
      document.querySelector<HTMLDivElement>(".upload-progress");
    if (uploadProgress) {
      uploadProgress.style.setProperty(
        "--blue-color-percentage",
        `${progress * 100}%`
      );

      uploadProgress.style.setProperty(
        "--red-color-percentage",
        `${progress < 1 ? progress * (100 * progress) : 100}%`
      );
    }
  }, 50);

  const blob = new Blob([new Uint8Array(10 * 1024 * 1024)]); // any Blob, including a File

  const xhr = new XMLHttpRequest();
  const success = await new Promise((resolve) => {
    xhr.upload.addEventListener("progress", uploadProgressCallback);
    xhr.addEventListener("progress", downloadProgressCallback);
    xhr.addEventListener("loadend", () => {
      resolve(xhr.readyState === 4 && xhr.status === 200);
    });
    xhr.open("PUT", "https://httpbin.org/put", true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.send(blob);
  });
  console.log("success:", success);
}

main().catch(console.error);
