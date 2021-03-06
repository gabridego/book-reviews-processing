import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import SendingFile from "./SendingFile";
import SendingText from "./SendingText";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Management() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                Send your document in form of text<br/>
                <SendingText></SendingText>
            </Paper>
        </Grid>
        {/*<Grid item xs={4}>
            <Paper className={classes.paper}>
                Send your document in form of file<br/>
                <SendingFile></SendingFile>
            </Paper>
        </Grid>*/}
      </Grid>
    </div>
  );
}