import React, { Component } from "react";

class Credits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credits: [],
      showForm: false,
      description: "",
      amount: 0
    };
    this.toggleForm = this.toggleForm.bind(this);
  }

    toggleForm() {
        this.setState((prevState) => ({
            showForm: !prevState.showForm
        }));
    }

    componentDidMount() {
        this.fetchcredits();
    }

    fetchcredits = async () => {
        try {
            const apiUrl =
                "https://bank-of-react-b745wfs0u-ajlapid718.vercel.app/credits";
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                this.setState({
                    credits: data
                });
            }
        } catch (error) {
            console.error("Error fetching credits:", error);
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleAddTransaction = (event) => {
        event.preventDefault();
      
        const { description, amount, credits } = this.state;
      
        const newcredit = {
          description,
          amount: parseFloat(amount),
          date: new Date().toISOString()
        };
      
        const updatedcredits = [...credits, newcredit];
        const creditsTotal = this.calculatecreditsTotal(updatedcredits);
        const updatedAccountBalance = this.props.accountBalance - creditsTotal;
      
        this.setState({
          credits: updatedcredits,
          description: "",
          amount: 0
        });
      
        this.props.updateAccountBalance(updatedAccountBalance);
      };
      

    calculatecreditsTotal = (credits) => {
        return credits.reduce((total, credit) => total + credit.amount, 0);
    };

    render() {
        const { credits, showForm, description, amount } = this.state;

        return (
            <div>
                <h1>Your credit Account</h1>
                <h2>Account Balance: ${this.props.accountBalance}</h2> 
                {showForm ? (
                    <form>
                        <label htmlFor="description">Description: </label>
                        <input
                            type="text"
                            name="description"
                            value={description}
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="description">Amount: </label>
                        <input
                            type="number"
                            name="amount"
                            value={amount}
                            onChange={this.handleInputChange}
                        />

                        <button onClick={this.handleAddTransaction}>Add credits</button>
                    </form>
                ) : (
                    <button onClick={this.toggleForm}>Add Transaction</button>
                )}
                <div>
                    {credits.map((credit, index) => (
                        <div key={index}>
                            <p>Description: {credit.description}</p>
                            <p>Amount: ${credit.amount}</p>
                            <p>Date: {credit.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Credits;
