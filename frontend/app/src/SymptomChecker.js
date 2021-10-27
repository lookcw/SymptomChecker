import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "react-apollo";
import { gql } from "apollo-boost";
import SymptomList from "./SymptomList";
import Button from "@material-ui/core/Button";
import { Container, Row, Col } from "react-bootstrap";

const QUERY_SYMPTOMS = gql`
  query {
    symptoms {
      name
      id
    }
  }
`;

const QUERY_DISEASES_BY_SYMPTOMS = gql`
  query getDiseases($ids: [Int]) {
    diseasesBySymptoms(ids: $ids)
  }
`;

function DiseaseList(props) {
  if (props.diseases != [])
    return props.diseases.map((disease) => <div>{disease}</div>);

  return <span>loading...</span>;
}

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const symptomRes = useQuery(QUERY_SYMPTOMS);

  const handleCheckChange = (id, name, checked) => {
    const newSymptoms = [...symptoms];
    const ind = newSymptoms.findIndex((x) => x.id == id);
    newSymptoms[ind] = { name: name, id: id, checked: checked };
    setSymptoms(newSymptoms);
  };

  function get_symptoms(symptoms) {
    return symptoms.filter((x) => x.checked).map((x) => x.id);
  }

  const diseasesRes = useLazyQuery(QUERY_DISEASES_BY_SYMPTOMS);

  function buttonClick() {
    diseasesRes[0]({ variables: { ids: get_symptoms(symptoms) } });
  }

  useEffect(() => {
    if (symptomRes["data"]) {
      setSymptoms(
        symptomRes["data"]?.symptoms.map(({ id, name }) => ({
          name: name,
          id: id,
          checked: false,
        }))
      );
    }
  }, [symptomRes]);

  useEffect(() => {
    if (diseasesRes && diseasesRes[1]["data"]) {
      console.log(diseasesRes[1]["data"]);
      setDiseases(diseasesRes[1]["data"]["diseasesBySymptoms"]);
    }
  }, [diseasesRes]);

  return (
    <Container fluid>
      <Row>
        <Col xs={6}>
          <h2 >
            Check off your Symptoms here and click submit...
          </h2>
          <SymptomList symptoms={symptoms} checkChange={handleCheckChange} />
          <Button variant="contained" onClick={() => buttonClick()}>
            Submit
          </Button>
        </Col>
        <Col xs={6}>
          <h2 style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
              to see possible diseases here
          </h2>
          <DiseaseList diseases={diseases} />
        </Col>
      </Row>
    </Container>
  );
}
