import React, { Fragment } from 'react';
import { Icon } from 'semantic-ui-react';

interface Props {
    text?: string;
}

const DataChanged: React.FC<Props> = ({ text = "Changed!" }) => {
    return (
        <Fragment>
            <Icon style={{ marginLeft: "1rem" }} name="check" color="green" />
            <span style={{ color: "#21ba45" }}>{text}</span>
        </Fragment>
    );
};

export default DataChanged;