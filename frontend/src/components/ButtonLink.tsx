import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ButtonLink = ({
    className = '',
    ...props
}) => <Button
        basic
        color='blue'
        className={['link', className].join(' ')}
        type="button"
        {...props}
    />;

ButtonLink.propTypes = {
    className: PropTypes.string
};

export default ButtonLink;