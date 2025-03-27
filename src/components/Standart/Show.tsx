import React from 'react';

interface ShowProps {
    when: boolean;
    children: React.ReactNode;
}

const Show: React.FC<ShowProps> = ({ when, children }) => {
    return <>{when ? children : null}</>;
};

export default Show;