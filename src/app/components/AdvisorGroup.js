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
                <Advisor key={i} category={this.props.id} {...advisor} />)
            : null;

        return (
            <div>
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