import React, { useState, useContext } from 'react';
import API from '../api/API';
import AuthNotificationContext from '../context/GlobalContext';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dropzone from 'react-dropzone';
 
export default function SendingFile() {
  const context = useContext(AuthNotificationContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loaded, setLoaded] = useState(0);

  const handleOnChange = files => {
    console.log(files[0]);
    setSelectedFile(files[0]);
  };

  const handleOnClick = event => {
    API.sendFile(selectedFile, setLoaded)
    .then((data) => {
            console.log(data);
            context.showNotificationSuccess("file sent correctly");
    })
    .catch((err) => { 
        context.showNotificationError("error for getting word count in word cloud component");
    });
  };
  

  return (
    <>
    <br/>
        <div style={{border: "10px", borderStyle: "dotted"}}>
          <Dropzone onDrop={handleOnChange}>
            {({getRootProps, getInputProps}) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
        {selectedFile &&
        <ul><li>{selectedFile.name}</li></ul>
        }<br/>
        <Button variant="contained" color="primary" onClick={handleOnClick} disabled={loaded!==0 && loaded!==100}> Upload </Button><br/><br/>
        <LinearProgress variant="determinate" value={loaded} />
    </>
  );
}