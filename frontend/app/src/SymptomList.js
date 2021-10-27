import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import Checkbox from "@material-ui/core/Checkbox";



function SymptomCheck(props) {

    const onInputChange = (e) => {
        props.handleChange(props.id, props.symptom, e.target.checked);
    }

    return (
        <span>
            <Checkbox
            checked={props.checked}
            onChange={onInputChange}
            />
            Symptom: {props.symptom}
        </span>
        )

}

function DiseaseList(props) {
    if (props.diseases)

    return(
        props.diseases.map(disease => 
        <div>{disease}</div>
        )
    )

return <span>loading...</span>

}

export function SymptomList(props)  {

    if (!props.symptoms)
    return <div>loading ...</div>
    else {
    return (
        props.symptoms.map(({id, name, checked}) => 
        <div>
        <SymptomCheck key={id} 
        symptom={name} 
        id={id} 
        checked={checked} 
        handleChange={props.checkChange} />
        </div>
    )
    )
    }
}


export default SymptomList;