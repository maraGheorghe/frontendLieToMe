import React, {useState, useRef} from 'react';
import { SyncLoader } from "react-spinners";
import axios from 'axios';
import './App.css';
import LoadingIndicator from "./LoadingIndicator";

function App() {
    const inputFileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [dropText, setDropText] = useState('Drag & drop a .mp4 or .wmv file here');
    const [buttonText, setButtonText] = useState('Select a video');
    const [videoUploaded, setVideoUploaded] = useState(false);
    const [videoIsUploading, setVideoIsUploading] = useState(false);
    const [videoIsDetecting, setVideoIsDetecting] = useState(false);
    const [detectFinished, setDetectFinished] = useState(false);

    // const baseUrl = "http://192.168.1.5:5000";
    const baseUrl = "https://fast-environs-391810.lm.r.appspot.com"
    //

    function handleFileSelect(event) {
        const selectedFile = event.target.files[0];
        if (!selectedFile)
            return;
        if (selectedFile && (selectedFile.type === "video/mp4" || selectedFile.type === "video/x-ms-wmv")) {
            setFile(selectedFile);
            setFilename(selectedFile.name); // Save filename
            setVideoUrl(URL.createObjectURL(selectedFile));
            setDropText('Drag and drop another .mp4 or .wmv file here');
            setButtonText('Select another video');
            setVideoUploaded(false);
            setDetectFinished(false);
            setVideoIsUploading(false);
        } else {
            alert("Please select a .mp4 or .wmv file.");
        }
    }

    function handleFileDrop(event) {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files[0];
        if (!selectedFile)
            return;
        if (selectedFile && (selectedFile.type === "video/mp4" || selectedFile.type === "video/x-ms-wmv")) {
            setFile(selectedFile);
            setFilename(selectedFile.name); // Save filename
            setVideoUrl(URL.createObjectURL(selectedFile));
            setDropText('Drag and drop another .mp4 or .wmv file here');
            setButtonText('Select another video');
            setVideoUploaded(false);
            setDetectFinished(false);
            setVideoIsUploading(false);
        } else {
            alert("Please drop a .mp4 or .wmv file.");
        }
    }

    function handleUploadClick() {
        const formData = new FormData();
        setVideoIsUploading(true)
        formData.append('file', file);
        axios.post(`${baseUrl}/videos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log(response);
            setVideoUploaded(true);
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setVideoIsUploading(false)
        })
    }

    function handleDetectClick() {
        setVideoIsDetecting(true)
        axios.get(`${baseUrl}/videos/detect/${filename}`, {
            responseType: 'blob'
        })
            .then(response => {
                const videoBlob = new Blob([response.data], { type: 'video/mp4' });
                const videoUrl = URL.createObjectURL(videoBlob);
                setVideoUrl(videoUrl);
                setDetectFinished(true);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setVideoIsDetecting(false);
            });
    }

    function handleDownloadClick() {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = filename;
        link.click();
    }

    return (
        <div className="App">
            <header>
                <h1>LieToMe: A Deception Detection Application</h1>
                <p>Import a video for detecting deception</p>
            </header>
            <main>
                <div className="file-input" onDrop={handleFileDrop} onDragOver={event => event.preventDefault()}>
                    <div className="file-drop">
                        {!videoUrl &&
                            (<>
                            <img className='upload-image' src='/upload-image.png' alt='Upload file.'/>
                            <p>{dropText}</p>
                            <p>or</p>
                            </>)
                        }
                        {videoUrl && (
                            <>
                                {videoIsDetecting && <LoadingIndicator/>}
                                <video src={videoUrl}
                                       width="100%"
                                       height="100%"
                                       controls
                                       onError={(e) => {
                                    console.error("Video error: ", e.target.error);
                                    console.log(videoUrl)
                                    alert("There was an error playing the video. Please check the console for details.");
                                }}/>

                            </>
                        )}
                        <button className='select-btn' onClick={() => inputFileRef.current.click()}>{buttonText}</button>
                    </div>
                    <input ref={inputFileRef} type="file" className="select-btn" accept=".mp4,.wmv" onChange={handleFileSelect} />
                </div>
                <div className='buttons'>
                {videoUploaded
                    ? (
                        detectFinished
                            ? <button className="download-btn" onClick={handleDownloadClick}>Download result</button>
                            : <button className="button-53" onClick={handleDetectClick}>Detect</button>
                    )
                    : (
                        <>
                            {<button className="button-52" disabled={!file} onClick={handleUploadClick}>
                                <SyncLoader
                                    color="#6dcff6"
                                    cssOverride={{}}
                                    loading={videoIsUploading}
                                    margin={4}
                                    size={15}
                                    speedMultiplier={1}
                                />
                                {!videoIsUploading ?
                                    ("Upload video")
                                    :
                                    ("Loading...")
                                }
                            </button>}
                        </>
                    )
                }
                </div>
            </main>
        </div>
    );
}

export default App;
