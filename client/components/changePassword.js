import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { translate, Trans } from 'react-i18next';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

class ChangePassword extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: ''
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    let current_password = document.getElementById('current-password').value;
    let new_password = document.getElementById('new-password').value;

    Accounts.changePassword(current_password, new_password, (error) => {
      if(error) {
        this.setState({
          error: this.props.i18n.t(error.reason)
        });
      } else {
        this.setState({
          error: ''
        });
        Alert.success(this.props.i18n.t('Password has been changed!'), {
          position: 'top-left',
          effect: 'jelly',
          onShow: function () {
            setTimeout(function(){
              browserHistory.push('/');
            }, 2000);
          },
          timeout: 1500,
          offset: 20
        });
      }
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
              <div className="form-group text-left">
                <p className="text-left">
                  <Link to='/'>{t('Close')}</Link>
                </p>
              </div>
              <h1 className="text-center">{t('Change password')}</h1>
            </div>
            <div className="modal-body">
              { error.length > 0 ?
                <div className="alert alert-danger fade in">{error}</div>
                :''}
              <form  id="login-form"
                    className="form col-md-12 center-block"
                    onSubmit={this.handleSubmit.bind(this)}
              >
                <div className="form-group">
                  <input type="password"
                    id="current-password"
                    className="form-control input-lg"
                    placeholder="Current password"
                  />
                </div>
                <div className="form-group">
                  <input type="password"
                    id="new-password"
                    className="form-control input-lg"
                    placeholder="New password"
                  />
                </div>
                <div className="form-group text-center">
                  <input type="submit"
                    id="login-button"
                    className="btn btn-primary btn-lg btn-block"
                    value={t('Change password')}
                  />
                </div>
                <div className="form-group text-center">
                </div>
              </form>
            </div>
            <div className="modal-footer" style={{borderTop: 0}}></div>
            <Alert stack={{limit: 3}} />
          </div>
        </div>
      </div>
    );
  }
}

export default translate('translations')(ChangePassword);
