import React from 'react';

class Footer extends React.Component {
    render() {
        return (
            <div className="footerContainer">
                <div className="groupHeaderSeparator" />
                <p className="copyrightLine1">&copy; {this.props.date.year} Vivek Hari</p>
                <p className="copyrightLine2">Not affiliated with Bungie or Activision Blizzard</p>
            </div>
        );
    };
}

export default Footer;