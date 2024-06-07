window.onload = function () {
    let compressBtn = document.querySelector('.btn_compress');
    let inputs = document.querySelectorAll('#text-upload, #image-upload');

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
            // Remove compression information table
            let compressionWrapper = document.querySelector('.compression_wrapper');
            if (compressionWrapper) {
                compressionWrapper.remove();
            }
        });

    })

    var sizeBeforeInKB = 0;
    var sizeAfterInKB = 0;
    document.querySelector('.btn_compress').addEventListener('click', function (event) {
        event.preventDefault();
        
        var form = document.getElementById('uploadForm')
        var formData = new FormData(form);
        var uploadButton = this;
        uploadButton.textContent = "Uploading...";  // Indicate upload progress
        uploadButton.disabled = true;
        console.log('http://127.0.0.1:5000/upload')
        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }

                var filename = data.filename;
                sizeBeforeInKB = data.filesize / 1024;
                checkStatus(filename, uploadButton);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error processing your request.');
                uploadButton.textContent = "Compress";
                uploadButton.disabled = false;
            });
    });

    function checkStatus(filename, uploadButton) {
        console.log(`http://127.0.0.1:5000/status/${filename}`)
        fetch(`http://127.0.0.1:5000/status/${filename}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "done") {
                    sizeAfterInKB = data.filesize / 1024;
                    
                    let status = 100 - (sizeAfterInKB * 100 / sizeBeforeInKB);

                    let uploadWrapper = document.querySelector('.upload_wrapper');
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
                                    <td class="fileName">${filename}</td>
                                    <td class="fileSizeBefore">${sizeBeforeInKB.toFixed(2)}</td>
                                    <td class="fileStatus">Saved ${status.toFixed(2)}%</td>
                                    <td class="fileSizeAfter">${sizeAfterInKB.toFixed(2)}</td>
                                    <td>
                                        <a class="btn_download" href="http://127.0.0.1:5000/download/${filename}" download=${filename}>Download</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    `;
                    uploadWrapper.appendChild(compressionWrapper); 

                    uploadButton.style.display = "none";
                    uploadButton.textContent = "Compress";
                    uploadButton.disabled = false;
                } else {
                    setTimeout(() => checkStatus(filename, uploadButton), 2000);  // Poll every 2 seconds
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error processing your request.');
                uploadButton.style.display = "none";
                uploadButton.textContent = "Compress";
                uploadButton.disabled = false;
            });
    }
}
