import React from 'react';
import Masonry from 'react-masonry-component';
import Advisor from './Advisor';

let masonryOptions = {
    transitionDuration: 0,
    columnWidth: '.masonrySizer',
    percentPosition: true,
    gutter: 16
};

class AdvisorGroup extends React.Component {
    render() {
        let childElements = this.props.advisors
            ? this.props.advisors.map((advisor, i) =>
                <Advisor key={i}
                    type={advisor.type}
                    name={advisor.name}
                    icon={advisor.icon}
                    image={advisor.image}
                    timeRemaining={advisor.timeRemaining}
                    items={advisor.items}
                    modifiers={advisor.modifiers} />)
            : null;

        return (
            <div className="advisorGroupContainer">
                <p className="groupHeader">{this.props.name}</p>
                <div className="groupHeaderSeparator" />
                <Masonry className="masonry"
                    options={masonryOptions}>
                    <div className="masonrySizer" />
                    {childElements}
                </Masonry>
            </div>
        );
    };
};

export default AdvisorGroup;