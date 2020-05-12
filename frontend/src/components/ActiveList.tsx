import React from 'react'
import { useStateValue } from '../state'

const ActiveList: React.FC = () => {
    const [{ activeList }] = useStateValue();

    if (!activeList) {
        return null
    }

    return (
        <div>
            {<h2>{activeList.name}</h2>}
            {activeList.items.map(item => (<li key={item}>{item}</li>))}
        </div>
    )

}

export default ActiveList