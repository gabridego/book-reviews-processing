import React, { useState, useEffect, useContext } from 'react';
/*import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';*/
import API from '../api/API';
import AuthNotificationContext from '../context/GlobalContext';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  //{ field: '_id', headerName: 'ID', type: 'number', flex: 1},
  { field: 'review', headerName: 'Review', flex: 1 },
  { field: 'result', headerName: 'Result', flex: 1 },
  { field: 'expected', headerName: 'Expected', flex: 1 }
];

export default function Sentiment(props) {

  const [document, setDocument] = useState([]);
  const context = useContext(AuthNotificationContext);

  useEffect(() => {
    // code to run on component mount
    let isSubscribed = true;
    API.getSentiment()
    .then((data) => {
            console.log(data);
            if (isSubscribed)
              //setDocument(data);
              setDocument(data.map(el => {el.id = el._id; return el;}));
    })
    .catch((err) => { 
      if (isSubscribed)
        context.showNotificationError("error for getting word count in word count component");
    });
    return () => (isSubscribed = false);
  // eslint-disable-next-line
  }, [props.updating]);

  return (
    /*<TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Review</TableCell>
            <TableCell align="right">Result</TableCell>
            <TableCell align="right">Expected</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {document.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">{row.id}</TableCell>
              <TableCell align="right">{row.review}</TableCell>
              <TableCell align="right">{row.result}</TableCell>
              <TableCell align="right">{row.expected}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>*/
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={document} columns={columns} pageSize={5} hideFooterSelectedRowCount />
    </div>
  );
}