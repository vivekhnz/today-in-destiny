import React from 'react';
import Advisor from './Advisor';

class AdvisorGroup extends React.Component {
    render() {
        return (
            <div>
                <p className="groupHeader">{this.props.name}</p>
                <div className="groupHeaderSeparator" />
                {
                    this.props.advisors
                        ? this.props.advisors.map((advisor, i) =>
                            <Advisor key={i}
                                type={advisor.type}
                                name={advisor.name}
                                icon={advisor.icon}
                                image={advisor.image}
                                timeRemaining={advisor.timeRemaining}
                                items={advisor.items}
                                modifiers={advisor.modifiers} />)
                        : null
                }
            </div>
        );
    };
};

export default AdvisorGroup;