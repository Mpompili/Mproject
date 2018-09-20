import React, { Component } from 'react';
import axios from 'axios';
export default class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: {}
        };
    }

    updateField = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    submit = e => {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };
        console.log(newUser);

        // we added proxy tool so we don't have to add https://
        axios
            .post('/api/users/register', newUser)
            .then(res => console.log(res.data))
            .catch(err => console.log(err.response.data));
    };
    render() {
        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">
                                Create your DevConnector account
                            </p>
                            <form onSubmit={this.submit}>
                                <div className="form-group">
                                    <input
                                        onChange={this.updateField}
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Name"
                                        name="name"
                                        value={this.state.name}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        onChange={this.updateField}
                                        type="email"
                                        className="form-control form-control-lg"
                                        placeholder="Email Address"
                                        name="email"
                                        value={this.state.email}
                                    />
                                    <small className="form-text text-muted">
                                        This site uses Gravatar so if you want a
                                        profile image, use a Gravatar email
                                    </small>
                                </div>
                                <div className="form-group">
                                    <input
                                        onChange={this.updateField}
                                        type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Password"
                                        name="password"
                                        value={this.state.password}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        onChange={this.updateField}
                                        type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Confirm Password"
                                        name="password2"
                                        value={this.state.password2}
                                    />
                                </div>
                                <input
                                    onClick={this.submit}
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
