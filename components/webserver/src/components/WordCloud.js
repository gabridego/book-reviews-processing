import React, { useState, useEffect, useContext } from 'react';
import API from '../api/API';
import AuthNotificationContext from '../context/GlobalContext';
import { TagCloud } from 'react-tagcloud';
 
export default function WordCloud(props) {

  const [words, setWords] = useState([]);
  const context = useContext(AuthNotificationContext);

  useEffect(() => {
    // code to run on component mount
    let isSubscribed = true;
    API.getWordCount()
    .then((data) => {
            console.log(data);
            if (isSubscribed)
              setWords(data);
    })
    .catch((err) => { 
      if (isSubscribed)
        context.showNotificationError("error for getting word count in word cloud component");
    });
    return () => (isSubscribed = false);
  // eslint-disable-next-line
  }, [props.updating]);
  

  return  <TagCloud
  minSize={12}
  maxSize={35}
  tags={words}
/>
}