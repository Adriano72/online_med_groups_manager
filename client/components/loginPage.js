import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { translate, Trans } from 'react-i18next';

class LoginPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: ''
    };
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;
    Meteor.loginWithPassword(email, password, (err) => {
      if(err){
        this.setState({
          error: this.props.i18n.t(err.reason)
        });
      } else {
        browserHistory.push('/');
      }
    });
  }

  forgotPassword() {
    browserHistory.push('/forgotpassword');
  }

  render(){
    const t = this.props.t;
    const error = this.state.error;
    return (
      <div className="modal show">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <div className="form-group text-left">
                <p className="text-left">
                  <Link to='/'>Close</Link>
                </p>
              </div>
              <h1 className="text-center">{t('Login')}</h1>
            </div>
            <div className="modal-body">
              { error.length > 0 ?
                <div className="alert alert-danger fade in">{error}</div>
                :''}
              <form  id="login-form"
                    className="form col-md-12 center-block"
                    onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-group">
                  <input type="text"
                        id="login-email"
                        className="form-control input-lg"
                        placeholder="username or email"/>
                </div>
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
                        value={t('Login')} />
                </div>
                <div className="form-group text-center">
                  <p className="text-center">
                    <a href="#" onClick={this.forgotPassword.bind(this)}>{t('Forgot password')}?</a>
                  </p>
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

export default translate('translations')(LoginPage);
