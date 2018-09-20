import React, { Component } from 'react';

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        };
        this.updateField = this.updateField.bind(this);
        this.submit = this.submit.bind(this);
    }
    updateField(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submit(e) {
        e.preventDefault();
        const newUser = {
            email: this.state.email,
            password: this.state.password
        };
        console.log(newUser);
    }
    render() {
        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Log In</h1>
                            <p className="lead text-center">
                                Sign in to your DevConnector account
                            </p>
                            <form onSubmit={this.submit}>
                                <div className="form-group">
                                    <input
                                        onChange={this.updateField}
                                        type="email"
                                        className="form-control form-control-lg"
                                        placeholder="Email Address"
                                        name="email"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        onChange={this.updateField}
                                        type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Password"
                                        name="password"
                                    />
                                </div>
                                <input
                                    type="submit"
                                    className="btn btn-info btn-block mt-4"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
