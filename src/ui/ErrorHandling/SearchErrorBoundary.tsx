import React, { Component, ErrorInfo, ReactNode } from "react";

interface IProps {

    children: ReactNode;
    searchTerm: string;
}

interface IState {
    hasError: boolean;
    issueTicketJSON: any;
}

class SearchErrorBoundary extends Component<IProps, IState> {
  public state: IState = {
        hasError: false,
        issueTicketJSON: ''
  }

  public static getDerivedStateFromError(_:Error) {
    return { hasError: true };
  }

  public async componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Error in Search term: " + info);
    }
    try {
            console.log('log issue:');
    }
    catch(error) {
      console.log('Error in Search term: ', error);
      throw new Error('Unable to create issue ticket');
    }
  }

  // TODO: Add issue to GitHub using https://medium.com/chingu/exploit-react-error-boundaries-to-improve-ux-8e1b18faa5ab
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h3>
            You searched for a wrong word! "{ this.props.searchTerm }" is prohibited.
          </h3>
          {/* <h5>
            An issue has been automatically created for this error on
            <a 
              href={ this.state.issueTicketJSON 
                ? this.state.issueTicketJSON.html_url : ' ' }
              target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </h5> */}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default SearchErrorBoundary;