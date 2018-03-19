
//React component for input 
var CustomerInput = React.createClass({
    //onchange event
    handleChange: function (e) {
        this.props.onChange(e.target.value);
        var isValidField = this.isValid(e.target);
    },
    //validation function
    isValid: function (input) {
        //check required field
        if (input.getAttribute('required') != null && input.value === "") {
            input.classList.add('error'); //add class error
            input.nextSibling.textContent = this.props.messageRequired; // show error message
            return false;
        }
        else {
            input.classList.remove('error');
            input.nextSibling.textContent = "";
        }
        //check email format
        if (input.getAttribute('type') == "email" && input.value != "") {
            if (!this.validateEmail(input.value)) {
                input.classList.add('error');
                input.nextSibling.textContent = this.props.messageEmail;
                return false;
            }
            else {
                input.classList.remove('error');
                input.nextSibling.textContent = "";
            }
        }
        return true;
    },
    //email validation function
    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    componentDidMount: function () {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this); //register this input in the form
        }
    },
    //render
    render: function () {
        var inputField = <input type={this.props.type} value={this.props.value} ref={this.props.name} name={this.props.name}
                className='form-control' required={this.props.isrequired} onChange={this.handleChange} />
        
        return (
            <div className="form-group">
                <label htmlFor={this.props.htmlFor}>{this.props.label}:</label>
                {inputField}
                <span className="error"></span>
            </div>
        );
    }
});

//React component for generate form
var CustomerForm = React.createClass({
    //get initial state enent
    getInitialState: function () {
        return {
            Id: '0',
            Name: '',
            Email: '',
            Country: '',
            Zipcode: '',
            Fields: [],
            ServerMessage: ''
        }
    },
    componentDidMount: function () {
        $.get(this.props.dataUrl, function (data) {
            if (this.isMounted()) {
                if (!data) {
                    this.setState({
                        Id: '0',
                        Name: '',
                        Email: '',
                        Country: '',
                        Zipcode: '',
                        ServerMessage: ''
                    });
                }
                else {
                    this.setState({
                        Id: data.Id,
                        Name: data.Name,
                        Email: data.Email,
                        Country: data.Country,
                        Zipcode: data.ZipCode
                    });
                }
            }
        }.bind(this));
    },
    // submit function
    handleSubmit: function (e) {
        e.preventDefault();
        //Validate entire form here
        var validForm = true;
        this.state.Fields.forEach(function (field) {
            if (typeof field.isValid === "function") {
                var validField = field.isValid(field.refs[field.props.name]);
                validForm = validForm && validField;
            }
        });
        //after validation complete post to server 
        if (validForm) {
            var d = {
                Id: this.state.Id,
                Name: this.state.Name,
                Email: this.state.Email,
                Country: this.state.Country,
                Zipcode: this.state.Zipcode
            }

            $.ajax({
                type: "POST",
                url: this.props.urlPost,
                data: d,
                success: function (data) {
                    //Will clear form here
                    this.setState({
                        Id: '0',
                        Name: '',
                        Email: '',
                        Country: '',
                        Zipcode: '',
                        ServerMessage: data.message
                    });

                    window.location.href = '/Home/Index';
                }.bind(this),
                error: function (e) {
                    console.log(e);
                    alert('Error! Please try again');
                }
            });
        }
    },
    //handle change name
    onChangeName: function (value) {
        this.setState({
            Name: value
        });
    },
    //handle chnage email
    onChangeEmail: function (value) {
        this.setState({
            Email: value
        });
    },
    //handle change country 
    onChangeCountry: function (value) {
        this.setState({
            Country: value
        });
    },
    //handle change zipcode 
    onChangeZipcode: function (value) {
        this.setState({
            Zipcode: value
        });
    },
    //register input controls
    register: function (field) {
        var s = this.state.Fields;
        s.push(field);
        this.setState({
            Fields: s
        })
    },
    //render
    render: function () {
        //Render form 
        return (
            <form name="customerForm" noValidate onSubmit={this.handleSubmit}>
                <CustomerInput type={'text'} value={this.state.Name} label={'Name'} name={'Name'} htmlFor={'Name'} isrequired={true}
                    onChange={this.onChangeName} onComponentMounted={this.register} messageRequired={'Name required'} />
                <CustomerInput type={'email'} value={this.state.Email} label={'Email'} name={'Email'} htmlFor={'Email'} isrequired={false}
                    onChange={this.onChangeEmail} onComponentMounted={this.register} messageRequired={'Invalid Email'} />
                <CustomerInput type={'text'} value={this.state.Country} label={'Country'} name={'Country'} htmlFor={'Country'} isrequired={false}
                    onChange={this.onChangeCountry} onComponentMounted={this.register}  />
                <CustomerInput type={'text'} value={this.state.Zipcode} label={'Zipcode'} name={'Zipcode'} htmlFor={'Zipcode'} isrequired={false}
                    onChange={this.onChangeZipcode} onComponentMounted={this.register}  />
                <button type="submit" className="btn btn-success">Submit</button>&nbsp;
                <a href="/Home/Index" className="btn btn-default" role="button" >Cancel</a>
                <p className="servermessage">{this.state.ServerMessage}</p>
            </form>
        );
    }
});

//Get url parameter
const root = document.getElementById('divForm');
const param = root.getAttribute('data-param');
const url = "/home/GetCustomerById/" + param;

//Render react component into the page
ReactDOM.render(<CustomerForm dataUrl={url} urlPost="/Home/SaveCustomerData" />, document.getElementById('divForm'));