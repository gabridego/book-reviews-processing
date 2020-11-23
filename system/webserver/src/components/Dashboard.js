import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import WordCloud from "./WordCloud";
import WordCount from "./WordCount";
import ChartAccuracy from "./ChartAccuracy";
import Sentiment from "./Sentiment";

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

export default function Dashboard() {
  const classes = useStyles();
  const updateEvery = 10000; //milliseconds
  const [updating, setUpdating] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      console.log('This will run every second!', updating);
      setUpdating(prevUpdating => prevUpdating + 1);
    }, updateEvery);
    return () => clearInterval(interval);
  // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                Accuracy Chart
                <ChartAccuracy updating={updating}></ChartAccuracy>
            </Paper>
        </Grid>
        <Grid item xs={8}>
            <Paper className={classes.paper}>
                Word Cloud
                <WordCloud updating={updating}></WordCloud>
            </Paper>
        </Grid>
        <Grid item xs={4}>
            <Paper className={classes.paper}>
                Word Count
                <WordCount updating={updating}></WordCount>
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                Sentiment Analysis
                <Sentiment updating={updating}></Sentiment>
            </Paper>
        </Grid>
      </Grid>
    </div>
  );
}