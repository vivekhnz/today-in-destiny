import React from 'react';
import AltContainer from 'alt-container';

export default function wrap(component, store, actions) {
    let Component = component;
    return class AltWrapper extends React.Component {
        render() {
            return (
                <AltContainer
                    store={store}
                    actions={actions}>
                    <Component params={this.props.params} />
                </AltContainer>
            );
        }
    };
}