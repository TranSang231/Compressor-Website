import Codec from "./CompressText.js";

function myDownloadFile(fileName, text) {

    let a = document.createElement('a');
    a.href = "data:application/octet-stream," + encodeURIComponent(text);
    a.download = fileName;
    
    let downloadButton = document.querySelector('.btn_download');

    downloadButton.addEventListener('click', function () {
        a.click();
    });
}

window.onload = function () {
    let compressBtn = document.querySelector('.btn_compress'); 
    let deCompressBtn = document.querySelector('.btn_deCompress');
    let inputs = document.querySelectorAll('#text-upload, #image-upload');
    let uploadWrapper = document.querySelector('.upload_wrapper');

    // Appear file name when user choose file
    Array.prototype.forEach.call(inputs, function (input) {
        var label = input.nextElementSibling,
            labelVal = label.innerHTML;
        
        input.addEventListener('change', function (e) {
            var fileName = '';
            
            fileName = e.target.value.split('\\').pop();

            var maxLength = 10;
            if (fileName.length > maxLength) {
                fileName = fileName.substring(0, maxLength) + '...';
            }

            if (fileName)
                label.querySelector('span').innerHTML = fileName;
            else
                label.innerHTML = labelVal;

            // Show compress button
            compressBtn.style.display = "block";
            deCompressBtn.style.display = "block";
            // Remove compression information table
            let compressionWrapper = document.querySelector('.compression_wrapper');
            if (compressionWrapper) {
                compressionWrapper.remove();
            }
        });
    
    })

    // Compress button
    let codecObj = new Codec();
    compressBtn.onclick = function () { 
        compressBtn.style.display = "none";
        deCompressBtn.style.display = "none";
        Array.prototype.forEach.call(inputs, function (input) {
            let uploadedFile = input.files[0];

            let fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                let srcData = fileLoadedEvent.target.result;
                
                let [encodedString, msg] = codecObj.encode(srcData);
                // let [decodedString, msg, sizeAfterInBytes] = codecObj.decode(encodedString);
                
                let fileName = uploadedFile.name;
                let sizeBeforeInKB = uploadedFile.size / 1024;
                let blob = new Blob([encodedString], { type: "text/plain" });
                let sizeAfterInKB = blob.size / 1024;
                let status = 100 - (sizeAfterInKB * 100 / sizeBeforeInKB);
                                
                // Create table to show compression information
                let compressionWrapper = document.createElement('div');
                compressionWrapper.classList.add('compression_wrapper');
                compressionWrapper.innerHTML = `
                <table class="compression-info">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Before</th>
                            <th>Status</th>
                            <th>After</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="fileListRow">
                            <td class="fileName">${fileName}</td>
                            <td class="fileSizeBefore">${sizeBeforeInKB.toFixed(2)}</td>
                            <td class="fileStatus">Saved ${status.toFixed(2)}%</td>
                            <td class="fileSizeAfter">${sizeAfterInKB.toFixed(2)}</td>
                            <td>
                                <button class="btn_download">Download</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;
                uploadWrapper.appendChild(compressionWrapper);         
           
                myDownloadFile(uploadedFile.name.split('.')[0] + "_compressed.txt", encodedString);   

            }

            fileReader.readAsText(uploadedFile, "UTF-8");
        });

    }

    deCompressBtn.onclick = function () {
        compressBtn.style.display = "none";
        deCompressBtn.style.display = "none";

        Array.prototype.forEach.call(inputs, function (input) {
            let uploadedFile = input.files[0];

            let fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                let srcData = fileLoadedEvent.target.result;

                let [decoded_data, msg] = codecObj.decode(srcData);

                let fileName = uploadedFile.name;
                let sizeBeforeInKB = uploadedFile.size / 1024;
                let blob = new Blob([decoded_data], { type: "text/plain" });
                let sizeAfterInKB = blob.size / 1024;
                let status = 100 - (sizeAfterInKB * 100 / sizeBeforeInKB);

                // Create table to show compression information
                let compressionWrapper = document.createElement('div');
                compressionWrapper.classList.add('compression_wrapper');
                compressionWrapper.innerHTML = `
                <table class="compression-info">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Before</th>
                            <th>Status</th>
                            <th>After</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="fileListRow">
                            <td class="fileName">${fileName}</td>
                            <td class="fileSizeBefore">${sizeBeforeInKB.toFixed(2)}</td>
                            <td class="fileStatus">Saved ${status.toFixed(2)}%</td>
                            <td class="fileSizeAfter">${sizeAfterInKB.toFixed(2)}</td>
                            <td>
                                <button class="btn_download">Download</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;
                uploadWrapper.appendChild(compressionWrapper);

                myDownloadFile(uploadedFile.name.split('.')[0] + "_decompressed.txt", decoded_data);

            }

            fileReader.readAsText(uploadedFile, "UTF-8");
        });
    }
}


