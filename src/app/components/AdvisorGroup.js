import React from 'react';
import Advisor from './Advisor';

class AdvisorGroup extends React.Component {
    render() {
        return (
            <div>
                <p>{this.props.name}</p>
                <ul>
                    {
                        this.props.advisors
                            ? this.props.advisors.map((advisor, i) =>
                                <Advisor key={i}
                                    type={advisor.type}
                                    name={advisor.name}
                                    timeRemaining={advisor.timeRemaining}
                                    items={advisor.items}
                                    modifiers={advisor.modifiers} />)
                            : null
                    }
                </ul>
            </div>
        );
    };
}

export default AdvisorGroup;