import React, { Fragment } from 'react';
import { ItemList } from '../../types';

const InvitedGuests: React.FC<{ list: ItemList }> = ({ list }) => {
    console.log(list.invitedGuests);
    return (
        <Fragment>
            <label style={{ fontWeight: 'bold' }}>Invitations</label>
            {list.invitedGuests.map(g => <li key={g.id}>{g.name}</li>)}
        </Fragment>
    );
};

export default InvitedGuests;