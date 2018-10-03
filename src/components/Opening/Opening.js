import React from 'react';

import classes from './Opening.css';

const opening = (props) => {
    if (props.selected) {
        return (
            <tr onClick={props.selectionHandler} className={classes.Selected}>
                <td className={classes.ECO}>{props.openingECO}</td>
                <td>
                    <div className={classes.Subcategory}>{props.openingSubcategory}</div>
                    <div>{props.openingName}</div>
                </td>
            </tr>
        );
    } else {
        return (
            <tr onClick={props.selectionHandler}>
                <td className={classes.ECO}>{props.openingECO}</td>
                <td>
                    <div className={classes.Subcategory}>{props.openingSubcategory}</div>
                    <div>{props.openingName}</div>
                </td>
            </tr>
        );
    }
};

export default opening;