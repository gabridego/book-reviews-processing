import React, { useState, useEffect, useContext }  from 'react';
import { Chart } from 'react-charts';
import API from '../api/API';
import AuthNotificationContext from '../context/GlobalContext';
 
export default function ChartAccuracy(props) {
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  );  
  const [data, setData] = useState([{ label: 'accuracy', data: [[0, 100]] }]);
  const context = useContext(AuthNotificationContext);

  useEffect(() => {
    // code to run on component mount
    let isSubscribed = true;
    API.getAccuracy()
    .then((result) => {
            console.log(result);
            if (isSubscribed)
              //setData(result);
              setData([{ label: 'accuracy', data: result.sort((el1, el2) => el1._id-el2._id).map(el => [el._id, el.value])}])
    })
    .catch((err) => {
      if (isSubscribed) 
        context.showNotificationError("error for getting accuracy in chart accuracy component");
    });
    return () => (isSubscribed = false);
  // eslint-disable-next-line
  }, [props.updating]);
 
  return (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div
      style={{
        width: '100%',
        minHeight: '300px'
      }}
    >
      <Chart data={data} axes={axes} tooltip />
    </div>
  )
}