import React, { useState, useEffect, useContext } from 'react';
import API from '../api/API';
import AuthNotificationContext from '../context/GlobalContext';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'value', headerName: 'Word', flex: 1 },
  { field: 'count', headerName: 'Count', type: 'number', flex: 1}
];

export default function WordCount(props) {

  const [words, setWords] = useState([]);
  const context = useContext(AuthNotificationContext);

  useEffect(() => {
    // code to run on component mount
    let isSubscribed = true;
    API.getWordCount()
    .then((data) => {
            console.log(data);
            if (isSubscribed)
              //setWords(data);
              setWords(data.map(el => {el.id = data.indexOf(el); return el;}))
    })
    .catch((err) => { 
      if (isSubscribed)
        context.showNotificationError("error for getting word count in word count component");
    });
    return () => (isSubscribed = false);
  // eslint-disable-next-line
  }, [props.updating]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={words} columns={columns} pageSize={5} hideFooterSelectedRowCount />
    </div>
  );
}