import React, { useState } from 'react';
import { TextField, Grid, Box } from '@material-ui/core';
import Button from '../ui/Button';
import AppAutoComplete from './AppAutoComplete';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

interface IProps {
    handleSubmit: (value: any) => void;
}

const DynamicInput: React.FC<IProps> = ({ handleSubmit, ...rest }) => {
    const [inputList, setInputList] = useState([{ item: '', qty: '' }]);

        // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
        console.log(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { item: '', qty: '' }]);
    };

  
    return (
        <div>
                      
            {inputList.map((x, i) => {
                return (
                    <Box m={1} p={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <TextField
                                    name="item"
                                    value={x.item}
                                    autoFocus
                                    variant="standard"
                                    placeholder="Enter item name"
                                    onChange={(e) => handleInputChange(e, i)}
                                />
                                                
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    name="qty"
                                    type="number"
                                    value={x.qty}
                                    variant="standard"
                                    placeholder="Enter quantity"
                                    onChange={(e) => handleInputChange(e, i)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <div className="btn-box">
                                    {inputList.length !== 1 && (
                                        <Button
                                            btnCat="danger"
                                            type="button"
                                            size="small"
                                            variant="contained"
                                            onClick={() => handleRemoveClick(i)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                    {inputList.length - 1 === i && (
                                        <Button
                                            btnCat="success"
                                            type="button"
                                            size="small"
                                            variant="contained"
                                            onClick={handleAddClick}
                                        >
                                            Add
                                        </Button>
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                   </Box>
                );
            })}
            {/* <Box m={1} p={1}>
                <Button
                    btnCat="success"
                    type="button"
                    size="large"
                    variant="contained"
                    onClick={handleSubmitClick}
                >
                    Submit
                </Button>
            </Box> */}
            <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
        </div>
    );
};

export default DynamicInput;
