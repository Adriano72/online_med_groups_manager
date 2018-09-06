import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { translate, Trans } from 'react-i18next';

class AccountEnroll extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: ''
    };
    console.log("PROPPSS: ", props);
  }

  componentDidMount() {
    const { resettoken } = this.props.params;
    console.log("TOKEN!!!!: ", resettoken);
  }


  handleSubmit(e) {
    e.preventDefault();
    let password = document.getElementById('login-password').value;

    const { resettoken } = this.props.params;

    Accounts.resetPassword(resettoken, password, () => {
      browserHistory.push('/');
    });

  }

  render(){
    const t = this.props.t;
    const error = this.state.error;
    return (
      <div className="modal show">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="text-center">{t('Chose a password')}</h1>
            </div>
            <div className="modal-body">
              { error.length > 0 ?
                <div className="alert alert-danger fade in">{error}</div>
                :''}
              <form  id="login-form"
                    className="form col-md-12 center-block"
                    onSubmit={this.handleSubmit.bind(this)}>

                <div className="form-group">
                  <input type="password"
                        id="login-password"
                        className="form-control input-lg"
                        placeholder="password"/>
                </div>
                <div className="form-group text-center">
                  <input type="submit"
                        id="login-button"
                        className="btn btn-primary btn-lg btn-block"
                        value={t('Create account')} />
                </div>
                <div className="form-group text-center">
                </div>
              </form>
            </div>
            <div className="modal-footer" style={{borderTop: 0}}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate('translations')(AccountEnroll);
