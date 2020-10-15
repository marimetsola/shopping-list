import React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

const LoadingIndicator: React.FC = () => {
    const { promiseInProgress } = usePromiseTracker();

    if (promiseInProgress) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "80",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Loader type="ThreeDots" color="#1b1c1d" height={80} width={80} />
            </div>);
    }
    return null;

};

export default LoadingIndicator;