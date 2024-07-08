import React, { useContext } from 'react';
import DefaultAdmin from '../../hive-admin/src/components/Admin';
import CodeScanner, { ScannerContext, ScannerProvider } from '../CodeScanner';

const AdminContent = ({ adminProps, extraProps, renderContent }) => {
  const { isVisible, setIsVisible } = useContext(ScannerContext);
  const content = renderContent(extraProps);

  if (content && adminProps.viewer) {
    return (
      <>
        {content}
        <CodeScanner
          {...adminProps}
          {...extraProps}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      </>
    );
  }

  return <>{content}</>; 
};

class Admin extends DefaultAdmin {
  renderContent(extraProps = {}) {
    return (
      <ScannerProvider>
        <AdminContent
          adminProps={this.props}
          extraProps={extraProps}
          renderContent={(...args) => super.renderContent(...args)}
        />
      </ScannerProvider>
    );
  }

  render() {
    return <>{this.renderContent()}</>;
  }
}

export default Admin;
