import React, { useState, useContext } from 'react';
import API from '../api/API';
import AuthNotificationContext from '../context/GlobalContext';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '25ch',
    },
  }));

const sentimentScore = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 5,
      label: '5',
    },
  ];
 
export default function SendingText() {

    const classes = useStyles();

    const context = useContext(AuthNotificationContext);
    const [review, setReview] = useState("");
    const [sentimentExpected, setSentimentExpected] = useState(sentimentScore[0].value);
    const [loading, setLoading] = useState(false);

    const handleOnChangeReview = event => {
        console.log(event.target.value);
        setReview(event.target.value);
    };

    const handleOnChangeSentimentExpected = event => {
        console.log(event.target.value);
        setSentimentExpected(event.target.value);
    };

    const handleOnClick = event => {
        setLoading(true);
        API.sendText(review, sentimentExpected)
        .then((data) => {
                console.log(data);
                context.showNotificationSuccess("review sent correctly");
        })
        .catch((err) => { 
            context.showNotificationError("error");
        })
        .finally(() => {setLoading(false);});
    };
    

    return (
        <>
            <br/><br/>
            <div className={classes.root}>
                <TextField id="review" label="Insert you review" placeholder="Review" multiline variant="filled" onChange={handleOnChangeReview} value={review} fullWidth/><br/><br/><br/><br/>
            

            <TextField id="sentimentExpected" select label="Score" value={sentimentExpected} onChange={handleOnChangeSentimentExpected} helperText="Please select your expected score">
                {sentimentScore.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
                </TextField>
                <Button color="primary" onClick={handleOnClick} disabled={loading}>
                    {loading && <CircularProgress disableShrink />} 
                    {!loading && <SendIcon />} 
                </Button>
            </div>
        </>
    );
}