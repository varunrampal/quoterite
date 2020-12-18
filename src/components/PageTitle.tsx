import React from 'react';
import Helmet from 'react-helmet';

interface IProps {

    title: string;
}

const TitleComponent: React.FC<IProps> = ({ title }) => {
    var defaultTitle = '⚛️ app';
    return (
        <Helmet>
            <title>{title ? title : defaultTitle}</title>
        </Helmet>
    );
};

export { TitleComponent };