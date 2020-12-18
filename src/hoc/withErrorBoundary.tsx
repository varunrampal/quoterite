import React from 'react';
import GlobalErrorBoundary from '../ui/ErrorHandling/GlobalErrorBoundary';

const withErrorBoundary = (WrappedComponent: any) => {
    
    return () => (
      
         <GlobalErrorBoundary>
             <WrappedComponent/>
         </GlobalErrorBoundary>

    );
}

export default withErrorBoundary