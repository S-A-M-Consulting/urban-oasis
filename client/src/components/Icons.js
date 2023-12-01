import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function Icons(props) {
  return (
    <div className='flex items-center'>
      {props.dog_friendly && <FontAwesomeIcon icon="fa-solid fa-dog" style={{color: "#1f5129",}} />}
      {props.washroom && <FontAwesomeIcon icon="fa-solid fa-toilet" style={{color: "#1f5129",}} />}
      {props.openarea && <FontAwesomeIcon icon="fa-solid fa-tree" style={{color: "#1f5129",}} />}
      {props.playground && <FontAwesomeIcon icon="fa-solid fa-children" style={{color: "#1f5129",}} />}
    </div>
  );
}

export default Icons;


