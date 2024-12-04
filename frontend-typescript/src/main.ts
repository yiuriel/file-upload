import "./style.css";

async function main() {
  const blob = new Blob([new Uint8Array(10 * 1024 * 256)]); // any Blob, including a File
  const uploadProgress =
    document.querySelector<HTMLProgressElement>("#upload-progress");
  const downloadProgress =
    document.querySelector<HTMLProgressElement>("#download-progress");

  const xhr = new XMLHttpRequest();
  const success = await new Promise((resolve) => {
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && uploadProgress) {
        console.log("upload progress:", event.loaded / event.total);
        uploadProgress.value = event.loaded / event.total;
      }
    });
    xhr.addEventListener("progress", (event) => {
      if (event.lengthComputable && downloadProgress) {
        console.log("download progress:", event.loaded / event.total);
        downloadProgress.value = event.loaded / event.total;
      }
    });
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
