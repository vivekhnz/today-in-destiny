import React from 'react';

class Footer extends React.Component {
    render() {
        let year = this.props.date
            ? this.props.date.year
            : new Date().getFullYear();
        return (
            <div className="footerContainer">
                <div className="groupHeaderSeparator" />
                <p className="copyrightLine1">&copy; {year} Vivek Hari</p>
                <p className="copyrightLine2">Not affiliated with Bungie or Activision Blizzard</p>
            </div>
        );
    };
}

export default Footer;