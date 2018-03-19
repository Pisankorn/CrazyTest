//React component for grid row
var CustomerGridRow = React.createClass({
    //get initial state enent
    getInitialState: function () {
        return {
            url: "/Home/Entry/"+ this.props.customer.Id
        }
    },
    handleDelete: function (value) {
        if (confirm('Are you sure to DELETE this customer?')) {
            var d = {
                Id: this.state.Id,
                Name: "",
                Email: "",
                Country: "",
                Zipcode: ""
            }

            $.ajax({
                type: "POST",
                url: "/home/DeleteCustomer/" + this.props.customer.Id,
                data: d,
                success: function (data) {
                    location.reload();
                    this.setState({
                        customers: data
                    });
                }.bind(this),
                error: function (e) {
                    console.log(e);
                    alert('Error! Please try again');
                }
            });
        }
    },
    //render
    render: function () {
        return (
            <tr>
                <td>{this.props.customer.Name}</td>
                <td>{this.props.customer.Email}</td>
                <td>{this.props.customer.Country}</td>
                <td>{this.props.customer.ZipCode}</td>
                <td>
                    <a href={this.state.url}>Edit</a> 
                </td>
                <td>
                    <button className="btn btn-link" onClick={this.handleDelete}>Delete</button>
                </td>
            </tr>
        );
    }
});

//React component for grid table
var CustomerGridTable = React.createClass({
    //get initial state enent
    getInitialState: function () {
        return {
            customers: []
        }
    },
    componentDidMount: function () {
        $.get(this.props.dataUrl, function (data) {
            if (this.isMounted()) {
                this.setState({
                    customers: data
                });
            }
        }.bind(this));
    },
    //render
    render: function () {
        var rows = [];
        this.state.customers.forEach(function (customer) {
            rows.push(<CustomerGridRow key={customer.Id} customer={customer} />);
        });
        return (
            <div>
                <div>
                    <a href="/Home/Entry" className="btn btn-primary btn-sm active" role="button" >Add customer</a> 
                </div><br/>
                <table className="table table-bordered table-responsive">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Country</th>
                            <th>Zip Code</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>);
    }
});
ReactDOM.render(
    <CustomerGridTable dataUrl="/home/GetCustomers" />,
    document.getElementById('div')
);