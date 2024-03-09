(function() {
    const button = document.createElement('button');
    button.textContent = 'Download';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.className = "btn btn-download-app"
    button.style.background = "#134f93"
    button.style.color = "#ffffff"
    button.id = "vieanhng-download"
    let linkViewDoc

    document.body.addEventListener('mousemove',function () {
        if(!Boolean(document.querySelector('#vieanhng-download')) && Boolean(document.querySelector('.link-view-doc'))){
            document.body.appendChild(button);
            linkViewDoc = document.querySelector('.link-view-doc').getAttribute('href');
        }

        if(!linkViewDoc && !Boolean(document.querySelector('.link-view-doc')) && Boolean(document.querySelector('#vieanhng-download'))){
            document.querySelector('#vieanhng-download').remove();
        }

    })


        button.addEventListener('click', async function() {
            button.disabled = true;
            button.textContent = "Downloading..."
            const myHeaders = new Headers();
            myHeaders.append("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const getDocumentUrl = (docFolderValue) => {
                return `https://dlib.tmu.edu.vn/server/viewer/services/view.php?subfolder=${docFolderValue.subfolderValue}&doc=${docFolderValue.docValue}&format=pdf`
            }


            const docFolderValue = await fetch(`https://dlib.tmu.edu.vn/server/api/core${linkViewDoc}`, requestOptions)
                .then(response => response.text())
                .then((result)=>{
                    button.disabled = false;
                    button.textContent = "Download"
                    const regex = /'doc'\s*:\s*'([^']+)',\s*'subfolder'\s*:\s*'([^']+)'/;
                    const match = result.match(regex);

                    if (match) {
                        const docValue = match[1];
                        const subfolderValue = match[2];
                        return {docValue,subfolderValue}
                    } else {
                        console.log("No match found.");
                    }

                })
                .catch((error) => function () {
                    console.log(error);
                    button.disabled = false;
                });
            let downloadElement = document.createElement('a');
            let fileTitle = document.querySelector('.item-page-title-field').textContent + '.pdf';
            downloadElement.href = getDocumentUrl(docFolderValue);
            downloadElement.download = fileTitle;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            downloadElement.remove();
        });

})();


