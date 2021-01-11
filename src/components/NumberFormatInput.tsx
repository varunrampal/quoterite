import NumberFormat from 'react-number-format';
import React from 'react';
import { TextField } from 'material-ui';
export default function MyNumberInput(props) {
  return <NumberFormat customInput={TextField} format="##" allowLeadingZeros= {false}/>
}